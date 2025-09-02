import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// ルートコンポーネント
const Landing = () => import('../pages/Landing.vue')
const Home = () => import('../pages/Home.vue')

// 基本タイピング練習
const BasicTyping = () => import('../pages/BasicTyping.vue')

// 英語学習（単語・フレーズ）
const WordLevel = () => import('../pages/WordLevel.vue')
const PhraseCategory = () => import('../pages/PhraseCategory.vue')
const WordStages = () => import('../pages/WordStages.vue')
const PhraseStages = () => import('../pages/PhraseStages.vue')
const Game = () => import('../pages/Game.vue')
const Clear = () => import('../pages/Clear.vue')

// ユーザー認証
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')

const routes: RouteRecordRaw[] = [
  // ランディングページ
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: {
      title: 'English Typing Game',
      hideHeader: true
    }
  },

  // ホーム画面
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: 'ホーム'
    }
  },

  // 基本タイピング練習フロー
  {
    path: '/basic-typing',
    name: 'BasicTyping',
    component: BasicTyping,
    meta: {
      title: '基本タイピング練習'
    }
  },

  // 英語学習フロー（英単語・英語フレーズ） - Unitページは削除（ホーム画面に統合）

  // 英単語学習（3レベル）
  {
    path: '/words/level',
    name: 'WordLevel',
    component: WordLevel,
    meta: {
      title: '英単語レベル選択'
    }
  },
  {
    path: '/words/:level',
    name: 'WordStages',
    component: WordStages,
    meta: {
      title: '英単語ステージ選択'
    },
    props: (route) => ({
      level: Number(route.params['level'])
    })
  },
  {
    path: '/words/game/:level/:stage',
    name: 'WordGame',
    component: Game,
    meta: {
      title: '英単語練習',
      unitType: 'words'
    },
    props: (route) => ({
      level: Number(route.params['level']),
      stage: Number(route.params['stage']),
      unitType: 'words'
    })
  },
  {
    path: '/words/clear/:level/:stage',
    name: 'WordClear',
    component: Clear,
    meta: {
      title: '英単語クリア',
      unitType: 'words'
    },
    props: (route) => ({
      level: Number(route.params['level']),
      stage: Number(route.params['stage']),
      unitType: 'words'
    })
  },

  // 基本タイピング用ゲーム画面
  {
    path: '/game/basic/:stage',
    name: 'BasicTypingGame',
    component: Game,
    meta: {
      title: '基本タイピング練習',
      unitType: 'basic'
    },
    props: (route) => ({
      stage: Number(route.params['stage']),
      unitType: 'basic'
    })
  },
  {
    path: '/clear/basic/:stage',
    name: 'BasicTypingClear',
    component: Clear,
    meta: {
      title: '基本タイピングクリア',
      unitType: 'basic'
    },
    props: (route) => ({
      stage: Number(route.params['stage']),
      unitType: 'basic'
    })
  },

  // 英語フレーズ学習（6カテゴリー）
  {
    path: '/phrases/category',
    name: 'PhraseCategory',
    component: PhraseCategory,
    meta: {
      title: '英語フレーズカテゴリー選択'
    }
  },
  {
    path: '/phrases/:category',
    name: 'PhraseStages',
    component: PhraseStages,
    meta: {
      title: '英語フレーズステージ選択'
    },
    props: (route) => ({
      category: String(route.params['category'])
    })
  },
  {
    path: '/phrases/game/:category/:stage',
    name: 'PhraseGame',
    component: Game,
    meta: {
      title: '英語フレーズ練習',
      unitType: 'phrases'
    },
    props: (route) => ({
      category: String(route.params['category']),
      stage: Number(route.params['stage']),
      unitType: 'phrases'
    })
  },
  {
    path: '/phrases/clear/:category/:stage',
    name: 'PhraseClear',
    component: Clear,
    meta: {
      title: '英語フレーズクリア',
      unitType: 'phrases'
    },
    props: (route) => ({
      category: String(route.params['category']),
      stage: Number(route.params['stage']),
      unitType: 'phrases'
    })
  },

  // 認証
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'ログイン',
      hideHeader: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'アカウント作成',
      hideHeader: true
    }
  },

  // 404リダイレクト
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 常にページ上部にスクロール
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  // ページタイトル設定
  const title = to.meta?.title as string
  if (title) {
    document.title = `${title} | English Typing Game`
  } else {
    document.title = 'English Typing Game'
  }
  
  // TODO: 認証が必要なページのチェック
  // const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  next()
})

export default router
export type { RouteRecordRaw }