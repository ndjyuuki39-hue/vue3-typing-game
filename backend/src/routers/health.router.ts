import { router, publicProcedure } from '../trpc.js'

/**
 * ヘルスチェック用ルーター
 */
export const healthRouter = router({
  check: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'Backend server is running!',
      timestamp: new Date().toISOString()
    }
  })
})
