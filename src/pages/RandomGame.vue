<template>
  <div class="game-page">
    <!-- ゲーム専用のコンパクトヘッダー -->
    <div class="game-header-wrapper">
      <PageHeader
        :title="gameTitle"
      >
        <template #actions>
          <div class="header-progress" v-if="gameStarted && !gameCompleted">
            <span class="progress-label">{{ questionsCompleted }} / {{ totalQuestions }}</span>
            <ProgressBar
              :value="(questionsCompleted / totalQuestions) * 100"
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
            <span class="start-instruction">{{ t('game.ready') }}</span>
            <span class="start-spacebar">Press SPACE to Start</span>
          </div>
        </div>

        <!-- 🈁 ゲーム情報表示エリア -->
        <div class="translation-area">
          <p class="japanese-text">{{ gameTitle }} - {{ gameDescription }}</p>
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
        <div v-if="currentQuestion?.japanese" class="translation-area">
          <p class="japanese-text">{{ currentQuestion.japanese }}</p>
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

        <h2 class="complete-title">{{ t('game.wellDone') }}</h2>

        <div class="final-stats">
          <div class="stat-card">
            <span class="stat-label">{{ t('game.finalWPM') }}</span>
            <span class="stat-value">{{ finalWPM }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ t('game.finalAccuracy') }}</span>
            <span class="stat-value">{{ finalAccuracy }}%</span>
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
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useContentStore } from '@/stores/content'
import { useSRSStore } from '@/stores/srs'
import PageHeader from '@/components/molecules/PageHeader.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import KeyboardGuide from '@/components/organisms/KeyboardGuide.vue'

interface Question {
  id: string
  english: string
  japanese?: string
  difficulty?: number
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const contentStore = useContentStore()
const srsStore = useSRSStore()

const props = defineProps<{
  type: 'words' | 'phrases' | 'core'
  level: number | string
}>()

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

// 問題進行管理
const currentQuestionIndex = ref(0)
const questionsCompleted = ref(0)

// 統計
const currentWPM = ref(0)
const currentAccuracy = ref(100)
const finalWPM = ref(0)
const finalAccuracy = ref(100)
const totalTime = ref(0)

// 問題データ
const questions = ref<Question[]>([])
const totalQuestions = computed(() => questions.value.length)

// SRS関連
const isSRSMode = computed(() => route.query['srs'] === 'true')
const currentSRSCard = ref<{ id: string; contentType: string } | null>(null)


// 現在の問題
const currentQuestion = computed(() => {
  if (currentQuestionIndex.value < questions.value.length) {
    return questions.value[currentQuestionIndex.value]
  }
  return null
})

// ゲームタイトルとタイプ
const gameTitle = computed(() => {
  let baseTitle = ''
  if (props.type === 'words') {
    baseTitle = t('game.wordGame')
  } else if (props.type === 'phrases') {
    baseTitle = t('game.phraseGame')
  } else if (props.type === 'core') {
    baseTitle = 'コア構文マスター'
  }
  return isSRSMode.value ? `${baseTitle} (SRS)` : baseTitle
})

const gameDescription = computed(() => {
  const count = totalQuestions.value
  let typeLabel = ''
  if (props.type === 'words') {
    typeLabel = '英単語'
  } else if (props.type === 'phrases') {
    typeLabel = '英語フレーズ'
  } else if (props.type === 'core') {
    typeLabel = 'コア構文'
  }
  return `${count}個の${typeLabel}をタイピング`
})

// 次に押すキー
const nextKey = computed(() => {
  if (currentIndex.value < currentText.value.length) {
    return currentText.value[currentIndex.value]
  }
  return ''
})

// 時間フォーマット
const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}


// ゲーム開始
const startGame = () => {
  gameStarted.value = true
  gameCompleted.value = false
  currentText.value = currentQuestion.value?.english || ''
  currentIndex.value = 0
  hasError.value = false
  elapsedTime.value = 0
  errorCount.value = 0
  startTime.value = Date.now()

  // 問題進行リセット
  currentQuestionIndex.value = 0
  questionsCompleted.value = 0

  // 自動読み上げ
  setTimeout(() => {
    playAudio()
  }, 500)

  timer.value = window.setInterval(() => {
    elapsedTime.value++
    updateStats()
  }, 1000)

  document.addEventListener('keypress', handleKeyPress)
}

