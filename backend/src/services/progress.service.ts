import { PrismaClient, UserProgress, GameSession } from '@prisma/client'

export class ProgressService {
  constructor(private prisma: PrismaClient) {}

  /**
   * ユーザーの全進捗取得
   */
  async getAllProgress(userId: string): Promise<UserProgress[]> {
    return this.prisma.userProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    })
  }

  /**
   * 特定コンテンツの進捗取得
   */
  async getProgressByContent(
    userId: string,
    contentType: string,
    contentId: string
  ): Promise<UserProgress | null> {
    return this.prisma.userProgress.findUnique({
      where: {
        userId_contentType_contentId: {
          userId,
          contentType,
          contentId
        }
      }
    })
  }

  /**
   * コンテンツタイプ別進捗取得
   */
  async getProgressByType(
    userId: string,
    contentType: string
  ): Promise<UserProgress[]> {
    return this.prisma.userProgress.findMany({
      where: { userId, contentType },
      orderBy: { updatedAt: 'desc' }
    })
  }

  /**
   * 進捗作成または更新
   */
  async upsertProgress(data: {
    userId: string
    contentType: string
    contentId: string
    level?: number
    stage?: number
    completed?: boolean
    bestWpm?: number
    bestAccuracy?: number
    totalTimeSeconds?: number
  }): Promise<UserProgress> {
    const {
      userId,
      contentType,
      contentId,
      level,
      stage,
      completed,
      bestWpm,
      bestAccuracy,
      totalTimeSeconds
    } = data

    return this.prisma.userProgress.upsert({
      where: {
        userId_contentType_contentId: {
          userId,
          contentType,
          contentId
        }
      },
      update: {
        level,
        stage,
        completed: completed ?? undefined,
        bestWpm: bestWpm !== undefined ? Math.max(bestWpm, 0) : undefined,
        bestAccuracy:
          bestAccuracy !== undefined ? Math.max(bestAccuracy, 0) : undefined,
        totalTimeSeconds:
          totalTimeSeconds !== undefined
            ? { increment: totalTimeSeconds }
            : undefined,
        totalAttempts: { increment: 1 },
        updatedAt: new Date()
      },
      create: {
        userId,
        contentType,
        contentId,
        level,
        stage,
        completed: completed ?? false,
        bestWpm: bestWpm ?? 0,
        bestAccuracy: bestAccuracy ?? 0,
        totalTimeSeconds: totalTimeSeconds ?? 0,
        totalAttempts: 1
      }
    })
  }

  /**
   * ゲームセッション作成
   */
  async createSession(data: {
    userId: string
    contentType: string
    contentId: string
    wpm: number
    accuracy: number
    durationSeconds: number
    errorCount?: number
    completed?: boolean
  }): Promise<GameSession> {
    return this.prisma.gameSession.create({
      data: {
        userId: data.userId,
        contentType: data.contentType,
        contentId: data.contentId,
        wpm: data.wpm,
        accuracy: data.accuracy,
        durationSeconds: data.durationSeconds,
        errorCount: data.errorCount ?? 0,
        completed: data.completed ?? true,
        startedAt: new Date(),
        completedAt: data.completed !== false ? new Date() : null
      }
    })
  }

  /**
   * ユーザーのセッション履歴取得
   */
  async getSessions(
    userId: string,
    limit: number = 50
  ): Promise<GameSession[]> {
    return this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * 統計情報取得
   */
  async getStats(userId: string): Promise<{
    totalSessions: number
    totalTime: number
    averageWpm: number
    averageAccuracy: number
    completedContent: number
    totalAttempts: number
  }> {
    const [sessions, progress] = await Promise.all([
      this.prisma.gameSession.findMany({
        where: { userId }
      }),
      this.prisma.userProgress.findMany({
        where: { userId }
      })
    ])

    const totalSessions = sessions.length
    const totalTime = sessions.reduce(
      (sum, s) => sum + s.durationSeconds,
      0
    )
    const averageWpm =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length
        : 0
    const averageAccuracy =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
        : 0
    const completedContent = progress.filter((p) => p.completed).length
    const totalAttempts = progress.reduce((sum, p) => sum + p.totalAttempts, 0)

    return {
      totalSessions,
      totalTime,
      averageWpm: Math.round(averageWpm * 100) / 100,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      completedContent,
      totalAttempts
    }
  }

  /**
   * 日次統計更新
   */
  async updateDailyStats(
    userId: string,
    data: {
      totalSessions: number
      totalTimeSeconds: number
      totalCharactersTyped: number
      averageWpm: number
      averageAccuracy: number
      newCardsLearned?: number
      cardsReviewed?: number
    }
  ): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await this.prisma.dailyStats.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        totalSessions: { increment: data.totalSessions },
        totalTimeSeconds: { increment: data.totalTimeSeconds },
        totalCharactersTyped: { increment: data.totalCharactersTyped },
        averageWpm: data.averageWpm,
        averageAccuracy: data.averageAccuracy,
        newCardsLearned: data.newCardsLearned
          ? { increment: data.newCardsLearned }
          : undefined,
        cardsReviewed: data.cardsReviewed
          ? { increment: data.cardsReviewed }
          : undefined
      },
      create: {
        userId,
        date: today,
        totalSessions: data.totalSessions,
        totalTimeSeconds: data.totalTimeSeconds,
        totalCharactersTyped: data.totalCharactersTyped,
        averageWpm: data.averageWpm,
        averageAccuracy: data.averageAccuracy,
        newCardsLearned: data.newCardsLearned ?? 0,
        cardsReviewed: data.cardsReviewed ?? 0
      }
    })
  }
}
