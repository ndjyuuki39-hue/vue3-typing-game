import { computed, ref } from 'vue'
import { useUserStore, type UserProgress } from '@/stores/user'
import { useContentStore } from '@/stores/content'

// 学習分析データ型定義
export interface LearningAnalytics {
  strengthAreas: string[]      // 得意分野
  weaknessAreas: string[]      // 苦手分野
  optimalDifficulty: number    // 最適難易度 (1-3)
  recommendedSpeed: number     // 推奨WPM目標
  learningVelocity: number     // 学習速度指標
  consistencyScore: number     // 一貫性スコア
  retentionRate: number       // 定着率
}

// 推奨学習コンテンツ型定義
export interface LearningRecommendation {
  type: 'basic' | 'words' | 'phrases' | 'core'
  priority: number             // 優先度 (1-10)
  reason: string              // 推奨理由
  estimatedDuration: number   // 推定学習時間（分）
  targetAccuracy: number      // 目標正確率
  targetWpm: number          // 目標WPM
  content: {
    id: string | number
    title: string
    description?: string
  }
}

export const useLearningOptimizer = () => {
  const userStore = useUserStore()
  const contentStore = useContentStore()

  // 学習分析の実行
  const analyzeUserPerformance = computed((): LearningAnalytics => {
    const progress = userStore.progress
    const analytics: LearningAnalytics = {
      strengthAreas: [],
      weaknessAreas: [],
      optimalDifficulty: 1,
      recommendedSpeed: 20,
      learningVelocity: 1.0,
      consistencyScore: 0,
      retentionRate: 0.8
    }

    // 基本タイピング分析
    const basicAccuracies = Object.values(progress.basicTyping.bestAccuracy)
    const basicWpms = Object.values(progress.basicTyping.bestWpm)

    if (basicAccuracies.length > 0) {
      const avgAccuracy = basicAccuracies.reduce((a, b) => a + b, 0) / basicAccuracies.length
      const avgWpm = basicWpms.reduce((a, b) => a + b, 0) / basicWpms.length

      if (avgAccuracy > 90) analytics.strengthAreas.push('基本タイピング')
      else if (avgAccuracy < 80) analytics.weaknessAreas.push('基本タイピング')

      analytics.recommendedSpeed = Math.max(20, Math.floor(avgWpm * 1.1))
      analytics.consistencyScore = calculateConsistency(basicAccuracies)
    }

    // 英単語学習分析
    const wordsCompleted = progress.words.completedLevels.length
    if (wordsCompleted >= 2) {
      analytics.strengthAreas.push('英単語')
    } else if (wordsCompleted === 0 && progress.basicTyping.completedStages.length >= 5) {
      analytics.weaknessAreas.push('英単語')
    }

    // コア構文分析
    const coreCompleted = progress.core.completedStages.length
    const coreAccuracies = Object.values(progress.core.bestAccuracy)

    if (coreCompleted >= 5) {
      const avgCoreAccuracy = coreAccuracies.reduce((a, b) => a + b, 0) / coreAccuracies.length
      if (avgCoreAccuracy > 85) {
        analytics.strengthAreas.push('コア構文')
      }
    }

    // 最適難易度の決定
    const totalGames = progress.totalGames
    if (totalGames > 50) {
      analytics.optimalDifficulty = 3
    } else if (totalGames > 20) {
      analytics.optimalDifficulty = 2
    }

    // 学習速度の分析
    if (progress.totalPlayTime > 0) {
      const gamesPerHour = (totalGames * 3600) / progress.totalPlayTime
      analytics.learningVelocity = Math.min(2.0, gamesPerHour / 10)
    }

    // 定着率の計算（再挑戦による成績向上を分析）
    analytics.retentionRate = calculateRetentionRate(progress)

    return analytics
  })

  // 学習推奨の生成
  const generateRecommendations = computed((): LearningRecommendation[] => {
    const analytics = analyzeUserPerformance.value
    const progress = userStore.progress
    const recommendations: LearningRecommendation[] = []

    // 基本タイピング推奨
    if (progress.basicTyping.completedStages.length < 12) {
      const nextStage = Math.max(1, progress.basicTyping.currentStage)
      const stage = contentStore.getBasicStageByNumber(nextStage)

      if (stage) {
        recommendations.push({
          type: 'basic',
          priority: analytics.weaknessAreas.includes('基本タイピング') ? 10 : 7,
          reason: analytics.weaknessAreas.includes('基本タイピング')
            ? '基本タイピングスキルの向上が必要です'
            : '基本スキルを継続して向上させましょう',
          estimatedDuration: 15,
          targetAccuracy: Math.max(85, stage.targetAccuracy - 5),
          targetWpm: Math.max(15, stage.targetWpm - 5),
          content: {
            id: nextStage,
            title: stage.title,
            description: stage.description
          }
        })
      }
    }

    // 英単語学習推奨
    if (progress.basicTyping.completedStages.length >= 5) {
      const currentLevel = progress.words.currentLevel
      if (currentLevel <= 3) {
        const difficulty = Math.min(analytics.optimalDifficulty, currentLevel)
        recommendations.push({
          type: 'words',
          priority: analytics.weaknessAreas.includes('英単語') ? 9 : 6,
          reason: currentLevel === 1
            ? '基本的な英単語から始めましょう'
            : `レベル${currentLevel}の英単語に挑戦しましょう`,
          estimatedDuration: 20,
          targetAccuracy: 85 + (difficulty * 2),
          targetWpm: analytics.recommendedSpeed,
          content: {
            id: currentLevel,
            title: `英単語レベル${currentLevel}`,
            description: `${currentLevel === 1 ? '基礎' : currentLevel === 2 ? '中級' : '上級'}レベルの英単語練習`
          }
        })
      }
    }

    // コア構文推奨
    if (progress.basicTyping.completedStages.length >= 8) {
      const nextStage = Math.min(13, progress.core.currentStage)
      const categoryInfo = getCategoryForStage(nextStage)

      recommendations.push({
        type: 'core',
        priority: progress.core.completedStages.length === 0 ? 8 : 5,
        reason: nextStage <= 3
          ? '基本的な英語構文パターンを学習しましょう'
          : nextStage <= 7
          ? '中級レベルの構文に挑戦しましょう'
          : nextStage <= 10
          ? '上級構文で表現力を高めましょう'
          : '実用的な表現をマスターしましょう',
        estimatedDuration: 25,
        targetAccuracy: 80 + Math.min(10, nextStage),
        targetWpm: Math.max(25, analytics.recommendedSpeed - 5),
        content: {
          id: nextStage,
          title: `コア構文 ステージ${nextStage}`,
          description: categoryInfo.description
        }
      })
    }

    // フレーズ学習推奨
    if (progress.words.completedLevels.length >= 2) {
      const uncompletedCategories = ['daily', 'business', 'travel', 'shopping', 'restaurant', 'emergency']
        .filter(cat => !progress.phrases.completedCategories.includes(cat))

      if (uncompletedCategories.length > 0) {
        const nextCategory = uncompletedCategories[0]
        recommendations.push({
          type: 'phrases',
          priority: 4,
          reason: '実用的な英語フレーズを学習しましょう',
          estimatedDuration: 30,
          targetAccuracy: 85,
          targetWpm: analytics.recommendedSpeed,
          content: {
            id: nextCategory,
            title: `英語フレーズ: ${getCategoryName(nextCategory)}`,
            description: `${getCategoryName(nextCategory)}で使われる実用的な英語表現`
          }
        })
      }
    }

    // 復習推奨の追加
    addReviewRecommendations(recommendations, progress, analytics)

    // 優先度でソート
    return recommendations.sort((a, b) => b.priority - a.priority)
  })

  // 学習パフォーマンス予測
  const predictLearningOutcome = (contentType: string, targetWpm: number): number => {
    const analytics = analyzeUserPerformance.value
    const baseSuccess = 0.7

    let adjustedSuccess = baseSuccess

    // 得意分野ボーナス
    if (analytics.strengthAreas.some(area => contentType.includes(area.toLowerCase()))) {
      adjustedSuccess += 0.1
    }

    // 苦手分野ペナルティ
    if (analytics.weaknessAreas.some(area => contentType.includes(area.toLowerCase()))) {
      adjustedSuccess -= 0.15
    }

    // 目標WPMの現実性チェック
    const wpmGap = targetWpm - analytics.recommendedSpeed
    if (wpmGap > 10) {
      adjustedSuccess -= Math.min(0.2, wpmGap * 0.02)
    }

    // 学習速度による調整
    adjustedSuccess += (analytics.learningVelocity - 1.0) * 0.1

    // 一貫性スコアによる調整
    adjustedSuccess += analytics.consistencyScore * 0.1

    return Math.max(0.1, Math.min(1.0, adjustedSuccess))
  }

  // ヘルパー関数
  const calculateConsistency = (scores: number[]): number => {
    if (scores.length < 2) return 0.5

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
    const stdDev = Math.sqrt(variance)

    // 標準偏差が小さいほど一貫性が高い
    return Math.max(0, 1 - (stdDev / mean))
  }

  const calculateRetentionRate = (progress: UserProgress): number => {
    const allStages = [
      ...progress.basicTyping.completedStages,
      ...progress.core.completedStages
    ]

    if (allStages.length < 3) return 0.8

    // 最近完了したステージでの成績向上を分析
    const recentStages = allStages.slice(-5)
    const improvements = recentStages.filter(stage => {
      const basicBest = progress.basicTyping.bestAccuracy[stage] || 0
      const coreBest = progress.core.bestAccuracy[stage] || 0
      return Math.max(basicBest, coreBest) > 80
    })

    return Math.min(1.0, improvements.length / recentStages.length + 0.2)
  }

  const getCategoryForStage = (stage: number) => {
    if (stage <= 3) return { category: 'basic', description: '基本構文パターン' }
    if (stage <= 7) return { category: 'intermediate', description: '中級構文表現' }
    if (stage <= 10) return { category: 'advanced', description: '上級構文表現' }
    return { category: 'practical', description: '実用的な表現' }
  }

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      daily: '日常会話',
      business: 'ビジネス',
      travel: '旅行',
      shopping: 'ショッピング',
      restaurant: 'レストラン',
      emergency: '緊急時'
    }
    return names[category] || category
  }

  const addReviewRecommendations = (
    recommendations: LearningRecommendation[],
    progress: UserProgress,
    analytics: LearningAnalytics
  ): void => {
    // 正確率の低いステージを復習対象として追加
    const reviewTargets: Array<{ type: string; id: number | string; accuracy: number }> = []

    // 基本タイピング復習
    Object.entries(progress.basicTyping.bestAccuracy).forEach(([stage, accuracy]) => {
      if (accuracy < 85 && progress.basicTyping.completedStages.includes(Number(stage))) {
        reviewTargets.push({ type: 'basic', id: Number(stage), accuracy })
      }
    })

    // コア構文復習
    Object.entries(progress.core.bestAccuracy).forEach(([stage, accuracy]) => {
      if (accuracy < 80 && progress.core.completedStages.includes(Number(stage))) {
        reviewTargets.push({ type: 'core', id: Number(stage), accuracy })
      }
    })

    // 最も正確率の低いものを復習推奨
    if (reviewTargets.length > 0) {
      const worstTarget = reviewTargets.sort((a, b) => a.accuracy - b.accuracy)[0]
      recommendations.push({
        type: worstTarget.type,
        priority: 3,
        reason: `正確率${worstTarget.accuracy}%のステージを復習しましょう`,
        estimatedDuration: 10,
        targetAccuracy: worstTarget.accuracy + 10,
        targetWpm: analytics.recommendedSpeed,
        content: {
          id: worstTarget.id,
          title: `復習: ${worstTarget.type === 'basic' ? '基本タイピング' : 'コア構文'} ステージ${worstTarget.id}`,
          description: '苦手分野の克服'
        }
      })
    }
  }

  return {
    analyzeUserPerformance,
    generateRecommendations,
    predictLearningOutcome
  }
}