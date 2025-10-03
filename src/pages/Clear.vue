<template>
  <div class="clear-page">
    <div class="clear-container">
      <div class="clear-content">
        <div class="celebration-animation">
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
        </div>
        
        <div class="clear-icon">
          <CheckIcon :size="100" />
        </div>
        
        <h1 class="clear-title">{{ t('clear.excellent') }}</h1>
        <p class="clear-subtitle">{{ getCompletionMessage() }}</p>
        
        <div class="achievement-stats">
          <div class="achievement-item">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
              <span class="achievement-label">{{ t('clear.finalScore') }}</span>
              <span class="achievement-value">{{ gameStore.lastScore }}</span>
            </div>
          </div>
          
          <div class="achievement-item">
            <div class="achievement-icon">🎯</div>
            <div class="achievement-text">
              <span class="achievement-label">{{ t('clear.accuracy') }}</span>
              <span class="achievement-value">{{ gameStore.lastAccuracy }}%</span>
            </div>
          </div>
          
          <div class="achievement-item">
            <div class="achievement-icon">⚡</div>
            <div class="achievement-text">
              <span class="achievement-label">{{ t('clear.wpm') }}</span>
              <span class="achievement-value">{{ gameStore.lastWPM }}</span>
            </div>
          </div>

          <div class="achievement-item">
            <div class="achievement-icon">⏱️</div>
            <div class="achievement-text">
              <span class="achievement-label">{{ t('clear.time') }}</span>
              <span class="achievement-value">{{ formatTime(gameStore.lastTime) }}s</span>
            </div>
          </div>
        </div>
        
        <div class="progress-summary" v-if="showProgressSummary">
          <h3 class="summary-title">{{ t('clear.overallProgress') }}</h3>
          <ProgressBar :value="overallProgress" :showLabel="true" variant="success" />
          <p class="summary-text">
            {{ t('clear.progressText', { progress: Math.round(overallProgress) }) }}
          </p>
        </div>
        
        <!-- MYフレーズ追加セクション（英単語・フレーズのみ） -->
        <div v-if="showFavoriteButton" class="my-phrases-section">
          <div class="section-header" @click="showItemsList = !showItemsList">
            <h3>⭐ MYフレーズに追加</h3>
            <button class="toggle-button">
              {{ showItemsList ? '▼' : '▶' }}
            </button>
          </div>
          
          <div v-show="showItemsList" class="items-list-container">
            <div class="list-controls">
              <label class="select-all-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected"
                  @change="toggleAllSelection"
                />
                <span>すべて選択</span>
              </label>
              <PrimaryButton 
                @click="addSelectedToMyPhrases" 
                variant="accent"
                size="sm"
                :disabled="selectedItems.length === 0"
              >
                選択した{{ selectedItems.length }}個を追加
              </PrimaryButton>
            </div>
            
            <div class="items-list">
              <div 
                v-for="item in stageItems" 
                :key="item.id"
                class="item-row"
                :class="{ 
                  selected: selectedItems.includes(item.id),
                  disabled: favoritesStore.isFavorited(gameType === 'words' ? 'word' : 'phrase', item.id)
                }"
              >
                <label class="item-checkbox">
                  <input 
                    type="checkbox" 
                    :checked="selectedItems.includes(item.id)"
                    :disabled="favoritesStore.isFavorited(gameType === 'words' ? 'word' : 'phrase', item.id)"
                    @change="toggleItemSelection(item.id)"
                  />
                </label>
                <div class="item-content">
                  <div class="item-english">{{ item.english }}</div>
                  <div class="item-japanese">{{ item.japanese }}</div>
                </div>
                <div class="item-status">
                  <span 
                    v-if="favoritesStore.isFavorited(gameType === 'words' ? 'word' : 'phrase', item.id)"
                    class="already-added"
                  >
                    登録済
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="clear-actions">
          <PrimaryButton @click="goToHome" variant="secondary">
            {{ t('clear.backToHome') }}
          </PrimaryButton>
          <PrimaryButton @click="continueJourney" variant="primary">
            {{ t('clear.continue') }}
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import { useContentStore } from '@/stores/content'
import type { WordContent, PhraseContent } from '@/types'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()
const contentStore = useContentStore()

// 選択状態を管理
const selectedItems = ref<string[]>([])
const showItemsList = ref<boolean>(false)
const stageItems = ref<Array<WordContent | PhraseContent>>([])
const isAllSelected = ref<boolean>(false)

