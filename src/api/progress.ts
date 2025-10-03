/**
 * 学習進捗同期API
 * SRSシステムと統合した包括的な学習データ管理
 */

import { httpClient } from './client'
import { handleApiError } from './error-handler'
import type {
  UserProgress,
  GameSession,
  CreateSessionRequest,
  CompleteSessionRequest,
  UpdateProgressRequest,
  ProgressResponse,
  SessionResponse,
  CreateSessionResponse,
  LearningAnalytics,
  AnalyticsResponse,
  GetAnalyticsRequest,
  ApiResponse,
  ApiError
} from './types'

// 既存SRSシステムとの統合
import type { SRSCard, ReviewResult } from '@/utils/srs'
// SRSManager removed - not used in this module

// 型安全なエラーハンドリングのためのAxiosエラー型定義
interface AxiosErrorData {
  response?: {
    data?: {
      error?: ApiError
    }
  }
}

// unknown型から安全にApiErrorを抽出するヘルパー関数（アロー関数に変更）
const extractApiError = (error: unknown, fallbackError: ApiError): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorData
    return axiosError.response?.data?.error || fallbackError
  }
  return fallbackError
}

// ============================================================================
// オフライン対応データキュー
// ============================================================================

interface QueuedOperation {
  id: string
  type: 'session' | 'progress' | 'srs'
  operation: 'create' | 'update' | 'complete'
  data: Record<string, unknown>
  timestamp: number
  retryCount: number
  maxRetries: number
}

class ProgressSyncManager {
  private static instance: ProgressSyncManager
  private isOnline: boolean = navigator.onLine
  private syncQueue: QueuedOperation[] = []
  private syncInProgress: boolean = false
  private readonly STORAGE_KEY = 'english-typing-game-sync-queue'
  private readonly MAX_QUEUE_SIZE = 1000
  private readonly SYNC_INTERVAL = 30000 // 30秒

  static getInstance(): ProgressSyncManager {
    if (!ProgressSyncManager.instance) {
      ProgressSyncManager.instance = new ProgressSyncManager()
    }
    return ProgressSyncManager.instance
  }

  constructor() {
    this.loadQueueFromStorage()
    this.setupNetworkMonitoring()
    this.setupPeriodicSync()
  }

