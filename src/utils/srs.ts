/**
 * Spaced Repetition System (SRS) Implementation
 * Based on SuperMemo SM-2 Algorithm
 */

export interface SRSCard {
  id: string
  contentType: 'word' | 'phrase' | 'core'

  // SRS Core Data
  easeFactor: number        // 間隔乗数 (初期値: 2.5)
  interval: number          // 次回復習までの日数
  repetitions: number       // 連続正解回数
  lastReviewed: Date | null // 最後の復習日
  nextReviewDate: Date      // 次回復習予定日

  // Learning History
  totalReviews: number      // 総復習回数
  totalCorrect: number      // 総正解数
  averageResponseTime: number // 平均回答時間(ms)
  streak: number            // 現在の連続正解数
  maxStreak: number         // 最高連続正解数

  // Performance Metrics
  lastAccuracy: number      // 前回の正確率 (0-1)
  lastWPM: number          // 前回のWPM
  difficultyLevel: number   // 主観的難易度 (1-5)

  // Metadata
  createdAt: Date
  updatedAt: Date
  isNew: boolean           // 新規学習項目か
}

export type ReviewQuality = 1 | 2 | 3 | 4 | 5

export interface ReviewResult {
  quality: ReviewQuality   // 1: 完全に忘れた, 2: 間違えた, 3: 困難だった, 4: 簡単だった, 5: 完璧
  responseTime: number     // 回答時間(ms)
  accuracy: number         // 正確率 (0-1)
  wpm: number             // WPM
}

/**
 * SuperMemo SM-2 Algorithm Implementation
 * 科学的に最適化された間隔反復アルゴリズム
 */
export class SRSManager {

  /**
   * 新しいSRSカードを作成
   */
  static createCard(id: string, contentType: 'word' | 'phrase' | 'core'): SRSCard {
    const now = new Date()

    return {
      id,
      contentType,

      // SRS初期値
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      lastReviewed: null,
      nextReviewDate: now,

      // 統計初期値
      totalReviews: 0,
      totalCorrect: 0,
      averageResponseTime: 0,
      streak: 0,
      maxStreak: 0,

      // パフォーマンス初期値
      lastAccuracy: 0,
      lastWPM: 0,
      difficultyLevel: 3,

      // メタデータ
      createdAt: now,
      updatedAt: now,
      isNew: true
    }
  }

  /**
   * 復習結果に基づいてカードを更新
   * SuperMemo SM-2アルゴリズムの実装
   */
  static updateCard(card: SRSCard, result: ReviewResult): SRSCard {
    const now = new Date()
    const updatedCard = { ...card }

    // 統計情報の更新
    updatedCard.totalReviews++
    updatedCard.lastReviewed = now
    updatedCard.lastAccuracy = result.accuracy
    updatedCard.lastWPM = result.wpm
    updatedCard.updatedAt = now
    updatedCard.isNew = false

    // 平均回答時間の更新
    if (updatedCard.averageResponseTime === 0) {
      updatedCard.averageResponseTime = result.responseTime
    } else {
      updatedCard.averageResponseTime =
        (updatedCard.averageResponseTime * (updatedCard.totalReviews - 1) + result.responseTime) / updatedCard.totalReviews
    }

    // 成功/失敗に基づくストリーク更新
    if (result.quality >= 3) {
      updatedCard.totalCorrect++
      updatedCard.streak++
      updatedCard.maxStreak = Math.max(updatedCard.maxStreak, updatedCard.streak)
    } else {
      updatedCard.streak = 0
    }

    // SuperMemo SM-2 アルゴリズム
    if (result.quality >= 3) {
      // 正解の場合
      if (updatedCard.repetitions === 0) {
        updatedCard.interval = 1
      } else if (updatedCard.repetitions === 1) {
        updatedCard.interval = 6
      } else {
        updatedCard.interval = Math.round(updatedCard.interval * updatedCard.easeFactor)
      }
      updatedCard.repetitions++
    } else {
      // 不正解の場合
      updatedCard.repetitions = 0
      updatedCard.interval = 1
    }

    // 難易度係数(EaseFactor)の調整
    const newEaseFactor = updatedCard.easeFactor + (0.1 - (5 - result.quality) * (0.08 + (5 - result.quality) * 0.02))
    updatedCard.easeFactor = Math.max(1.3, newEaseFactor) // 最小値1.3

    // 次回復習日の計算
    const nextReviewTime = now.getTime() + updatedCard.interval * 24 * 60 * 60 * 1000
    updatedCard.nextReviewDate = new Date(nextReviewTime)

    return updatedCard
  }

