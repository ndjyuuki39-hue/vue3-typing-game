import { PrismaClient, SRSCard } from '@prisma/client'
import { SRSAlgorithm, type ReviewResult } from '../utils/srs-algorithm.util.js'

export class SRSService {
  constructor(private prisma: PrismaClient) {}

  /**
   * SRSカード作成
   */
  async createCard(
    userId: string,
    contentId: string,
    contentType: string
  ): Promise<SRSCard> {
    const now = new Date()

    return this.prisma.sRSCard.create({
      data: {
        userId,
        contentId,
        contentType,
        nextReviewAt: now,
        isNew: true
      }
    })
  }

  /**
   * カード取得（存在しない場合は作成）
   */
  async getOrCreateCard(
    userId: string,
    contentId: string,
    contentType: string
  ): Promise<SRSCard> {
    let card = await this.prisma.sRSCard.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId
        }
      }
    })

    if (!card) {
      card = await this.createCard(userId, contentId, contentType)
    }

    return card
  }

  /**
   * ユーザーの全カード取得
   */
  async getAllCards(userId: string): Promise<SRSCard[]> {
    return this.prisma.sRSCard.findMany({
      where: { userId },
      orderBy: { nextReviewAt: 'asc' }
    })
  }

  /**
   * 復習期限のカード取得
   */
  async getDueCards(userId: string, limit?: number): Promise<SRSCard[]> {
    const now = new Date()

    return this.prisma.sRSCard.findMany({
      where: {
        userId,
        nextReviewAt: {
          lte: now
        }
      },
      orderBy: { nextReviewAt: 'asc' },
      take: limit
    })
  }

  /**
   * 新規カード取得
   */
  async getNewCards(userId: string, limit: number = 20): Promise<SRSCard[]> {
    return this.prisma.sRSCard.findMany({
      where: {
        userId,
        isNew: true
      },
      orderBy: { createdAt: 'asc' },
      take: limit
    })
  }

  /**
   * 復習後のカード更新
   */
  async updateAfterReview(
    cardId: string,
    result: ReviewResult
  ): Promise<SRSCard> {
    const card = await this.prisma.sRSCard.findUnique({
      where: { id: cardId }
    })

    if (!card) {
      throw new Error('Card not found')
    }

    // SRSアルゴリズムで新しいパラメータを計算
    const updated = SRSAlgorithm.updateCardParameters(
      {
        easeFactor: card.easeFactor,
        intervalDays: card.intervalDays,
        repetitions: card.repetitions,
        totalReviews: card.totalReviews,
        correctReviews: card.correctReviews,
        averageResponseTime: card.averageResponseTime
      },
      result
    )

    // データベース更新
    return this.prisma.sRSCard.update({
      where: { id: cardId },
      data: {
        easeFactor: updated.easeFactor,
        intervalDays: updated.intervalDays,
        repetitions: updated.repetitions,
        isNew: updated.isNew,
        totalReviews: updated.totalReviews,
        correctReviews: updated.correctReviews,
        lastAccuracy: updated.lastAccuracy,
        averageResponseTime: Math.round(updated.averageResponseTime),
        lastReviewedAt: new Date(),
        nextReviewAt: updated.nextReviewAt,
        updatedAt: new Date()
      }
    })
  }

  /**
   * 最適な学習セットを生成
   */
  async generateStudySet(
    userId: string,
    targetCount: number = 20,
    reviewRatio: number = 0.7
  ): Promise<{
    reviews: SRSCard[]
    news: SRSCard[]
    total: SRSCard[]
  }> {
    const dueCards = await this.getDueCards(userId)
    const newCards = await this.getNewCards(userId)

    const reviewCount = Math.min(
      Math.floor(targetCount * reviewRatio),
      dueCards.length
    )
    const newCount = Math.min(targetCount - reviewCount, newCards.length)

    // 復習カードを優先度順にソート
    const prioritizedReviews = dueCards
      .map((card) => ({
        card,
        priority: SRSAlgorithm.calculatePriority({
          nextReviewAt: card.nextReviewAt,
          totalReviews: card.totalReviews,
          correctReviews: card.correctReviews,
          intervalDays: card.intervalDays
        })
      }))
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.card)

    const selectedReviews = prioritizedReviews.slice(0, reviewCount)
    const selectedNews = newCards.slice(0, newCount)

    // シャッフル
    const total = this.shuffle([...selectedReviews, ...selectedNews])

    return {
      reviews: selectedReviews,
      news: selectedNews,
      total
    }
  }

  /**
   * SRS統計取得
   */
  async getStats(userId: string): Promise<{
    total: number
    new: number
    learning: number
    mature: number
    dueToday: number
    averageRetention: number
  }> {
    const cards = await this.getAllCards(userId)
    const now = new Date()

    const total = cards.length
    const newCards = cards.filter((c) => c.isNew).length
    const learning = cards.filter((c) => !c.isNew && c.intervalDays < 21).length
    const mature = cards.filter((c) => c.intervalDays >= 21).length
    const dueToday = cards.filter((c) => c.nextReviewAt <= now).length

    // 平均記憶保持率
    const cardsWithReviews = cards.filter((c) => c.totalReviews > 0)
    let averageRetention = 0
    if (cardsWithReviews.length > 0) {
      const totalRetention = cardsWithReviews.reduce((sum, c) => {
        return sum + c.correctReviews / c.totalReviews
      }, 0)
      averageRetention =
        Math.round((totalRetention / cardsWithReviews.length) * 10000) / 100
    }

    return {
      total,
      new: newCards,
      learning,
      mature,
      dueToday,
      averageRetention
    }
  }

  /**
   * カードリセット
   */
  async resetCard(cardId: string): Promise<SRSCard> {
    const now = new Date()

    return this.prisma.sRSCard.update({
      where: { id: cardId },
      data: {
        easeFactor: 2.5,
        intervalDays: 0,
        repetitions: 0,
        isNew: true,
        totalReviews: 0,
        correctReviews: 0,
        lastAccuracy: 0,
        averageResponseTime: 0,
        lastReviewedAt: null,
        nextReviewAt: now,
        updatedAt: now
      }
    })
  }

  /**
   * カード削除
   */
  async deleteCard(cardId: string): Promise<void> {
    await this.prisma.sRSCard.delete({
      where: { id: cardId }
    })
  }

  /**
   * 配列をシャッフル
   */
  private shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
}
