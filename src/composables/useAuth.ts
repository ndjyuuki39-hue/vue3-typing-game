import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { trpc } from '@/api/trpc'
import { useUserStore } from '@/stores/user'

const user = ref<any>(null)
const loading = ref(false)

export const useAuth = () => {
  const router = useRouter()
  const userStore = useUserStore()

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
      // Update userStore and load progress (will be empty for new users)
      userStore.setUser(result.user)
      await userStore.loadProgress()

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
      // Update userStore and load user's progress
      userStore.setUser(result.user)
      await userStore.loadProgress()

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
    localStorage.removeItem('vue3-typing-game-progress')
    localStorage.removeItem('vue3-typing-game-user')
    user.value = null
    // Reset userStore progress to initial state
    userStore.clearProgress()
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
      // Update userStore and load user's progress
      userStore.setUser(userData)
      await userStore.loadProgress()
      console.log('✅ User authenticated:', userData)
    } catch (error) {
      console.log('⚠️ Auth failed, trying refresh token...')
      // トークンリフレッシュを試みる
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const result = await trpc.auth.refresh.mutate({ refreshToken })
          localStorage.setItem('accessToken', result.accessToken)
          const userData = await trpc.auth.me.query()
          user.value = userData
          // Update userStore and load user's progress
          userStore.setUser(userData)
          await userStore.loadProgress()
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
