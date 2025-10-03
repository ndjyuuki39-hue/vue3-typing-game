import { ref } from 'vue'
import { trpc } from '@/api/trpc'

const studySet = ref<any>(null)
const stats = ref<any>(null)
const loading = ref(false)

export const useSRS = () => {
  // 学習セット生成
  const generateStudySet = async (targetCount = 20, reviewRatio = 0.7) => {
    loading.value = true
    try {
      studySet.value = await trpc.srs.generateStudySet.query({
        targetCount,
        reviewRatio
      })
      return studySet.value
    } catch (error) {
      console.error('Failed to generate study set:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 復習記録
  const recordReview = async (
    cardId: string,
    quality: 1 | 2 | 3 | 4 | 5,
    responseTime: number,
    accuracy: number,
    wpm: number
  ) => {
    loading.value = true
    try {
      return await trpc.srs.recordReview.mutate({
        cardId,
        quality,
        responseTime,
        accuracy,
        wpm
      })
    } catch (error) {
      console.error('Failed to record review:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // カード取得または作成
  const getOrCreateCard = async (contentId: string, contentType: string) => {
    loading.value = true
    try {
      return await trpc.srs.getOrCreateCard.mutate({
        contentId,
        contentType
      })
    } catch (error) {
      console.error('Failed to get or create card:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 全カード取得
  const getAllCards = async () => {
    loading.value = true
    try {
      return await trpc.srs.getAllCards.query()
    } catch (error) {
      console.error('Failed to get all cards:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 復習期限カード取得
  const getDueCards = async (limit = 10) => {
    loading.value = true
    try {
      return await trpc.srs.getDueCards.query({ limit })
    } catch (error) {
      console.error('Failed to get due cards:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // SRS統計取得
  const fetchStats = async () => {
    loading.value = true
    try {
      stats.value = await trpc.srs.getStats.query()
      return stats.value
    } catch (error) {
      console.error('Failed to fetch SRS stats:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 品質スコア計算
  const calculateQuality = async (
    accuracy: number,
    responseTime: number,
    averageResponseTime: number
  ) => {
    try {
      const result = await trpc.srs.calculateQuality.query({
        accuracy,
        responseTime,
        averageResponseTime
      })
      return result.quality
    } catch (error) {
      console.error('Failed to calculate quality:', error)
      throw error
    }
  }

  return {
    studySet,
    stats,
    loading,
    generateStudySet,
    recordReview,
    getOrCreateCard,
    getAllCards,
    getDueCards,
    fetchStats,
    calculateQuality
  }
}