  /**
   * ネットワーク状態監視
   */
  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      console.log('🌐 [Progress] Network online - starting sync')
      this.isOnline = true
      this.processSyncQueue()
    })

    window.addEventListener('offline', () => {
      console.log('🌐 [Progress] Network offline - queuing operations')
      this.isOnline = false
    })
  }

  /**
   * 定期同期設定
   */
  private setupPeriodicSync(): void {
    setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.processSyncQueue()
      }
    }, this.SYNC_INTERVAL)
  }

  /**
   * キューをローカルストレージから読み込み
   */
  private loadQueueFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.syncQueue = JSON.parse(stored)
        console.log(`📁 [Progress] Loaded ${this.syncQueue.length} queued operations`)
      }
    } catch (error) {
      console.warn('📁 [Progress] Failed to load sync queue:', error)
      this.syncQueue = []
    }
  }

  /**
   * キューをローカルストレージに保存
   */
  private saveQueueToStorage(): void {
    try {
      // キューサイズ制限
      if (this.syncQueue.length > this.MAX_QUEUE_SIZE) {
        this.syncQueue = this.syncQueue.slice(-this.MAX_QUEUE_SIZE)
        console.warn(`📁 [Progress] Queue size limited to ${this.MAX_QUEUE_SIZE}`)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error('📁 [Progress] Failed to save sync queue:', error)
    }
  }

  /**
   * 操作をキューに追加
   */
  private queueOperation(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retryCount'>): void {
    const queuedOp: QueuedOperation = {
      id: `${operation.type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
      retryCount: 0,
      ...operation
    }

    this.syncQueue.push(queuedOp)
    this.saveQueueToStorage()

    console.log(`📝 [Progress] Queued ${operation.type} operation:`, queuedOp.id)

    // オンラインなら即座に同期試行
    if (this.isOnline) {
      this.processSyncQueue()
    }
  }

  /**
   * 同期キュー処理
   */
  private async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || this.syncQueue.length === 0) {
      return
    }

    this.syncInProgress = true
    console.log(`🔄 [Progress] Processing ${this.syncQueue.length} queued operations`)

    const processed: string[] = []

    for (const operation of this.syncQueue) {
      try {
        const success = await this.executeQueuedOperation(operation)

        if (success) {
          processed.push(operation.id)
          console.log(`✅ [Progress] Synced operation: ${operation.id}`)
        } else {
          operation.retryCount++
          if (operation.retryCount >= operation.maxRetries) {
            processed.push(operation.id)
            console.error(`❌ [Progress] Operation failed permanently: ${operation.id}`)
          }
        }
      } catch (error) {
        console.error(`❌ [Progress] Sync error for ${operation.id}:`, error)
        operation.retryCount++
      }
    }

    // 処理済み操作をキューから削除
    this.syncQueue = this.syncQueue.filter(op => !processed.includes(op.id))
    this.saveQueueToStorage()

    this.syncInProgress = false
    console.log(`🔄 [Progress] Sync completed. ${this.syncQueue.length} operations remaining`)
  }

  /**
   * キューされた操作の実行
   */
  private async executeQueuedOperation(operation: QueuedOperation): Promise<boolean> {
    try {
      switch (operation.type) {
        case 'session':
          if (operation.operation === 'create') {
            const response = await this.directCreateSession(operation.data as unknown as CreateSessionRequest)
            return response.success
          } else if (operation.operation === 'complete') {
            const response = await this.directCompleteSession(operation.data as unknown as CompleteSessionRequest)
            return response.success
          }
          break

        case 'progress':
          const progressResponse = await this.directUpdateProgress(operation.data as unknown as UpdateProgressRequest)
          return progressResponse.success

        case 'srs':
          const srsResponse = await this.directSyncSRSData(operation.data as unknown as ReviewResult)
          return srsResponse.success
      }
      return false
    } catch {
      return false
    }
  }

  // ============================================================================
  // セッション管理
  // ============================================================================

  /**
   * 学習セッション作成
   */
  async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    if (!this.isOnline) {
      // オフライン時はキューに追加
      this.queueOperation({
        type: 'session',
        operation: 'create',
        data: { ...request } as Record<string, unknown>,
        maxRetries: 3
      })

      // ローカルセッションIDを生成
      const localSessionId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      return {
        success: true,
        data: { sessionId: localSessionId },
        message: 'Session queued for offline sync',
        timestamp: new Date().toISOString()
      }
    }

    return this.directCreateSession(request)
  }

  private async directCreateSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    try {
      const response = await httpClient.post<{ sessionId: string }>('/progress/sessions', request)

      if (response.success) {
        console.log('🎮 [Progress] Session created:', response.data?.sessionId)
      }

      return response
    } catch (error: unknown) {
      console.error('API Error:', error instanceof Error ? error.message : String(error))
      console.error('🎮 [Progress] Create session error:', error)
      const apiError = extractApiError(error, { code: 'SESSION_CREATE_ERROR', message: 'セッション作成でエラーが発生しました' })
      const processedError = handleApiError(apiError, { url: '/progress/sessions', method: 'POST' })
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * 学習セッション完了
   */
  async completeSession(request: CompleteSessionRequest): Promise<SessionResponse> {
    // SRSデータの自動更新
    await this.updateSRSFromSession(request)

    if (!this.isOnline) {
      this.queueOperation({
        type: 'session',
        operation: 'complete',
        data: { ...request } as Record<string, unknown>,
        maxRetries: 5 // セッション完了は重要なので多めにリトライ
      })

      return {
        success: true,
        message: 'Session completion queued for offline sync',
        timestamp: new Date().toISOString()
      }
    }

    return this.directCompleteSession(request)
  }

  private async directCompleteSession(request: CompleteSessionRequest): Promise<SessionResponse> {
    try {
      const response = await httpClient.patch<GameSession>(`/progress/sessions/${request.sessionId}/complete`, request)

      if (response.success) {
        console.log('🏁 [Progress] Session completed:', request.sessionId)
      }

      return response
    } catch (error: unknown) {
      console.error('API Error:', error instanceof Error ? error.message : String(error))
      console.error('🏁 [Progress] Complete session error:', error)
      const processedError = handleApiError(
        extractApiError(error, { code: 'SESSION_COMPLETE_ERROR', message: 'セッション完了でエラーが発生しました' }),
        { url: `/progress/sessions/${request.sessionId}/complete`, method: 'PATCH' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * セッションからSRSデータを自動更新
   */
  private async updateSRSFromSession(sessionData: CompleteSessionRequest): Promise<void> {
    try {
      // セッションIDから元のコンテンツ情報を復元
      // 実際の実装では、セッション作成時にコンテンツ情報を保存しておく
      const { wpm, accuracy, duration } = sessionData

      // SRS品質スコア計算 (1-5)
      const quality = this.calculateSRSQuality(wpm, accuracy, duration)

      // SRSレビュー結果を作成
      const reviewResult: ReviewResult = {
        quality,
        responseTime: duration * 1000, // ミリ秒に変換
        accuracy: accuracy / 100, // 0-1スケールに変換
        wpm
      }

      // ローカルSRSデータを更新
      // 注意: 実際のcontentIdが必要。ここではプレースホルダー
      console.log('🧠 [Progress] SRS update prepared:', { quality, responseTime: reviewResult.responseTime })

      // SRSデータをサーバーに同期
      if (this.isOnline) {
        await this.syncSRSData(sessionData.sessionId, reviewResult)
      }
    } catch (error) {
      console.warn('🧠 [Progress] SRS update failed:', error)
    }
  }

  /**
   * SRS品質スコア計算
   */
  private calculateSRSQuality(wpm: number, accuracy: number, duration: number): 1 | 2 | 3 | 4 | 5 {
    // 基準値設定
    const baseWPM = 30
    const baseAccuracy = 85
    const maxDuration = 120 // 2分

    // 各指標をスコア化 (0-1)
    const wpmScore = Math.min(wpm / (baseWPM * 1.5), 1)
    const accuracyScore = Math.min(accuracy / baseAccuracy, 1)
    const timeScore = Math.max(1 - (duration / maxDuration), 0)

    // 重み付き平均 (正確性を最重視)
    const weightedScore = (accuracyScore * 0.5) + (wpmScore * 0.3) + (timeScore * 0.2)

    // 1-5スケールに変換
    if (weightedScore >= 0.9) return 5 // 完璧
    if (weightedScore >= 0.75) return 4 // 簡単
    if (weightedScore >= 0.6) return 3 // 困難だった
    if (weightedScore >= 0.4) return 2 // 間違えた
    return 1 // 完全に忘れた
  }

  // ============================================================================
  // 進捗管理
  // ============================================================================

  /**
   * ユーザー進捗更新
   */
  async updateProgress(request: UpdateProgressRequest): Promise<ProgressResponse> {
    if (!this.isOnline) {
      this.queueOperation({
        type: 'progress',
        operation: 'update',
        data: { ...request } as Record<string, unknown>,
        maxRetries: 3
      })

      return {
        success: true,
        message: 'Progress update queued for offline sync',
        timestamp: new Date().toISOString()
      }
    }

    return this.directUpdateProgress(request)
  }

  private async directUpdateProgress(request: UpdateProgressRequest): Promise<ProgressResponse> {
    try {
      const response = await httpClient.put<UserProgress[]>('/progress/update', request)

      if (response.success) {
        console.log('📈 [Progress] Progress updated for:', request.contentId)
      }

      return response
    } catch (error: unknown) {
      console.error('API Error:', error instanceof Error ? error.message : String(error))
      console.error('📈 [Progress] Update progress error:', error)
      const processedError = handleApiError(
        extractApiError(error, { code: 'PROGRESS_UPDATE_ERROR', message: '進捗更新でエラーが発生しました' }),
        { url: '/progress/update', method: 'PUT' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * ユーザー進捗取得
   */
  async getUserProgress(userId: string, contentType?: string): Promise<ProgressResponse> {
    try {
      const params: Record<string, string> = { userId }
      if (contentType) params['contentType'] = contentType

      const response = await httpClient.get<UserProgress[]>('/progress', { params })

      if (response.success) {
        console.log(`📊 [Progress] Retrieved progress for user: ${userId}`)
      }

      return response
    } catch (error: unknown) {
      console.error('API Error:', error instanceof Error ? error.message : String(error))
      console.error('📊 [Progress] Get progress error:', error)
      const processedError = handleApiError(
        extractApiError(error, { code: 'PROGRESS_GET_ERROR', message: '進捗取得でエラーが発生しました' }),
        { url: '/progress', method: 'GET' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  // ============================================================================
  // SRS統合
  // ============================================================================

  /**
   * SRSデータ同期
   */
  async syncSRSData(sessionId: string, reviewResult: ReviewResult): Promise<ApiResponse<void>> {
    const syncData = {
      sessionId,
      reviewResult,
      timestamp: new Date().toISOString()
    }

    if (!this.isOnline) {
      this.queueOperation({
        type: 'srs',
        operation: 'update',
        data: syncData as unknown as Record<string, unknown>,
        maxRetries: 5
      })

      return {
        success: true,
        message: 'SRS data queued for offline sync',
        timestamp: new Date().toISOString()
      }
    }

    return this.directSyncSRSData(reviewResult)
  }

  private async directSyncSRSData(syncData: ReviewResult): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.post<void>('/progress/srs/sync', syncData)

      if (response.success) {
        console.log('🧠 [Progress] SRS data synced successfully')
      }

      return response
    } catch (error: unknown) {
      console.error('API Error:', error instanceof Error ? error.message : String(error))
      console.error('🧠 [Progress] SRS sync error:', error)
      const processedError = handleApiError(
        extractApiError(error, { code: 'SRS_SYNC_ERROR', message: 'SRSデータ同期でエラーが発生しました' }),
        { url: '/progress/srs/sync', method: 'POST' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * SRSカードをサーバーからプル
   */
  async pullSRSCards(userId: string): Promise<ApiResponse<SRSCard[]>> {
    try {
      const response = await httpClient.get<SRSCard[]>('/progress/srs/cards', {
        params: { userId }
      })

      if (response.success && response.data) {
        console.log(`🧠 [Progress] Pulled ${response.data.length} SRS cards`)

        // ローカルSRSストアを更新
        // 注意: 実際の実装ではSRSストアのAPIを使用
      }

      return response
    } catch (error: unknown) {
      console.error('API Error:', error instanceof Error ? error.message : String(error))
      console.error('🧠 [Progress] Pull SRS cards error:', error)
      const processedError = handleApiError(
        extractApiError(error, { code: 'SRS_PULL_ERROR', message: 'SRSカード取得でエラーが発生しました' }),
        { url: '/progress/srs/cards', method: 'GET' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  // ============================================================================
  // 分析・レポート
  // ============================================================================

  /**
   * 学習分析データ取得
   */
  async getLearningAnalytics(request: GetAnalyticsRequest): Promise<AnalyticsResponse> {
    try {
      const response = await httpClient.get<LearningAnalytics>('/progress/analytics', {
        params: request,
        cache: true, // 分析データはキャッシュ可能
        cacheTTL: 300000 // 5分
      })

      if (response.success) {
        console.log('📊 [Progress] Analytics retrieved for period:', request.period)
      }

      return response
    } catch (error: unknown) {
      console.error('API Error:', error instanceof Error ? error.message : String(error))
      console.error('📊 [Progress] Analytics error:', error)
      const processedError = handleApiError(
        extractApiError(error, { code: 'ANALYTICS_ERROR', message: '分析データ取得でエラーが発生しました' }),
        { url: '/progress/analytics', method: 'GET' }
      )
      return {
        success: false,
        error: processedError.originalError,
        timestamp: new Date().toISOString()
      }
    }
  }

  // ============================================================================
  // ユーティリティ
  // ============================================================================

  /**
   * 同期状態取得
   */
  getSyncStatus(): { isOnline: boolean; queueSize: number; syncInProgress: boolean } {
    return {
      isOnline: this.isOnline,
      queueSize: this.syncQueue.length,
      syncInProgress: this.syncInProgress
    }
  }

  /**
   * 手動同期実行
   */
  async forcSync(): Promise<void> {
    if (this.isOnline) {
      await this.processSyncQueue()
    } else {
      console.warn('🌐 [Progress] Cannot sync while offline')
    }
  }

  /**
   * キューのクリア（緊急時用）
   */
  clearSyncQueue(): void {
    this.syncQueue = []
    this.saveQueueToStorage()
    console.log('🗑️ [Progress] Sync queue cleared')
  }
}

// ============================================================================
// エクスポート
// ============================================================================

export const progressManager = ProgressSyncManager.getInstance()

// 便利な関数をエクスポート
export const createSession = (request: CreateSessionRequest) => progressManager.createSession(request)
export const completeSession = (request: CompleteSessionRequest) => progressManager.completeSession(request)
export const updateProgress = (request: UpdateProgressRequest) => progressManager.updateProgress(request)
export const getUserProgress = (userId: string, contentType?: string) => progressManager.getUserProgress(userId, contentType)
export const syncSRSData = (sessionId: string, reviewResult: ReviewResult) => progressManager.syncSRSData(sessionId, reviewResult)
export const getLearningAnalytics = (request: GetAnalyticsRequest) => progressManager.getLearningAnalytics(request)

// 状態取得
export const useSyncStatus = () => progressManager.getSyncStatus()
export const forceSync = () => progressManager.forcSync()

// 開発環境用のグローバル公開
if (import.meta.env.MODE === 'development') {
  ;(window as unknown as Record<string, unknown>)['__progressManager'] = progressManager
}