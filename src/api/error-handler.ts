/**
 * エラーハンドリング統一システム
 * プロジェクト全体のエラー処理を一元管理
 */

import type { ApiError, ApiErrorCode } from './types'
import { API_ERROR_CODES } from './types'

// ============================================================================
// エラー分類・分析
// ============================================================================

export interface ErrorContext {
  url?: string
  method?: string
  userId?: string
  sessionId?: string
  userAgent?: string
  timestamp: string
  environment: 'development' | 'staging' | 'production'
  buildVersion?: string
}

export interface ProcessedError {
  originalError: ApiError
  userMessage: string
  developerMessage: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'network' | 'auth' | 'validation' | 'server' | 'client' | 'business'
  isRetryable: boolean
  shouldReport: boolean
  context: ErrorContext
}

// ============================================================================
// エラーメッセージマッピング
// ============================================================================

const USER_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  // 認証エラー
  [API_ERROR_CODES.UNAUTHORIZED]: 'ログインが必要です。再度ログインしてください。',
  [API_ERROR_CODES.TOKEN_EXPIRED]: 'セッションの有効期限が切れました。再度ログインしてください。',
  [API_ERROR_CODES.INVALID_CREDENTIALS]: 'メールアドレスまたはパスワードが正しくありません。',
  [API_ERROR_CODES.ACCOUNT_DISABLED]: 'アカウントが無効になっています。サポートにお問い合わせください。',
  [API_ERROR_CODES.EMAIL_NOT_VERIFIED]: 'メールアドレスの確認が必要です。確認メールをご確認ください。',

  // バリデーションエラー
  [API_ERROR_CODES.VALIDATION_ERROR]: '入力内容に問題があります。入力内容を確認してください。',
  [API_ERROR_CODES.INVALID_REQUEST]: 'リクエストの形式が正しくありません。',
  [API_ERROR_CODES.MISSING_REQUIRED_FIELD]: '必須項目が入力されていません。',
  [API_ERROR_CODES.INVALID_FORMAT]: '入力形式が正しくありません。',

  // リソースエラー
  [API_ERROR_CODES.NOT_FOUND]: '指定されたデータが見つかりません。',
  [API_ERROR_CODES.ALREADY_EXISTS]: '既に登録されているデータです。',
  [API_ERROR_CODES.RESOURCE_CONFLICT]: 'データの競合が発生しました。ページを再読み込みしてください。',
  [API_ERROR_CODES.RESOURCE_LOCKED]: 'データが他のユーザーによって編集されています。',

  // 権限エラー
  [API_ERROR_CODES.FORBIDDEN]: 'この操作を実行する権限がありません。',
  [API_ERROR_CODES.INSUFFICIENT_PERMISSIONS]: '十分な権限がありません。',
  [API_ERROR_CODES.SUBSCRIPTION_REQUIRED]: 'この機能を使用するにはプレミアムプランへの加入が必要です。',

  // サーバーエラー
  [API_ERROR_CODES.INTERNAL_ERROR]: 'サーバーで問題が発生しました。時間をおいて再度お試しください。',
  [API_ERROR_CODES.SERVICE_UNAVAILABLE]: 'サービスが一時的に利用できません。しばらく後に再度お試しください。',
  [API_ERROR_CODES.DATABASE_ERROR]: 'データベースエラーが発生しました。',
  [API_ERROR_CODES.THIRD_PARTY_ERROR]: '外部サービスとの連携でエラーが発生しました。',

  // ネットワークエラー
  [API_ERROR_CODES.NETWORK_ERROR]: 'ネットワーク接続に問題があります。インターネット接続を確認してください。',
  [API_ERROR_CODES.TIMEOUT]: 'リクエストがタイムアウトしました。時間をおいて再度お試しください。',
  [API_ERROR_CODES.CONNECTION_LOST]: 'ネットワーク接続が失われました。接続を確認してください。',

  // 制限エラー
  [API_ERROR_CODES.RATE_LIMIT]: 'リクエストが多すぎます。しばらく時間をおいて再度お試しください。',
  [API_ERROR_CODES.QUOTA_EXCEEDED]: '利用制限に達しました。プランのアップグレードをご検討ください。',
  [API_ERROR_CODES.DAILY_LIMIT_EXCEEDED]: '本日の利用制限に達しました。明日再度お試しください。',
  [API_ERROR_CODES.CONCURRENT_LIMIT_EXCEEDED]: '同時接続数の上限に達しました。時間をおいて再度お試しください。'
}