// ルートパラメータ取得
const stageId = computed(() => Number(route.params['stage']) || 1)
const levelId = computed(() => Number(route.params['level']) || 1)  
const categoryId = computed(() => String(route.params['category']) || 'daily')

const gameType = computed(() => {
  const path = route.path
  if (path.includes('basic')) return 'basic'
  if (path.includes('words')) return 'words'
  if (path.includes('phrases') && !path.includes('core-phrases')) return 'phrases'
  if (path.includes('core-substages')) return 'core-substage'
  if (path.includes('core-stages')) return 'core-substage'  // core-stages/stage/X/substages も含む
  if (path.includes('core-phrases')) return 'core'
  if (path.includes('random')) return 'random'
  return 'general'
})

const showProgressSummary = computed(() => gameType !== 'basic')

const showFavoriteButton = computed(() => gameType === 'words' || gameType === 'phrases' || gameType === 'core')

const overallProgress = computed(() => {
  switch (gameType) {
    case 'basic':
      return userStore.progress.basicTyping.overallProgress || 0
    case 'words':
      return userStore.progress.words.overallProgress || 0
    case 'phrases':
      return userStore.progress.phrases.overallProgress || 0
    default:
      return 0
  }
})

const getCompletionMessage = (): string => {
  const accuracy = gameStore.lastAccuracy || 0
  const wpm = gameStore.lastWPM || 0

  if (accuracy >= 98 && wpm >= 50) {
    return t('clear.messages.perfect')
  } else if (accuracy >= 95 && wpm >= 40) {
    return t('clear.messages.excellent')
  } else if (accuracy >= 90 && wpm >= 30) {
    return t('clear.messages.good')
  } else {
    return t('clear.messages.keepPracticing')
  }
}

const formatTime = (timeInSeconds: number): string => {
  return timeInSeconds.toFixed(1)
}

const goToHome = () => {
  console.log('🏠 goToHome called - navigating to /home')
  router.push('/home')
}

const continueJourney = () => {
  // デバッグ用のログ出力
  console.log('🚀 continueJourney called')
  console.log('Current route path:', route.path)
  console.log('Current route query:', route.query)
  console.log('Detected gameType:', gameType)

  switch (gameType) {
    case 'basic':
      router.push('/basic-typing')
      break
    case 'words':
      router.push(`/words/${levelId.value}`)
      break
    case 'phrases':
      router.push(`/phrases/${categoryId.value}`)
      break
    case 'core-substage':
      // ユニット完了後は同じステージのサブステージ選択画面に戻る
      router.push(`/core-stages/stage/${stageId.value}/substages`)
      break
    case 'core':
      router.push('/core-phrases')
      break
    case 'random':
      // ランダムゲームとSRSの場合は、クエリパラメータから元のコンテンツタイプを判定
      const contentType = route.query['contentType']
      const category = route.query['category']
      const level = route.query['level']
      const srs = route.query['srs']
      const type = route.query['type']

      console.log('📊 Query parameters debug:')
      console.log('  contentType:', contentType)
      console.log('  category:', category)
      console.log('  level:', level)
      console.log('  srs:', srs)
      console.log('  type:', type)

      // SRSの場合
      if (srs === 'true') {
        console.log('🧠 SRS detected, type:', type)
        if (type === 'phrases') {
          console.log('→ Navigating to /phrases/category')
          router.push('/phrases/category')
        } else if (type === 'words') {
          console.log('→ Navigating to /words/level')
          router.push('/words/level')
        } else if (type === 'core') {
          console.log('→ Navigating to /core-phrases')
          router.push('/core-phrases')
        } else {
          console.log('→ Unknown SRS type, navigating to /home')
          router.push('/home')
        }
      }
      // 通常のランダムゲームの場合
      else if (contentType === 'phrases' && category) {
        console.log('🎲 Random phrases detected, navigating to:', `/phrases/${category}`)
        router.push(`/phrases/${category}`)
      } else if (contentType === 'words' && level) {
        console.log('🎲 Random words detected, navigating to:', `/words/${level}`)
        router.push(`/words/${level}`)
      } else if (contentType === 'core') {
        console.log('🎲 Random core detected, navigating to /core-phrases')
        router.push('/core-phrases')
      } else {
        console.log('❓ Unknown random game type, navigating to /home')
        router.push('/home')
      }
      break
    default:
      console.log('⚠️ Default case reached, navigating to /home')
      router.push('/home')
  }
}

