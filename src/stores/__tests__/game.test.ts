import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../game'
import type { GameConfig } from '@/types'

describe('Game Store', () => {
  let gameStore: ReturnType<typeof useGameStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    gameStore = useGameStore()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(gameStore.gameState).toBe('ready')
      expect(gameStore.gameConfig).toBe(null)
      expect(gameStore.currentText).toBe('')
      expect(gameStore.currentTranslation).toBe('')
      expect(gameStore.isGameActive).toBe(false)
      expect(gameStore.gameTimer).toBe(0)

      // Check typing progress initial state
      expect(gameStore.typingProgress.currentIndex).toBe(0)
      expect(gameStore.typingProgress.inputText).toBe('')
      expect(gameStore.typingProgress.isCurrentCharacterCorrect).toBe(true)
      expect(gameStore.typingProgress.completedCharacters).toEqual([])
      expect(gameStore.typingProgress.errors).toEqual([])

      // Check game stats initial state
      expect(gameStore.gameStats.wpm).toBe(0)
      expect(gameStore.gameStats.accuracy).toBe(100)
      expect(gameStore.gameStats.totalCharacters).toBe(0)
      expect(gameStore.gameStats.correctCharacters).toBe(0)
      expect(gameStore.gameStats.incorrectCharacters).toBe(0)
    })
  })

  describe('Game Configuration', () => {
    it('should set game config correctly', () => {
      const config: GameConfig = {
        type: 'words',
        level: 1,
        stage: 1,
        mode: 'practice'
      }

      gameStore.setGameConfig(config)
      expect(gameStore.gameConfig).toEqual(config)
    })

    it('should set current text and translation', () => {
      const text = 'Hello world'
      const translation = 'こんにちは世界'

      gameStore.setCurrentText(text, translation)
      expect(gameStore.currentText).toBe(text)
      expect(gameStore.currentTranslation).toBe(translation)
    })
  })

  describe('Game State Management', () => {
    it('should start game correctly', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()

      expect(gameStore.gameState).toBe('playing')
      expect(gameStore.isGameActive).toBe(true)
      expect(gameStore.gameStats.startTime).toBeGreaterThan(0)
      expect(gameStore.gameTimer).toBe(0)
    })

    it('should complete game correctly', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()

      // Simulate 5 seconds passing
      vi.advanceTimersByTime(5000)

      gameStore.completeGame()

      expect(gameStore.gameState).toBe('completed')
      expect(gameStore.isGameActive).toBe(false)
      expect(gameStore.gameStats.totalTime).toBeGreaterThan(0)
    })

    it('should reset game state correctly', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()
      gameStore.handleInput('t')
      gameStore.completeGame()

      gameStore.resetGame()

      expect(gameStore.gameState).toBe('ready')
      expect(gameStore.currentText).toBe('')
      expect(gameStore.currentTranslation).toBe('')
      expect(gameStore.isGameActive).toBe(false)
      expect(gameStore.gameTimer).toBe(0)
      expect(gameStore.typingProgress.currentIndex).toBe(0)
      expect(gameStore.typingProgress.inputText).toBe('')
    })
  })

  describe('Typing Logic', () => {
    beforeEach(() => {
      gameStore.setCurrentText('Hello', '你好')
      gameStore.startGame()
    })

    it('should handle correct character input', () => {
      gameStore.handleInput('H')

      expect(gameStore.typingProgress.currentIndex).toBe(1)
      expect(gameStore.typingProgress.inputText).toBe('H')
      expect(gameStore.typingProgress.isCurrentCharacterCorrect).toBe(true)
      expect(gameStore.typingProgress.completedCharacters).toEqual([true])
      expect(gameStore.typingProgress.errors).toEqual([])
    })

    it('should handle incorrect character input', () => {
      gameStore.handleInput('h') // lowercase instead of uppercase

      expect(gameStore.typingProgress.currentIndex).toBe(1)
      expect(gameStore.typingProgress.inputText).toBe('h')
      expect(gameStore.typingProgress.isCurrentCharacterCorrect).toBe(false)
      expect(gameStore.typingProgress.completedCharacters).toEqual([false])
      expect(gameStore.typingProgress.errors).toEqual([0])
    })

    it('should handle backspace correctly', () => {
      gameStore.handleInput('H')
      gameStore.handleInput('e')

      expect(gameStore.typingProgress.currentIndex).toBe(2)

      gameStore.handleBackspace()

      expect(gameStore.typingProgress.currentIndex).toBe(1)
      expect(gameStore.typingProgress.inputText).toBe('H')
      expect(gameStore.typingProgress.completedCharacters).toHaveLength(1)
    })

    it('should complete text when all characters are typed', () => {
      const text = 'Hi'
      gameStore.setCurrentText(text, 'ハイ')
      gameStore.startGame()

      gameStore.handleInput('H')
      expect(gameStore.gameState).toBe('playing')

      gameStore.handleInput('i')
      expect(gameStore.gameState).toBe('completed')
    })
  })

  describe('WPM Calculation', () => {
    it('should calculate WPM correctly', () => {
      gameStore.setCurrentText('Hello world test', 'テスト')
      gameStore.startGame()

      // Type most of the text (but not all to avoid auto-completion)
      'Hello world tes'.split('').forEach(char => {
        gameStore.handleInput(char)
      })

      // Simulate 1 minute (60 seconds)
      vi.advanceTimersByTime(60000)

      // Type the final character to complete
      gameStore.handleInput('t')

      // "Hello world test" = 17 characters = ~3.4 words (17/5)
      // In 1 minute = ~3 WPM (allowing for small timing/character differences)
      expect(gameStore.gameStats.wpm).toBeGreaterThanOrEqual(3)
      expect(gameStore.gameStats.wpm).toBeLessThanOrEqual(4)
    })

    it('should calculate WPM for partial completion', () => {
      gameStore.setCurrentText('Hello world', 'テスト')
      gameStore.startGame()

      // Type only "Hello" (5 characters = 1 word)
      'Hello'.split('').forEach(char => {
        gameStore.handleInput(char)
      })

      // Simulate 30 seconds
      vi.advanceTimersByTime(30000)
      gameStore.completeGame()

      // 1 word in 0.5 minutes = 2 WPM
      expect(gameStore.gameStats.wpm).toBe(2)
    })
  })

  describe('Accuracy Calculation', () => {
    it('should calculate 100% accuracy for perfect typing', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()

      'test'.split('').forEach(char => {
        gameStore.handleInput(char)
      })

      expect(gameStore.gameStats.accuracy).toBe(100)
      expect(gameStore.gameStats.correctCharacters).toBe(4)
      expect(gameStore.gameStats.incorrectCharacters).toBe(0)
    })

    it('should calculate accuracy correctly with errors', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()

      // Type with 1 error: 'west' instead of 'test'
      gameStore.handleInput('w') // error
      gameStore.handleInput('e')
      gameStore.handleInput('s')
      gameStore.handleInput('t')

      expect(gameStore.gameStats.accuracy).toBe(75) // 3/4 = 75%
      expect(gameStore.gameStats.correctCharacters).toBe(3)
      expect(gameStore.gameStats.incorrectCharacters).toBe(1)
    })

    it('should handle zero characters correctly', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()
      gameStore.completeGame()

      expect(gameStore.gameStats.accuracy).toBe(100) // Should default to 100% if no input
    })
  })

  describe('Timer Management', () => {
    it('should increment timer every second when game is active', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()

      expect(gameStore.gameTimer).toBe(0)

      vi.advanceTimersByTime(1000)
      expect(gameStore.gameTimer).toBe(1)

      vi.advanceTimersByTime(2000)
      expect(gameStore.gameTimer).toBe(3)
    })

    it('should stop timer when game is completed', () => {
      gameStore.setCurrentText('Hi', 'ハイ')
      gameStore.startGame()

      vi.advanceTimersByTime(2000)
      expect(gameStore.gameTimer).toBe(2)

      'Hi'.split('').forEach(char => {
        gameStore.handleInput(char)
      })

      vi.advanceTimersByTime(3000)
      // Timer should stop when game completes
      expect(gameStore.gameTimer).toBe(2)
    })
  })

  describe('Statistics Tracking', () => {
    it('should track total words correctly', () => {
      gameStore.setCurrentText('Hello world test', 'テスト')
      gameStore.startGame()

      'Hello world test'.split('').forEach(char => {
        gameStore.handleInput(char)
      })

      // "Hello world test" = 3 words
      expect(gameStore.gameStats.totalWords).toBe(3)
      expect(gameStore.gameStats.correctWords).toBe(3)
    })

    it('should track words with errors correctly', () => {
      gameStore.setCurrentText('Hi test', 'テスト')
      gameStore.startGame()

      // Type "Hi" correctly
      gameStore.handleInput('H')
      gameStore.handleInput('i')
      gameStore.handleInput(' ')

      // Type "west" instead of "test" (error)
      gameStore.handleInput('w') // error
      gameStore.handleInput('e')
      gameStore.handleInput('s')
      gameStore.handleInput('t')

      expect(gameStore.gameStats.totalWords).toBe(2)
      expect(gameStore.gameStats.correctWords).toBe(1) // Only "Hi" was correct
    })
  })

  describe('Error Tracking', () => {
    it('should track error positions correctly', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()

      gameStore.handleInput('t')   // correct - position 0
      gameStore.handleInput('x')   // error - position 1
      gameStore.handleInput('s')   // correct - position 2
      gameStore.handleInput('w')   // error - position 3

      expect(gameStore.typingProgress.errors).toEqual([1, 3])
    })

    it('should remove error when corrected with backspace', () => {
      gameStore.setCurrentText('test', 'テスト')
      gameStore.startGame()

      gameStore.handleInput('t')   // correct
      gameStore.handleInput('x')   // error at position 1

      expect(gameStore.typingProgress.errors).toEqual([1])

      gameStore.handleBackspace()
      gameStore.handleInput('e')   // correct

      expect(gameStore.typingProgress.errors).toEqual([])
    })
  })
})