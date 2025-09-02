<template>
  <div class="game-page">
    <PageHeader 
      :title="gameTitle" 
      :showBack="true" 
    />
    
    <div class="game-container">
      <!-- ゲーム開始前 -->
      <div v-if="!gameStarted" class="start-screen">
        <div class="game-info">
          <h2 class="game-title">{{ currentContent.title }}</h2>
          <p class="game-description">{{ currentContent.description }}</p>
          
          <div class="game-objectives">
            <div class="objective">
              <span class="objective-label">{{ t('game.targetWPM') }}</span>
              <span class="objective-value">{{ currentContent.targetWPM }}</span>
            </div>
            <div class="objective">
              <span class="objective-label">{{ t('game.targetAccuracy') }}</span>
              <span class="objective-value">{{ currentContent.targetAccuracy }}%</span>
            </div>
            <div class="objective" v-if="currentContent.requiredPhrases">
              <span class="objective-label">{{ t('game.requiredPhrases') }}</span>
              <span class="objective-value">{{ currentContent.requiredPhrases }}</span>
            </div>
          </div>
        </div>
        
        <PrimaryButton @click="startGame" size="lg" variant="primary">
          {{ t('game.startButton') }}
        </PrimaryButton>
      </div>

      <!-- ゲーム中 -->
      <div v-else-if="!gameCompleted" class="game-screen">
        <div class="game-header">
          <div class="timer">
            <span class="timer-label">{{ t('game.time') }}</span>
            <span class="timer-value">{{ formatTime(elapsedTime) }}</span>
          </div>
          <div class="progress-section">
            <ProgressBar :value="progress" :showLabel="true" />
            <div class="phrase-progress">{{ phrasesCompleted }}/{{ totalPhrases }} フレーズ</div>
          </div>
          <div class="current-stats">
            <div class="stat">
              <span class="stat-value">{{ currentWPM }}</span>
              <span class="stat-label">WPM</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ currentAccuracy }}%</span>
              <span class="stat-label">{{ t('game.accuracy') }}</span>
            </div>
          </div>
        </div>

        <!-- 音声再生ボタン -->
        <div v-if="currentContent.hasAudio" class="audio-controls">
          <PrimaryButton @click="playAudio" variant="ghost" size="sm">
            <PlayIcon />
          </PrimaryButton>
        </div>

        <!-- タイピングエリア -->
        <div class="typing-area">
          <div class="original-text" v-if="gameType === 'phrases' || gameType === 'words'">
            <p class="japanese-text">{{ currentContent.japanese }}</p>
          </div>
          
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

        <!-- キーボードガイド -->
        <div v-if="keyboardGuideEnabled" class="keyboard-section">
          <KeyboardGuide v-if="nextKey" :highlightKey="nextKey" />
        </div>
      </div>

      <!-- ゲーム完了 -->
      <div v-else class="complete-screen">
        <div class="complete-icon">
          <CheckIcon :size="80" />
        </div>
        
        <h2 class="complete-title">{{ t('game.wellDone') }}</h2>
        
        <div class="final-stats">
          <div class="stat-card">
            <span class="stat-label">{{ t('game.finalWPM') }}</span>
            <span class="stat-value" :class="{ success: finalWPM >= currentContent.targetWPM }">
              {{ finalWPM }}
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ t('game.finalAccuracy') }}</span>
            <span class="stat-value" :class="{ success: finalAccuracy >= currentContent.targetAccuracy }">
              {{ finalAccuracy }}%
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ t('game.totalTime') }}</span>
            <span class="stat-value">{{ formatTime(totalTime) }}</span>
          </div>
        </div>
        
        <div class="complete-actions">
          <PrimaryButton @click="retry" variant="secondary">
            {{ t('game.retry') }}
          </PrimaryButton>
          <PrimaryButton @click="goToNext" variant="primary">
            {{ t('game.continue') }}
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useContentStore } from '@/stores/content'
import PageHeader from '@/components/molecules/PageHeader.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import PlayIcon from '@/components/atoms/PlayIcon.vue'
import KeyboardGuide from '@/components/organisms/KeyboardGuide.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const contentStore = useContentStore()

// ルートパラメータから判定
const gameType = computed(() => {
  const path = route.path
  if (path.includes('words')) return 'words'
  if (path.includes('phrases')) return 'phrases'
  return 'basic'
})

