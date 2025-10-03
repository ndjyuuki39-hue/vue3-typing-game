# 🚀 デプロイメントガイド

## Railway デプロイ

### 1. Railwayプロジェクト作成

```bash
# Railway CLI インストール
npm i -g @railway/cli

# ログイン
railway login

# プロジェクト初期化
railway init
```

### 2. PostgreSQL追加

Railway ダッシュボードで:
1. "New" → "Database" → "PostgreSQL"
2. 自動的に `DATABASE_URL` 環境変数が設定されます

### 3. 環境変数設定

Railway ダッシュボードで以下を設定:

```bash
# JWT Secrets (強力なランダム文字列に変更！)
JWT_SECRET="your-production-jwt-secret-min-32-chars"
JWT_REFRESH_SECRET="your-production-refresh-secret-min-32-chars"

# Frontend URL
FRONTEND_URL="https://your-app.vercel.app"

# Node環境
NODE_ENV="production"
```

### 4. デプロイ

```bash
# デプロイ実行
railway up

# ログ確認
railway logs
```

---

## Vercel デプロイ（Serverless Functions）

### 1. vercel.json 作成

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

### 2. 環境変数設定

```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
vercel env add FRONTEND_URL
```

### 3. デプロイ

```bash
# ビルド
pnpm run build

# デプロイ
vercel --prod
```

---

## 環境変数一覧

| 変数名 | 必須 | 説明 | 例 |
|--------|------|------|-----|
| `DATABASE_URL` | ✅ | PostgreSQL接続URL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ | JWTアクセストークン秘密鍵 | `min-32-random-chars` |
| `JWT_REFRESH_SECRET` | ✅ | JWTリフレッシュトークン秘密鍵 | `min-32-random-chars` |
| `FRONTEND_URL` | ✅ | フロントエンドURL（CORS用） | `https://app.vercel.app` |
| `PORT` | ❌ | サーバーポート（自動設定される） | `3001` |
| `NODE_ENV` | ❌ | 実行環境 | `production` |

---

## データベース移行

### 初回デプロイ時

```bash
# マイグレーション適用（本番環境で自動実行）
pnpm run start
# または手動で
pnpm prisma migrate deploy
```

### スキーマ変更時

```bash
# 開発環境でマイグレーション作成
pnpm prisma migrate dev --name add_new_field

# 本番環境にデプロイ（自動的にmigrate deployが実行されます）
```

---

## セキュリティチェックリスト

- [ ] `JWT_SECRET` を強力なランダム文字列に変更
- [ ] `JWT_REFRESH_SECRET` を強力なランダム文字列に変更
- [ ] PostgreSQL の強力なパスワード設定
- [ ] `FRONTEND_URL` を正しいドメインに設定
- [ ] HTTPS 強制（Railway/Vercelは自動）
- [ ] Rate limiting 追加（必要に応じて）

---

## トラブルシューティング

### マイグレーションエラー

```bash
# Prisma Client再生成
pnpm prisma generate

# マイグレーションリセット（開発環境のみ！）
pnpm run db:reset
```

### CORS エラー

- `FRONTEND_URL` が正しく設定されているか確認
- フロントエンドのURLがHTTPSであることを確認

### データベース接続エラー

- `DATABASE_URL` が正しいか確認
- PostgreSQLサービスが起動しているか確認
- ネットワークファイアウォール設定を確認

---

## パフォーマンス最適化

### 1. データベース接続プール

Prismaは自動的に接続プールを管理しますが、必要に応じて設定可能:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### 2. レスポンスキャッシュ

よく使うクエリにはキャッシュを追加:

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5 // 5分
})
```

### 3. インデックス最適化

schema.prismaで既に最適化済み:
- `@@index([userId])`
- `@@index([userId, nextReviewAt])`
- `@@unique([userId, contentId])`

---

## モニタリング

### Railway

```bash
# ログ確認
railway logs

# メトリクス
Railway ダッシュボード → Metrics
```

### Vercel

```bash
# ログ確認
vercel logs

# Analytics
Vercel ダッシュボード → Analytics
```
