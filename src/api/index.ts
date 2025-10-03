/**
 * API層エントリーポイント
 * 統一されたAPIアクセスを提供
 */

// 基盤
export { httpClient, HttpClient } from './client'
export { globalErrorHandler, handleApiError, getErrorNotification, formatErrorForUser, isRetryableError, setupVueErrorHandler } from './error-handler'

// 認証
export { authManager, login, register, logout, refreshToken, changePassword, updateUser, getCurrentUser, useAuth } from './auth'

// 進捗同期
export {
  progressManager,
  createSession,
  completeSession,
  updateProgress,
  getUserProgress,
  syncSRSData,
  getLearningAnalytics,
  useSyncStatus,
  forceSync
} from './progress'

// 型定義
export type * from './types'

// 便利な再エクスポート
export { API_ERROR_CODES } from './types'

/**
 * API初期化
 * アプリケーション起動時に呼び出し
 */
export const initializeApi = () => {
  console.log('🚀 [API] Initializing API layer...')

  // 開発環境でのデバッグ情報
  if (import.meta.env.MODE === 'development') {
    console.log('🚀 [API] Development mode - enhanced logging enabled')
    console.log('🚀 [API] Base URL:', import.meta.env.VITE_API_BASE_URL || 'https://api.typing-game.dev')
  }

  console.log('✅ [API] API layer initialized successfully')
}

/**
 * API統合ヘルスチェック
 * 基本機能が動作するかテスト
 */
export const healthCheck = async (): Promise<{ status: 'ok' | 'error'; details: Record<string, any> }> => {
  const results: Record<string, any> = {}

  try {
    // 1. HTTPクライアント基本機能テスト
    const { httpClient } = await import('./client')
    results['httpClient'] = httpClient ? 'ok' : 'error'

    // 2. エラーハンドラー基本チェック (関数の存在確認のみ)
    const { handleApiError } = await import('./error-handler')
    results['errorHandler'] = typeof handleApiError === 'function' ? 'ok' : 'error'

    // 3. 認証システム基本チェック
    const { authManager } = await import('./auth')
    results['authManager'] = authManager ? 'ok' : 'error'

    // 4. 進捗システム基本チェック
    const { progressManager } = await import('./progress')
    results['progressManager'] = progressManager ? 'ok' : 'error'

    // 5. ローカルストレージアクセステスト
    try {
      localStorage.setItem('api-test', 'test')
      localStorage.removeItem('api-test')
      results['localStorage'] = 'ok'
    } catch {
      results['localStorage'] = 'error'
    }

    // 6. 環境変数チェック
    results['environment'] = {
      mode: import.meta.env.MODE,
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'default',
      version: import.meta.env.VITE_APP_VERSION || 'unknown'
    }

    const hasErrors = Object.values(results).some(v => v === 'error')

    return {
      status: hasErrors ? 'error' : 'ok',
      details: results
    }
  } catch (error) {
    return {
      status: 'error',
      details: { ...results, criticalError: error }
    }
  }
}