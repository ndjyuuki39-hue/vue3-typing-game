<template>
  <div class="app" :data-theme="settingsStore.theme">
    <div class="app-container">
      <!-- グローバルヘッダー -->
      <AppHeader v-if="!isLandingPage" />
      
      <!-- メインコンテンツ -->
      <main class="app-main">
        <RouterView />
      </main>
      
      <!-- 設定モーダル -->
      <SettingsModal v-if="settingsStore.isSettingsOpen" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { RouterView } from 'vue-router'

  import AppHeader from '@/components/organisms/AppHeader.vue'
  import SettingsModal from '@/components/organisms/SettingsModal.vue'

  import { useSettingsStore } from '@/stores/settings'
  import { useAuth } from '@/composables/useAuth'
  import { LegacyRuntimeGuard } from '@/utils/legacy-runtime-guard'

  // Runtime legacy guard initialization
  LegacyRuntimeGuard.init()

  const route = useRoute()
  const settingsStore = useSettingsStore()
  const { checkAuth } = useAuth()

  const isLandingPage = computed(() => route.meta?.hideHeader === true)

  // Check authentication on app mount
  onMounted(() => {
    checkAuth()
  })
</script>

<style lang="scss">
  .app {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>