const gameTitle = computed(() => {
  switch (gameType.value) {
    case 'words': return t('game.wordGame')
    case 'phrases': return t('game.phraseGame')
    default: return t('game.typingGame')
  }
})

const keyboardGuideEnabled = computed(() => true) // TODO: settingsStoreにkeyboardGuideEnabled追加

// ルートパラメータ取得
const stageId = computed(() => Number(route.params['stage']) || 1)
const levelId = computed(() => Number(route.params['level']) || 1)  
const categoryId = computed(() => String(route.params['category'] || 'daily'))

// ゲーム状態
const gameStarted = ref(false)
const gameCompleted = ref(false)
const currentText = ref('')
const currentIndex = ref(0)
const hasError = ref(false)
const elapsedTime = ref(0)
const timer = ref<number | null>(null)
const startTime = ref(0)
const errorCount = ref(0)

// フレーズ進行管理
const currentPhraseIndex = ref(0)
const totalPhrases = ref(10) // デフォルト値、ステージデータで上書き
const phrasesCompleted = ref(0)

// 統計
const currentWPM = ref(0)
const currentAccuracy = ref(100)
const finalWPM = ref(0)
const finalAccuracy = ref(0)
const totalTime = ref(0)

// コンテンツ
const currentContent = computed(() => {
  if (gameType.value === 'basic') {
    // 基本タイピングモード: ステージデータを取得
    const stage = contentStore.basicStages.find(s => s.stage === stageId.value)
    if (stage) {
      // フレーズ進行管理: practiceTextを順番に出す
      const phraseIndex = currentPhraseIndex.value % stage.practiceText.length
      return {
        title: stage.title,
        description: stage.description,
        english: stage.practiceText[phraseIndex],
        japanese: '基本タイピング練習',
        targetWPM: stage.targetWpm,
        targetAccuracy: stage.targetAccuracy,
        requiredPhrases: stage.requiredPhrases,
        hasAudio: false
      }
    }
  } else if (gameType.value === 'words') {
    // 英単語モード: レベル別の単語を取得
    const words = contentStore.getWordsByLevel(levelId.value as 1 | 2 | 3)
    const wordsPerStage = 10
    const startIndex = (stageId.value - 1) * wordsPerStage
    const stageWords = words.slice(startIndex, startIndex + wordsPerStage)
    
    if (stageWords.length > 0) {
      const wordIndex = currentPhraseIndex.value % stageWords.length
      const currentWord = stageWords[wordIndex]
      return {
        title: `レベル${levelId.value} - ステージ${stageId.value}`,
        description: `${stageWords.length}個の英単語をタイピング`,
        english: currentWord?.english || '',
        japanese: currentWord?.japanese || '',
        targetWPM: 25 + (levelId.value - 1) * 5,
        targetAccuracy: 90 + levelId.value,
        requiredPhrases: stageWords.length,
        hasAudio: false
      }
    }
  } else if (gameType.value === 'phrases') {
    // 英語フレーズモード: カテゴリ別のフレーズを取得
    const phrases = contentStore.getPhrasesByCategory(categoryId.value)
    const phrasesPerStage = 5
    const startIndex = (stageId.value - 1) * phrasesPerStage
    const stagePhrases = phrases.slice(startIndex, startIndex + phrasesPerStage)
    
    if (stagePhrases.length > 0) {
      const phraseIndex = currentPhraseIndex.value % stagePhrases.length
      const currentPhrase = stagePhrases[phraseIndex]
      return {
        title: `${categoryId.value} - ステージ${stageId.value}`,
        description: `${stagePhrases.length}個の英語フレーズをタイピング`,
        english: currentPhrase?.english || '',
        japanese: currentPhrase?.japanese || '',
        targetWPM: 30 + (currentPhrase?.difficulty || 1) * 5,
        targetAccuracy: 85 + (currentPhrase?.difficulty || 1) * 3,
        requiredPhrases: stagePhrases.length,
        hasAudio: false
      }
    }
  }
  
  // デフォルト（開発用）
  return {
    title: 'Sample Game',
    description: 'Type the text below',
    english: 'Hello world',
    japanese: 'こんにちは世界',
    targetWPM: 30,
    targetAccuracy: 95,
    hasAudio: false
  }
})

