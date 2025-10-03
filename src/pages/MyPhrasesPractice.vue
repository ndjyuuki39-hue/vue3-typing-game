<template>
  <div class="game-page">
    <!-- ゲーム専用のコンパクトヘッダー -->
    <div class="game-header-wrapper">
      <PageHeader
        title="MYフレーズ練習"
      >
        <template #actions>
          <div class="header-progress" v-if="gameStarted && !gameCompleted">
            <span class="progress-label">{{ phrasesCompleted }} / {{ totalPhrases }}</span>
            <ProgressBar
              :value="(phrasesCompleted / totalPhrases) * 100"
              size="sm"
              :showLabel="false"
            />
          </div>
        </template>
      </PageHeader>
    </div>


    <div class="game-container">
      <!-- ゲーム開始前 -->
      <div v-if="!gameStarted" class="game-screen">

        <!-- 📝 直接入力エリア -->
        <div class="direct-input-area">
          <div class="typing-text start-message">
            <span class="start-instruction">Ready to practice!</span>
            <span class="start-spacebar">Press SPACE to Start</span>
          </div>
        </div>

        <!-- 🈁 ゲーム情報表示エリア -->
        <div class="translation-area">
          <p class="japanese-text">{{ getModeLabel() }} - {{ getCategoryLabel() }}</p>
        </div>

        <!-- 🎹 指ガイド付きキーボード -->
        <div class="keyboard-section">
          <KeyboardGuide :highlightKey="' '" />
        </div>

      </div>

      <!-- ゲーム中 -->
      <div v-else-if="!gameCompleted" class="game-screen">

        <!-- 📝 直接入力エリア -->
        <div class="direct-input-area">
          <div class="typing-text">
            <span
              v-for="(char, index) in currentText"
              :key="index"
              class="char"
              :class="{
                'char--completed': index < currentIndex,
                'char--current': index === currentIndex,
                'char--error': index === currentIndex && hasError
              }"
            >
              {{ char }}
            </span>
          </div>
        </div>

        <!-- 🈁 和訳表示エリア -->
        <div class="translation-area">
          <p class="japanese-text">{{ currentItem?.content.japanese }}</p>
        </div>

        <!-- 音声再生ボタン -->
        <div class="audio-section">
          <button @click="playAudio" class="audio-button">
            <div class="audio-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span class="audio-text">音声を聞く</span>
          </button>
        </div>

        <!-- 🎹 指ガイド付きキーボード -->
        <div class="keyboard-section">
          <KeyboardGuide :highlightKey="nextKey || ''" />
        </div>

      </div>

      <!-- ゲーム完了 -->
      <div v-else class="complete-screen">
        <div class="complete-icon">
          <CheckIcon :size="80" />
        </div>

        <h2 class="complete-title">練習完了！</h2>

        <div class="final-stats">
          <div class="stat-card">
            <span class="stat-label">平均WPM</span>
            <span class="stat-value">{{ finalWPM }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">平均正確率</span>
            <span class="stat-value">{{ finalAccuracy }}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">総時間</span>
            <span class="stat-value">{{ formatTime(totalTime) }}</span>
          </div>
        </div>

        <div class="complete-actions">
          <PrimaryButton @click="retry" variant="secondary">
            もう一度練習
          </PrimaryButton>
          <PrimaryButton @click="goToNext" variant="primary">
            MYフレーズ管理に戻る
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import type { FavoriteItem } from '@/types'

// Components
import PageHeader from '@/components/molecules/PageHeader.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import KeyboardGuide from '@/components/organisms/KeyboardGuide.vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()

// ゲーム状態
const gameStarted = ref(false)
const gameCompleted = ref(false)
const practiceItems = ref<FavoriteItem[]>([])
const currentIndex = ref(0)
const currentText = ref('')
const hasError = ref(false)
const elapsedTime = ref(0)
const startTime = ref(0)
const errorCount = ref(0)

// フレーズ進行管理
const currentPhraseIndex = ref(0)
const totalPhrases = ref(10)
const phrasesCompleted = ref(0)

// 統計
const currentWPM = ref(0)
const currentAccuracy = ref(100)
const finalWPM = ref(0)
const finalAccuracy = ref(0)
const totalTime = ref(0)

// Timer
const timer = ref<number | null>(null)

// Computed
const currentItem = computed(() => practiceItems.value[currentPhraseIndex.value])

const nextKey = computed(() => {
  if (currentIndex.value < currentText.value.length) {
    return currentText.value[currentIndex.value]
  }
  return ''
})

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Methods
const getModeLabel = (): string => {
  const config = favoritesStore.practiceConfig
  const labels = {
    quick: 'クイック練習',
    normal: 'ノーマル練習',
    long: 'ロング練習',
    marathon: 'マラソン練習'
  }
  return labels[config.mode] || 'カスタム練習'
}

const getCategoryLabel = (): string => {
  const config = favoritesStore.practiceConfig
  if (config.categories.length === 0) return '全カテゴリー'

  const category = favoritesStore.favoriteCategories
    .find(cat => cat.id === config.categories[0])

  return category?.label || '選択カテゴリー'
}

const startGame = () => {
  gameStarted.value = true
  gameCompleted.value = false

  // フレーズ進行リセット（最初に実行）
  currentPhraseIndex.value = 0
  phrasesCompleted.value = 0
  totalPhrases.value = practiceItems.value.length

  // Vue のリアクティブシステムが更新されるまで待つ
  nextTick(() => {
    // currentPhraseIndexリセット後にcurrentTextを設定
    currentText.value = currentItem.value?.content.english || ''

    // 自動読み上げ
    setTimeout(() => {
      playAudio()
    }, 500)
  })

  currentIndex.value = 0
  hasError.value = false
  elapsedTime.value = 0
  errorCount.value = 0
  startTime.value = Date.now()

  timer.value = window.setInterval(() => {
    elapsedTime.value++
    updateStats()
  }, 1000)

  document.addEventListener('keypress', handleKeyPress)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (!gameStarted.value || gameCompleted.value) return

  const expectedChar = currentText.value[currentIndex.value]
  const typedChar = event.key

  if (typedChar === expectedChar) {
    currentIndex.value++
    hasError.value = false

    if (currentIndex.value >= currentText.value.length) {
      completePhraseOrGame()
    }
  } else {
    hasError.value = true
    errorCount.value++
  }

  updateStats()
}

const updateStats = () => {
  const elapsedMinutes = elapsedTime.value / 60
  const wordsTyped = currentIndex.value / 5
  currentWPM.value = Math.round(wordsTyped / elapsedMinutes) || 0

  const totalChars = currentIndex.value + errorCount.value
  currentAccuracy.value = totalChars > 0
    ? Math.round((currentIndex.value / totalChars) * 100)
    : 100
}

const completePhraseOrGame = () => {
  phrasesCompleted.value++

  // Update favorites store stats
  if (currentItem.value) {
    favoritesStore.updatePracticeStats(
      currentItem.value.id,
      currentWPM.value,
      currentAccuracy.value
    )
  }

  if (phrasesCompleted.value >= totalPhrases.value) {
    completeGame()
  } else {
    // 次のフレーズに進む
    currentPhraseIndex.value++
    currentIndex.value = 0
    hasError.value = false
    currentText.value = currentItem.value?.content.english || ''

    // 新しいフレーズの自動読み上げ
    setTimeout(() => {
      playAudio()
    }, 500)
  }
}

const completeGame = () => {
  gameCompleted.value = true

  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }

  document.removeEventListener('keypress', handleKeyPress)

  finalWPM.value = currentWPM.value
  finalAccuracy.value = currentAccuracy.value
  totalTime.value = elapsedTime.value
}

