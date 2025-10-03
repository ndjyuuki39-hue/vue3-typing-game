<template>
  <div class="game-page">
    <!-- ゲーム専用のコンパクトヘッダー -->
    <div class="game-header-wrapper">
      <PageHeader
        :title="gameTitle"
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
            <span class="start-instruction">{{ t('game.ready') }}</span>
            <span class="start-spacebar">Press SPACE to Start</span>
          </div>
        </div>

        <!-- 🈁 ゲーム情報表示エリア -->
        <div class="translation-area">
          <p class="japanese-text">{{ currentContent.title }} - {{ currentContent.description }}</p>
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
        <div v-if="gameType === 'phrases' || gameType === 'words' || gameType === 'core' || gameType === 'core-substage'" class="translation-area">
          <p class="japanese-text">{{ currentContent.japanese }}</p>
        </div>

        <!-- 音声再生ボタン -->
        <div v-if="currentContent.hasAudio" class="audio-section">
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
import { useI18n } from '@/composables/useI18n'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useContentStore } from '@/stores/content'
import { useAdaptiveLearning } from '@/composables/useAdaptiveLearning'
import { useProgress } from '@/composables/useProgress'
import { useSRS } from '@/composables/useSRS'
import { useAuth } from '@/composables/useAuth'
import PageHeader from '@/components/molecules/PageHeader.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import KeyboardGuide from '@/components/organisms/KeyboardGuide.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const contentStore = useContentStore()
const adaptiveLearning = useAdaptiveLearning()
const { recordSession } = useProgress()
const { getOrCreateCard, recordReview } = useSRS()
const { isAuthenticated } = useAuth()

// ルートパラメータから判定
const gameType = computed(() => {
  const path = route.path
  if (path.includes('words')) return 'words'
  if (path.includes('phrases') && !path.includes('core-stages')) return 'phrases'
  if (path.includes('core-stages/stage') || path.includes('core-phrases')) return 'core'
  if (path.includes('core-substages/game')) return 'core-substage'
  return 'basic'
})

const gameTitle = computed(() => {
  switch (gameType.value) {
    case 'words': return t('game.wordGame')
    case 'phrases': return t('game.phraseGame')
    case 'core': return 'コアフレーズ練習'
    case 'core-substage': return 'コア構文練習'
    default: return t('game.typingGame')
  }
})

// TODO: settingsStoreにkeyboardGuideEnabled追加後に有効化
// const keyboardGuideEnabled = computed(() => true)

// ルートパラメータ取得
const stageId = computed(() => Number(route.params['stage']) || 1)
const levelId = computed(() => Number(route.params['level']) || 1)
const categoryId = computed(() => String(route.params['category'] || 'daily'))
const substageId = computed(() => String(route.params['substage'] || '1') as '1' | '2')

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

// 現在のWordContentまたはPhraseContent（MYフレーズ追加用）
const currentRawContent = ref<any>(null)

