import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { trpc } from '@/api/trpc'

const user = ref<any>(null)
const loading = ref(false)

export const useAuth = () => {
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)

  // ユーザー登録
  const register = async (username: string, email: string, password: string) => {
    loading.value = true
    try {
      const result = await trpc.auth.register.mutate({
        username,
        email,
        password
      })

      // Clear previous user's data from localStorage
      localStorage.removeItem('vue3-typing-game-progress')
      localStorage.removeItem('vue3-typing-game-user')

      // トークン保存
      localStorage.setItem('accessToken', result.accessToken)
      localStorage.setItem('refreshToken', result.refreshToken)

      user.value = result.user

      return result
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ログイン
  const login = async (username: string, password: string) => {
    loading.value = true
    try {
      const result = await trpc.auth.login.mutate({
        username,
        password
      })

      // トークン保存
      localStorage.setItem('accessToken', result.accessToken)
      localStorage.setItem('refreshToken', result.refreshToken)

      user.value = result.user

      return result
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ログアウト
  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    user.value = null
    router.push('/login')
  }

  // 認証チェック
  const checkAuth = async () => {
    console.log('🔐 checkAuth called')
    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.log('❌ No access token found')
      user.value = null
      return
    }

    try {
      console.log('✅ Access token found, fetching user...')
      const userData = await trpc.auth.me.query()
      user.value = userData
      console.log('✅ User authenticated:', userData)
    } catch (error) {
      console.log('⚠️ Auth failed, trying refresh token...')
      // トークンリフレッシュを試みる
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const result = await trpc.auth.refresh.mutate({ refreshToken })
          localStorage.setItem('accessToken', result.accessToken)
          user.value = await trpc.auth.me.query()
          console.log('✅ Token refreshed, user authenticated')
        } else {
          console.log('❌ No refresh token, logging out')
          logout()
        }
      } catch {
        console.log('❌ Refresh failed, logging out')
        logout()
      }
    }
  }

  // プロフィール更新
  const updateProfile = async (displayName?: string, avatarUrl?: string) => {
    loading.value = true
    try {
      const result = await trpc.auth.updateProfile.mutate({
        displayName,
        avatarUrl
      })

      user.value = result

      return result
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    checkAuth,
    updateProfile
  }
}
