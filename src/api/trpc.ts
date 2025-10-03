import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../backend/src/router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/trpc'

// アクセストークン取得関数
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

// tRPCクライアント作成
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