const playAudio = () => {
  if (currentItem.value?.content.english) {
    // Web Speech API を使用した音声読み上げ
    const utterance = new SpeechSynthesisUtterance(currentItem.value.content.english)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    utterance.pitch = 1.0
    speechSynthesis.speak(utterance)
  }
}

const retry = () => {
  startGame()
}

const goToNext = () => {
  router.push('/my-phrases')
}

// スペースキーでゲーム開始
const handleSpaceToStart = (event: KeyboardEvent) => {
  if (!gameStarted.value && event.code === 'Space') {
    event.preventDefault()
    startGame()
  }
}

// Lifecycle
onMounted(() => {
  // Prevent body scrolling when game is mounted
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  // Get practice items from favorites store
  practiceItems.value = favoritesStore.getPracticeItems()

  // スペースキーでゲーム開始できるようにリスナー追加
  window.addEventListener('keydown', handleSpaceToStart)
})

onUnmounted(() => {
  // Restore body scrolling when leaving game
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''

  if (timer.value) {
    clearInterval(timer.value)
  }
  document.removeEventListener('keypress', handleKeyPress)
  window.removeEventListener('keydown', handleSpaceToStart)
})
</script>

<style lang="scss" scoped>
.game-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
  touch-action: none;
  padding-top: 80px;
}

.game-header-wrapper {
  flex: 0 0 auto;
  min-height: 40px;

  .page-header {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--space-md);
  }
}

.game-container {
  flex: 1;
  min-height: 0;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  width: 100%;
}

.game-screen {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-sm);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  gap: 20px;
}

.complete-screen {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  max-height: 100%;
  overflow: auto;
}

// 📝 直接入力エリア
.direct-input-area {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10vh;
  max-height: 100px;
  min-height: 80px;
}

// 🈁 和訳表示エリア
.translation-area {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6vh;
  max-height: 60px;
  min-height: 40px;
  border: 1px solid var(--border-color);
}

.japanese-text {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.5;
  margin: 0;
}

.typing-text {
  font-size: var(--text-3xl);
  line-height: 1.6;
  font-family: monospace;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;

  &.start-message {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);

    .start-instruction {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--accent-green);
    }

    .start-spacebar {
      font-size: var(--text-lg);
      color: var(--text-secondary);
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

.char {
  transition: all var(--transition-fast);

  &--completed {
    color: var(--accent-green);
  }

  &--current {
    background: var(--accent-blue);
    color: white;
    padding: 2px 4px;
    border-radius: var(--radius-xs);
    animation: blink 1s infinite;
  }

  &--error {
    background: var(--accent-red);
    animation: shake 0.3s;
  }
}

// 🎹 指ガイド付きキーボード
.keyboard-section {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-height: 50vh;
}

// 音声ボタンセクション
.audio-section {
  display: flex;
  justify-content: flex-end;
  margin: var(--spacing-lg) 0;
  padding: 0 var(--spacing-md);
}

.audio-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border: none;
  border-radius: var(--radius-full);
  color: white;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 195, 247, 0.4);
    background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(79, 195, 247, 0.3);
  }
}

.audio-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
}

.audio-text {
  font-family: var(--font-primary);
  letter-spacing: 0.5px;
}

.complete-icon {
  color: var(--accent-green);
  margin-bottom: var(--spacing-lg);
}

.complete-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2xl);
}

.final-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.stat-card {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  min-width: 120px;

  .stat-label {
    display: block;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }

  .stat-value {
    display: block;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);

    &.success {
      color: var(--accent-green);
    }
  }
}

.complete-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.header-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
  min-width: 80px;
}

.progress-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 600;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>