// キー押下処理
const handleKeyPress = (event: KeyboardEvent) => {
  if (!gameStarted.value || gameCompleted.value) return

  const expectedChar = currentText.value[currentIndex.value]
  const typedChar = event.key

  if (typedChar === expectedChar) {
    currentIndex.value++
    hasError.value = false

    if (currentIndex.value >= currentText.value.length) {
      completeQuestionOrGame()
    }
  } else {
    hasError.value = true
    errorCount.value++
  }

  updateStats()
}

// 統計更新
const updateStats = () => {
  const elapsedMinutes = elapsedTime.value / 60
  const wordsTyped = currentIndex.value / 5
  currentWPM.value = Math.round(wordsTyped / elapsedMinutes) || 0

  const totalChars = currentIndex.value + errorCount.value
  currentAccuracy.value = totalChars > 0
    ? Math.round((currentIndex.value / totalChars) * 100)
    : 100
}

// 問題完了またはゲーム完了
const completeQuestionOrGame = async () => {
  if (!currentQuestion.value) return

  // SRS記録更新
  if (isSRSMode.value && currentSRSCard.value) {
    const responseTime = Date.now() - startTime.value
    const accuracy = hasError.value ? 0.8 : 1.0 // 簡単な正確度計算

    const reviewResult = {
      quality: (accuracy >= 0.9 ? 5 : accuracy >= 0.7 ? 4 : 3) as 3 | 4 | 5,
      accuracy,
      responseTime,
      wpm: currentWPM.value
    }

    srsStore.updateCardAfterReview(currentSRSCard.value.id, reviewResult)
  }

  questionsCompleted.value++

  // 全問題完了チェック
  if (questionsCompleted.value >= totalQuestions.value) {
    completeGame()
  } else {
    // 次の問題へ
    currentQuestionIndex.value++
    prepareNextQuestion()
  }
}

// 次の問題準備
const prepareNextQuestion = async () => {
  currentIndex.value = 0
  hasError.value = false
  currentText.value = currentQuestion.value?.english || ''
  startTime.value = Date.now()

  if (isSRSMode.value) {
    const question = currentQuestion.value
    if (question) {
      currentSRSCard.value = srsStore.getCardById(question.id)
    }
  }

  // 新しい問題の自動読み上げ
  setTimeout(() => {
    playAudio()
  }, 500)

  await nextTick()
}

// ゲーム完了
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
  gameStore.lastScore = Math.round((finalWPM.value * finalAccuracy.value) / 10)
}

// 音声再生
const playAudio = () => {
  if (currentQuestion.value?.english) {
    // Web Speech API を使用した音声読み上げ
    const utterance = new SpeechSynthesisUtterance(currentQuestion.value.english)
    utterance.lang = 'en-US'
    utterance.rate = 0.8 // 少しゆっくり読む
    utterance.pitch = 1.0
    speechSynthesis.speak(utterance)
  }
}

// 再挑戦
const retry = () => {
  startGame()
}

// クリア画面へ
const goToNext = () => {
  // Store game results
  gameStore.lastWPM = finalWPM.value
  gameStore.lastAccuracy = finalAccuracy.value
  gameStore.lastTime = totalTime.value / 1000
  gameStore.lastScore = Math.round((finalWPM.value * finalAccuracy.value) / 10)

  // クリア画面へ遷移
  const clearQuery: Record<string, string> = {
    type: props.type || 'words',
    level: String(props.level || '1')
  }

  if (route.query['srs'] === 'true') {
    clearQuery['srs'] = 'true'
    clearQuery['contentType'] = route.query['contentType'] as string || props.type || 'words'
  }

  router.push({
    name: 'RandomGameClear',
    query: clearQuery
  })
}

