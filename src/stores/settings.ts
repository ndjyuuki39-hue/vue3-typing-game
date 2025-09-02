import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'dark' | 'light'
export type Language = 'ja' | 'en'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const theme = ref<Theme>('dark')
  const language = ref<Language>('ja')
  const isSettingsOpen = ref<boolean>(false)
  const soundEnabled = ref<boolean>(true)
  const keyboardSoundEnabled = ref<boolean>(true)
  const vibrationEnabled = ref<boolean>(false)

  // Computed
  const isDarkMode = computed(() => theme.value === 'dark')
  const isJapanese = computed(() => language.value === 'ja')

  // Actions
  const toggleTheme = (): void => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
    saveSettings()
  }

  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme
    applyTheme()
    saveSettings()
  }

  const toggleLanguage = (): void => {
    language.value = language.value === 'ja' ? 'en' : 'ja'
    saveSettings()
  }

  const setLanguage = (newLanguage: Language): void => {
    language.value = newLanguage
    saveSettings()
  }

  const toggleSettings = (): void => {
    isSettingsOpen.value = !isSettingsOpen.value
  }

  const openSettings = (): void => {
    isSettingsOpen.value = true
  }

  const closeSettings = (): void => {
    isSettingsOpen.value = false
  }

  const toggleSound = (): void => {
    soundEnabled.value = !soundEnabled.value
    saveSettings()
  }

  const toggleKeyboardSound = (): void => {
    keyboardSoundEnabled.value = !keyboardSoundEnabled.value
    saveSettings()
  }

  const toggleVibration = (): void => {
    vibrationEnabled.value = !vibrationEnabled.value
    saveSettings()
  }

  // Theme application
  const applyTheme = (): void => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-theme', theme.value)
  }

  // Persistence
  const STORAGE_KEY = 'english-typing-game-settings'

  const saveSettings = (): void => {
    const settings = {
      theme: theme.value,
      language: language.value,
      soundEnabled: soundEnabled.value,
      keyboardSoundEnabled: keyboardSoundEnabled.value,
      vibrationEnabled: vibrationEnabled.value
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error)
    }
  }

  const loadSettings = (): void => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const settings = JSON.parse(saved)
        
        // Apply loaded settings with fallbacks
        theme.value = settings.theme ?? 'dark'
        language.value = settings.language ?? 'ja'
        soundEnabled.value = settings.soundEnabled ?? true
        keyboardSoundEnabled.value = settings.keyboardSoundEnabled ?? true
        vibrationEnabled.value = settings.vibrationEnabled ?? false
        
        applyTheme()
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error)
      // Use defaults if loading fails
      applyTheme()
    }
  }

  const resetSettings = (): void => {
    theme.value = 'dark'
    language.value = 'ja'
    soundEnabled.value = true
    keyboardSoundEnabled.value = true
    vibrationEnabled.value = false
    
    applyTheme()
    saveSettings()
  }

  // Initialize settings on store creation
  loadSettings()

  return {
    // State
    theme,
    language,
    isSettingsOpen,
    soundEnabled,
    keyboardSoundEnabled,
    vibrationEnabled,
    
    // Computed
    isDarkMode,
    isJapanese,
    
    // Actions
    toggleTheme,
    setTheme,
    toggleLanguage,
    setLanguage,
    toggleSettings,
    openSettings,
    closeSettings,
    toggleSound,
    toggleKeyboardSound,
    toggleVibration,
    saveSettings,
    loadSettings,
    resetSettings
  }
})