// ステージのすべてのアイテムを取得
const loadStageItems = () => {
  if (gameType === 'words') {
    const words = contentStore.getWordsByLevel(levelId.value as 1 | 2 | 3)
    const wordsPerStage = 10
    const startIndex = (stageId.value - 1) * wordsPerStage
    stageItems.value = words.slice(startIndex, startIndex + wordsPerStage)
  } else if (gameType === 'phrases') {
    const phrases = contentStore.getPhrasesByCategory(categoryId.value)
    const phrasesPerStage = 5
    const startIndex = (stageId.value - 1) * phrasesPerStage
    stageItems.value = phrases.slice(startIndex, startIndex + phrasesPerStage)
  } else if (gameType === 'core') {
    const corePhrases = contentStore.getPhrasesByCategory('core')
    const phrasesPerStage = 10
    const startIndex = (stageId.value - 1) * phrasesPerStage
    stageItems.value = corePhrases.slice(startIndex, startIndex + phrasesPerStage)
  }
}

// チェックボックスの選択を切り替え
const toggleItemSelection = (itemId: string) => {
  // 既に登録済みのアイテムは選択できないようにする
  const item = stageItems.value.find(item => item.id === itemId)
  if (item && favoritesStore.isFavorited(gameType === 'words' ? 'word' : 'phrase', item.id)) {
    return // 既に登録済みなので選択を許可しない
  }

  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
  
  // 全選択状態を更新（登録済みでないアイテムのみで判定）
  const selectableItems = stageItems.value.filter(item =>
    !favoritesStore.isFavorited(gameType === 'words' ? 'word' : 'phrase', item.id)
  )
  isAllSelected.value = selectableItems.length > 0 && 
    selectedItems.value.length === selectableItems.length
}

// 全選択/全解除
const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
    isAllSelected.value = false
  } else {
    // 登録済みでないアイテムのみを選択
    const selectableItems = stageItems.value.filter(item =>
      !favoritesStore.isFavorited(gameType === 'words' ? 'word' : 'phrase', item.id)
    )
    selectedItems.value = selectableItems.map(item => item.id)
    isAllSelected.value = selectableItems.length > 0
  }
}

// 選択したアイテムをMYフレーズに追加
const addSelectedToMyPhrases = () => {
  if (selectedItems.value.length === 0) return
  
  const itemsToAdd = stageItems.value
    .filter(item => selectedItems.value.includes(item.id))
    .map(item => {
      if (gameType === 'words') {
        return {
          type: 'word' as const,
          category: `word-level${levelId.value}`,
          content: item
        }
      } else {
        return {
          type: 'phrase' as const,
          category: `phrase-${categoryId.value}`,
          content: item
        }
      }
    })
  
  const beforeCount = selectedItems.value.length
  favoritesStore.addToFavorites(itemsToAdd)
  
  // 選択をリセット
  selectedItems.value = []
  isAllSelected.value = false
  
  console.log(`✅ ${beforeCount}個のアイテムを処理しました`)
}


// ステージクリア時の処理
const handleStageCompletion = () => {
  console.log('🏆 Clear.vue handleStageCompletion called')
  console.log('Game type:', gameType)
  console.log('Stage ID:', stageId.value)
  
  const wpm = gameStore.lastWPM || 0
  const accuracy = gameStore.lastAccuracy || 0
  
  if (gameType === 'basic') {
    // 基本タイピングステージクリア処理
    const currentStage = stageId.value
    console.log('Game stats:', { currentStage, wpm, accuracy })

    // ユーザー進捗を更新（次のステージアンロック）
    userStore.completeBasicStage(currentStage, wpm, accuracy)

    console.log(`🎯 ステージ${currentStage}クリア！次のステージ: ${userStore.progress.basicTyping.currentStage}`)
  } else if (gameType === 'words') {
    // 英単語ステージクリア処理
    const level = levelId.value
    const stage = stageId.value
    console.log('Word game stats:', { level, stage, wpm, accuracy })

    // ユーザー進捗を更新
    userStore.completeWordStage(level, stage, wpm, accuracy)

    console.log(`🎯 英単語 レベル${level} ステージ${stage}クリア！`)
  } else if (gameType === 'phrases') {
    // 英語フレーズステージクリア処理
    const category = categoryId.value
    const stage = stageId.value
    console.log('Phrase game stats:', { category, stage, wpm, accuracy })

    // ユーザー進捗を更新
    userStore.completePhraseStage(category, stage, wpm, accuracy)

    console.log(`🎯 英語フレーズ ${category} ステージ${stage}クリア！`)
  } else if (gameType === 'core-substage') {
    // コア構文ユニットクリア処理
    const stage = stageId.value
    const substage = route.params['substage'] as '1' | '2'
    console.log('Core substage game stats:', { stage, substage, wpm, accuracy })
    // ユーザー進捗を更新（ユニット単位）
    const progressKey = `core_stage_${stage}_${substage}`
    userStore.completeCoreSubstage(progressKey, wpm, accuracy)
    console.log(`🎯 コア構文 ステージ${stage} ユニット${substage}クリア！`)
  } else if (gameType === 'core') {
    // コア構文ステージクリア処理
    const stage = stageId.value
    console.log('Core syntax game stats:', { stage, wpm, accuracy })

    // ユーザー進捗を更新（次のステージアンロック）
    userStore.completeCoreStage(stage, wpm, accuracy)

    console.log(`🎯 コア構文 ステージ${stage}クリア！`)
  }
}

