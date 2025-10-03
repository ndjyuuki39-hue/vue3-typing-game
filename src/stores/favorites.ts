import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FavoriteItem, FavoriteCategory, FavoriteStats, PracticeConfig, WordContent, PhraseContent } from '@/types'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favorites = ref<FavoriteItem[]>([])
  const selectedCategories = ref<string[]>([])
  const practiceConfig = ref<PracticeConfig>({
    mode: 'quick',
    questionCount: 10,
    categories: [],
    smartMode: false
  })

  // Load favorites from localStorage
  const loadFavorites = (): void => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      try {
        favorites.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load favorites:', e)
        favorites.value = []
      }
    }
  }

  // Save favorites to localStorage
  const saveFavorites = (): void => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  // Add to favorites
  const addToFavorites = (items: Array<{ type: 'word' | 'phrase', category: string, content: WordContent | PhraseContent }>): void => {
    const newItems: FavoriteItem[] = items
      .filter(item => !isFavorited(item.type, item.content.id)) // 重複チェック
      .map(item => ({
        id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: item.type,
        category: item.category,
        content: item.content,
        addedAt: new Date().toISOString(),
        practiceCount: 0,
        bestWpm: 0,
        bestAccuracy: 0
      }))

    if (newItems.length === 0) {
      console.info('💡 選択したアイテムは既に登録済みです')
      return
    }

    favorites.value.push(...newItems)
    saveFavorites()

    // 追加結果をログ出力
    const skippedCount = items.length - newItems.length
    if (skippedCount > 0) {
      console.info(`✅ ${newItems.length}個のアイテムを追加しました（${skippedCount}個は既に登録済みのためスキップ）`)
    } else {
      console.info(`✅ ${newItems.length}個のアイテムを追加しました`)
    }

    // Check if we should show warnings
    const totalCount = favorites.value.length
    if (totalCount > 500) {
      console.warn('⚠️ パフォーマンスに影響するかもしれません')
    } else if (totalCount > 100) {
      console.info('💡 たくさん登録されています！カテゴリー分けで整理しましょう')
    }
  }

  // Remove from favorites
  const removeFromFavorites = (id: string): void => {
    const index = favorites.value.findIndex(item => item.id === id)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  // Remove multiple items
  const removeMultiple = (ids: string[]): void => {
    favorites.value = favorites.value.filter(item => !ids.includes(item.id))
    saveFavorites()
  }

  // Clear category
  const clearCategory = (category: string): void => {
    favorites.value = favorites.value.filter(item => item.category !== category)
    saveFavorites()
  }

  // Clear all favorites
  const clearAllFavorites = (): void => {
    favorites.value = []
    saveFavorites()
  }

  // Update practice stats
  const updatePracticeStats = (id: string, wpm: number, accuracy: number): void => {
    const item = favorites.value.find(fav => fav.id === id)
    if (item) {
      item.lastPracticed = new Date().toISOString()
      item.practiceCount++
      if (!item.bestWpm || wpm > item.bestWpm) {
        item.bestWpm = wpm
      }
      if (!item.bestAccuracy || accuracy > item.bestAccuracy) {
        item.bestAccuracy = accuracy
      }
      saveFavorites()
    }
  }

  // Check if item is favorited
  const isFavorited = (type: 'word' | 'phrase', id: string): boolean => {
    return favorites.value.some(fav => {
      if (fav.type !== type) return false
      const content = fav.content as WordContent | PhraseContent
      return content.id === id
    })
  }

  // Toggle favorite
  const toggleFavorite = (type: 'word' | 'phrase', category: string, content: WordContent | PhraseContent): void => {
    if (isFavorited(type, content.id)) {
      const item = favorites.value.find(fav => {
        if (fav.type !== type) return false
        const favContent = fav.content as WordContent | PhraseContent
        return favContent.id === content.id
      })
      if (item) {
        removeFromFavorites(item.id)
      }
    } else {
      addToFavorites([{ type, category, content }])
    }
  }

  // Set practice config
  const setPracticeConfig = (config: Partial<PracticeConfig>): void => {
    practiceConfig.value = { ...practiceConfig.value, ...config }
  }

  // Get practice items based on config
  const getPracticeItems = (): FavoriteItem[] => {
    let items = favorites.value.filter(item => 
      practiceConfig.value.categories.includes(item.category)
    )

    // Smart mode: prioritize items with lower accuracy or not practiced recently
    if (practiceConfig.value.smartMode) {
      items.sort((a, b) => {
        // Prioritize items with lower accuracy
        const accuracyDiff = (a.bestAccuracy || 0) - (b.bestAccuracy || 0)
        if (accuracyDiff !== 0) return accuracyDiff

        // Then prioritize items not practiced recently
        const aDate = a.lastPracticed ? new Date(a.lastPracticed).getTime() : 0
        const bDate = b.lastPracticed ? new Date(b.lastPracticed).getTime() : 0
        return aDate - bDate
      })
    }

    // Shuffle for randomness (keeping some priority if smart mode)
    const shuffled = practiceConfig.value.smartMode 
      ? items.slice(0, Math.ceil(items.length * 0.3)).concat(
          items.slice(Math.ceil(items.length * 0.3)).sort(() => Math.random() - 0.5)
        )
      : items.sort(() => Math.random() - 0.5)

    // Limit by question count
    const limit = practiceConfig.value.mode === 'marathon' 
      ? shuffled.length 
      : practiceConfig.value.questionCount

    return shuffled.slice(0, limit)
  }

  // Computed
  const favoriteCategories = computed<FavoriteCategory[]>(() => {
    const categories: Record<string, FavoriteCategory> = {
      'word-level1': { id: 'word-level1', label: '英単語初級', icon: '📚', count: 0, items: [] },
      'word-level2': { id: 'word-level2', label: '英単語中級', icon: '📚', count: 0, items: [] },
      'word-level3': { id: 'word-level3', label: '英単語上級', icon: '📚', count: 0, items: [] },
      'phrase-daily': { id: 'phrase-daily', label: '日常会話', icon: '💬', count: 0, items: [] },
      'phrase-business': { id: 'phrase-business', label: 'ビジネス', icon: '💼', count: 0, items: [] },
      'phrase-travel': { id: 'phrase-travel', label: '旅行', icon: '✈️', count: 0, items: [] },
      'phrase-restaurant': { id: 'phrase-restaurant', label: 'レストラン', icon: '🍽️', count: 0, items: [] },
      'phrase-shopping': { id: 'phrase-shopping', label: 'ショッピング', icon: '🛍️', count: 0, items: [] },
      'phrase-emergency': { id: 'phrase-emergency', label: '病院・緊急時', icon: '🏥', count: 0, items: [] }
    }

    favorites.value.forEach(item => {
      if (categories[item.category]) {
        categories[item.category].items.push(item)
        categories[item.category].count++
      }
    })

    return Object.values(categories)
  })

  const totalCount = computed(() => favorites.value.length)

  const favoriteStats = computed<FavoriteStats>(() => {
    const stats: FavoriteStats = {
      totalItems: favorites.value.length,
      totalPractices: 0,
      averageWpm: 0,
      averageAccuracy: 0
    }

    if (favorites.value.length === 0) return stats

    let totalWpm = 0
    let totalAccuracy = 0
    let wpmCount = 0
    let accuracyCount = 0

    favorites.value.forEach(item => {
      stats.totalPractices += item.practiceCount
      if (item.bestWpm) {
        totalWpm += item.bestWpm
        wpmCount++
      }
      if (item.bestAccuracy) {
        totalAccuracy += item.bestAccuracy
        accuracyCount++
      }
      if (item.lastPracticed && (!stats.lastPracticeDate || item.lastPracticed > stats.lastPracticeDate)) {
        stats.lastPracticeDate = item.lastPracticed
      }
    })

    stats.averageWpm = wpmCount > 0 ? Math.round(totalWpm / wpmCount) : 0
    stats.averageAccuracy = accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0

    return stats
  })

  // Initialize
  loadFavorites()

  return {
    // State
    favorites,
    selectedCategories,
    practiceConfig,

    // Actions
    addToFavorites,
    removeFromFavorites,
    removeMultiple,
    clearCategory,
    clearAllFavorites,
    updatePracticeStats,
    isFavorited,
    toggleFavorite,
    setPracticeConfig,
    getPracticeItems,
    loadFavorites,
    saveFavorites,

    // Computed
    favoriteCategories,
    totalCount,
    favoriteStats
  }
})