import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SRSManager, type SRSCard, type ReviewResult, type ReviewQuality } from '@/utils/srs'
import type { WordContent, PhraseContent } from '@/types'

export interface SRSState {
  cards: Record<string, SRSCard>  // key: content.id, value: SRSCard
  lastSyncAt: Date | null
  settings: {
    maxNewCardsPerDay: number
    maxReviewsPerDay: number
    reviewRatio: number           // 復習の割合 (0-1)
    autoCalculateQuality: boolean // 自動品質計算の有効/無効
  }
}

export const useSRSStore = defineStore('srs', () => {
  // State
  const state = ref<SRSState>({
    cards: {},
    lastSyncAt: null,
    settings: {
      maxNewCardsPerDay: 20,
      maxReviewsPerDay: 100,
      reviewRatio: 0.7,
      autoCalculateQuality: true
    }
  })

  // Computed
  const allCards = computed((): SRSCard[] => Object.values(state.value.cards))

  const dueCards = computed((): SRSCard[] =>
    SRSManager.getDueCards(allCards.value)
  )

  const newCards = computed((): SRSCard[] =>
    SRSManager.getNewCards(allCards.value, state.value.settings.maxNewCardsPerDay)
  )

  const stats = computed(() =>
    SRSManager.calculateStats(allCards.value)
  )

  const todayStats = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayCards = allCards.value.filter(card => {
      if (!card.lastReviewed) return false
      const reviewDate = new Date(card.lastReviewed)
      reviewDate.setHours(0, 0, 0, 0)
      return reviewDate.getTime() === today.getTime()
    })

    return {
      reviewsCompleted: todayCards.filter(c => !c.isNew).length,
      newCardsLearned: todayCards.filter(c => c.isNew && c.totalReviews > 0).length,
      totalTimeSpent: todayCards.reduce((sum, c) => sum + c.averageResponseTime, 0),
      averageAccuracy: todayCards.length > 0
        ? todayCards.reduce((sum, c) => sum + c.lastAccuracy, 0) / todayCards.length
        : 0
    }
  })

  // Actions
  const initializeCard = (contentId: string, contentType: 'word' | 'phrase' | 'core'): SRSCard => {
    if (state.value.cards[contentId]) {
      return state.value.cards[contentId]
    }

    const card = SRSManager.createCard(contentId, contentType)
    state.value.cards[contentId] = card
    saveToStorage()

    return card
  }

  const initializeContentCards = (
    content: (WordContent | PhraseContent)[],
    contentType: 'word' | 'phrase' | 'core'
  ): void => {
    content.forEach(item => {
      if (!state.value.cards[item.id]) {
        const card = SRSManager.createCard(item.id, contentType)
        state.value.cards[item.id] = card
      }
    })
    saveToStorage()
  }

  const updateCardAfterReview = (contentId: string, result: ReviewResult): SRSCard => {
    const card = state.value.cards[contentId]
    if (!card) {
      throw new Error(`Card not found: ${contentId}`)
    }

    const updatedCard = SRSManager.updateCard(card, result)
    state.value.cards[contentId] = updatedCard
    state.value.lastSyncAt = new Date()
    saveToStorage()

    return updatedCard
  }

  const generateStudySet = (targetCount: number = 20): {
    reviews: SRSCard[]
    news: SRSCard[]
    total: SRSCard[]
  } => {
    return SRSManager.generateOptimalSet(
      allCards.value,
      targetCount,
      state.value.settings.reviewRatio
    )
  }

  const getCardById = (contentId: string): SRSCard | null => {
    return state.value.cards[contentId] || null
  }

  const getCardsByType = (contentType: 'word' | 'phrase' | 'core'): SRSCard[] => {
    return allCards.value.filter(card => card.contentType === contentType)
  }

  const updateSettings = (newSettings: Partial<SRSState['settings']>): void => {
    state.value.settings = {
      ...state.value.settings,
      ...newSettings
    }
    saveToStorage()
  }

  const resetCard = (contentId: string): void => {
    const card = state.value.cards[contentId]
    if (!card) return

    const resetCard = SRSManager.createCard(contentId, card.contentType)
    state.value.cards[contentId] = resetCard
    saveToStorage()
  }

  const deleteCard = (contentId: string): void => {
    delete state.value.cards[contentId]
    saveToStorage()
  }

  // 自動品質計算
  const calculateAutoQuality = (
    contentId: string,
    accuracy: number,
    responseTime: number
  ): ReviewQuality => {
    const card = getCardById(contentId)
    if (!card) return 3

    return SRSManager.calculateQualityScore(
      accuracy,
      responseTime,
      card.averageResponseTime || responseTime
    )
  }

  // ステージ/カテゴリー固有の統計
  const getStageStats = (stageId: number, contentType: 'word' | 'phrase' | 'core') => {
    const stageCards = allCards.value.filter(card => {
      // カードIDからステージ情報を抽出（実装依存）
      return card.contentType === contentType
    })

    if (stageCards.length === 0) {
      return {
        total: 0,
        due: 0,
        new: 0,
        learning: 0,
        mature: 0
      }
    }

    const now = new Date()
    return {
      total: stageCards.length,
      due: stageCards.filter(c => c.nextReviewDate <= now).length,
      new: stageCards.filter(c => c.isNew).length,
      learning: stageCards.filter(c => !c.isNew && c.interval < 21).length,
      mature: stageCards.filter(c => c.interval >= 21).length
    }
  }

  // Storage methods
  const saveToStorage = (): void => {
    try {
      const serializedState = {
        ...state.value,
        cards: Object.fromEntries(
          Object.entries(state.value.cards).map(([key, card]) => [
            key,
            {
              ...card,
              lastReviewed: card.lastReviewed?.toISOString(),
              nextReviewDate: card.nextReviewDate.toISOString(),
              createdAt: card.createdAt.toISOString(),
              updatedAt: card.updatedAt.toISOString()
            }
          ])
        ),
        lastSyncAt: state.value.lastSyncAt?.toISOString()
      }

      localStorage.setItem('srs-state', JSON.stringify(serializedState))
    } catch (error) {
      console.error('Failed to save SRS state:', error)
    }
  }

  const loadFromStorage = (): void => {
    try {
      const saved = localStorage.getItem('srs-state')
      if (!saved) return

      const parsed = JSON.parse(saved)

      // Deserialize dates
      const deserializedCards: Record<string, SRSCard> = {}
      for (const [key, card] of Object.entries(parsed.cards)) {
        const c = card as Omit<SRSCard, 'lastReviewed' | 'nextReviewDate' | 'createdAt' | 'updatedAt'> & {
          lastReviewed: string | null
          nextReviewDate: string
          createdAt: string
          updatedAt: string
        }
        deserializedCards[key] = {
          ...c,
          lastReviewed: c.lastReviewed ? new Date(c.lastReviewed) : null,
          nextReviewDate: new Date(c.nextReviewDate),
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }
      }

      state.value = {
        cards: deserializedCards,
        lastSyncAt: parsed.lastSyncAt ? new Date(parsed.lastSyncAt) : null,
        settings: parsed.settings || state.value.settings
      }
    } catch (error) {
      console.error('Failed to load SRS state:', error)
    }
  }

  const clearStorage = (): void => {
    localStorage.removeItem('srs-state')
    state.value = {
      cards: {},
      lastSyncAt: null,
      settings: {
        maxNewCardsPerDay: 20,
        maxReviewsPerDay: 100,
        reviewRatio: 0.7,
        autoCalculateQuality: true
      }
    }
  }

  // 初期化時にストレージからロード
  loadFromStorage()

  return {
    // State
    state,

    // Computed
    allCards,
    dueCards,
    newCards,
    stats,
    todayStats,

    // Actions
    initializeCard,
    initializeContentCards,
    updateCardAfterReview,
    generateStudySet,
    getCardById,
    getCardsByType,
    updateSettings,
    resetCard,
    deleteCard,
    calculateAutoQuality,
    getStageStats,

    // Storage
    saveToStorage,
    loadFromStorage,
    clearStorage
  }
})