const ERROR_CATEGORIES: Record<ApiErrorCode, ProcessedError['category']> = {
  [API_ERROR_CODES.NETWORK_ERROR]: 'network',
  [API_ERROR_CODES.TIMEOUT]: 'network',
  [API_ERROR_CODES.CONNECTION_LOST]: 'network',

  [API_ERROR_CODES.UNAUTHORIZED]: 'auth',
  [API_ERROR_CODES.TOKEN_EXPIRED]: 'auth',
  [API_ERROR_CODES.INVALID_CREDENTIALS]: 'auth',
  [API_ERROR_CODES.ACCOUNT_DISABLED]: 'auth',
  [API_ERROR_CODES.EMAIL_NOT_VERIFIED]: 'auth',

  [API_ERROR_CODES.VALIDATION_ERROR]: 'validation',
  [API_ERROR_CODES.INVALID_REQUEST]: 'validation',
  [API_ERROR_CODES.MISSING_REQUIRED_FIELD]: 'validation',
  [API_ERROR_CODES.INVALID_FORMAT]: 'validation',

  [API_ERROR_CODES.INTERNAL_ERROR]: 'server',
  [API_ERROR_CODES.SERVICE_UNAVAILABLE]: 'server',
  [API_ERROR_CODES.DATABASE_ERROR]: 'server',
  [API_ERROR_CODES.THIRD_PARTY_ERROR]: 'server',

  [API_ERROR_CODES.NOT_FOUND]: 'business',
  [API_ERROR_CODES.ALREADY_EXISTS]: 'business',
  [API_ERROR_CODES.RESOURCE_CONFLICT]: 'business',
  [API_ERROR_CODES.RESOURCE_LOCKED]: 'business',
  [API_ERROR_CODES.FORBIDDEN]: 'business',
  [API_ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'business',
  [API_ERROR_CODES.SUBSCRIPTION_REQUIRED]: 'business',

  [API_ERROR_CODES.RATE_LIMIT]: 'client',
  [API_ERROR_CODES.QUOTA_EXCEEDED]: 'client',
  [API_ERROR_CODES.DAILY_LIMIT_EXCEEDED]: 'client',
  [API_ERROR_CODES.CONCURRENT_LIMIT_EXCEEDED]: 'client'
}

const ERROR_SEVERITIES: Record<ApiErrorCode, ProcessedError['severity']> = {
  // 低: ユーザーが簡単に対処可能
  [API_ERROR_CODES.VALIDATION_ERROR]: 'low',
  [API_ERROR_CODES.INVALID_REQUEST]: 'low',
  [API_ERROR_CODES.MISSING_REQUIRED_FIELD]: 'low',
  [API_ERROR_CODES.INVALID_FORMAT]: 'low',
  [API_ERROR_CODES.NOT_FOUND]: 'low',
  [API_ERROR_CODES.ALREADY_EXISTS]: 'low',

  // 中: ユーザーが対処可能だが手順が必要
  [API_ERROR_CODES.UNAUTHORIZED]: 'medium',
  [API_ERROR_CODES.TOKEN_EXPIRED]: 'medium',
  [API_ERROR_CODES.INVALID_CREDENTIALS]: 'medium',
  [API_ERROR_CODES.EMAIL_NOT_VERIFIED]: 'medium',
  [API_ERROR_CODES.FORBIDDEN]: 'medium',
  [API_ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'medium',
  [API_ERROR_CODES.SUBSCRIPTION_REQUIRED]: 'medium',
  [API_ERROR_CODES.NETWORK_ERROR]: 'medium',
  [API_ERROR_CODES.TIMEOUT]: 'medium',
  [API_ERROR_CODES.RATE_LIMIT]: 'medium',

  // 高: システム側の問題、ユーザーは待つしかない
  [API_ERROR_CODES.SERVICE_UNAVAILABLE]: 'high',
  [API_ERROR_CODES.RESOURCE_CONFLICT]: 'high',
  [API_ERROR_CODES.RESOURCE_LOCKED]: 'high',
  [API_ERROR_CODES.CONNECTION_LOST]: 'high',
  [API_ERROR_CODES.QUOTA_EXCEEDED]: 'high',
  [API_ERROR_CODES.DAILY_LIMIT_EXCEEDED]: 'high',
  [API_ERROR_CODES.CONCURRENT_LIMIT_EXCEEDED]: 'high',

  // 重要: システム障害、緊急対応が必要
  [API_ERROR_CODES.ACCOUNT_DISABLED]: 'critical',
  [API_ERROR_CODES.INTERNAL_ERROR]: 'critical',
  [API_ERROR_CODES.DATABASE_ERROR]: 'critical',
  [API_ERROR_CODES.THIRD_PARTY_ERROR]: 'critical'
}

const RETRYABLE_ERRORS: Set<ApiErrorCode> = new Set([
  API_ERROR_CODES.NETWORK_ERROR,
  API_ERROR_CODES.TIMEOUT,
  API_ERROR_CODES.CONNECTION_LOST,
  API_ERROR_CODES.SERVICE_UNAVAILABLE,
  API_ERROR_CODES.INTERNAL_ERROR,
  API_ERROR_CODES.RATE_LIMIT
])

const REPORTABLE_ERRORS: Set<ApiErrorCode> = new Set([
  API_ERROR_CODES.INTERNAL_ERROR,
  API_ERROR_CODES.DATABASE_ERROR,
  API_ERROR_CODES.THIRD_PARTY_ERROR,
  API_ERROR_CODES.SERVICE_UNAVAILABLE
])

// ============================================================================
// エラー処理クラス
// ============================================================================

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorReportingEnabled: boolean
  private environment: 'development' | 'staging' | 'production'

  constructor() {
    this.errorReportingEnabled = import.meta.env.PROD
    this.environment = (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development'
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * エラーを処理し、ユーザーフレンドリーな形式に変換
   */
  processError(error: ApiError, context: Partial<ErrorContext> = {}): ProcessedError {
    const fullContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      environment: this.environment,
      buildVersion: import.meta.env.VITE_APP_VERSION,
      userAgent: navigator.userAgent,
      ...context
    }

    const errorCode = error.code as ApiErrorCode
    const userMessage = USER_ERROR_MESSAGES[errorCode] || error.message || '予期しないエラーが発生しました。'
    const category = ERROR_CATEGORIES[errorCode] || 'client'
    const severity = ERROR_SEVERITIES[errorCode] || 'medium'
    const isRetryable = RETRYABLE_ERRORS.has(errorCode)
    const shouldReport = REPORTABLE_ERRORS.has(errorCode) || severity === 'critical'

    const processedError: ProcessedError = {
      originalError: error,
      userMessage,
      developerMessage: this.buildDeveloperMessage(error, fullContext),
      severity,
      category,
      isRetryable,
      shouldReport,
      context: fullContext
    }

    // ログ出力
    this.logError(processedError)

    // エラー報告
    if (shouldReport && this.errorReportingEnabled) {
      this.reportError(processedError)
    }

    return processedError
  }

  /**
   * 開発者向けメッセージ構築
   */
  private buildDeveloperMessage(error: ApiError, context: ErrorContext): string {
    const parts = [
      `Error: ${error.code}`,
      `Message: ${error.message}`,
      `URL: ${context.url || 'N/A'}`,
      `Method: ${context.method || 'N/A'}`,
      `Timestamp: ${context.timestamp}`,
      `User Agent: ${context.userAgent || 'N/A'}`
    ]

    if (error.details) {
      parts.push(`Details: ${JSON.stringify(error.details, null, 2)}`)
    }

    if (error.stack && this.environment === 'development') {
      parts.push(`Stack: ${error.stack}`)
    }

    return parts.join('\n')
  }

  /**
   * エラーログ出力
   */
  private logError(processedError: ProcessedError): void {
    const { originalError, severity, category, context } = processedError

    const logMethod = severity === 'critical' ? console.error :
                     severity === 'high' ? console.error :
                     severity === 'medium' ? console.warn :
                     console.log

    logMethod(
      `🚨 [${severity.toUpperCase()}] ${category.toUpperCase()} Error:`,
      {
        code: originalError.code,
        message: originalError.message,
        context: {
          url: context.url,
          method: context.method,
          timestamp: context.timestamp
        },
        details: originalError.details
      }
    )
  }

  /**
   * エラー報告（実装例）
   */
  private async reportError(processedError: ProcessedError): Promise<void> {
    try {
      // 本格運用時はSentry等のエラー監視サービスに送信
      if (this.environment === 'development') {
        console.group('📊 Error Report')
        console.log('Error Code:', processedError.originalError.code)
        console.log('Severity:', processedError.severity)
        console.log('Category:', processedError.category)
        console.log('Context:', processedError.context)
        console.log('User Message:', processedError.userMessage)
        console.log('Developer Message:', processedError.developerMessage)
        console.groupEnd()
        return
      }

      // プロダクション環境での実装例
      const reportData = {
        error: {
          code: processedError.originalError.code,
          message: processedError.originalError.message,
          stack: processedError.originalError.stack
        },
        severity: processedError.severity,
        category: processedError.category,
        context: processedError.context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getCurrentUserId()
      }

      // 実際のエラー報告サービスへの送信
      // await fetch('/api/errors/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reportData)
      // })

    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  /**
   * 現在のユーザーID取得
   */
  private getCurrentUserId(): string | undefined {
    try {
      const userStore = JSON.parse(localStorage.getItem('english-typing-game-user') || '{}')
      return userStore.currentUser?.id
    } catch {
      return undefined
    }
  }

  /**
   * エラーからユーザー向け通知メッセージ生成
   */
  getNotificationMessage(error: ApiError): { title: string; message: string; type: 'error' | 'warning' | 'info' } {
    const processed = this.processError(error)

    const titles: Record<ProcessedError['severity'], string> = {
      low: '入力エラー',
      medium: '接続エラー',
      high: 'システムエラー',
      critical: '重要なエラー'
    }

    const types: Record<ProcessedError['severity'], 'error' | 'warning' | 'info'> = {
      low: 'warning',
      medium: 'warning',
      high: 'error',
      critical: 'error'
    }

    return {
      title: titles[processed.severity],
      message: processed.userMessage,
      type: types[processed.severity]
    }
  }

  /**
   * エラー統計情報取得
   */
  getErrorStats(): { total: number; byCategory: Record<string, number>; bySeverity: Record<string, number> } {
    // 実装例: localStorageから統計取得
    try {
      const stats = JSON.parse(localStorage.getItem('error-stats') || '{}')
      return {
        total: stats.total || 0,
        byCategory: stats.byCategory || {},
        bySeverity: stats.bySeverity || {}
      }
    } catch {
      return {
        total: 0,
        byCategory: {},
        bySeverity: {}
      }
    }
  }

  /**
   * 設定更新
   */
  updateConfig(config: { errorReportingEnabled?: boolean }): void {
    if (config.errorReportingEnabled !== undefined) {
      this.errorReportingEnabled = config.errorReportingEnabled
    }
  }
}

// ============================================================================
// ユーティリティ関数
// ============================================================================

/**
 * グローバルエラーハンドラー
 */
export const globalErrorHandler = ErrorHandler.getInstance()

/**
 * 簡単なエラー処理
 */
export const handleApiError = (error: ApiError, context?: Partial<ErrorContext>): ProcessedError => {
  return globalErrorHandler.processError(error, context)
}

/**
 * ユーザー通知用エラーメッセージ取得
 */
export const getErrorNotification = (error: ApiError) => {
  return globalErrorHandler.getNotificationMessage(error)
}

/**
 * エラー詳細をユーザーフレンドリーな形式で表示
 */
export const formatErrorForUser = (error: ApiError): string => {
  const processed = globalErrorHandler.processError(error)
  return processed.userMessage
}

/**
 * 開発者向けエラー情報表示
 */
export const formatErrorForDeveloper = (error: ApiError, context?: Partial<ErrorContext>): string => {
  const processed = globalErrorHandler.processError(error, context)
  return processed.developerMessage
}

/**
 * エラーがリトライ可能かチェック
 */
export const isRetryableError = (error: ApiError): boolean => {
  return RETRYABLE_ERRORS.has(error.code as ApiErrorCode)
}

/**
 * Vue.js グローバルエラーハンドラー設定用
 */
export const setupVueErrorHandler = (app: { config: { errorHandler: Function } }) => {
  app.config.errorHandler = (err: Error, instance: unknown, info: string) => {
    const apiError: ApiError = {
      code: 'VUE_ERROR',
      message: err.message,
      details: {
        componentInfo: info,
        stack: err.stack
      }
    }

    globalErrorHandler.processError(apiError, {
      url: window.location.href,
      method: 'VUE_COMPONENT'
    })
  }
}