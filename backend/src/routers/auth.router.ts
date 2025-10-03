import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc.js'
import { TRPCError } from '@trpc/server'
import { UserService } from '../services/user.service.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.util.js'

/**
 * 認証ルーター
 * ユーザー登録・ログイン・トークン更新を管理
 */
export const authRouter = router({
  /**
   * ユーザー登録
   */
  register: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3, 'ユーザー名は3文字以上必要です')
          .max(50, 'ユーザー名は50文字以内です')
          .regex(
            /^[a-zA-Z0-9_]+$/,
            'ユーザー名は英数字とアンダースコアのみ使用可能です'
          ),
        email: z.string().email('有効なメールアドレスを入力してください'),
        password: z
          .string()
          .min(8, 'パスワードは8文字以上必要です')
          .max(100, 'パスワードは100文字以内です')
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input
      const userService = new UserService(ctx.prisma)

      // 既存ユーザーチェック
      const existingUsername = await userService.findByUsername(username)
      if (existingUsername) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'このユーザー名は既に使用されています'
        })
      }

      const existingEmail = await userService.findByEmail(email)
      if (existingEmail) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'このメールアドレスは既に登録されています'
        })
      }

      // ユーザー作成
      const user = await userService.createUser(username, email, password)

      // トークン生成
      const accessToken = generateAccessToken(user.id)
      const refreshToken = generateRefreshToken(user.id)

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt
        },
        accessToken,
        refreshToken
      }
    }),

  /**
   * ログイン
   */
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, 'ユーザー名を入力してください'),
        password: z.string().min(1, 'パスワードを入力してください')
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username, password } = input
      const userService = new UserService(ctx.prisma)

      // ユーザー検索
      const user = await userService.findByUsername(username)
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'ユーザー名またはパスワードが正しくありません'
        })
      }

      // パスワード検証
      const isValidPassword = await userService.verifyPassword(
        password,
        user.passwordHash
      )
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'ユーザー名またはパスワードが正しくありません'
        })
      }

      // 最終ログイン更新
      await userService.updateLastLogin(user.id)

      // トークン生成
      const accessToken = generateAccessToken(user.id)
      const refreshToken = generateRefreshToken(user.id)

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          lastLoginAt: new Date()
        },
        accessToken,
        refreshToken
      }
    }),

  /**
   * トークン更新
   */
  refresh: publicProcedure
    .input(
      z.object({
        refreshToken: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // リフレッシュトークン検証
        const payload = verifyRefreshToken(input.refreshToken)
        const userService = new UserService(ctx.prisma)

        // ユーザー存在確認
        const user = await userService.findById(payload.userId)
        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'ユーザーが見つかりません'
          })
        }

        // 新しいトークン生成
        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        return {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl
          },
          accessToken,
          refreshToken
        }
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '無効なリフレッシュトークンです'
        })
      }
    }),

  /**
   * 現在のユーザー情報取得
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const userService = new UserService(ctx.prisma)
    const user = await userService.findById(ctx.userId)

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'ユーザーが見つかりません'
      })
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }
  }),

  /**
   * ユーザー情報更新
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().max(100).optional(),
        avatarUrl: z.string().url().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userService = new UserService(ctx.prisma)
      const user = await userService.updateUser(ctx.userId, input)

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl
      }
    })
})
