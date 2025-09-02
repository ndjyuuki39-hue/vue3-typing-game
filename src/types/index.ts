// Vue Router Meta Types
export interface RouteMeta {
  title?: string
  hideHeader?: boolean
  requiresAuth?: boolean
  unitType?: 'basic' | 'words' | 'phrases'
}

// Game Types
export type GameType = 'basic' | 'words' | 'phrases'
export type GameState = 'ready' | 'playing' | 'paused' | 'completed' | 'failed'

export interface GameConfig {
  type: GameType
  stage?: number
  level?: number
  category?: string
  timeLimit?: number
  targetWpm?: number
  targetAccuracy?: number
}

export interface GameStats {
  startTime: number
  endTime?: number
  totalTime: number
  wpm: number
  accuracy: number
  totalCharacters: number
  correctCharacters: number
  incorrectCharacters: number
  totalWords: number
  correctWords: number
}

export interface TypingProgress {
  currentIndex: number
  inputText: string
  isCurrentCharacterCorrect: boolean
  completedCharacters: boolean[]
  errors: number[]
}

// Content Types
export interface BasicStageContent {
  stage: number
  title: string
  description: string
  targetKeys: string[]
  practiceText: string[]
  targetWpm: number
  targetAccuracy: number
}

export type BasicStage = BasicStageContent

export interface WordContent {
  id: string
  english: string
  japanese: string
  phonetic?: string
  difficulty: 1 | 2 | 3
  category: string[]
}

export interface PhraseContent {
  id: string
  english: string
  japanese: string
  category: 'daily' | 'business' | 'travel' | 'shopping' | 'restaurant' | 'emergency'
  situation: string
  difficulty: 1 | 2 | 3
}

// User Types
export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatar?: string
  createdAt: string
  lastLoginAt: string
}

export interface UserProgress {
  basicTyping: {
    currentStage: number
    completedStages: number[]
    bestWpm: Record<number, number>
    bestAccuracy: Record<number, number>
  }
  words: {
    currentLevel: number
    completedLevels: number[]
    bestWpm: Record<number, number>
    bestAccuracy: Record<number, number>
  }
  phrases: {
    completedCategories: string[]
    bestWpm: Record<string, number>
    bestAccuracy: Record<string, number>
  }
  totalPlayTime: number
  totalCharactersTyped: number
  totalGames: number
}

// Settings Types
export type Theme = 'dark' | 'light'
export type Language = 'ja' | 'en'

export interface Settings {
  theme: Theme
  language: Language
  soundEnabled: boolean
  keyboardSoundEnabled: boolean
  vibrationEnabled: boolean
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

export interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'sm' | 'md' | 'lg'
  clickable?: boolean
}

export interface ProgressBarProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

// Keyboard Types
export interface KeyboardKey {
  key: string
  code: string
  finger: 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky' | 'thumb'
  position: {
    row: number
    column: number
  }
}

export interface KeyboardLayout {
  rows: KeyboardKey[][]
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresAt: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  displayName?: string
}

// Event Types
export interface GameStartEvent {
  config: GameConfig
  timestamp: number
}

export interface GameEndEvent {
  stats: GameStats
  config: GameConfig
  timestamp: number
}

export interface ProgressUpdateEvent {
  progress: TypingProgress
  stats: Partial<GameStats>
  timestamp: number
}

// Utility Types
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown>
    ? DeepReadonly<T[P]>
    : T[P]
}

export type Nullable<T> = T | null

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// Error Types
export interface AppError extends Error {
  code?: string
  statusCode?: number
  context?: Record<string, unknown>
}

export class ValidationError extends Error implements AppError {
  code = 'VALIDATION_ERROR'
  statusCode = 400
  context?: Record<string, unknown>

  constructor(message: string, context?: Record<string, unknown>) {
    super(message)
    this.context = context
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error implements AppError {
  code = 'NETWORK_ERROR'
  statusCode?: number
  context?: Record<string, unknown>

  constructor(message: string, statusCode?: number, context?: Record<string, unknown>) {
    super(message)
    this.statusCode = statusCode
    this.context = context
    this.name = 'NetworkError'
  }
}