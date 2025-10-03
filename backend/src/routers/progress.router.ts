import { z } from 'zod'
import { router, protectedProcedure } from '../trpc.js'
import { ProgressService } from '../services/progress.service.js'

/**
 * 進捗管理ルーター
 * 学習進捗のCRUD操作を管理
 */
export const progressRouter = router({
  /**
   * 全進捗取得
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const progressService = new ProgressService(ctx.prisma)
    return await progressService.getAllProgress(ctx.userId)
  }),

  /**
   * コンテンツタイプ別進捗取得
   */
  getByType: protectedProcedure
    .input(
      z.object({
        contentType: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const progressService = new ProgressService(ctx.prisma)
      return await progressService.getProgressByType(
        ctx.userId,
        input.contentType
      )
    }),

  /**
   * 特定コンテンツの進捗取得
   */
  getByContent: protectedProcedure
    .input(
      z.object({
        contentType: z.string(),
        contentId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const progressService = new ProgressService(ctx.prisma)
      return await progressService.getProgressByContent(
        ctx.userId,
        input.contentType,
        input.contentId
      )
    }),

  /**
   * 進捗更新
   */
  update: protectedProcedure
    .input(
      z.object({
        contentType: z.string(),
        contentId: z.string(),
        level: z.number().optional(),
        stage: z.number().optional(),
        completed: z.boolean().optional(),
        bestWpm: z.number().min(0).optional(),
        bestAccuracy: z.number().min(0).max(100).optional(),
        totalTimeSeconds: z.number().min(0).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const progressService = new ProgressService(ctx.prisma)
      return await progressService.upsertProgress({
        userId: ctx.userId,
        ...input
      })
    }),

  /**
   * ゲームセッション記録
   */
  createSession: protectedProcedure
    .input(
      z.object({
        contentType: z.string(),
        contentId: z.string(),
        wpm: z.number().min(0),
        accuracy: z.number().min(0).max(100),
        durationSeconds: z.number().min(0),
        errorCount: z.number().min(0).optional(),
        completed: z.boolean().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const progressService = new ProgressService(ctx.prisma)

      // セッション記録
      const session = await progressService.createSession({
        userId: ctx.userId,
        ...input
      })

      // 進捗も自動更新
      await progressService.upsertProgress({
        userId: ctx.userId,
        contentType: input.contentType,
        contentId: input.contentId,
        bestWpm: input.wpm,
        bestAccuracy: input.accuracy,
        totalTimeSeconds: input.durationSeconds,
        completed: input.completed
      })

      // 日次統計更新
      await progressService.updateDailyStats(ctx.userId, {
        totalSessions: 1,
        totalTimeSeconds: input.durationSeconds,
        totalCharactersTyped: Math.round((input.wpm * 5 * input.durationSeconds) / 60),
        averageWpm: input.wpm,
        averageAccuracy: input.accuracy
      })

      return session
    }),

  /**
   * セッション履歴取得
   */
  getSessions: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional()
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const progressService = new ProgressService(ctx.prisma)
      return await progressService.getSessions(ctx.userId, input?.limit)
    }),

  /**
   * 統計情報取得
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const progressService = new ProgressService(ctx.prisma)
    return await progressService.getStats(ctx.userId)
  }),

  /**
   * コンテンツタイプ別統計
   */
  getStatsByType: protectedProcedure
    .input(
      z.object({
        contentType: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const progressService = new ProgressService(ctx.prisma)
      const progress = await progressService.getProgressByType(
        ctx.userId,
        input.contentType
      )

      const total = progress.length
      const completed = progress.filter((p) => p.completed).length
      const averageWpm =
        progress.length > 0
          ? progress.reduce((sum, p) => sum + p.bestWpm, 0) / progress.length
          : 0
      const averageAccuracy =
        progress.length > 0
          ? progress.reduce((sum, p) => sum + p.bestAccuracy, 0) /
            progress.length
          : 0

      return {
        contentType: input.contentType,
        total,
        completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        averageWpm: Math.round(averageWpm * 100) / 100,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100
      }
    })
})
