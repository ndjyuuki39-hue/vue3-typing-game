import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const progress = ref<UserProgress>({
    basicTyping: {
      currentStage: 1,
      completedStages: [],
      bestWpm: {},
      bestAccuracy: {}
    },
    words: {
      currentLevel: 1,
      completedLevels: [],
      bestWpm: {},
      bestAccuracy: {}
    },
    phrases: {
      completedCategories: [],
      bestWpm: {},
      bestAccuracy: {}
    },
    totalPlayTime: 0,
    totalCharactersTyped: 0,
    totalGames: 0
  })

  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => user.value !== null)
  const username = computed(() => user.value?.username ?? '')
  const displayName = computed(() => user.value?.displayName ?? '')

  // Progress computed values
  const basicTypingProgress = computed(() => {
    const completed = progress.value.basicTyping.completedStages.length
    const total = 12 // 12 stages total
    return Math.round((completed / total) * 100)
  })

  const wordsProgress = computed(() => {
    const completed = progress.value.words.completedLevels.length
    const total = 3 // 3 levels total
    return Math.round((completed / total) * 100)
  })

  const phrasesProgress = computed(() => {
    const completed = progress.value.phrases.completedCategories.length
    const total = 6 // 6 categories total
    return Math.round((completed / total) * 100)
  })

  const overallProgress = computed(() => {
    const basicWeight = 0.4 // 40%
    const wordsWeight = 0.3 // 30%
    const phrasesWeight = 0.3 // 30%
    
    return Math.round(
      basicTypingProgress.value * basicWeight +
      wordsProgress.value * wordsWeight +
      phrasesProgress.value * phrasesWeight
    )
  })

  // Actions
  const setUser = (newUser: User): void => {
    user.value = newUser
    saveUser()
  }

  const clearUser = (): void => {
    user.value = null
    clearStorage()
  }

  const updateProgress = (newProgress: Partial<UserProgress>): void => {
    progress.value = {
      ...progress.value,
      ...newProgress
    }
    saveProgress()
  }

  const completeBasicStage = (stage: number, wpm: number, accuracy: number): void => {
    console.log(`🎮 completeBasicStage called: stage=${stage}, wpm=${wpm}, accuracy=${accuracy}`)
    const basicTyping = progress.value.basicTyping
    
    console.log('Before:', {
      currentStage: basicTyping.currentStage,
      completedStages: [...basicTyping.completedStages]
    })
    
    if (!basicTyping.completedStages.includes(stage)) {
      basicTyping.completedStages.push(stage)
      basicTyping.completedStages.sort((a, b) => a - b)
    }
    
    // Update best scores if improved
    if (!basicTyping.bestWpm[stage] || wpm > basicTyping.bestWpm[stage]) {
      basicTyping.bestWpm[stage] = wpm
    }
    if (!basicTyping.bestAccuracy[stage] || accuracy > basicTyping.bestAccuracy[stage]) {
      basicTyping.bestAccuracy[stage] = accuracy
    }
    
    // Advance to next stage if completed sequentially
    if (stage === basicTyping.currentStage && stage < 12) {
      basicTyping.currentStage = stage + 1
    }
    
    console.log('After:', {
      currentStage: basicTyping.currentStage,
      completedStages: [...basicTyping.completedStages]
    })
    
    saveProgress()
    console.log('✅ Progress saved to localStorage')
  }

  const completeWordLevel = (level: number, wpm: number, accuracy: number): void => {
    const words = progress.value.words
    
    if (!words.completedLevels.includes(level)) {
      words.completedLevels.push(level)
      words.completedLevels.sort((a, b) => a - b)
    }
    
    // Update best scores if improved
    if (!words.bestWpm[level] || wpm > words.bestWpm[level]) {
      words.bestWpm[level] = wpm
    }
    if (!words.bestAccuracy[level] || accuracy > words.bestAccuracy[level]) {
      words.bestAccuracy[level] = accuracy
    }
    
    // Advance to next level if completed sequentially
    if (level === words.currentLevel && level < 3) {
      words.currentLevel = level + 1
    }
    
    saveProgress()
  }

  // 英単語のステージ完了処理
  const completeWordStage = (level: number, stage: number, wpm: number, accuracy: number): void => {
    console.log(`🎮 completeWordStage called: level=${level}, stage=${stage}, wpm=${wpm}, accuracy=${accuracy}`)
    const key = `wordLevel${level}`
    
    // レベル別の進捗を初期化（存在しない場合）
    if (!progress.value.words[key]) {
      progress.value.words[key] = {
        completedStages: [],
        stageBestWpm: {},
        stageBestAccuracy: {},
        currentStage: 1
      }
    }
    
    const levelProgress = progress.value.words[key]
    
    // ステージ完了記録
    if (!levelProgress.completedStages.includes(stage)) {
      levelProgress.completedStages.push(stage)
      levelProgress.completedStages.sort((a, b) => a - b)
    }
    
    // ベストスコア更新
    if (!levelProgress.stageBestWpm[stage] || wpm > levelProgress.stageBestWpm[stage]) {
      levelProgress.stageBestWpm[stage] = wpm
    }
    if (!levelProgress.stageBestAccuracy[stage] || accuracy > levelProgress.stageBestAccuracy[stage]) {
      levelProgress.stageBestAccuracy[stage] = accuracy
    }
    
    // 次のステージに進む
    if (stage === levelProgress.currentStage) {
      levelProgress.currentStage = stage + 1
    }
    
    saveProgress()
    console.log('✅ Word stage progress saved to localStorage')
  }

  // 英語フレーズのステージ完了処理
  const completePhraseStage = (category: string, stage: number, wpm: number, accuracy: number): void => {
    console.log(`🎮 completePhraseStage called: category=${category}, stage=${stage}, wpm=${wpm}, accuracy=${accuracy}`)
    const key = `phraseCategory_${category}`
    
    // カテゴリ別の進捗を初期化（存在しない場合）
    if (!progress.value.phrases[key]) {
      progress.value.phrases[key] = {
        completedStages: [],
        stageBestWpm: {},
        stageBestAccuracy: {},
        currentStage: 1
      }
    }
    
    const categoryProgress = progress.value.phrases[key]
    
    // ステージ完了記録
    if (!categoryProgress.completedStages.includes(stage)) {
      categoryProgress.completedStages.push(stage)
      categoryProgress.completedStages.sort((a, b) => a - b)
    }
    
    // ベストスコア更新
    if (!categoryProgress.stageBestWpm[stage] || wpm > categoryProgress.stageBestWpm[stage]) {
      categoryProgress.stageBestWpm[stage] = wpm
    }
    if (!categoryProgress.stageBestAccuracy[stage] || accuracy > categoryProgress.stageBestAccuracy[stage]) {
      categoryProgress.stageBestAccuracy[stage] = accuracy
    }
    
    // 次のステージに進む
    if (stage === categoryProgress.currentStage) {
      categoryProgress.currentStage = stage + 1
    }
    
    saveProgress()
    console.log('✅ Phrase stage progress saved to localStorage')
  }

  const completePhraseCategory = (category: string, wpm: number, accuracy: number): void => {
    const phrases = progress.value.phrases
    
    if (!phrases.completedCategories.includes(category)) {
      phrases.completedCategories.push(category)
    }
    
    // Update best scores if improved
    if (!phrases.bestWpm[category] || wpm > phrases.bestWpm[category]) {
      phrases.bestWpm[category] = wpm
    }
    if (!phrases.bestAccuracy[category] || accuracy > phrases.bestAccuracy[category]) {
      phrases.bestAccuracy[category] = accuracy
    }
    
    saveProgress()
  }

  const updateGameStats = (playTime: number, charactersTyped: number): void => {
    progress.value.totalPlayTime += playTime
    progress.value.totalCharactersTyped += charactersTyped
    progress.value.totalGames += 1
    saveProgress()
  }

  // Persistence
  const USER_STORAGE_KEY = 'english-typing-game-user'
  const PROGRESS_STORAGE_KEY = 'english-typing-game-progress'

  const saveUser = (): void => {
    if (!user.value) return
    
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value))
    } catch (error) {
      console.warn('Failed to save user to localStorage:', error)
    }
  }

  const saveProgress = (): void => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress.value))
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error)
    }
  }

  const loadUser = (): void => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY)
      if (saved) {
        user.value = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load user from localStorage:', error)
    }
  }

  const loadProgress = (): void => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
      if (saved) {
        const savedProgress = JSON.parse(saved)
        progress.value = {
          ...progress.value,
          ...savedProgress
        }
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error)
    }
  }

  const clearStorage = (): void => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(PROGRESS_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear user storage:', error)
    }
  }

  // Initialize
  loadUser()
  loadProgress()

  return {
    // State
    user,
    progress,
    isLoading,
    error,
    
    // Computed
    isAuthenticated,
    username,
    displayName,
    basicTypingProgress,
    wordsProgress,
    phrasesProgress,
    overallProgress,
    
    // Actions
    setUser,
    clearUser,
    updateProgress,
    completeBasicStage,
    completeWordStage,
    completePhraseStage,
    completeWordLevel,
    completePhraseCategory,
    updateGameStats,
    loadUser,
    loadProgress
  }
})