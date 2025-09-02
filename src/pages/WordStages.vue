<template>
  <div class="word-stages-page">
    <PageHeader :title="levelTitle" :showBack="true" />
    
    <div class="content-container">
      <div class="level-info">
        <h2>{{ levelTitle }}</h2>
        <p>{{ levelDescription }}</p>
        <div class="level-stats">
          <span>{{ t('words.stats.totalWords') }}: {{ t('words.stages.totalWordsFormat', { count: totalWords }) }}</span>
          <span>{{ t('words.stats.progress') }}: {{ t('words.stages.progressFormat', { completed: completedStages, total: totalStages }) }}</span>
        </div>
      </div>

      <div class="stage-grid">
        <div
          v-for="stage in stages"
          :key="stage.id"
          class="stage-card"
          :class="{
            'stage-card--locked': !isStageUnlocked(stage.id),
            'stage-card--completed': isStageCompleted(stage.id),
            'stage-card--current': isCurrentStage(stage.id)
          }"
          @click="handleStageClick(stage)"
        >
          <div class="stage-header">
            <div class="stage-number">{{ stage.id }}</div>
            <div class="stage-status">
              <CheckIcon v-if="isStageCompleted(stage.id)" class="status-icon completed" />
              <LockIcon v-else-if="!isStageUnlocked(stage.id)" class="status-icon locked" />
              <PlayIcon v-else class="status-icon available" />
            </div>
          </div>
          
          <div class="stage-content">
            <h3 class="stage-title">{{ t('words.stages.stageTitle') }} {{ stage.id }}</h3>
            <p class="stage-description">{{ stage.wordCount }}{{ t('words.stages.wordsCount') }}</p>
            
            <div class="stage-progress">
              <ProgressBar 
                :value="getStageProgress(stage.id)" 
                :showLabel="true"
                size="sm"
              />
            </div>
          </div>
          
          <div class="stage-footer">
            <div class="stage-stats">
              <div class="stat">
                <span class="stat-label">{{ t('words.stats.bestWPM') }}</span>
                <span class="stat-value">{{ getStageStats(stage.id).bestWPM || '-' }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">{{ t('words.stats.accuracy') }}</span>
                <span class="stat-value">{{ getStageStats(stage.id).accuracy || '-' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useContentStore } from '@/stores/content'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import LockIcon from '@/components/atoms/LockIcon.vue'
import PlayIcon from '@/components/atoms/PlayIcon.vue'

interface WordStage {
  id: number
  wordCount: number
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const contentStore = useContentStore()

// URLパラメータからレベルを取得
const levelId = computed(() => Number(route.params.level) || 1)

const levelTitle = computed(() => {
  switch(levelId.value) {
    case 1: return 'レベル1 - 初級'
    case 2: return 'レベル2 - 中級'
    case 3: return 'レベル3 - 上級'
    default: return 'レベル1 - 初級'
  }
})

const levelDescription = computed(() => {
  switch(levelId.value) {
    case 1: return '日常的な基本単語を学習します'
    case 2: return '実用的な一般単語を学習します'
    case 3: return 'ビジネス・学術単語を学習します'
    default: return ''
  }
})

// このレベルの単語数
const totalWords = computed(() => {
  return contentStore.getWordsByLevel(levelId.value).length
})

// ステージ設定（10単語ずつステージ分け）
const stages = computed(() => {
  const wordsPerStage = 10
  const stageCount = Math.ceil(totalWords.value / wordsPerStage)
  return Array.from({ length: stageCount }, (_, i) => ({
    id: i + 1,
    wordCount: Math.min(wordsPerStage, totalWords.value - i * wordsPerStage)
  }))
})

const totalStages = computed(() => stages.value.length)

// 進捗管理
const completedStages = computed(() => {
  const key = `wordLevel${levelId.value}`
  return userStore.progress.words[key]?.completedStages?.length || 0
})

const isStageUnlocked = (stageId: number): boolean => {
  if (stageId === 1) return true
  const key = `wordLevel${levelId.value}`
  const progress = userStore.progress.words[key]
  
  // デバッグ用ログ
  console.log(`🔍 isStageUnlocked(${stageId}): key=${key}`, progress)
  console.log(`🔍 completedStages:`, progress?.completedStages)
  console.log(`🔍 looking for stage ${stageId - 1}:`, progress?.completedStages?.includes(stageId - 1))
  
  return progress?.completedStages?.includes(stageId - 1) || false
}

const isStageCompleted = (stageId: number): boolean => {
  const key = `wordLevel${levelId.value}`
  const progress = userStore.progress.words[key]
  return progress?.completedStages?.includes(stageId) || false
}

const isCurrentStage = (stageId: number): boolean => {
  if (!isStageUnlocked(stageId)) return false
  if (isStageCompleted(stageId)) return false
  
  for (let i = 1; i < stageId; i++) {
    if (!isStageCompleted(i)) return false
  }
  return true
}

const getStageProgress = (stageId: number): number => {
  if (isStageCompleted(stageId)) return 100
  const key = `wordLevel${levelId.value}`
  const progress = userStore.progress.words[key]
  if (progress?.currentStage === stageId) return 50
  return 0
}

const getStageStats = (stageId: number) => {
  const key = `wordLevel${levelId.value}`
  const progress = userStore.progress.words[key]
  return {
    bestWPM: progress?.stageBestWpm?.[stageId] || 0,
    accuracy: progress?.stageBestAccuracy?.[stageId] || 0
  }
}

const handleStageClick = (stage: WordStage) => {
  if (!isStageUnlocked(stage.id)) {
    return
  }
  
  // ゲーム画面へ遷移（英単語モード）
  router.push(`/words/game/${levelId.value}/${stage.id}`)
}

onMounted(() => {
  contentStore.initializeWordsContent()
})
</script>

<style lang="scss" scoped>
.word-stages-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.level-info {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  text-align: center;

  h2 {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }

  p {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
  }

  .level-stats {
    display: flex;
    justify-content: center;
    gap: var(--spacing-2xl);
    font-size: var(--text-md);
    color: var(--text-tertiary);

    span {
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
    }
  }
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.stage-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  
  &:hover:not(.stage-card--locked) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-blue);
  }

  &--completed {
    border-color: var(--accent-green);
    background: linear-gradient(135deg, 
      var(--bg-secondary) 0%, 
      rgba(var(--accent-green-rgb), 0.05) 100%);
  }

  &--current {
    border-color: var(--accent-blue);
    animation: pulse 2s infinite;
  }

  &--locked {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.stage-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-md);
  font-weight: 700;
  color: white;
}

.status-icon {
  width: 20px;
  height: 20px;

  &.completed {
    color: var(--accent-green);
  }

  &.locked {
    color: var(--text-tertiary);
  }

  &.available {
    color: var(--accent-blue);
  }
}

.stage-content {
  margin-bottom: var(--spacing-md);
}

.stage-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.stage-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.stage-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.stage-stats {
  display: flex;
  justify-content: space-around;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  display: block;
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--text-primary);
}

@keyframes pulse {
  0%, 100% {
    border-color: var(--accent-blue);
  }
  50% {
    border-color: var(--accent-purple);
  }
}

@media (max-width: 768px) {
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>