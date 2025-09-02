import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type GameType = 'basic' | 'words' | 'phrases'
export type GameState = 'ready' | 'playing' | 'paused' | 'completed' | 'failed'

export interface GameConfig {
  type: GameType
  stage?: number // for basic typing
  level?: number // for words
  category?: string // for phrases
  timeLimit?: number // in seconds, optional
  targetWpm?: number // target words per minute
  targetAccuracy?: number // target accuracy percentage
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

export const useGameStore = defineStore('game', () => {
  // State
  const gameState = ref<GameState>('ready')
  const gameConfig = ref<GameConfig | null>(null)
  const currentText = ref<string>('')
  const currentTranslation = ref<string>('')
  const typingProgress = ref<TypingProgress>({
    currentIndex: 0,
    inputText: '',
    isCurrentCharacterCorrect: true,
    completedCharacters: [],
    errors: []
  })
  
  const gameStats = ref<GameStats>({
    startTime: 0,
    totalTime: 0,
    wpm: 0,
    accuracy: 100,
    totalCharacters: 0,
    correctCharacters: 0,
    incorrectCharacters: 0,
    totalWords: 0,
    correctWords: 0
  })

  const isGameActive = ref<boolean>(false)
  const gameTimer = ref<number>(0)
  const timerInterval = ref<number | null>(null)
  
  // 最後のゲーム結果を保存
  const lastWPM = ref<number>(0)
  const lastAccuracy = ref<number>(0)
  const lastTime = ref<number>(0)

  // Computed
  const isReady = computed(() => gameState.value === 'ready')
  const isPlaying = computed(() => gameState.value === 'playing')
  const isPaused = computed(() => gameState.value === 'paused')
  const isCompleted = computed(() => gameState.value === 'completed')
  const isFailed = computed(() => gameState.value === 'failed')

  const currentCharacter = computed(() => {
    if (typingProgress.value.currentIndex < currentText.value.length) {
      return currentText.value[typingProgress.value.currentIndex]
    }
    return ''
  })

  const remainingText = computed(() => {
    return currentText.value.slice(typingProgress.value.currentIndex)
  })

  const progressPercentage = computed(() => {
    if (currentText.value.length === 0) return 0
    return Math.round((typingProgress.value.currentIndex / currentText.value.length) * 100)
  })

  const currentWpm = computed(() => {
    const timeInMinutes = gameStats.value.totalTime / 60
    if (timeInMinutes === 0) return 0
    return Math.round((gameStats.value.correctWords / timeInMinutes))
  })

  const currentAccuracy = computed(() => {
    const total = gameStats.value.totalCharacters
    if (total === 0) return 100
    return Math.round((gameStats.value.correctCharacters / total) * 100)
  })

  // Actions
  const initializeGame = (config: GameConfig, text: string, translation?: string): void => {
    gameConfig.value = config
    currentText.value = text
    currentTranslation.value = translation ?? ''
    
    // Reset progress
    typingProgress.value = {
      currentIndex: 0,
      inputText: '',
      isCurrentCharacterCorrect: true,
      completedCharacters: new Array(text.length).fill(false),
      errors: []
    }
    
    // Reset stats
    gameStats.value = {
      startTime: 0,
      totalTime: 0,
      wpm: 0,
      accuracy: 100,
      totalCharacters: 0,
      correctCharacters: 0,
      incorrectCharacters: 0,
      totalWords: text.split(' ').length,
      correctWords: 0
    }
    
    gameState.value = 'ready'
    gameTimer.value = 0
    isGameActive.value = false
  }

  const startGame = (): void => {
    if (gameState.value !== 'ready' && gameState.value !== 'paused') return
    
    gameState.value = 'playing'
    isGameActive.value = true
    gameStats.value.startTime = Date.now()
    
    // Start timer
    startTimer()
  }

  const pauseGame = (): void => {
    if (gameState.value !== 'playing') return
    
    gameState.value = 'paused'
    isGameActive.value = false
    stopTimer()
  }

  const resumeGame = (): void => {
    if (gameState.value !== 'paused') return
    startGame()
  }

  const completeGame = (): void => {
    gameState.value = 'completed'
    isGameActive.value = false
    gameStats.value.endTime = Date.now()
    stopTimer()
    calculateFinalStats()
    
    // 最後のゲーム結果を保存
    lastWPM.value = gameStats.value.wpm
    lastAccuracy.value = gameStats.value.accuracy
    lastTime.value = gameStats.value.totalTime
  }

  const failGame = (): void => {
    gameState.value = 'failed'
    isGameActive.value = false
    stopTimer()
  }

  const resetGame = (): void => {
    gameState.value = 'ready'
    isGameActive.value = false
    gameTimer.value = 0
    typingProgress.value.currentIndex = 0
    typingProgress.value.inputText = ''
    typingProgress.value.completedCharacters.fill(false)
    typingProgress.value.errors = []
    stopTimer()
  }

  const processInput = (input: string): void => {
    if (gameState.value !== 'playing') return

    typingProgress.value.inputText = input
    const targetChar = currentText.value[typingProgress.value.currentIndex]
    const inputChar = input[input.length - 1]

    if (inputChar === targetChar) {
      // Correct input
      typingProgress.value.completedCharacters[typingProgress.value.currentIndex] = true
      typingProgress.value.isCurrentCharacterCorrect = true
      typingProgress.value.currentIndex++
      
      gameStats.value.correctCharacters++
      gameStats.value.totalCharacters++
      
      // Check if word completed
      if (targetChar === ' ' || typingProgress.value.currentIndex === currentText.value.length) {
        gameStats.value.correctWords++
      }
      
      // Check if game completed
      if (typingProgress.value.currentIndex >= currentText.value.length) {
        completeGame()
      }
    } else {
      // Incorrect input
      typingProgress.value.isCurrentCharacterCorrect = false
      typingProgress.value.errors.push(typingProgress.value.currentIndex)
      
      gameStats.value.incorrectCharacters++
      gameStats.value.totalCharacters++
    }
  }

  const processKeyInput = (key: string): void => {
    if (gameState.value !== 'playing') return

    if (key === 'Backspace') {
      if (typingProgress.value.currentIndex > 0) {
        typingProgress.value.currentIndex--
        typingProgress.value.inputText = typingProgress.value.inputText.slice(0, -1)
        typingProgress.value.completedCharacters[typingProgress.value.currentIndex] = false
        
        // Remove from errors if it was an error
        const errorIndex = typingProgress.value.errors.indexOf(typingProgress.value.currentIndex)
        if (errorIndex > -1) {
          typingProgress.value.errors.splice(errorIndex, 1)
        }
      }
    } else if (key.length === 1) {
      // Single character input
      const newInput = typingProgress.value.inputText + key
      processInput(newInput)
    }
  }

  // Timer functions
  const startTimer = (): void => {
    if (timerInterval.value) return
    
    timerInterval.value = window.setInterval(() => {
      gameTimer.value++
      gameStats.value.totalTime = gameTimer.value
    }, 1000)
  }

  const stopTimer = (): void => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const calculateFinalStats = (): void => {
    const timeInMinutes = gameStats.value.totalTime / 60
    gameStats.value.wpm = timeInMinutes > 0 ? Math.round(gameStats.value.correctWords / timeInMinutes) : 0
    gameStats.value.accuracy = gameStats.value.totalCharacters > 0 
      ? Math.round((gameStats.value.correctCharacters / gameStats.value.totalCharacters) * 100)
      : 100
  }

  // Cleanup on store destruction
  const cleanup = (): void => {
    stopTimer()
  }

  return {
    // State
    gameState,
    gameConfig,
    currentText,
    currentTranslation,
    typingProgress,
    gameStats,
    isGameActive,
    gameTimer,
    lastWPM,
    lastAccuracy,
    lastTime,
    
    // Computed
    isReady,
    isPlaying,
    isPaused,
    isCompleted,
    isFailed,
    currentCharacter,
    remainingText,
    progressPercentage,
    currentWpm,
    currentAccuracy,
    
    // Actions
    initializeGame,
    startGame,
    pauseGame,
    resumeGame,
    completeGame,
    failGame,
    resetGame,
    processInput,
    processKeyInput,
    cleanup
  }
})