import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import router from './router/index'

import App from './App.vue'

// Import global styles
import './styles/main.scss'

// Import locale messages
import ja from './locales/ja.json'
import en from './locales/en.json'

// Create Vue app
const app = createApp(App)

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'ja', // デフォルトは日本語
  fallbackLocale: 'en',
  messages: {
    ja,
    en
  }
})

// Install plugins
app.use(createPinia())
app.use(router)
app.use(i18n)

// Mount app
app.mount('#app')