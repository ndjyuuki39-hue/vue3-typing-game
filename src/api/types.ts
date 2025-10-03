/**
 * API型定義
 * 全てのAPIレスポンス・リクエストの型安全性を保証
 */

// ============================================================================
// 基本API型
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: ApiError
  timestamp: string
  requestId?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  stack?: string // 開発環境のみ
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number
    page: number
    limit: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ============================================================================
// 設定関連型
// ============================================================================

export interface ApiConfig {
  baseURL: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  enableMock: boolean
  enableCache: boolean
  cacheTimeout: number
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  data?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
  timeout?: number
  retries?: number
  cache?: boolean
  cacheTTL?: number
}

// ============================================================================
// 認証関連型
// ============================================================================

export interface AuthUser {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  level: number
  totalWPM: number
  averageAccuracy: number
  totalPlayTime: number
  streakDays: number
  preferences: UserPreferences
  subscription?: UserSubscription
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'ja' | 'en'
  soundEnabled: boolean
  keyboardSoundEnabled: boolean
  vibrationEnabled: boolean
  autoSave: boolean
  difficultyAdjustment: 'auto' | 'manual'
  targetWPM: number
  targetAccuracy: number
}

export interface UserSubscription {
  plan: 'free' | 'premium' | 'pro'
  status: 'active' | 'canceled' | 'expired'
  startDate: string
  endDate?: string
  features: string[]
}

// 認証リクエスト型
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
  displayName: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateUserRequest {
  displayName?: string
  preferences?: Partial<UserPreferences>
}

// 認証レスポンス型
export interface LoginResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type AuthResponse = ApiResponse<LoginResponse>
export type UserResponse = ApiResponse<AuthUser>

// ============================================================================
// 進捗・ゲーム関連型
// ============================================================================

export interface UserProgress {
  userId: string
  contentType: 'words' | 'phrases' | 'core' | 'basic'
  contentId: string
  level?: number
  stage?: number
  category?: string

  // 進捗状況
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
  completedAt?: string
  lastAccessedAt: string

  // パフォーマンス統計
  bestWPM: number
  bestAccuracy: number
  averageWPM: number
  averageAccuracy: number
  totalAttempts: number
  totalTime: number

  // SRS関連データ
  srsData?: {
    easeFactor: number
    interval: number
    repetitions: number
    nextReviewDate: string
    lastReviewed?: string
    totalReviews: number
    totalCorrect: number
    streak: number
    maxStreak: number
  }

  createdAt: string
  updatedAt: string
}

export interface GameSession {
  id: string
  userId: string
  contentType: 'words' | 'phrases' | 'core' | 'basic'
  contentId: string

  // セッション詳細
  startedAt: string
  completedAt?: string
  duration: number // 秒

  // パフォーマンスデータ
  wpm: number
  accuracy: number
  totalCharacters: number
  correctCharacters: number
  errorCharacters: number

  // 詳細分析データ
  keystrokeData?: KeystrokeData[]
  errorPatterns?: string[]
  difficultyLevel?: number

  // デバイス・環境情報
  deviceType: 'desktop' | 'tablet' | 'mobile'
  userAgent: string
  screenSize?: string

  createdAt: string
}

export interface KeystrokeData {
  timestamp: number // セッション開始からのミリ秒
  expectedChar: string
  actualChar: string
  isCorrect: boolean
  timeSinceLast: number // 前のキー入力からの時間
  keyCode?: string
}

// 進捗リクエスト型
export interface CreateSessionRequest {
  contentType: 'words' | 'phrases' | 'core' | 'basic'
  contentId: string
  startedAt: string
  deviceType: 'desktop' | 'tablet' | 'mobile'
  userAgent?: string
  screenSize?: string
}

export interface CompleteSessionRequest {
  sessionId: string
  completedAt: string
  duration: number
  wpm: number
  accuracy: number
  totalCharacters: number
  correctCharacters: number
  errorCharacters: number
  keystrokeData?: KeystrokeData[]
  errorPatterns?: string[]
}

export interface UpdateProgressRequest {
  userId: string
  contentType: 'words' | 'phrases' | 'core' | 'basic'
  contentId: string
  status?: 'not_started' | 'in_progress' | 'completed' | 'mastered'
  performanceData: {
    wpm: number
    accuracy: number
    completionTime: number
  }
  srsResult?: {
    quality: 1 | 2 | 3 | 4 | 5
    responseTime: number
  }
}

// 進捗レスポンス型
export type ProgressResponse = ApiResponse<UserProgress[]>
export type SessionResponse = ApiResponse<GameSession>
export type CreateSessionResponse = ApiResponse<{ sessionId: string }>

// ============================================================================
// コンテンツ関連型
// ============================================================================

