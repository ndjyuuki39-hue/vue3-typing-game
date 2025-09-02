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
        </div>
        
        <div class="progress-summary" v-if="showProgressSummary">
          <h3 class="summary-title">{{ t('clear.overallProgress') }}</h3>
          <ProgressBar :value="overallProgress" :showLabel="true" variant="success" />
          <p class="summary-text">
            {{ t('clear.progressText', { progress: Math.round(overallProgress) }) }}
          </p>
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
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const userStore = useUserStore()

// ルートパラメータ取得
const stageId = computed(() => Number(route.params['stage']) || 1)
const levelId = computed(() => Number(route.params['level']) || 1)  
const categoryId = computed(() => String(route.params['category']) || 'daily')

const gameType = computed(() => {
  const path = route.path
  if (path.includes('basic')) return 'basic'
  if (path.includes('words')) return 'words'
  if (path.includes('phrases')) return 'phrases'
  return 'general'
})

const showProgressSummary = computed(() => gameType.value !== 'basic')

const overallProgress = computed(() => {
  switch (gameType.value) {
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

const goToHome = () => {
  router.push('/home')
}

const continueJourney = () => {
  switch (gameType.value) {
    case 'basic':
      router.push('/basic-typing')
      break
    case 'words':
      router.push(`/words/${levelId.value}`)
      break
    case 'phrases':
      router.push(`/phrases/${categoryId.value}`)
      break
    default:
      router.push('/home')
  }
}

// ステージクリア時の処理
const handleStageCompletion = () => {
  console.log('🏆 Clear.vue handleStageCompletion called')
  console.log('Game type:', gameType.value)
  console.log('Stage ID:', stageId.value)
  
  const wpm = gameStore.lastWPM || 0
  const accuracy = gameStore.lastAccuracy || 0
  
  if (gameType.value === 'basic') {
    // 基本タイピングステージクリア処理
    const currentStage = stageId.value
    console.log('Game stats:', { currentStage, wpm, accuracy })
    
    // ユーザー進捗を更新（次のステージアンロック）
    userStore.completeBasicStage(currentStage, wpm, accuracy)
    
    console.log(`🎯 ステージ${currentStage}クリア！次のステージ: ${userStore.progress.basicTyping.currentStage}`)
  } else if (gameType.value === 'words') {
    // 英単語ステージクリア処理
    const level = levelId.value
    const stage = stageId.value
    console.log('Word game stats:', { level, stage, wpm, accuracy })
    
    // ユーザー進捗を更新
    userStore.completeWordStage(level, stage, wpm, accuracy)
    
    console.log(`🎯 英単語 レベル${level} ステージ${stage}クリア！`)
  } else if (gameType.value === 'phrases') {
    // 英語フレーズステージクリア処理
    const category = categoryId.value
    const stage = stageId.value
    console.log('Phrase game stats:', { category, stage, wpm, accuracy })
    
    // ユーザー進捗を更新
    userStore.completePhraseStage(category, stage, wpm, accuracy)
    
    console.log(`🎯 英語フレーズ ${category} ステージ${stage}クリア！`)
  }
}

// コンポーネントマウント時にステージクリア処理を実行
onMounted(() => {
  handleStageCompletion()
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