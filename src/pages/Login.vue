<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <div class="form-header">
          <AppLogo class="form-logo" />
          <h1 class="form-title">{{ t('auth.login') }}</h1>
          <p class="form-subtitle">{{ t('auth.loginSubtitle') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="form-label">{{ t('auth.email') }}</label>
            <input
              v-model="email"
              type="email"
              class="form-input"
              :placeholder="t('auth.emailPlaceholder')"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('auth.password') }}</label>
            <input
              v-model="password"
              type="password"
              class="form-input"
              :placeholder="t('auth.passwordPlaceholder')"
              required
            />
          </div>

          <PrimaryButton
            type="submit"
            :loading="isLoading"
            :disabled="!canSubmit"
            variant="primary"
            size="lg"
            class="submit-button"
          >
            {{ t('auth.loginButton') }}
          </PrimaryButton>
        </form>

        <div class="form-footer">
          <p class="footer-text">
            {{ t('auth.noAccount') }}
            <router-link to="/register" class="footer-link">
              {{ t('auth.signUp') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AppLogo from '@/components/atoms/AppLogo.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'

const { t } = useI18n()
const router = useRouter()
const { login, loading: isLoading } = useAuth()

const email = ref('')
const password = ref('')

const canSubmit = computed(() => {
  return email.value.length > 0 && password.value.length >= 6
})

const handleLogin = async () => {
  if (!canSubmit.value) return

  try {
    // emailをusernameとして使用（バックエンドがusernameを要求するため）
    await login(email.value, password.value)

    router.push('/home')
  } catch (error) {
    console.error('Login failed:', error)
    // TODO: エラーメッセージ表示
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.login-container {
  max-width: 450px;
  width: 100%;
}

.login-form {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.form-logo {
  margin-bottom: var(--spacing-xl);
}

.form-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.form-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
}

.auth-form {
  margin-bottom: var(--spacing-2xl);
}

.form-group {
  margin-bottom: var(--spacing-xl);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.form-input {
  width: 100%;
  padding: var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: var(--text-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--accent-blue);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
}

.submit-button {
  width: 100%;
  margin-top: var(--spacing-lg);
}

.form-footer {
  text-align: center;
}

.footer-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.footer-link {
  color: var(--accent-blue);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-purple);
  }
}
</style>