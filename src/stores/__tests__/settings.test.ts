import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../settings'

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear localStorage mock
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const store = useSettingsStore()
    
    expect(store.theme).toBe('dark')
    expect(store.language).toBe('ja')
    expect(store.isSettingsOpen).toBe(false)
    expect(store.soundEnabled).toBe(true)
    expect(store.keyboardSoundEnabled).toBe(true)
    expect(store.vibrationEnabled).toBe(false)
  })

  it('should compute isDarkMode correctly', () => {
    const store = useSettingsStore()
    
    expect(store.isDarkMode).toBe(true)
    
    store.setTheme('light')
    expect(store.isDarkMode).toBe(false)
  })

  it('should compute isJapanese correctly', () => {
    const store = useSettingsStore()
    
    expect(store.isJapanese).toBe(true)
    
    store.setLanguage('en')
    expect(store.isJapanese).toBe(false)
  })

  it('should toggle theme correctly', () => {
    const store = useSettingsStore()
    
    expect(store.theme).toBe('dark')
    store.toggleTheme()
    expect(store.theme).toBe('light')
    store.toggleTheme()
    expect(store.theme).toBe('dark')
  })

  it('should set theme correctly', () => {
    const store = useSettingsStore()
    
    store.setTheme('light')
    expect(store.theme).toBe('light')
    
    store.setTheme('dark')
    expect(store.theme).toBe('dark')
  })

  it('should toggle language correctly', () => {
    const store = useSettingsStore()
    
    expect(store.language).toBe('ja')
    store.toggleLanguage()
    expect(store.language).toBe('en')
    store.toggleLanguage()
    expect(store.language).toBe('ja')
  })

  it('should set language correctly', () => {
    const store = useSettingsStore()
    
    store.setLanguage('en')
    expect(store.language).toBe('en')
    
    store.setLanguage('ja')
    expect(store.language).toBe('ja')
  })

  it('should toggle settings modal', () => {
    const store = useSettingsStore()
    
    expect(store.isSettingsOpen).toBe(false)
    store.toggleSettings()
    expect(store.isSettingsOpen).toBe(true)
    store.toggleSettings()
    expect(store.isSettingsOpen).toBe(false)
  })

  it('should open and close settings modal', () => {
    const store = useSettingsStore()
    
    store.openSettings()
    expect(store.isSettingsOpen).toBe(true)
    
    store.closeSettings()
    expect(store.isSettingsOpen).toBe(false)
  })

  it('should toggle sound settings', () => {
    const store = useSettingsStore()
    
    expect(store.soundEnabled).toBe(true)
    store.toggleSound()
    expect(store.soundEnabled).toBe(false)
    store.toggleSound()
    expect(store.soundEnabled).toBe(true)
  })

  it('should reset settings to defaults', () => {
    const store = useSettingsStore()
    
    // Change settings
    store.setTheme('light')
    store.setLanguage('en')
    store.toggleSound()
    
    // Reset
    store.resetSettings()
    
    expect(store.theme).toBe('dark')
    expect(store.language).toBe('ja')
    expect(store.soundEnabled).toBe(true)
  })

  it('should save settings to localStorage', () => {
    const store = useSettingsStore()
    
    store.setTheme('light')
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'english-typing-game-settings',
      JSON.stringify({
        theme: 'light',
        language: 'ja',
        soundEnabled: true,
        keyboardSoundEnabled: true,
        vibrationEnabled: false
      })
    )
  })

  it('should load settings from localStorage', () => {
    const mockSettings = {
      theme: 'light',
      language: 'en',
      soundEnabled: false,
      keyboardSoundEnabled: false,
      vibrationEnabled: true
    }
    
    // Mock localStorage.getItem
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSettings))
    
    const store = useSettingsStore()
    store.loadSettings()
    
    expect(store.theme).toBe('light')
    expect(store.language).toBe('en')
    expect(store.soundEnabled).toBe(false)
    expect(store.keyboardSoundEnabled).toBe(false)
    expect(store.vibrationEnabled).toBe(true)
  })

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('LocalStorage error')
    })
    
    const store = useSettingsStore()
    
    // Should not throw and use defaults
    expect(() => store.loadSettings()).not.toThrow()
    expect(store.theme).toBe('dark')
    expect(store.language).toBe('ja')
  })
})