export interface ContentItem {
  id: string
  type: 'words' | 'phrases' | 'core' | 'basic'
  title: string
  description: string
  category?: string
  level?: number
  stage?: number
  difficulty: number // 1.0-5.0

  // コンテンツデータ
  text: string
  translation: string
  pronunciation?: string
  tags: string[]

  // 統計情報
  averageWPM: number
  averageAccuracy: number
  totalAttempts: number
  successRate: number

  // メタデータ
  estimatedTime: number // 予想完了時間（秒）
  wordCount: number
  characterCount: number

  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface ContentRecommendation {
  content: ContentItem
  reason: string
  priority: number // 1-10, higher = more recommended
  estimatedImprovement: number // 期待される改善率 (0.0-1.0)
  adaptedDifficulty?: number // ユーザーに適応した難易度
}

// コンテンツリクエスト型
export interface GetContentRequest {
  type?: 'words' | 'phrases' | 'core' | 'basic'
  level?: number
  category?: string
  difficulty?: number
  limit?: number
  offset?: number
}

export interface GetRecommendationsRequest {
  userId: string
  contentType?: 'words' | 'phrases' | 'core' | 'basic'
  limit?: number
  currentLevel?: number
  focusAreas?: string[]
}

// コンテンツレスポンス型
export type ContentResponse = ApiResponse<ContentItem[]>
export type RecommendationsResponse = ApiResponse<ContentRecommendation[]>

// ============================================================================
// 分析・レポート関連型
// ============================================================================

export interface LearningAnalytics {
  userId: string
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: string
  endDate: string

  // 全体統計
  totalSessions: number
  totalTime: number
  averageSessionTime: number

  // パフォーマンス統計
  averageWPM: number
  wpmImprovement: number // 期間での改善率
  averageAccuracy: number
  accuracyImprovement: number

  // 学習パターン
  mostActiveTimeOfDay: number // 0-23 hour
  mostActiveWeekday: number // 0=Sunday, 6=Saturday
  preferredContentType: string

  // 困難分析
  strugglingAreas: string[]
  masteredAreas: string[]
  recommendedFocus: string[]

  // トレンドデータ
  wpmTrend: TrendPoint[]
  accuracyTrend: TrendPoint[]
  sessionFrequency: TrendPoint[]

  generatedAt: string
}

export interface TrendPoint {
  date: string
  value: number
  trend: 'up' | 'down' | 'stable'
}

export interface GetAnalyticsRequest {
  userId: string
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate?: string
  endDate?: string
}

export type AnalyticsResponse = ApiResponse<LearningAnalytics>

// ============================================================================
// 設定・環境関連型
// ============================================================================

export interface AppConfig {
  version: string
  environment: 'development' | 'staging' | 'production'
  features: {
    offlineMode: boolean
    socialFeatures: boolean
    premiumFeatures: boolean
    analyticsTracking: boolean
  }
  limits: {
    maxSessionTime: number // 最大セッション時間（秒）
    maxDailyAttempts: number // 1日の最大挑戦回数
    cacheTTL: number // キャッシュ有効期限（秒）
  }
  urls: {
    termsOfService: string
    privacyPolicy: string
    support: string
    feedback: string
  }
}

export type ConfigResponse = ApiResponse<AppConfig>

// ============================================================================
// エラーコード定数
// ============================================================================

export const API_ERROR_CODES = {
  // 認証エラー
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // バリデーションエラー
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // リソースエラー
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',

  // 権限エラー
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',

  // サーバーエラー
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  THIRD_PARTY_ERROR: 'THIRD_PARTY_ERROR',

  // ネットワークエラー
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_LOST: 'CONNECTION_LOST',

  // 制限エラー
  RATE_LIMIT: 'RATE_LIMIT',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',
  CONCURRENT_LIMIT_EXCEEDED: 'CONCURRENT_LIMIT_EXCEEDED'
} as const

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES]

// ============================================================================
// ユーティリティ型
// ============================================================================

/**
 * API レスポンスの成功データ部分のみを抽出
 */
export type ApiData<T> = T extends ApiResponse<infer U> ? U : never

/**
 * ページネーション対応レスポンス型
 */
export type PaginatedApiResponse<T> = PaginatedResponse<T>

/**
 * オプショナルフィールドを持つ更新リクエスト型生成
 */
export type UpdateRequest<T> = Partial<Pick<T, keyof T>>

/**
 * IDを除く作成リクエスト型生成
 */
export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

// ============================================================================
// モック・テスト用型
// ============================================================================

export interface MockResponse<T> {
  status: number
  data: ApiResponse<T>
  delay?: number
}

export interface MockConfig {
  enabled: boolean
  delay: number
  errorRate: number // 0.0-1.0
  responses: Record<string, MockResponse<any>>
}