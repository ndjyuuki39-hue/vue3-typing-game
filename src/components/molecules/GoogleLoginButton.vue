<template>
  <button
    @click="handleGoogleLogin"
    :disabled="loading"
    class="google-login-button"
    type="button"
  >
    <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
    <span v-if="!loading">{{ buttonText }}</span>
    <span v-else>処理中...</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { trpc } from '@/api/trpc'
import { useUserStore } from '@/stores/user'

interface Props {
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Googleでログイン'
})

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface GoogleOAuthError {
  type: string
  message?: string
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: GoogleTokenResponse) => void
            error_callback: (error: GoogleOAuthError) => void
          }) => {
            requestAccessToken: () => void
          }
        }
      }
    }
  }
}

const handleGoogleLogin = () => {
  loading.value = true

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error('Google Client ID not configured')
    alert('Google認証の設定が完了していません')
    loading.value = false
    return
  }

  // Google Sign-In初期化
  window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'email profile',
    callback: async (response: GoogleTokenResponse) => {
      try {
        if (response.access_token) {
          // バックエンドにアクセストークンを送信
          const result = await trpc.auth.googleLogin.mutate({
            accessToken: response.access_token
          })

          // ユーザー情報とトークンを保存
          localStorage.setItem('accessToken', result.accessToken)
          localStorage.setItem('refreshToken', result.refreshToken)

          userStore.setUser(result.user)
          await userStore.loadProgress()

          // ホームへリダイレクト
          router.push('/')
        }
      } catch (error) {
        console.error('Google login failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Googleログインに失敗しました'
        alert(errorMessage)
      } finally {
        loading.value = false
      }
    },
    error_callback: (error: GoogleOAuthError) => {
      console.error('Google OAuth error:', error)
      loading.value = false
    }
  }).requestAccessToken()
}
</script>

<style scoped>
.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px 24px;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  cursor: pointer;
  transition: all 0.2s ease;
}

.google-login-button:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.google-login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
}
</style>
