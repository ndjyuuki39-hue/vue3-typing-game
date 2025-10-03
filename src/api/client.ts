/**
 * HTTPクライアント基盤
 * プロジェクトの全API通信を統括する中核システム
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse, ApiError, ApiConfig, RequestConfig } from './types'

// ============================================================================
// 設定
// ============================================================================

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.typing-game.dev',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  enableMock: import.meta.env.MODE === 'development',
  enableCache: true,
  cacheTimeout: 300000 // 5分
}

// ============================================================================
// インターセプター・ユーティリティ
// ============================================================================

/**
 * 指数バックオフによるリトライ計算
 */
const calculateRetryDelay = (attempt: number, baseDelay: number): number => {
  return Math.min(baseDelay * Math.pow(2, attempt - 1), 30000) // 最大30秒
}

/**
 * リクエストヘッダー構築
 */
const buildHeaders = (config: Partial<RequestConfig> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': import.meta.env.VITE_APP_VERSION || '1.0.0',
    'X-Client-Platform': 'web'
  }

  // 認証トークン自動付与
  const token = localStorage.getItem('english-typing-game-token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // 言語設定
  const language = localStorage.getItem('english-typing-game-language') || 'ja'
  headers['Accept-Language'] = language

  return { ...headers, ...config.headers }
}

/**
 * レスポンス変換
 */
const transformResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  // 既にApiResponse形式の場合はそのまま返す
  if (response.data && typeof response.data === 'object' && 'success' in response.data) {
    return response.data as ApiResponse<T>
  }

  // 標準的なレスポンスをApiResponse形式に変換
  return {
    success: response.status >= 200 && response.status < 300,
    data: response.data as T,
    message: response.statusText,
    timestamp: new Date().toISOString(),
    requestId: response.headers['x-request-id']
  }
}

/**
 * エラー変換
 */
const transformError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const response = error.response
    const request = error.request

    // サーバーエラーレスポンスがある場合
    if (response) {
      return {
        code: response.data?.code || `HTTP_${response.status}`,
        message: response.data?.message || response.statusText || 'サーバーエラーが発生しました',
        details: {
          status: response.status,
          statusText: response.statusText,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          data: response.data
        }
      }
    }

    // ネットワークエラー（リクエスト送信失敗）
    if (request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'ネットワーク接続に問題があります。インターネット接続を確認してください。',
        details: {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase()
        }
      }
    }

    // リクエスト設定エラー
    return {
      code: 'REQUEST_SETUP_ERROR',
      message: 'リクエストの設定に問題があります。',
      details: { message: error.message }
    }
  }

  // その他のエラー
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || '予期しないエラーが発生しました。',
    details: { originalError: error }
  }
}

// ============================================================================
// HTTPクライアントクラス
// ============================================================================