// 問題データの初期化
const initializeQuestions = () => {
  if (isSRSMode.value) {
    // SRSモード: SRSストアから問題を取得
    const questionCount = Number(route.query['count']) || 10
    const studySet = srsStore.generateStudySet(questionCount)
    const studyCards = studySet.total

    questions.value = studyCards.map(card => {
      let content
      if (card.contentType === 'word') {
        content = contentStore.words.find(w => w.id === card.id)
      } else if (card.contentType === 'phrase') {
        content = contentStore.phrases.find(p => p.id === card.id)
      } else if (card.contentType === 'core') {
        content = contentStore.getCorePhrasesEnhanced.find(p => p.id === card.id)
      }

      return {
        id: card.id,
        english: content?.english || '',
        japanese: content?.japanese || ''
      }
    })
  } else {
    // 通常のランダム出題モード
    let allContent: Array<{ id: string; english: string; japanese?: string }> = []
    if (props.type === 'words') {
      allContent = contentStore.getWordsByLevel(Number(props.level) as 1 | 2 | 3)
    } else if (props.type === 'phrases') {
      allContent = contentStore.getPhrasesByCategory(String(props.level))
    } else if (props.type === 'core') {
      if (props.level === 'all') {
        allContent = contentStore.getCorePhrasesEnhanced
      } else {
        // 特定のステージの場合
        allContent = contentStore.getCorePhrasesbyStage(Number(props.level))
      }
    }

    const shuffled = [...allContent].sort(() => Math.random() - 0.5)
    const questionCount = Number(route.query['count']) || 10

    questions.value = shuffled.slice(0, questionCount).map(item => ({
      id: item.id,
      english: item.english,
      japanese: item.japanese || ''
    }))
  }
}

// スペースキーでゲーム開始
const handleSpaceToStart = (event: KeyboardEvent) => {
  if (!gameStarted.value && event.code === 'Space') {
    event.preventDefault()
    startGame()
  }
}

// ライフサイクル
onMounted(async () => {
  // Prevent body scrolling when game is mounted
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  // コンテンツ初期化
  if (props.type === 'words') {
    contentStore.initializeWordsContent()
  } else if (props.type === 'phrases') {
    contentStore.initializePhrasesContent()
  } else if (props.type === 'core') {
    contentStore.initializePhrasesContent() // Core phrases are included in phrases
  }

  // SRS初期化
  if (isSRSMode.value) {
    if (props.type === 'words') {
      srsStore.initializeContentCards(contentStore.words, 'word')
    } else if (props.type === 'phrases') {
      srsStore.initializeContentCards(contentStore.phrases, 'phrase')
    } else if (props.type === 'core') {
      srsStore.initializeContentCards(contentStore.getCorePhrasesEnhanced, 'core')
    }
  }

  // 問題初期化
  initializeQuestions()

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

// ゲーム状態の監視
watch(currentQuestion, (newQuestion) => {
  if (newQuestion && isSRSMode.value) {
    currentSRSCard.value = srsStore.getCardById(newQuestion.id)
  }
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
  padding-top: 80px; // 固定値で大きな上部余白を追加
}

.game-header-wrapper {
  flex: 0 0 auto;
  min-height: 40px;

  .page-header {
    max-width: 1200px;           // AppHeaderと同じ幅制限
    margin: 0 auto;              // 中央寄せ
    padding: var(--spacing-md) var(--space-md); // 上下+左右パディング
  }
}

.game-container {
  flex: 1;
  min-height: 0; // Important for flexbox overflow
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  width: 100%;
}

.complete-screen {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg); // 上下パディングを削減
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  max-height: 100%;
  overflow: auto; // 必要時のみスクロール
}

.game-screen {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-sm); // Fixed small padding
  flex: 1;
  min-height: 0; // Critical for flex overflow
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  gap: 20px; // 50px → 20px に削減
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
  height: 10vh; // Fixed height using viewport
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
  height: 6vh; // Fixed height using viewport
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


// 音声ボタンセクション
.audio-section {
  display: flex;
  justify-content: flex-end;
  margin: var(--spacing-lg) 0;
  padding: 0 var(--spacing-md);
  flex: 0 0 auto;
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

// 🎹 指ガイド付きキーボード (可変高さ)
.keyboard-section {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-height: 50vh; // Fixed max height to prevent overflow
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

@media (max-width: 768px) {
  .final-stats {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .stat-card {
    min-width: 100px;
  }

  .keyboard-section {
    max-height: 40vh;
  }
}

@media (max-width: 480px) {
  .game-container {
    padding: var(--spacing-md);
  }

  .game-screen {
    padding: var(--spacing-xs);
    gap: 15px;
  }

  .typing-text {
    font-size: var(--text-xl);
  }

  .final-stats {
    flex-direction: column;
    align-items: center;
  }
}
</style>