// エンターキーでの次進行を処理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.code === 'Enter' || event.key === 'Enter') {
    continueJourney()
  }
}

// コンポーネントマウント時にステージクリア処理を実行
onMounted(() => {
  // デバッグ用：Clear.vueが読み込まれた時のルート情報を出力
  console.log('📱 Clear.vue mounted')
  console.log('Route path:', route.path)
  console.log('Route query:', route.query)
  console.log('Route params:', route.params)
  console.log('Computed gameType:', gameType)

  handleStageCompletion()

  // contentStoreを初期化してステージアイテムを読み込み
  contentStore.initializeBasicContent()
  loadStageItems()

  // キーボードイベントリスナーを追加
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  // キーボードイベントリスナーを削除
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.clear-page {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--bg-primary) 0%, 
    var(--bg-secondary) 50%, 
    var(--bg-primary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.clear-container {
  max-width: 700px;
  width: 100%;
  padding: var(--spacing-xl);
  position: relative;
  z-index: 2;
}

.clear-content {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-3xl);
  text-align: center;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.celebration-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--accent-blue);
  animation: confetti-fall 3s infinite linear;
  
  &:nth-child(1) {
    left: 10%;
    background: var(--accent-green);
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    left: 50%;
    background: var(--accent-purple);
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    left: 90%;
    background: var(--accent-orange);
    animation-delay: 2s;
  }
}

.clear-icon {
  color: var(--accent-green);
  margin-bottom: var(--spacing-xl);
  animation: bounce 2s ease-in-out infinite;
}

.clear-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-green), var(--accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-lg);
}

.clear-subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3xl);
  line-height: 1.5;
}

.achievement-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
}

.achievement-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.achievement-text {
  flex: 1;
}

.achievement-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.achievement-value {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
}

.progress-summary {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
  border: 1px solid var(--border-color);
}

.summary-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.summary-text {
  margin-top: var(--spacing-lg);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.clear-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
}

// MYフレーズ追加セクション
.my-phrases-section {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
  border: 1px solid var(--border-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  
  h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  .toggle-button {
    background: none;
    border: none;
    font-size: var(--text-lg);
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);
    
    &:hover {
      color: var(--text-primary);
    }
  }
}

.items-list-container {
  margin-top: var(--spacing-lg);
}

.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
  
  .select-all-checkbox {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    
    input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }
    
    &:hover {
      color: var(--text-primary);
    }
  }
}

.items-list {
  max-height: 300px;
  overflow-y: auto;
  border-radius: var(--radius-md);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: var(--radius-sm);
    
    &:hover {
      background: var(--border-hover);
    }
  }
}

.item-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &.selected {
    background: rgba(59, 130, 246, 0.1);
    border-left: 3px solid var(--accent-blue);
  }
  
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
    
    .item-checkbox input[type="checkbox"] {
      cursor: not-allowed;
    }
  }
  
  .item-checkbox {
    flex-shrink: 0;
    
    input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }
  }
  
  .item-content {
    flex: 1;
    min-width: 0;
    
    .item-english {
      font-size: var(--text-md);
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .item-japanese {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .item-status {
    flex-shrink: 0;
    
    .already-added {
      font-size: var(--text-xs);
      color: var(--accent-green);
      background: rgba(34, 197, 94, 0.1);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-weight: 500;
    }
  }
}

// アニメーション
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .clear-container {
    padding: var(--spacing-lg);
  }
  
  .clear-content {
    padding: var(--spacing-2xl);
  }
  
  .achievement-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .achievement-item {
    flex-direction: column;
    text-align: center;
  }
  
  .clear-actions {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}
</style>