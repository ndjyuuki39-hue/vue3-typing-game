import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WordContent, PhraseContent, GameType, GameState, GameConfig, GameStats } from '@/types'
import { useSRSStore } from './srs'
import type { ReviewResult } from '@/utils/srs'

export interface TypingProgress {
  currentIndex: number
  inputText: string
  isCurrentCharacterCorrect: boolean
  completedCharacters: boolean[]
  errors: number[]
}

export const useGameStore = defineStore('game', () => {
  // SRS Store
  const srsStore = useSRSStore()
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
  const lastScore = ref<number>(0)
  const lastPlayedContent = ref<WordContent | PhraseContent | null>(null)

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
    // Standard WPM calculation: (correct characters ÷ 5) ÷ time in minutes
    return Math.round((gameStats.value.correctCharacters / 5) / timeInMinutes)
  })

  const currentAccuracy = computed(() => {
    const total = gameStats.value.totalCharacters
    if (total === 0) return 100
    return Math.round((gameStats.value.correctCharacters / total) * 100)
  })

  // Actions
  // テスト用にも使用される個別セッターメソッド
  const setGameConfig = (config: GameConfig): void => {
    gameConfig.value = config
  }

  const setCurrentText = (text: string, translation?: string): void => {
    currentText.value = text
    currentTranslation.value = translation ?? ''

    // Update totalWords when text changes
    gameStats.value.totalWords = text.split(' ').length
  }

  const initializeGame = (config: GameConfig, text: string, translation?: string, content?: WordContent | PhraseContent): void => {
    setGameConfig(config)
    setCurrentText(text, translation)
    lastPlayedContent.value = content || null
    
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

  // Helper function to check if current word was completed correctly
  const checkWordCompletion = (): void => {
    // Find the current word boundaries
    const text = currentText.value
    const currentPos = typingProgress.value.currentIndex

    // Find start of current word (go back to previous space or beginning)
    let wordStart = currentPos - 1
    while (wordStart > 0 && text[wordStart - 1] !== ' ') {
      wordStart--
    }

    // Find end of current word (current position or previous space)
    let wordEnd = currentPos
    if (text[currentPos - 1] === ' ') {
      wordEnd = currentPos - 1
    }

    // Check if any characters in this word had errors
    const wordHasErrors = typingProgress.value.errors.some(errorPos =>
      errorPos >= wordStart && errorPos < wordEnd
    )

    // Only count word as correct if no errors in the word
    if (!wordHasErrors && wordEnd > wordStart) {
      gameStats.value.correctWords++
    }
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
    lastScore.value = Math.round((gameStats.value.wpm * gameStats.value.accuracy) / 10)
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
        checkWordCompletion()
      }

      // Update real-time stats
      updateRealTimeStats()

      // Check if game completed
      if (typingProgress.value.currentIndex >= currentText.value.length) {
        completeGame()
      }
    } else {
      // Incorrect input - advance index but mark as error
      typingProgress.value.completedCharacters[typingProgress.value.currentIndex] = false
      typingProgress.value.isCurrentCharacterCorrect = false

      // Only add error if not already recorded for this position
      if (!typingProgress.value.errors.includes(typingProgress.value.currentIndex)) {
        typingProgress.value.errors.push(typingProgress.value.currentIndex)
      }

      typingProgress.value.currentIndex++
      gameStats.value.incorrectCharacters++
      gameStats.value.totalCharacters++

      // Update real-time stats
      updateRealTimeStats()

      // Check if game completed even with errors
      if (typingProgress.value.currentIndex >= currentText.value.length) {
        completeGame()
      }
    }
  }

  // テストで使用される互換性エイリアス
  const handleInput = (input: string): void => {
    if (input.length === 1) {
      processKeyInput(input)
    } else {
      processInput(input)
    }
  }

  const handleBackspace = (): void => {
    processKeyInput('Backspace')
  }

  const resetGame = (): void => {
    gameState.value = 'ready'
    currentText.value = ''
    currentTranslation.value = ''
    isGameActive.value = false
    gameTimer.value = 0
    stopTimer()

    // Reset progress
    typingProgress.value = {
      currentIndex: 0,
      inputText: '',
      isCurrentCharacterCorrect: true,
      completedCharacters: [],
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
      totalWords: 0,
      correctWords: 0
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

        // Reset the current character completion status (will be resized when needed)
        if (typingProgress.value.completedCharacters.length > typingProgress.value.currentIndex) {
          typingProgress.value.completedCharacters.length = typingProgress.value.currentIndex
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
    gameStats.value.wpm = timeInMinutes > 0 ? Math.round((gameStats.value.correctCharacters / 5) / timeInMinutes) : 0
    gameStats.value.accuracy = gameStats.value.totalCharacters > 0
      ? Math.round((gameStats.value.correctCharacters / gameStats.value.totalCharacters) * 100)
      : 100
  }

  // Real-time stats update function
  const updateRealTimeStats = (): void => {
    const timeInMinutes = gameStats.value.totalTime / 60
    gameStats.value.wpm = timeInMinutes > 0 ? Math.round((gameStats.value.correctCharacters / 5) / timeInMinutes) : 0
    gameStats.value.accuracy = gameStats.value.totalCharacters > 0
      ? Math.round((gameStats.value.correctCharacters / gameStats.value.totalCharacters) * 100)
      : 100
  }

  // SRS Integration
  const updateSRSAfterGame = (): void => {
    if (!lastPlayedContent.value || !gameConfig.value) return

    // ゲーム結果をSRS用のデータに変換
    const result: ReviewResult = {
      quality: srsStore.calculateAutoQuality(
        lastPlayedContent.value.id,
        lastAccuracy.value / 100, // 0-1に正規化
        lastTime.value * 1000     // msに変換
      ),
      responseTime: lastTime.value * 1000,
      accuracy: lastAccuracy.value / 100,
      wpm: lastWPM.value
    }

    // SRSカードを更新
    try {
      srsStore.updateCardAfterReview(lastPlayedContent.value.id, result)
      console.log('✅ SRS card updated:', lastPlayedContent.value.id, result)
    } catch (error) {
      console.error('❌ Failed to update SRS card:', error)
    }
  }

  const initializeSRSCard = (content: WordContent | PhraseContent): void => {
    if (!gameConfig.value) return

    const contentType = gameConfig.value.type === 'words' ? 'word' :
                       gameConfig.value.type === 'phrases' ? 'phrase' :
                       gameConfig.value.type === 'core' ? 'core' : 'phrase'

    srsStore.initializeCard(content.id, contentType)
  }

  // Enhanced completeGame with SRS integration
  const completeGameWithSRS = (): void => {
    completeGame()
    updateSRSAfterGame()
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
    lastScore,
    lastPlayedContent,
    
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
    setGameConfig,
    setCurrentText,
    initializeGame,
    startGame,
    pauseGame,
    resumeGame,
    completeGame,
    completeGameWithSRS,
    resetGame,
    processInput,
    handleInput, // テスト互換性エイリアス
    handleBackspace, // テスト互換性エイリアス
    processKeyInput,
    updateSRSAfterGame,
    initializeSRSCard,
    cleanup
  }
})