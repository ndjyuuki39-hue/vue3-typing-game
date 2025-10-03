import { z } from 'zod'
import { router, protectedProcedure } from '../trpc.js'
import { SRSService } from '../services/srs.service.js'
import { SRSAlgorithm } from '../utils/srs-algorithm.util.js'

/**
 * SRSルーター
 * 間隔反復学習システムを管理
 */
export const srsRouter = router({
  /**
   * 全カード取得
   */
  getAllCards: protectedProcedure.query(async ({ ctx }) => {
    const srsService = new SRSService(ctx.prisma)
    return await srsService.getAllCards(ctx.userId)
  }),

  /**
   * カード取得または作成
   */
  getOrCreateCard: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
        contentType: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const srsService = new SRSService(ctx.prisma)
      return await srsService.getOrCreateCard(
        ctx.userId,
        input.contentId,
        input.contentType
      )
    }),

  /**
   * 復習期限カード取得
   */
  getDueCards: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional()
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const srsService = new SRSService(ctx.prisma)
      return await srsService.getDueCards(ctx.userId, input?.limit)
    }),

  /**
   * 新規カード取得
   */
  getNewCards: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional()
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const srsService = new SRSService(ctx.prisma)
      return await srsService.getNewCards(ctx.userId, input?.limit ?? 20)
    }),

  /**
   * 学習セット生成
   */
  generateStudySet: protectedProcedure
    .input(
      z.object({
        targetCount: z.number().min(1).max(100).optional(),
        reviewRatio: z.number().min(0).max(1).optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const srsService = new SRSService(ctx.prisma)
      return await srsService.generateStudySet(
        ctx.userId,
        input.targetCount ?? 20,
        input.reviewRatio ?? 0.7
      )
    }),

  /**
   * 復習記録
   */
  recordReview: protectedProcedure
    .input(
      z.object({
        cardId: z.string(),
        quality: z.union([
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5)
        ]),
        responseTime: z.number().min(0),
        accuracy: z.number().min(0).max(1),
        wpm: z.number().min(0)
      })
    )
    .mutation(async ({ input, ctx }) => {
      const srsService = new SRSService(ctx.prisma)

      const result = {
        quality: input.quality,
        responseTime: input.responseTime,
        accuracy: input.accuracy,
        wpm: input.wpm
      }

      return await srsService.updateAfterReview(input.cardId, result)
    }),

  /**
   * 自動品質スコア計算
   */
  calculateQuality: protectedProcedure
    .input(
      z.object({
        accuracy: z.number().min(0).max(1),
        responseTime: z.number().min(0),
        averageResponseTime: z.number().min(0)
      })
    )
    .query(({ input }) => {
      return {
        quality: SRSAlgorithm.calculateQualityScore(
          input.accuracy,
          input.responseTime,
          input.averageResponseTime
        )
      }
    }),

  /**
   * SRS統計取得
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const srsService = new SRSService(ctx.prisma)
    return await srsService.getStats(ctx.userId)
  }),

  /**
   * カードリセット
   */
  resetCard: protectedProcedure
    .input(
      z.object({
        cardId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const srsService = new SRSService(ctx.prisma)
      return await srsService.resetCard(input.cardId)
    }),

  /**
   * カード削除
   */
  deleteCard: protectedProcedure
    .input(
      z.object({
        cardId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const srsService = new SRSService(ctx.prisma)
      await srsService.deleteCard(input.cardId)
      return { success: true }
    })
})
