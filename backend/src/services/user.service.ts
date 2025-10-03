import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export class UserService {
  constructor(private prisma: PrismaClient) {}

  /**
   * ユーザー作成
   */
  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    return this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash
      }
    })
  }

  /**
   * ユーザー名でユーザー検索
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username }
    })
  }

  /**
   * メールアドレスでユーザー検索
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  /**
   * IDでユーザー検索
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  /**
   * パスワード検証
   */
  async verifyPassword(
    plainPassword: string,
    passwordHash: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash)
  }

  /**
   * 最終ログイン時刻更新
   */
  async updateLastLogin(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    })
  }

  /**
   * ユーザー情報更新
   */
  async updateUser(
    userId: string,
    data: {
      displayName?: string
      avatarUrl?: string
    }
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data
    })
  }
}
