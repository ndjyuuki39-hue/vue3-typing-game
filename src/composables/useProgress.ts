import { ref } from 'vue'
import { trpc } from '@/api/trpc'

const progress = ref<any[]>([])
const stats = ref<any>(null)
const loading = ref(false)

export const useProgress = () => {
  // ゲームセッション記録
  const recordSession = async (sessionData: {
    contentType: string
    contentId: string
    wpm: number
    accuracy: number
    durationSeconds: number
    errorCount: number
    completed: boolean
  }) => {
    loading.value = true
    try {
      const result = await trpc.progress.createSession.mutate(sessionData)

      // ローカルの進捗も更新
      await fetchAllProgress()

      return result
    } catch (error) {
      console.error('Session recording failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 全進捗取得
  const fetchAllProgress = async () => {
    loading.value = true
    try {
      progress.value = await trpc.progress.getAll.query()
      return progress.value
    } catch (error) {
      console.error('Failed to fetch progress:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 統計取得
  const fetchStats = async () => {
    loading.value = true
    try {
      stats.value = await trpc.progress.getStats.query()
      return stats.value
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // コンテンツ別進捗取得
  const getProgressByContent = async (contentType: string, contentId: string) => {
    loading.value = true
    try {
      return await trpc.progress.getByContent.query({ contentType, contentId })
    } catch (error) {
      console.error('Failed to fetch content progress:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 最近のセッション取得
  const getRecentSessions = async (limit = 10) => {
    loading.value = true
    try {
      return await trpc.progress.getRecent.query({ limit })
    } catch (error) {
      console.error('Failed to fetch recent sessions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ベストスコア取得
  const getBestScores = async (limit = 10) => {
    loading.value = true
    try {
      return await trpc.progress.getBestScores.query({ limit })
    } catch (error) {
      console.error('Failed to fetch best scores:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 日別統計取得
  const getDailyStats = async (startDate?: Date, endDate?: Date) => {
    loading.value = true
    try {
      return await trpc.progress.getDaily.query({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      })
    } catch (error) {
      console.error('Failed to fetch daily stats:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    progress,
    stats,
    loading,
    recordSession,
    fetchAllProgress,
    fetchStats,
    getProgressByContent,
    getRecentSessions,
    getBestScores,
    getDailyStats
  }
}
