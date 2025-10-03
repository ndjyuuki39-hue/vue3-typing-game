/**
 * Spaced Repetition System (SRS) Algorithm
 * Based on SuperMemo SM-2 Algorithm
 *
 * フロントエンドから移植したSRSアルゴリズム
 */

export type ReviewQuality = 1 | 2 | 3 | 4 | 5

export interface ReviewResult {
  quality: ReviewQuality // 1: 完全に忘れた, 2: 間違えた, 3: 困難だった, 4: 簡単だった, 5: 完璧
  responseTime: number // 回答時間(ms)
  accuracy: number // 正確率 (0-1)
  wpm: number // WPM
}

export interface SRSUpdateResult {
  easeFactor: number
  intervalDays: number
  repetitions: number
  nextReviewAt: Date
  isNew: boolean
  totalReviews: number
  correctReviews: number
  lastAccuracy: number
  averageResponseTime: number
}

/**
 * SuperMemo SM-2アルゴリズムによるカード更新計算
 */
export class SRSAlgorithm {
  /**
   * 復習結果に基づいてSRSパラメータを更新
   */
  static updateCardParameters(
    current: {
      easeFactor: number
      intervalDays: number
      repetitions: number
      totalReviews: number
      correctReviews: number
      averageResponseTime: number
    },
    result: ReviewResult
  ): SRSUpdateResult {
    const now = new Date()

    // 統計情報の更新
    const totalReviews = current.totalReviews + 1
    const correctReviews =
      result.quality >= 3
        ? current.correctReviews + 1
        : current.correctReviews

    // 平均回答時間の更新
    const averageResponseTime =
      current.averageResponseTime === 0
        ? result.responseTime
        : (current.averageResponseTime * current.totalReviews +
            result.responseTime) /
          totalReviews

    let easeFactor = current.easeFactor
    let intervalDays = current.intervalDays
    let repetitions = current.repetitions

    // SuperMemo SM-2 アルゴリズム
    if (result.quality >= 3) {
      // 正解の場合
      if (repetitions === 0) {
        intervalDays = 1
      } else if (repetitions === 1) {
        intervalDays = 6
      } else {
        intervalDays = Math.round(intervalDays * easeFactor)
      }
      repetitions++
    } else {
      // 不正解の場合
      repetitions = 0
      intervalDays = 1
    }

    // 難易度係数(EaseFactor)の調整
    const newEaseFactor =
      easeFactor +
      (0.1 - (5 - result.quality) * (0.08 + (5 - result.quality) * 0.02))
    easeFactor = Math.max(1.3, newEaseFactor) // 最小値1.3

    // 次回復習日の計算
    const nextReviewTime = now.getTime() + intervalDays * 24 * 60 * 60 * 1000
    const nextReviewAt = new Date(nextReviewTime)

    return {
      easeFactor,
      intervalDays,
      repetitions,
      nextReviewAt,
      isNew: false, // 一度でも復習したら新規ではない
      totalReviews,
      correctReviews,
      lastAccuracy: result.accuracy,
      averageResponseTime
    }
  }

  /**
   * パフォーマンスに基づく品質スコアを自動計算
   */
  static calculateQualityScore(
    accuracy: number,
    responseTime: number,
    averageResponseTime: number
  ): ReviewQuality {
    // 正確率ベースの基本スコア
    let baseScore: ReviewQuality = 3

    if (accuracy >= 0.95) baseScore = 5
    else if (accuracy >= 0.85) baseScore = 4
    else if (accuracy >= 0.7) baseScore = 3
    else if (accuracy >= 0.5) baseScore = 2
    else baseScore = 1

    // 回答速度による調整
    if (averageResponseTime > 0) {
      const speedRatio = responseTime / averageResponseTime

      if (speedRatio <= 0.7 && baseScore >= 4) {
        baseScore = 5 // 速くて正確 = 完璧
      } else if (speedRatio >= 2.0 && baseScore <= 3) {
        baseScore = Math.max(1, baseScore - 1) as ReviewQuality // 遅い場合はペナルティ
      }
    }

    return baseScore
  }

  /**
   * 復習カードの優先度計算
   */
  static calculatePriority(card: {
    nextReviewAt: Date
    totalReviews: number
    correctReviews: number
    intervalDays: number
  }): number {
    const now = new Date()

    // 1. 期限切れの長さ (期限切れが長いほど高優先)
    const overdueDays = Math.max(
      0,
      (now.getTime() - card.nextReviewAt.getTime()) / (24 * 60 * 60 * 1000)
    )

    // 2. 失敗率 (失敗率が高いほど高優先)
    const failureRate =
      card.totalReviews > 0
        ? 1 - card.correctReviews / card.totalReviews
        : 0

    // 3. 間隔の短さ (間隔が短いほど高優先)
    const intervalFactor = 1 / (card.intervalDays + 1)

    // 総合優先度スコア
    return overdueDays * 10 + failureRate * 5 + intervalFactor * 2
  }
}
