# 🔗 フロントエンド統合ガイド

## 1. tRPCクライアントのセットアップ

### 依存関係インストール

```bash
cd /root/ワークスペース/vue3-typing-game
pnpm add @trpc/client @trpc/server
```

### API型定義のエクスポート

バックエンドの型をフロントエンドで使用できるようにします。

**backend/src/router.ts** (既に完了)
```typescript
export type AppRouter = typeof appRouter
```

### tRPCクライアント作成

**src/api/trpc.ts** (新規作成)
```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../backend/src/router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/trpc'

// アクセストークン取得関数
function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_URL,
      headers() {
        const token = getAccessToken()
        return token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}
      }
    })
  ]
})
```

---

## 2. 環境変数設定

**.env.development**
```bash
VITE_API_URL=http://localhost:3001/trpc
```

**.env.production**
```bash
VITE_API_URL=https://your-backend.railway.app/trpc
```

---

## 3. API使用例

### 認証

```typescript
// ユーザー登録
const registerUser = async (username: string, email: string, password: string) => {
  const result = await trpc.auth.register.mutate({
    username,
    email,
    password
  })

  localStorage.setItem('accessToken', result.accessToken)
  localStorage.setItem('refreshToken', result.refreshToken)
  return result.user
}

// ログイン
const login = async (username: string, password: string) => {
  const result = await trpc.auth.login.mutate({
    username,
    password
  })

  localStorage.setItem('accessToken', result.accessToken)
  localStorage.setItem('refreshToken', result.refreshToken)
  return result.user
}

// 現在のユーザー取得
const getCurrentUser = async () => {
  return await trpc.auth.me.query()
}

// トークンリフレッシュ
const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken')
  if (!refresh) throw new Error('No refresh token')

  const result = await trpc.auth.refresh.mutate({ refreshToken: refresh })
  localStorage.setItem('accessToken', result.accessToken)
  return result
}
```

### 進捗管理

```typescript
// ゲームセッション記録
const recordSession = async (sessionData: {
  contentType: string
  contentId: string
  wpm: number
  accuracy: number
  durationSeconds: number
  errorCount: number
  completed: boolean
}) => {
  return await trpc.progress.createSession.mutate(sessionData)
}

// 全進捗取得
const getAllProgress = async () => {
  return await trpc.progress.getAll.query()
}

// 統計取得
const getStats = async () => {
  return await trpc.progress.getStats.query()
}

// コンテンツ別進捗取得
const getProgressByContent = async (contentType: string, contentId: string) => {
  return await trpc.progress.getByContent.query({ contentType, contentId })
}
```

### SRSシステム

```typescript
// 学習セット生成
const generateStudySet = async (targetCount = 20, reviewRatio = 0.7) => {
  return await trpc.srs.generateStudySet.query({
    targetCount,
    reviewRatio
  })
}

// 復習記録
const recordReview = async (reviewData: {
  cardId: string
  quality: 1 | 2 | 3 | 4 | 5
  responseTime: number
  accuracy: number
  wpm: number
}) => {
  return await trpc.srs.recordReview.mutate(reviewData)
}

// SRS統計取得
const getSRSStats = async () => {
  return await trpc.srs.getStats.query()
}

// 復習期限カード取得
const getDueCards = async (limit = 10) => {
  return await trpc.srs.getDueCards.query({ limit })
}
```

---

## 4. Composableの作成

### useAuth.ts

```typescript
import { ref } from 'vue'
import { trpc } from '@/api/trpc'

export function useAuth() {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  const register = async (username: string, email: string, password: string) => {
    loading.value = true
    try {
      const result = await trpc.auth.register.mutate({
        username,
        email,
        password
      })

      localStorage.setItem('accessToken', result.accessToken)
      localStorage.setItem('refreshToken', result.refreshToken)
      user.value = result.user
      isAuthenticated.value = true

      return result
    } finally {
      loading.value = false
    }
  }

  const login = async (username: string, password: string) => {
    loading.value = true
    try {
      const result = await trpc.auth.login.mutate({
        username,
        password
      })

      localStorage.setItem('accessToken', result.accessToken)
      localStorage.setItem('refreshToken', result.refreshToken)
      user.value = result.user
      isAuthenticated.value = true

      return result
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    user.value = null
    isAuthenticated.value = false
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      isAuthenticated.value = false
      return
    }

    try {
      user.value = await trpc.auth.me.query()
      isAuthenticated.value = true
    } catch (error) {
      // トークンが無効な場合はリフレッシュを試みる
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const result = await trpc.auth.refresh.mutate({ refreshToken })
          localStorage.setItem('accessToken', result.accessToken)
          user.value = await trpc.auth.me.query()
          isAuthenticated.value = true
        }
      } catch {
        logout()
      }
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    checkAuth
  }
}
```

### useProgress.ts

