<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <div class="form-header">
          <AppLogo class="form-logo" />
          <h1 class="form-title">{{ t('auth.register') }}</h1>
          <p class="form-subtitle">{{ t('auth.registerSubtitle') }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label class="form-label">{{ t('auth.name') }}</label>
            <input
              v-model="name"
              type="text"
              class="form-input"
              :placeholder="t('auth.namePlaceholder')"
              required
            />
          </div>

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
            <div class="password-strength">
              <div class="strength-bar" :class="passwordStrengthClass"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('auth.confirmPassword') }}</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-input"
              :placeholder="t('auth.confirmPasswordPlaceholder')"
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
            {{ t('auth.registerButton') }}
          </PrimaryButton>
        </form>

        <div class="form-footer">
          <p class="footer-text">
            {{ t('auth.hasAccount') }}
            <router-link to="/login" class="footer-link">
              {{ t('auth.signIn') }}
            </router-link>
          </p>
          <router-link to="/" class="back-to-home">
            ← ホームに戻る
          </router-link>
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
const { register, loading: isLoading } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const passwordStrength = computed(() => {
  const pwd = password.value
  if (pwd.length === 0) return 0
  if (pwd.length < 6) return 1
  if (pwd.length < 8) return 2
  if (pwd.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) return 4
  return 3
})

const passwordStrengthClass = computed(() => {
  switch (passwordStrength.value) {
    case 0: return ''
    case 1: return 'strength-weak'
    case 2: return 'strength-fair'
    case 3: return 'strength-good'
    case 4: return 'strength-strong'
    default: return ''
  }
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0: return ''
    case 1: return t('auth.passwordWeak')
    case 2: return t('auth.passwordFair')
    case 3: return t('auth.passwordGood')
    case 4: return t('auth.passwordStrong')
    default: return ''
  }
})

const canSubmit = computed(() => {
  return name.value.length > 0 &&
         email.value.length > 0 &&
         password.value.length >= 6 &&
         password.value === confirmPassword.value
})

const handleRegister = async () => {
  if (!canSubmit.value) return

  try {
    // nameをusernameとして、emailも一緒に送信
    await register(name.value, email.value, password.value)

    router.push('/home')
  } catch (error) {
    console.error('Registration failed:', error)
    // TODO: エラーメッセージ表示
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.register-container {
  max-width: 450px;
  width: 100%;
}

.register-form {
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

.password-strength {
  margin-top: var(--spacing-sm);
}

.strength-bar {
  height: 4px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
  transition: all var(--transition-fast);
  background: var(--bg-tertiary);

  &.strength-weak {
    width: 25%;
    background: var(--accent-red);
  }

  &.strength-fair {
    width: 50%;
    background: var(--accent-orange);
  }

  &.strength-good {
    width: 75%;
    background: var(--accent-blue);
  }

  &.strength-strong {
    width: 100%;
    background: var(--accent-green);
  }
}

.strength-text {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.submit-button {
  width: 100%;
  margin-top: var(--spacing-lg);
}

.form-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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

.back-to-home {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-blue);
  }
}
</style>