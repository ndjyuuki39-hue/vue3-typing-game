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