import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from './src/stores/game.js'

describe('Debug WPM', () => {
  let gameStore

  beforeEach(() => {
    setActivePinia(createPinia())
    gameStore = useGameStore()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debug WPM calculation', () => {
    gameStore.setCurrentText('Hello world test', 'テスト')
    console.log('After setCurrentText - totalWords:', gameStore.gameStats.totalWords)

    gameStore.startGame()
    console.log('After startGame - gameTimer:', gameStore.gameTimer)
    console.log('After startGame - totalTime:', gameStore.gameStats.totalTime)

    // Type the complete text
    'Hello world test'.split('').forEach((char, index) => {
      gameStore.handleInput(char)
      console.log(`After typing '${char}' (${index + 1}/17):`)
      console.log('  correctCharacters:', gameStore.gameStats.correctCharacters)
      console.log('  totalCharacters:', gameStore.gameStats.totalCharacters)
      console.log('  currentIndex:', gameStore.typingProgress.currentIndex)
      console.log('  gameState:', gameStore.gameState)
    })

    console.log('Before time advance - gameTimer:', gameStore.gameTimer)
    console.log('Before time advance - totalTime:', gameStore.gameStats.totalTime)

    // Simulate 1 minute (60 seconds)
    vi.advanceTimersByTime(60000)

    console.log('After time advance - gameTimer:', gameStore.gameTimer)
    console.log('After time advance - totalTime:', gameStore.gameStats.totalTime)

    gameStore.completeGame()

    console.log('After completeGame:')
    console.log('  correctCharacters:', gameStore.gameStats.correctCharacters)
    console.log('  totalTime:', gameStore.gameStats.totalTime)
    console.log('  wpm:', gameStore.gameStats.wpm)
    console.log(
      '  calculated WPM:',
      gameStore.gameStats.correctCharacters / 5 / (gameStore.gameStats.totalTime / 60)
    )

    expect(gameStore.gameStats.wpm).toBeCloseTo(3.4, 1)
  })
})
