# 🚀 Vue3 Typing Game - Backend API

Fastify + tRPC + Prisma による型安全なバックエンドAPI

## 📋 目次

- [技術スタック](#技術スタック)
- [主要機能](#主要機能)
- [セットアップ](#セットアップ)
- [API仕様](#api仕様)
- [デプロイ](#デプロイ)
- [開発](#開発)

---

## 🛠 技術スタック

- **Fastify** - 高速なNode.jsウェブフレームワーク
- **tRPC** - エンドツーエンド型安全なAPI
- **Prisma** - 型安全なORM
- **SQLite** - 開発用データベース（本番はPostgreSQL推奨）
- **TypeScript** - 型安全な開発
- **JWT** - 認証システム
- **bcrypt** - パスワードハッシュ化

---

## ✨ 主要機能

### 1. 認証システム
- ユーザー登録・ログイン
- JWTトークン認証（アクセス + リフレッシュ）
- プロフィール管理

### 2. 学習進捗管理
- ゲームセッション記録
- 進捗データの永続化
- 統計情報の自動集計
- 日別・コンテンツ別の分析

### 3. SRS（間隔反復学習）システム
- SuperMemo SM-2アルゴリズム実装
- 自動復習スケジューリング
- 学習効率の最適化
- パフォーマンス追跡

---

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- pnpm 8以上

### インストール

```bash
# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env

# データベース初期化
pnpm prisma migrate dev

# 開発サーバー起動
pnpm run dev
```

サーバーが http://localhost:3001 で起動します。

---

## 📚 API仕様

### エンドポイント

- **Health Check**: `GET /health`
- **tRPC**: `POST /trpc/*`

### tRPC ルーター

#### auth（認証）
```typescript
auth.register({ username, email, password })
auth.login({ username, password })
auth.refresh({ refreshToken })
auth.me()
auth.updateProfile({ displayName?, avatarUrl? })
```

#### progress（進捗）
```typescript
progress.createSession({ contentType, contentId, wpm, accuracy, ... })
progress.getAll()
progress.getByContent({ contentType, contentId })
progress.getStats()
progress.getRecent({ limit? })
progress.getBestScores({ limit? })
progress.getDaily({ startDate?, endDate? })
progress.reset({ contentType?, contentId? })
```

#### srs（間隔反復学習）
```typescript
srs.getAllCards()
srs.getOrCreateCard({ contentId, contentType })
srs.getDueCards({ limit? })
srs.getNewCards({ limit? })
srs.generateStudySet({ targetCount?, reviewRatio? })
srs.recordReview({ cardId, quality, responseTime, accuracy, wpm })
srs.calculateQuality({ accuracy, responseTime, averageResponseTime })
srs.getStats()
srs.resetCard({ cardId })
srs.deleteCard({ cardId })
```

---

## 🔐 認証フロー

### 1. ユーザー登録
```bash
curl -X POST http://localhost:3001/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. ログイン
```bash
curl -X POST http://localhost:3001/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

レスポンス:
```json
{
  "result": {
    "data": {
      "user": { ... },
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### 3. 認証が必要なAPIの呼び出し
```bash
curl -X GET http://localhost:3001/trpc/auth.me \
  -H "Authorization: Bearer <accessToken>"
```

---

## 🧪 テスト

### テストスクリプト実行

```bash
# 認証テスト
./test-auth.sh

# 進捗APIテスト
./test-progress.sh

# SRSシステムテスト
./test-srs.sh
```

---

## 📦 デプロイ

詳細は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照

### Railway（推奨）

```bash
# Railway CLI インストール
npm i -g @railway/cli

# デプロイ
railway init
railway up
```

### 環境変数（本番環境）

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

---

## 🔧 開発

### スクリプト

```bash
pnpm run dev              # 開発サーバー起動（ホットリロード）
pnpm run build            # プロダクションビルド
pnpm run start            # プロダクション起動
pnpm run typecheck        # 型チェック
pnpm prisma:generate      # Prismaクライアント生成
pnpm prisma:migrate       # マイグレーション実行
pnpm prisma:studio        # Prisma Studio起動
pnpm run db:reset         # DB リセット + シード
```

### ディレクトリ構造

```
backend/
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   └── migrations/            # マイグレーションファイル
├── src/
│   ├── routers/               # tRPCルーター
│   │   ├── health.router.ts
│   │   ├── auth.router.ts
│   │   ├── progress.router.ts
│   │   └── srs.router.ts
│   ├── services/              # ビジネスロジック
│   │   ├── user.service.ts
│   │   ├── progress.service.ts
│   │   └── srs.service.ts
│   ├── utils/                 # ユーティリティ
│   │   ├── jwt.util.ts
│   │   └── srs-algorithm.util.ts
│   ├── types/                 # 型定義
│   │   └── index.ts
│   ├── trpc.ts               # tRPC設定
│   ├── router.ts             # メインルーター
│   └── server.ts             # Fastifyサーバー
├── test-auth.sh              # 認証テスト
├── test-progress.sh          # 進捗テスト
├── test-srs.sh               # SRSテスト
├── .env                      # 環境変数
└── package.json
```

---

## 🔗 フロントエンド統合

詳細は [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) を参照

### クイックスタート

```typescript
// src/api/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../backend/src/router'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      headers() {
        const token = localStorage.getItem('accessToken')
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
    })
  ]
})

// 使用例
const user = await trpc.auth.login.mutate({
  username: 'testuser',
  password: 'password123'
})
```

---

## 📊 データベーススキーマ

### User（ユーザー）
- 認証情報、プロフィール

### UserProgress（学習進捗）
- コンテンツごとの進捗状況

### GameSession（ゲームセッション）
- 各プレイセッションの詳細記録

### SRSCard（SRSカード）
- 間隔反復学習のカード情報

### Favorite（お気に入り）
- ユーザーのお気に入りコンテンツ

### DailyStats（日別統計）
- 日ごとの学習統計

---

## 🔍 トラブルシューティング

### Prismaクライアントエラー
```bash
pnpm prisma generate
```

### マイグレーションエラー
```bash
pnpm run db:reset
```

### CORS エラー
`.env` ファイルの `FRONTEND_URL` を確認

---

## 📝 ライセンス

MIT

---

## 👥 コントリビューション

プルリクエスト歓迎！

1. Fork
2. Feature ブランチ作成
3. Commit
4. Push
5. Pull Request 作成

---

## 📞 サポート

問題が発生した場合は Issue を作成してください。
