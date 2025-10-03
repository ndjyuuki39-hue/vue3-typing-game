import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './types/index.js'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

/**
 * 認証が必要なプロシージャ
 * userIdが存在しない場合はUNAUTHORIZEDエラーを投げる
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '認証が必要です'
    })
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId // TypeScriptで型保証
    }
  })
})
