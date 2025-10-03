import { router } from './trpc.js'
import { healthRouter } from './routers/health.router.js'
import { authRouter } from './routers/auth.router.js'
import { progressRouter } from './routers/progress.router.js'
import { srsRouter } from './routers/srs.router.js'

/**
 * メインルーター
 * すべてのサブルーターをここで結合
 */
export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  progress: progressRouter,
  srs: srsRouter
})

export type AppRouter = typeof appRouter