// SRSカードID（バックエンド統合用）
const currentSRSCardId = ref<string | null>(null)

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
        hasAudio: true
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
      currentRawContent.value = currentWord // MYフレーズ追加用に保存
      return {
        title: `レベル${levelId.value} - ステージ${stageId.value}`,
        description: `${stageWords.length}個の英単語をタイピング`,
        english: currentWord?.english || '',
        japanese: currentWord?.japanese || '',
        targetWPM: 25 + (levelId.value - 1) * 5,
        targetAccuracy: 90 + levelId.value,
        requiredPhrases: stageWords.length,
        hasAudio: true
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
      currentRawContent.value = currentPhrase // MYフレーズ追加用に保存
      return {
        title: `${categoryId.value} - ステージ${stageId.value}`,
        description: `${stagePhrases.length}個の英語フレーズをタイピング`,
        english: currentPhrase?.english || '',
        japanese: currentPhrase?.japanese || '',
        targetWPM: 30 + (currentPhrase?.difficulty || 1) * 5,
        targetAccuracy: 85 + (currentPhrase?.difficulty || 1) * 3,
        requiredPhrases: stagePhrases.length,
        hasAudio: true
      }
    }
  } else if (gameType.value === 'core') {
    // コアフレーズモード: ステージ別のコアフレーズを取得（新システム）
    const stagePhrases = contentStore.getCorePhrasesbyStage(stageId.value)

    if (stagePhrases.length > 0) {
      const phraseIndex = currentPhraseIndex.value % stagePhrases.length
      const currentPhrase = stagePhrases[phraseIndex]
      currentRawContent.value = currentPhrase // MYフレーズ追加用に保存
      return {
        title: `コアフレーズ - ステージ${stageId.value}`,
        description: `${stagePhrases.length}個のコアフレーズをタイピング`,
        english: currentPhrase?.english || '',
        japanese: currentPhrase?.japanese || '',
        targetWPM: 30 + (currentPhrase?.difficulty || 1) * 5,
        targetAccuracy: 85 + (currentPhrase?.difficulty || 1) * 3,
        requiredPhrases: stagePhrases.length,
        hasAudio: true
      }
    }
  } else if (gameType.value === 'core-substage') {
    // コア構文サブステージモード: ステージとサブステージ（A/B）から10フレーズを取得
    const substagePhrases = contentStore.getCorePhrasesbySubstage(stageId.value, substageId.value)

    if (substagePhrases.length > 0) {
      const phraseIndex = currentPhraseIndex.value % substagePhrases.length
      const currentPhrase = substagePhrases[phraseIndex]
      currentRawContent.value = currentPhrase // MYフレーズ追加用に保存
      return {
        title: `コア構文 ステージ${stageId.value}${substageId.value}`,
        description: `${substagePhrases.length}個のコア構文フレーズをタイピング`,
        english: currentPhrase?.english || '',
        japanese: currentPhrase?.japanese || '',
        targetWPM: 30 + (currentPhrase?.difficulty || 1) * 5,
        targetAccuracy: 85 + (currentPhrase?.difficulty || 1) * 3,
        requiredPhrases: substagePhrases.length,
        hasAudio: true
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

const startGame = async () => {
  gameStarted.value = true
  gameCompleted.value = false
  currentText.value = currentContent.value.english || ''
  currentIndex.value = 0
  hasError.value = false
  elapsedTime.value = 0
  errorCount.value = 0
  startTime.value = Date.now()

  // 適応学習セッション開始
  adaptiveLearning.startLearningSession(gameType.value)

  // 🔥 SRSカード取得（認証済みの場合のみ）
  if (isAuthenticated.value) {
    try {
      const contentId = gameType.value === 'basic' ? stageId.value :
                       gameType.value === 'words' ? levelId.value :
                       gameType.value === 'phrases' ? categoryId.value : stageId.value

      const card = await getOrCreateCard(String(contentId), gameType.value)
      currentSRSCardId.value = card.id
    } catch (error) {
      console.error('Failed to get SRS card:', error)
      // エラーでも続行
    }
  }

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
  } else if (gameType.value === 'core') {
    const stagePhrases = contentStore.getCorePhrasesbyStage(stageId.value)
    totalPhrases.value = stagePhrases.length
  } else if (gameType.value === 'core-substage') {
    const substagePhrases = contentStore.getCorePhrasesbySubstage(stageId.value, substageId.value)
    totalPhrases.value = substagePhrases.length
  }
  
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

    // 新しいフレーズの自動読み上げ
    setTimeout(() => {
      playAudio()
    }, 500)
  }
}

const completeGame = async () => {
  gameCompleted.value = true

  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }

  document.removeEventListener('keypress', handleKeyPress)

  finalWPM.value = currentWPM.value
  finalAccuracy.value = currentAccuracy.value
  totalTime.value = elapsedTime.value

  // 適応学習システムにパフォーマンスデータを記録
  const contentId = gameType.value === 'basic' ? stageId.value :
                   gameType.value === 'words' ? levelId.value :
                   gameType.value === 'phrases' ? categoryId.value : stageId.value

  adaptiveLearning.recordPerformance({
    wpm: finalWPM.value,
    accuracy: finalAccuracy.value,
    completionTime: totalTime.value,
    contentType: gameType.value,
    contentId: contentId,
    errorPatterns: [], // TODO: 文字別エラー分析を後で追加
    retryCount: 0 // TODO: 再挑戦回数の追跡を後で追加
  })

  // gameStoreに統計データを保存
  gameStore.lastWPM = finalWPM.value
  gameStore.lastAccuracy = finalAccuracy.value
  gameStore.lastTime = totalTime.value
  gameStore.lastScore = Math.round((finalWPM.value * finalAccuracy.value) / 10)

  // MYフレーズ追加用に現在のコンテンツを保存（英単語・フレーズ・コアフレーズ）
  if (gameType.value === 'words' || gameType.value === 'phrases' || gameType.value === 'core' || gameType.value === 'core-substage') {
    gameStore.lastPlayedContent = currentRawContent.value
  }

  // 🔥 バックエンドAPIに進捗記録（認証済みの場合のみ）
  if (isAuthenticated.value) {
    try {
      // 進捗セッション記録
      await recordSession({
        contentType: gameType.value,
        contentId: String(contentId),
        wpm: finalWPM.value,
        accuracy: finalAccuracy.value / 100,
        durationSeconds: totalTime.value,
        errorCount: errorCount.value,
        completed: true
      })

      // SRS復習記録（カードIDがある場合）
      if (currentSRSCardId.value) {
        const quality = calculateQuality(finalAccuracy.value)
        await recordReview(
          currentSRSCardId.value,
          quality,
          totalTime.value * 1000, // ms単位に変換
          finalAccuracy.value / 100,
          finalWPM.value
        )
      }
    } catch (error) {
      console.error('Failed to record game session:', error)
      // エラーでも続行
      //（オフラインでも使える）
    }
  }

  // ゲームモードに応じてClear.vueに遷移
  if (gameType.value === 'basic') {
    router.push(`/clear/basic/${stageId.value}`)
  } else if (gameType.value === 'words') {
    router.push(`/words/clear/${levelId.value}/${stageId.value}`)
  } else if (gameType.value === 'phrases') {
    router.push(`/phrases/clear/${categoryId.value}/${stageId.value}`)
  } else if (gameType.value === 'core') {
    router.push(`/core-stages/clear/${stageId.value}`)
  } else if (gameType.value === 'core-substage') {
    router.push(`/core-substages/clear/${stageId.value}/${substageId.value}`)
  }
}