const progress = computed(() => {
  if (totalPhrases.value === 0) return 0
  // フレーズ進行 + 現在のフレーズ内進捗
  const phraseProgress = (phrasesCompleted.value / totalPhrases.value) * 100
  const currentPhraseProgress = currentText.value.length > 0 ? (currentIndex.value / currentText.value.length) * (100 / totalPhrases.value) : 0
  return phraseProgress + currentPhraseProgress
})

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

const startGame = () => {
  gameStarted.value = true
  gameCompleted.value = false
  currentText.value = currentContent.value.english || ''
  currentIndex.value = 0
  hasError.value = false
  elapsedTime.value = 0
  errorCount.value = 0
  startTime.value = Date.now()
  
  // フレーズ進行リセット
  currentPhraseIndex.value = 0
  phrasesCompleted.value = 0
  
  // ゲームモードに応じて必要フレーズ数を設定
  if (gameType.value === 'basic') {
    const stage = contentStore.basicStages.find(s => s.stage === stageId.value)
    if (stage) {
      totalPhrases.value = stage.requiredPhrases
    }
  } else if (gameType.value === 'words') {
    const words = contentStore.getWordsByLevel(levelId.value as 1 | 2 | 3)
    const wordsPerStage = 10
    const startIndex = (stageId.value - 1) * wordsPerStage
    const stageWords = words.slice(startIndex, startIndex + wordsPerStage)
    totalPhrases.value = stageWords.length
  } else if (gameType.value === 'phrases') {
    const phrases = contentStore.getPhrasesByCategory(categoryId.value)
    const phrasesPerStage = 5
    const startIndex = (stageId.value - 1) * phrasesPerStage
    const stagePhrases = phrases.slice(startIndex, startIndex + phrasesPerStage)
    totalPhrases.value = stagePhrases.length
  }
  
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
  
  // 10フレーズ完了したらゲーム完了
  if (phrasesCompleted.value >= totalPhrases.value) {
    completeGame()
  } else {
    // 次のフレーズに進む
    currentPhraseIndex.value++
    currentIndex.value = 0
    hasError.value = false
    currentText.value = currentContent.value.english || ''
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
  
  // gameStoreに統計データを保存
  gameStore.lastWPM = finalWPM.value
  gameStore.lastAccuracy = finalAccuracy.value
  gameStore.lastTime = totalTime.value
  
  // ゲームモードに応じてClear.vueに遷移
  if (gameType.value === 'basic') {
    router.push(`/clear/basic/${stageId.value}`)
  } else if (gameType.value === 'words') {
    router.push(`/words/clear/${levelId.value}/${stageId.value}`)
  } else if (gameType.value === 'phrases') {
    router.push(`/phrases/clear/${categoryId.value}/${stageId.value}`)
  }
}

const playAudio = () => {
  // 音声再生機能
  console.log('Playing audio for:', currentContent.value.english)
}

const retry = () => {
  startGame()
}

const goToNext = () => {
  router.back()
}

// 初期化
onMounted(() => {
  contentStore.initializeBasicContent()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  document.removeEventListener('keypress', handleKeyPress)
})
</script>

<style lang="scss" scoped>
.game-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.start-screen,
.complete-screen {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
}

.game-info {
  margin-bottom: var(--spacing-2xl);
}

.game-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.game-description {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.game-objectives {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2xl);
}

.objective {
  text-align: center;
}

.objective-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.objective-value {
  display: block;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
}

.game-screen {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
}

.game-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
  margin-bottom: var(--spacing-2xl);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.phrase-progress {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 600;
}

.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.timer-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
}

.current-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.audio-controls {
  position: absolute;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
}

.typing-area {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
  min-height: 200px;
}

.original-text {
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.japanese-text {
  font-size: var(--text-lg);
  color: var(--text-secondary);
}

.typing-text {
  font-size: var(--text-2xl);
  line-height: 2;
  font-family: monospace;
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
}

.stat-card .stat-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.stat-card .stat-value {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  
  &.success {
    color: var(--accent-green);
  }
}

.complete-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.keyboard-section {
  margin-top: var(--spacing-2xl);
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

// レスポンシブ対応
@media (max-width: 768px) {
  .game-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .final-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .complete-actions {
    flex-direction: column;
  }
}
</style>