/**
 * 認証API
 * ユーザー認証・セッション管理・権限制御を統括
 */

import { httpClient } from './client'
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  UpdateUserRequest,
  AuthResponse,
  UserResponse,
  ApiResponse
} from './types'
import { handleApiError } from './error-handler'

// ============================================================================
// 認証状態管理
// ============================================================================

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  lastActivity: number
}

class AuthManager {
  private static instance: AuthManager
  private state: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    lastActivity: Date.now()
  }

  // トークン自動更新用タイマー
  private refreshTimer: number | null = null
  private readonly TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000 // 15分
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24時間

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  constructor() {
    this.initializeFromStorage()
    this.setupActivityTracking()
    this.setupTokenRefresh()
  }

  /**
   * ローカルストレージから認証状態を復元
   */
  private initializeFromStorage(): void {
    try {
      const storedToken = localStorage.getItem('english-typing-game-token')
      const storedRefreshToken = localStorage.getItem('english-typing-game-refresh-token')
      const storedUser = localStorage.getItem('english-typing-game-user')
      const lastActivity = parseInt(localStorage.getItem('english-typing-game-last-activity') || '0')

      if (storedToken && storedRefreshToken && storedUser) {
        // セッション有効期限チェック
        const isSessionValid = Date.now() - lastActivity < this.SESSION_TIMEOUT

        if (isSessionValid) {
          this.state.accessToken = storedToken
          this.state.refreshToken = storedRefreshToken
          this.state.user = JSON.parse(storedUser)
          this.state.isAuthenticated = true
          this.state.lastActivity = lastActivity

          console.log('🔐 [Auth] Session restored from storage')
        } else {
          console.log('🔐 [Auth] Session expired, clearing storage')
          this.clearAuthData()
        }
      }
    } catch (error) {
      console.error('🔐 [Auth] Failed to restore session:', error)
      this.clearAuthData()
    }
  }

  /**
   * ユーザーアクティビティ追跡設定
   */
  private setupActivityTracking(): void {
    const updateActivity = () => {
      this.state.lastActivity = Date.now()
      localStorage.setItem('english-typing-game-last-activity', this.state.lastActivity.toString())
    }

    // マウス・キーボード・タッチイベントでアクティビティ更新
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // ページ可視性変更時の処理
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        updateActivity()
      }
    })
  }

  /**
   * トークン自動更新設定
   */
  private setupTokenRefresh(): void {
    this.refreshTimer = window.setInterval(async () => {
      if (this.state.isAuthenticated && this.state.refreshToken) {
        try {
          await this.refreshAccessToken()
        } catch (error) {
          console.error('🔐 [Auth] Auto refresh failed:', error)
          // リフレッシュ失敗時はログアウト
          await this.logout()
        }
      }
    }, this.TOKEN_REFRESH_INTERVAL)
  }

  /**
   * 認証データをストレージに保存
   */
  private saveAuthData(user: AuthUser, accessToken: string, refreshToken: string): void {
    this.state.user = user
    this.state.accessToken = accessToken
    this.state.refreshToken = refreshToken
    this.state.isAuthenticated = true
    this.state.lastActivity = Date.now()

    localStorage.setItem('english-typing-game-token', accessToken)
    localStorage.setItem('english-typing-game-refresh-token', refreshToken)
    localStorage.setItem('english-typing-game-user', JSON.stringify(user))
    localStorage.setItem('english-typing-game-last-activity', this.state.lastActivity.toString())
  }

  /**
   * 認証データをクリア
   */
  private clearAuthData(): void {
    this.state.user = null
    this.state.accessToken = null
    this.state.refreshToken = null
    this.state.isAuthenticated = false

    localStorage.removeItem('english-typing-game-token')
    localStorage.removeItem('english-typing-game-refresh-token')
    localStorage.removeItem('english-typing-game-user')
    localStorage.removeItem('english-typing-game-last-activity')

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  // ============================================================================
  // 公開API
  // ============================================================================

  /**
   * ログイン
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    this.state.isLoading = true

    try {
      const response = await httpClient.post<LoginResponse>('/auth/login', credentials)

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data
        this.saveAuthData(user, accessToken, refreshToken)

        console.log('🔐 [Auth] Login successful:', user.username)

        // ユーザー設定をローカルストレージに同期
        this.syncUserPreferences(user.preferences)

        return response
      } else {
        const error = response.error || { code: 'LOGIN_FAILED', message: 'ログインに失敗しました' }
        handleApiError(error, { url: '/auth/login', method: 'POST' })
        return response
      }
    } catch (error: unknown) {
      console.error('🔐 [Auth] Login error:', error)
      const processedError = handleApiError(
        error.response?.data?.error || { code: 'LOGIN_ERROR', message: 'ログイン処理でエラーが発生しました' },
        { url: '/auth/login', method: 'POST' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    } finally {
      this.state.isLoading = false
    }
  }

  /**
   * ユーザー登録
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    this.state.isLoading = true

    try {
      const response = await httpClient.post<LoginResponse>('/auth/register', userData)

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data
        this.saveAuthData(user, accessToken, refreshToken)

        console.log('🔐 [Auth] Registration successful:', user.username)

        // 新規ユーザーのデフォルト設定を適用
        this.syncUserPreferences(user.preferences)

        return response
      } else {
        const error = response.error || { code: 'REGISTRATION_FAILED', message: 'ユーザー登録に失敗しました' }
        handleApiError(error, { url: '/auth/register', method: 'POST' })
        return response
      }
    } catch (error: unknown) {
      console.error('🔐 [Auth] Registration error:', error)
      const processedError = handleApiError(
        error.response?.data?.error || { code: 'REGISTRATION_ERROR', message: 'ユーザー登録処理でエラーが発生しました' },
        { url: '/auth/register', method: 'POST' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    } finally {
      this.state.isLoading = false
    }
  }

  /**
   * ログアウト
   */
  async logout(): Promise<void> {
    try {
      // サーバーにログアウト通知（トークン無効化）
      if (this.state.accessToken) {
        await httpClient.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${this.state.accessToken}` }
        })
      }
    } catch (error) {
      console.warn('🔐 [Auth] Logout request failed (continuing with local logout):', error)
    } finally {
      this.clearAuthData()
      console.log('🔐 [Auth] Logout completed')

      // ログインページにリダイレクト（必要に応じて）
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login'
      }
    }
  }

  /**
   * アクセストークン更新
   */
  async refreshAccessToken(): Promise<boolean> {
    if (!this.state.refreshToken) {
      console.warn('🔐 [Auth] No refresh token available')
      return false
    }

    try {
      const response = await httpClient.post<LoginResponse>('/auth/refresh', {
        refreshToken: this.state.refreshToken
      })

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data
        this.saveAuthData(user, accessToken, refreshToken)

        console.log('🔐 [Auth] Token refreshed successfully')
        return true
      } else {
        console.warn('🔐 [Auth] Token refresh failed:', response.error)
        await this.logout()
        return false
      }
    } catch (error) {
      console.error('🔐 [Auth] Token refresh error:', error)
      await this.logout()
      return false
    }
  }

  /**
   * パスワード変更
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.post<void>('/auth/change-password', passwordData)

      if (response.success) {
        console.log('🔐 [Auth] Password changed successfully')
      }

      return response
    } catch (error: unknown) {
      console.error('🔐 [Auth] Password change error:', error)
      const processedError = handleApiError(
        error.response?.data?.error || { code: 'PASSWORD_CHANGE_ERROR', message: 'パスワード変更でエラーが発生しました' },
        { url: '/auth/change-password', method: 'POST' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * ユーザー情報更新
   */
  async updateUser(userData: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await httpClient.patch<AuthUser>('/auth/user', userData)

      if (response.success && response.data) {
        // ローカル状態を更新
        this.state.user = { ...this.state.user!, ...response.data }
        localStorage.setItem('english-typing-game-user', JSON.stringify(this.state.user))

        // 設定変更の場合は同期
        if (userData.preferences) {
          this.syncUserPreferences(response.data.preferences)
        }

        console.log('🔐 [Auth] User updated successfully')
      }

      return response
    } catch (error: unknown) {
      console.error('🔐 [Auth] User update error:', error)
      const processedError = handleApiError(
        error.response?.data?.error || { code: 'USER_UPDATE_ERROR', message: 'ユーザー情報の更新でエラーが発生しました' },
        { url: '/auth/user', method: 'PATCH' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * 現在のユーザー情報取得
   */
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await httpClient.get<AuthUser>('/auth/user')

      if (response.success && response.data) {
        // ローカル状態を更新
        this.state.user = response.data
        localStorage.setItem('english-typing-game-user', JSON.stringify(this.state.user))
        this.syncUserPreferences(response.data.preferences)
      }

      return response
    } catch (error: unknown) {
      console.error('🔐 [Auth] Get current user error:', error)
      const processedError = handleApiError(
        error.response?.data?.error || { code: 'GET_USER_ERROR', message: 'ユーザー情報の取得でエラーが発生しました' },
        { url: '/auth/user', method: 'GET' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * ユーザー設定をローカルストレージに同期
   */
  private syncUserPreferences(preferences: UserPreferences): void {
    try {
      // settingsStoreと同期するために、既存の形式で保存
      const settingsData = {
        theme: preferences.theme,
        language: preferences.language,
        soundEnabled: preferences.soundEnabled,
        keyboardSoundEnabled: preferences.keyboardSoundEnabled,
        vibrationEnabled: preferences.vibrationEnabled
      }

      localStorage.setItem('english-typing-game-settings', JSON.stringify(settingsData))
      console.log('🔐 [Auth] User preferences synced to local storage')
    } catch (error) {
      console.warn('🔐 [Auth] Failed to sync user preferences:', error)
    }
  }

  // ============================================================================
  // 状態取得
  // ============================================================================

  get currentUser(): AuthUser | null {
    return this.state.user
  }

  get isAuthenticated(): boolean {
    return this.state.isAuthenticated
  }

  get isLoading(): boolean {
    return this.state.isLoading
  }

  get accessToken(): string | null {
    return this.state.accessToken
  }

  /**
   * 認証が必要かチェック
   */
  requiresAuth(): boolean {
    return !this.state.isAuthenticated
  }

  /**
   * セッション有効期限チェック
   */
  isSessionValid(): boolean {
    if (!this.state.isAuthenticated) return false

    const sessionAge = Date.now() - this.state.lastActivity
    return sessionAge < this.SESSION_TIMEOUT
  }

  /**
   * 権限チェック
   */
  hasPermission(permission: string): boolean {
    if (!this.state.user) return false

    // プレミアム機能の権限チェック
    const subscription = this.state.user.subscription
    if (permission === 'premium' && subscription?.plan === 'free') {
      return false
    }

    // その他の権限チェックロジック
    return true
  }
}

// ============================================================================
// エクスポート
// ============================================================================

export const authManager = AuthManager.getInstance()

// 便利な関数をエクスポート
export const login = (credentials: LoginRequest) => authManager.login(credentials)
export const register = (userData: RegisterRequest) => authManager.register(userData)
export const logout = () => authManager.logout()
export const refreshToken = () => authManager.refreshAccessToken()
export const changePassword = (passwordData: ChangePasswordRequest) => authManager.changePassword(passwordData)
export const updateUser = (userData: UpdateUserRequest) => authManager.updateUser(userData)
export const getCurrentUser = () => authManager.getCurrentUser()

// 状態取得
export const useAuth = () => ({
  user: authManager.currentUser,
  isAuthenticated: authManager.isAuthenticated,
  isLoading: authManager.isLoading,
  requiresAuth: authManager.requiresAuth(),
  isSessionValid: authManager.isSessionValid(),
  hasPermission: (permission: string) => authManager.hasPermission(permission)
})

// 開発環境用のグローバル公開
if (import.meta.env.MODE === 'development') {
  ;(window as unknown as Record<string, unknown>)['__authManager'] = authManager
}