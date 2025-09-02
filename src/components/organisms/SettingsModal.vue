<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">{{ t('settings.title') }}</h2>
            <IconButton
              @click="emit('close')"
              class="close-button"
              :aria-label="t('common.close')"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div class="modal-body">
            <!-- テーマ設定 -->
            <div class="setting-group">
              <label class="setting-label">{{ t('settings.theme') }}</label>
              <div class="toggle-group">
                <button
                  class="toggle-option"
                  :class="{ active: theme === 'dark' }"
                  @click="updateTheme('dark')"
                >
                  {{ t('settings.darkMode') }}
                </button>
                <button
                  class="toggle-option"
                  :class="{ active: theme === 'light' }"
                  @click="updateTheme('light')"
                >
                  {{ t('settings.lightMode') }}
                </button>
              </div>
            </div>

            <!-- 言語設定 -->
            <div class="setting-group">
              <label class="setting-label">{{ t('settings.language') }}</label>
              <div class="toggle-group">
                <button
                  class="toggle-option"
                  :class="{ active: locale === 'ja' }"
                  @click="updateLanguage('ja')"
                >
                  日本語
                </button>
                <button
                  class="toggle-option"
                  :class="{ active: locale === 'en' }"
                  @click="updateLanguage('en')"
                >
                  English
                </button>
              </div>
            </div>

            <!-- サウンド設定 -->
            <div class="setting-group">
              <label class="setting-label">{{ t('settings.sound') }}</label>
              <div class="toggle-group">
                <button
                  class="toggle-option"
                  :class="{ active: soundEnabled }"
                  @click="updateSound(true)"
                >
                  {{ t('common.on') }}
                </button>
                <button
                  class="toggle-option"
                  :class="{ active: !soundEnabled }"
                  @click="updateSound(false)"
                >
                  {{ t('common.off') }}
                </button>
              </div>
            </div>

            <!-- キーボードガイド設定 -->
            <div class="setting-group">
              <label class="setting-label">{{ t('settings.keyboardGuide') }}</label>
              <div class="toggle-group">
                <button
                  class="toggle-option"
                  :class="{ active: keyboardGuideEnabled }"
                  @click="updateKeyboardGuide(true)"
                >
                  {{ t('common.on') }}
                </button>
                <button
                  class="toggle-option"
                  :class="{ active: !keyboardGuideEnabled }"
                  @click="updateKeyboardGuide(false)"
                >
                  {{ t('common.off') }}
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <PrimaryButton @click="emit('close')" variant="secondary">
              {{ t('common.close') }}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import CloseIcon from '@/components/atoms/CloseIcon.vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()
const settingsStore = useSettingsStore()

const theme = computed(() => settingsStore.theme)
const soundEnabled = computed(() => settingsStore.soundEnabled)
const keyboardGuideEnabled = computed(() => settingsStore.keyboardGuideEnabled)

const updateTheme = (value: 'light' | 'dark') => {
  settingsStore.setTheme(value)
}

const updateLanguage = (value: 'ja' | 'en') => {
  settingsStore.setLanguage(value)
  locale.value = value
}

const updateSound = (value: boolean) => {
  settingsStore.setSoundEnabled(value)
}

const updateKeyboardGuide = (value: boolean) => {
  settingsStore.setKeyboardGuideEnabled(value)
}

const handleBackdropClick = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-container {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-button {
  color: var(--text-secondary);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--text-primary);
  }
}

.modal-body {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.setting-label {
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--text-primary);
}

.toggle-group {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.toggle-option {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 500;

  &:hover:not(.active) {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  &.active {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
    color: white;
    box-shadow: var(--shadow-sm);
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
}

// モーダルアニメーション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .modal-backdrop {
    padding: var(--spacing-md);
  }

  .modal-container {
    max-height: 100%;
    border-radius: var(--radius-lg);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--spacing-lg);
  }
}
</style>