export class HttpClient {
  private axiosInstance: AxiosInstance
  private config: ApiConfig
  private requestCache: Map<string, { data: unknown; timestamp: number }> = new Map()

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  /**
   * リクエスト・レスポンスインターセプター設定
   */
  private setupInterceptors(): void {
    // リクエストインターセプター
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // リクエスト前処理
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        config.headers['X-Request-ID'] = requestId
        config.metadata = { requestId, startTime: Date.now() }

        // ログ出力（開発環境のみ）
        if (import.meta.env.MODE === 'development') {
          console.group(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`)
          console.log('Request ID:', requestId)
          console.log('Config:', config)
          console.groupEnd()
        }

        return config
      },
      (error) => {
        console.error('❌ [API Request Error]', error)
        return Promise.reject(transformError(error))
      }
    )

    // レスポンスインターセプター
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // レスポンス後処理
        const duration = Date.now() - (response.config.metadata?.startTime || 0)

        // ログ出力（開発環境のみ）
        if (import.meta.env.MODE === 'development') {
          console.group(`✅ [API Response] ${response.status} ${response.config.url} (${duration}ms)`)
          console.log('Response:', response.data)
          console.groupEnd()
        }

        return response
      },
      async (error) => {
        const duration = Date.now() - (error.config?.metadata?.startTime || 0)

        // ログ出力
        console.group(`❌ [API Error] ${error.response?.status || 'Network'} ${error.config?.url} (${duration}ms)`)
        console.error('Error:', error)
        console.groupEnd()

        // 自動リトライ処理
        if (this.shouldRetry(error)) {
          return this.retryRequest(error)
        }

        // 認証エラー処理
        if (error.response?.status === 401) {
          await this.handleAuthError()
        }

        return Promise.reject(transformError(error))
      }
    )
  }

  /**
   * リトライ判定
   */
  private shouldRetry(error: unknown): boolean {
    if (!error.config || error.config.__retryCount >= this.config.retryAttempts) {
      return false
    }

    // リトライ対象のエラーコード
    const retryableStatuses = [408, 429, 500, 502, 503, 504]
    const status = error.response?.status

    return !status || retryableStatuses.includes(status)
  }

  /**
   * リトライ実行
   */
  private async retryRequest(error: unknown): Promise<AxiosResponse> {
    const config = error.config
    config.__retryCount = config.__retryCount || 0
    config.__retryCount++

    const delay = calculateRetryDelay(config.__retryCount, this.config.retryDelay)

    console.log(`🔄 [API Retry] ${config.__retryCount}/${this.config.retryAttempts} after ${delay}ms`)

    await new Promise(resolve => setTimeout(resolve, delay))
    return this.axiosInstance.request(config)
  }

  /**
   * 認証エラー処理
   */
  private async handleAuthError(): Promise<void> {
    // トークンをクリア
    localStorage.removeItem('english-typing-game-token')
    localStorage.removeItem('english-typing-game-refresh-token')

    // 認証が必要なページの場合はログインページにリダイレクト
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      console.log('🔒 [Auth] Redirecting to login due to auth error')
      window.location.href = '/login'
    }
  }

  /**
   * キャッシュキー生成
   */
  private getCacheKey(config: RequestConfig): string {
    return `${config.method}_${config.url}_${JSON.stringify(config.params || {})}`
  }

  /**
   * キャッシュ取得
   */
  private getCache(key: string): unknown | null {
    if (!this.config.enableCache) return null

    const cached = this.requestCache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > this.config.cacheTimeout
    if (isExpired) {
      this.requestCache.delete(key)
      return null
    }

    console.log(`💾 [Cache Hit] ${key}`)
    return cached.data
  }

  /**
   * キャッシュ保存
   */
  private setCache(key: string, data: unknown): void {
    if (!this.config.enableCache) return

    this.requestCache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 汎用リクエストメソッド
   */
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const fullConfig: AxiosRequestConfig = {
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      headers: buildHeaders(config),
      timeout: config.timeout || this.config.timeout
    }

    // GETリクエストのキャッシュ確認
    if (config.method === 'GET' && config.cache !== false) {
      const cacheKey = this.getCacheKey(config)
      const cached = this.getCache(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      const response = await this.axiosInstance.request<T>(fullConfig)
      const transformedResponse = transformResponse<T>(response)

      // GETリクエストの結果をキャッシュ
      if (config.method === 'GET' && config.cache !== false && transformedResponse.success) {
        const cacheKey = this.getCacheKey(config)
        this.setCache(cacheKey, transformedResponse)
      }

      return transformedResponse
    } catch (error) {
      const transformedError = transformError(error)

      return {
        success: false,
        error: transformedError,
        timestamp: new Date().toISOString()
      }
    }
  }

  // ============================================================================
  // 便利メソッド
  // ============================================================================

  async get<T>(url: string, params?: Record<string, unknown>, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, params, ...config })
  }

  async post<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config })
  }

  async put<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config })
  }

  async patch<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, ...config })
  }

  async delete<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config })
  }

  /**
   * キャッシュクリア
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.requestCache.keys()) {
        if (key.includes(pattern)) {
          this.requestCache.delete(key)
        }
      }
    } else {
      this.requestCache.clear()
    }
  }

  /**
   * 設定更新
   */
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config }

    // axios instanceの設定も更新
    if (config.baseURL) {
      this.axiosInstance.defaults.baseURL = config.baseURL
    }
    if (config.timeout) {
      this.axiosInstance.defaults.timeout = config.timeout
    }
  }
}

// ============================================================================
// デフォルトインスタンス
// ============================================================================

export const httpClient = new HttpClient()

// 開発環境用のグローバル公開（デバッグ用）
if (import.meta.env.MODE === 'development') {
  ;(window as unknown as Record<string, unknown>)['__httpClient'] = httpClient
}