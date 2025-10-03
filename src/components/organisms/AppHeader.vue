<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo & Brand -->
        <div class="header-brand">
          <router-link to="/home" class="brand-link">
            <AppLogo class="brand-logo" />
            <span class="brand-text">{{ t('app.title') }}</span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="header-nav">
          <!-- Back Button -->
          <BackButton v-if="showBackButton" />
        </nav>

        <!-- Actions -->
        <div class="header-actions">
          <!-- User Info -->
          <div v-if="isAuthenticated" class="user-info">
            <span class="username">{{ user?.displayName || user?.username }}</span>
            <ProgressBar 
              :value="userStore.overallProgress"
              size="sm"
              :showLabel="false"
            />
          </div>

          <!-- Settings Button -->
          <IconButton
            @click="settingsStore.toggleSettings"
            :aria-label="t('navigation.settings')"
            variant="ghost"
            size="md"
            class="settings-button"
          >
            <SettingsIcon />
          </IconButton>

          <!-- Login/Logout Button -->
          <template v-if="!isAuthenticated">
            <PrimaryButton
              @click="goToLogin"
              size="sm"
            >
              {{ t('navigation.login') }}
            </PrimaryButton>
          </template>
          <template v-else>
            <IconButton
              @click="logout"
              :aria-label="t('navigation.logout')"
              variant="ghost"
              size="md"
            >
              <LogoutIcon />
            </IconButton>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'

// Components
import AppLogo from '@/components/atoms/AppLogo.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import SettingsIcon from '@/components/atoms/SettingsIcon.vue'
import LogoutIcon from '@/components/atoms/LogoutIcon.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { isAuthenticated, user, logout: authLogout } = useAuth()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

// Computed
const showBackButton = computed(() => {
  const routesWithBackButton = [
    '/basic-typing',
    '/unit',
    '/words',
    '/phrases',
    '/basic-typing/lesson',
    '/basic-typing/game',
    '/game/basic',  // 基本タイピング練習のゲーム画面
    '/words/level',
    '/words/game',
    '/phrases/category',
    '/phrases/game'
  ]
  
  return routesWithBackButton.some(path => 
    route.path.startsWith(path) && route.path !== '/home'
  )
})

// Methods

const goToLogin = (): void => {
  router.push('/login')
}

const logout = (): void => {
  authLogout()
}
</script>

<style lang="scss" scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--bg-primary);
    opacity: 0.9;
    z-index: -1;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  min-height: 64px;
}

// Brand
.header-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--text-primary);
  transition: opacity var(--transition-fast);
  
  &:hover {
    opacity: 0.8;
  }
}

.brand-logo {
  width: 32px;
  height: 32px;
}

.brand-text {
  font-size: var(--text-lg);
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    display: none;
  }
}

// Navigation
.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  justify-content: center;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    margin-left: var(--space-md);
  }
}

// Actions
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  @media (max-width: 768px) {
    display: none;
  }
}

.username {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.settings-button {
  position: relative;
  
  &:hover {
    color: var(--accent-blue);
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .header-content {
    padding: var(--space-sm) 0;
    min-height: 56px;
  }
  
  .header-actions {
    gap: var(--space-sm);
  }
}
</style>