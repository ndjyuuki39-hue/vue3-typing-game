import { useI18n as useVueI18n } from 'vue-i18n'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

export interface I18nComposable {
  t: (key: string, values?: Record<string, unknown>) => string
  locale: ComputedRef<string>
  availableLocales: ComputedRef<string[]>
  setLocale: (locale: string) => void
}

export const useI18n = (): I18nComposable => {
  const { t, locale, availableLocales } = useVueI18n()

  const currentLocale = computed(() => locale.value)
  const locales = computed(() => availableLocales)

  const setLocale = (newLocale: string): void => {
    if (availableLocales.includes(newLocale)) {
      locale.value = newLocale
    } else {
      console.warn(`Locale '${newLocale}' is not available. Available locales:`, availableLocales)
    }
  }

  return {
    t,
    locale: currentLocale,
    availableLocales: locales,
    setLocale
  }
}

// Utility function for type-safe translation keys
export const createTranslationKey = (namespace: string, key: string): string => {
  return `${namespace}.${key}`
}

// Common translation helpers
export const useTranslations = () => {
  const { t } = useI18n()

  return {
    // Navigation translations
    nav: {
      home: () => t('navigation.home'),
      back: () => t('navigation.back'),
      settings: () => t('navigation.settings'),
      login: () => t('navigation.login'),
      logout: () => t('navigation.logout')
    },

    // Common translations
    common: {
      loading: () => t('common.loading'),
      error: () => t('common.error'),
      retry: () => t('common.retry'),
      cancel: () => t('common.cancel'),
      confirm: () => t('common.confirm'),
      save: () => t('common.save'),
      edit: () => t('common.edit'),
      delete: () => t('common.delete'),
      close: () => t('common.close')
    },

    // Game translations
    game: {
      ready: () => t('game.ready'),
      start: () => t('game.start'),
      pause: () => t('game.pause'),
      resume: () => t('game.resume'),
      restart: () => t('game.restart'),
      quit: () => t('game.quit'),
      completed: () => t('game.completed'),
      time: () => t('game.stats.time'),
      wpm: () => t('game.stats.wpm'),
      accuracy: () => t('game.stats.accuracy'),
      progress: () => t('game.stats.progress')
    }
  }
}