```typescript
import { ref } from 'vue'
import { trpc } from '@/api/trpc'

export function useProgress() {
  const progress = ref([])
  const stats = ref(null)
  const loading = ref(false)

  const recordSession = async (sessionData: {
    contentType: string
    contentId: string
    wpm: number
    accuracy: number
    durationSeconds: number
    errorCount: number
    completed: boolean
  }) => {
    loading.value = true
    try {
      return await trpc.progress.createSession.mutate(sessionData)
    } finally {
      loading.value = false
    }
  }

  const fetchAllProgress = async () => {
    loading.value = true
    try {
      progress.value = await trpc.progress.getAll.query()
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    loading.value = true
    try {
      stats.value = await trpc.progress.getStats.query()
    } finally {
      loading.value = false
    }
  }

  return {
    progress,
    stats,
    loading,
    recordSession,
    fetchAllProgress,
    fetchStats
  }
}
```

### useSRS.ts

```typescript
import { ref } from 'vue'
import { trpc } from '@/api/trpc'

export function useSRS() {
  const studySet = ref(null)
  const stats = ref(null)
  const loading = ref(false)

  const generateStudySet = async (targetCount = 20, reviewRatio = 0.7) => {
    loading.value = true
    try {
      studySet.value = await trpc.srs.generateStudySet.query({
        targetCount,
        reviewRatio
      })
      return studySet.value
    } finally {
      loading.value = false
    }
  }

  const recordReview = async (reviewData: {
    cardId: string
    quality: 1 | 2 | 3 | 4 | 5
    responseTime: number
    accuracy: number
    wpm: number
  }) => {
    loading.value = true
    try {
      return await trpc.srs.recordReview.mutate(reviewData)
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    loading.value = true
    try {
      stats.value = await trpc.srs.getStats.query()
    } finally {
      loading.value = false
    }
  }

  return {
    studySet,
    stats,
    loading,
    generateStudySet,
    recordReview,
    fetchStats
  }
}
```

---

## 5. LocalStorageからの移行

### 移行ステップ

1. **既存データのエクスポート**
   ```typescript
   // ローカルストレージのデータを取得
   const oldProgress = JSON.parse(localStorage.getItem('userProgress') || '{}')
   const oldSRS = JSON.parse(localStorage.getItem('srsCards') || '{}')
   ```

2. **バックエンドにインポート**
   ```typescript
   // 各進捗をAPIに送信
   for (const [contentId, progressData] of Object.entries(oldProgress)) {
     await trpc.progress.createSession.mutate({
       contentType: 'word',
       contentId,
       wpm: progressData.bestWpm,
       accuracy: progressData.bestAccuracy,
       durationSeconds: 0,
       errorCount: 0,
       completed: progressData.completed
     })
   }
   ```

3. **LocalStorage削除**
   ```typescript
   localStorage.removeItem('userProgress')
   localStorage.removeItem('srsCards')
   ```

---

## 6. エラーハンドリング

```typescript
import { TRPCClientError } from '@trpc/client'

try {
  await trpc.auth.login.mutate({ username, password })
} catch (error) {
  if (error instanceof TRPCClientError) {
    // tRPCエラー
    console.error('API Error:', error.message)

    if (error.data?.code === 'UNAUTHORIZED') {
      // 認証エラー
      logout()
    }
  } else {
    // その他のエラー
    console.error('Unexpected error:', error)
  }
}
```

---

## 7. APIエンドポイント一覧

### 認証 (auth)
- `auth.register` - ユーザー登録
- `auth.login` - ログイン
- `auth.refresh` - トークンリフレッシュ
- `auth.me` - 現在のユーザー取得
- `auth.updateProfile` - プロフィール更新

### 進捗 (progress)
- `progress.createSession` - セッション記録
- `progress.getAll` - 全進捗取得
- `progress.getByContent` - コンテンツ別進捗取得
- `progress.getStats` - 統計取得
- `progress.getRecent` - 最近のセッション取得
- `progress.getBestScores` - ベストスコア取得
- `progress.getDaily` - 日別統計取得
- `progress.reset` - 進捗リセット

### SRS (srs)
- `srs.getAllCards` - 全カード取得
- `srs.getOrCreateCard` - カード取得/作成
- `srs.getDueCards` - 復習期限カード取得
- `srs.getNewCards` - 新規カード取得
- `srs.generateStudySet` - 学習セット生成
- `srs.recordReview` - 復習記録
- `srs.calculateQuality` - 品質スコア計算
- `srs.getStats` - SRS統計取得
- `srs.resetCard` - カードリセット
- `srs.deleteCard` - カード削除

---

## 8. 型安全性

tRPCの最大の利点は完全な型安全性です：

```typescript
// ✅ 型チェックされる
await trpc.progress.createSession.mutate({
  contentType: 'word',
  contentId: 'cat',
  wpm: 50,
  accuracy: 0.95,
  durationSeconds: 30,
  errorCount: 2,
  completed: true
})

// ❌ コンパイルエラー
await trpc.progress.createSession.mutate({
  contentType: 'word',
  // contentId が欠けている！
  wpm: '50', // 型が間違っている！
  accuracy: 95 // 0-1の範囲外！
})
```

バックエンドのスキーマ変更が即座にフロントエンドに反映されます！
