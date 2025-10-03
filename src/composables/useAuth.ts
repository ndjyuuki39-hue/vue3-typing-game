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
    const token = localStorage.getItem('accessToken')
    if (!token) {
      user.value = null
      return
    }

    try {
      user.value = await trpc.auth.me.query()
    } catch (error) {
      // トークンリフレッシュを試みる
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const result = await trpc.auth.refresh.mutate({ refreshToken })
          localStorage.setItem('accessToken', result.accessToken)
          user.value = await trpc.auth.me.query()
        } else {
          logout()
        }
      } catch {
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
