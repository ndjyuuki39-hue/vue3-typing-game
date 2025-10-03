import Fastify from 'fastify'
import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { PrismaClient } from '@prisma/client'
import { appRouter } from './router.js'
import type { Context } from './types/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// 環境変数読み込み
dotenv.config()

const prisma = new PrismaClient()
const server = Fastify({
  logger: true
})

const PORT = Number(process.env.PORT) || 3001
const HOST = '0.0.0.0'

// CORS設定
const allowedOrigins = [
  'http://localhost:5173',
  'https://vue3-typing-game.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

await server.register(cors, {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
})

// tRPCプラグイン登録
await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: async ({ req }: { req: any }): Promise<Context> => {
      // JWT検証
      let userId: string | undefined

      const authHeader = req.headers.authorization
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1]
          if (token) {
            const decoded = jwt.verify(
              token,
              process.env.JWT_SECRET!
            ) as { userId: string }
            userId = decoded.userId
          }
        } catch (error) {
          // トークン無効 - userIdはundefinedのまま
          server.log.warn('Invalid JWT token')
        }
      }

      return { prisma, userId }
    }
  }
})

// 通常のRESTエンドポイント（ヘルスチェック用）
server.get('/health', async () => {
  return {
    status: 'ok',
    message: 'Fastify + tRPC Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }
})

// ルートエンドポイント
server.get('/', async () => {
  return {
    message: 'Vue3 Typing Game Backend API',
    endpoints: {
      health: '/health',
      trpc: '/trpc'
    }
  }
})

// サーバー起動
const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST })
    console.log(`
    🚀 Server is running!

    📍 Local:   http://localhost:${PORT}
    📍 Network: http://${HOST}:${PORT}

    🔗 Endpoints:
       - Health:  http://localhost:${PORT}/health
       - tRPC:    http://localhost:${PORT}/trpc

    💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}
    🔐 JWT:      ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}
    `)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...')
  await prisma.$disconnect()
  await server.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...')
  await prisma.$disconnect()
  await server.close()
  process.exit(0)
})

start()