// 品質スコア計算ヘルパー
const calculateQuality = (accuracy: number): 1 | 2 | 3 | 4 | 5 => {
  if (accuracy >= 95) return 5
  if (accuracy >= 85) return 4
  if (accuracy >= 70) return 3
  if (accuracy >= 50) return 2
  return 1
}

const playAudio = () => {
  if (currentContent.value.english) {
    // Web Speech API を使用した音声読み上げ
    const utterance = new SpeechSynthesisUtterance(currentContent.value.english)
    utterance.lang = 'en-US'
    utterance.rate = 0.8 // 少しゆっくり読む
    utterance.pitch = 1.0
    speechSynthesis.speak(utterance)
    console.log('Playing audio for:', currentContent.value.english)
  }
}

const retry = () => {
  startGame()
}

const goToNext = () => {
  router.back()
}

// 初期化
// スペースキーでゲーム開始
const handleSpaceToStart = (event: KeyboardEvent) => {
  if (!gameStarted.value && event.code === 'Space') {
    event.preventDefault()
    startGame()
  }
}

onMounted(() => {
  // Prevent body scrolling when game is mounted
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  
  contentStore.initializeBasicContent()
  
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

.start-screen,
.complete-screen {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg); // 上下パディングを削減
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  max-height: 100%;
  overflow: auto; // 必要時のみスクロール
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
  padding: var(--spacing-sm); // Fixed small padding
  flex: 1;
  min-height: 0; // Critical for flex overflow
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  gap: 20px; // 50px → 20px に削減
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
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 10;
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

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
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