  /**
   * 復習が必要なカードをフィルタリング
   */
  static getDueCards(cards: SRSCard[]): SRSCard[] {
    const now = new Date()
    return cards.filter(card => card.nextReviewDate <= now)
  }

  /**
   * 新規学習対象のカードを取得
   */
  static getNewCards(cards: SRSCard[], limit: number = 20): SRSCard[] {
    return cards
      .filter(card => card.isNew)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, limit)
  }

  /**
   * 最適な学習セットを生成
   * @param allCards 全カード
   * @param targetCount 目標問題数
   * @param reviewRatio 復習の割合 (0-1)
   */
  static generateOptimalSet(
    allCards: SRSCard[],
    targetCount: number = 20,
    reviewRatio: number = 0.7
  ): { reviews: SRSCard[], news: SRSCard[], total: SRSCard[] } {
    const dueCards = this.getDueCards(allCards)
    const newCards = this.getNewCards(allCards)

    const reviewCount = Math.min(Math.floor(targetCount * reviewRatio), dueCards.length)
    const newCount = Math.min(targetCount - reviewCount, newCards.length)

    // 復習カードを優先度順にソート
    const prioritizedReviews = this.prioritizeReviews(dueCards)
    const selectedReviews = prioritizedReviews.slice(0, reviewCount)
    const selectedNews = newCards.slice(0, newCount)

    // シャッフルして混ぜる
    const total = this.shuffle([...selectedReviews, ...selectedNews])

    return {
      reviews: selectedReviews,
      news: selectedNews,
      total
    }
  }

  /**
   * 復習カードの優先度付け
   */
  private static prioritizeReviews(dueCards: SRSCard[]): SRSCard[] {
    const now = new Date()

    return dueCards.sort((a, b) => {
      // 1. 期限切れの長さ (期限切れが長いほど優先)
      const overdueA = now.getTime() - a.nextReviewDate.getTime()
      const overdueB = now.getTime() - b.nextReviewDate.getTime()

      if (overdueA !== overdueB) {
        return overdueB - overdueA
      }

      // 2. 失敗率 (失敗率が高いほど優先)
      const failureRateA = a.totalReviews > 0 ? 1 - (a.totalCorrect / a.totalReviews) : 0
      const failureRateB = b.totalReviews > 0 ? 1 - (b.totalCorrect / b.totalReviews) : 0

      if (failureRateA !== failureRateB) {
        return failureRateB - failureRateA
      }

      // 3. 間隔の短さ (間隔が短いほど優先)
      return a.interval - b.interval
    })
  }

  /**
   * 配列をシャッフル
   */
  private static shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  /**
   * 学習統計を計算
   */
  static calculateStats(cards: SRSCard[]): {
    total: number
    new: number
    learning: number
    mature: number
    averageRetention: number
    totalReviews: number
  } {
    const now = new Date()

    const stats = {
      total: cards.length,
      new: cards.filter(c => c.isNew).length,
      learning: cards.filter(c => !c.isNew && c.interval < 21).length,
      mature: cards.filter(c => c.interval >= 21).length,
      averageRetention: 0,
      totalReviews: cards.reduce((sum, c) => sum + c.totalReviews, 0)
    }

    // 平均記憶保持率の計算
    const cardsWithReviews = cards.filter(c => c.totalReviews > 0)
    if (cardsWithReviews.length > 0) {
      const totalRetention = cardsWithReviews.reduce((sum, c) => {
        return sum + (c.totalCorrect / c.totalReviews)
      }, 0)
      stats.averageRetention = totalRetention / cardsWithReviews.length
    }

    return stats
  }

  /**
   * パフォーマンスに基づく品質スコアを自動計算
   */
  static calculateQualityScore(accuracy: number, responseTime: number, averageResponseTime: number): ReviewQuality {
    // 正確率ベースの基本スコア
    let baseScore: ReviewQuality = 3

    if (accuracy >= 0.95) baseScore = 5
    else if (accuracy >= 0.85) baseScore = 4
    else if (accuracy >= 0.70) baseScore = 3
    else if (accuracy >= 0.50) baseScore = 2
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
}