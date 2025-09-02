<template>
  <div class="phrase-stages-page">
    <PageHeader :title="categoryTitle" :showBack="true" />
    
    <div class="content-container">
      <div class="category-info">
        <div class="category-icon">{{ categoryIcon }}</div>
        <h2>{{ categoryTitle }}</h2>
        <p>{{ categoryDescription }}</p>
        <div class="category-stats">
          <span>{{ t('phrases.stats.totalPhrases') }}: {{ t('phrases.stages.totalPhrasesFormat', { count: totalPhrases }) }}</span>
          <span>{{ t('phrases.stats.progress') }}: {{ t('phrases.stages.progressFormat', { completed: completedStages, total: totalStages }) }}</span>
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
            <h3 class="stage-title">{{ t('phrases.stages.stageTitle') }} {{ stage.id }}</h3>
            <p class="stage-description">{{ stage.phraseCount }}{{ t('phrases.stages.phrasesCount') }}</p>
            
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
                <span class="stat-label">{{ t('phrases.stats.bestWPM') }}</span>
                <span class="stat-value">{{ getStageStats(stage.id).bestWPM || '-' }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">{{ t('phrases.stats.accuracy') }}</span>
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

interface PhraseStage {
  id: number
  phraseCount: number
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const contentStore = useContentStore()

// URLパラメータからカテゴリを取得
const categoryId = computed(() => String(route.params.category) || 'daily')

const categoryInfo = computed(() => {
  const categories = {
    daily: {
      title: '日常会話',
      description: '挨拶や感情表現など、毎日使える基本フレーズ',
      icon: '☕'
    },
    business: {
      title: 'ビジネス',
      description: '会議・プレゼン・メールで使うフレーズ',
      icon: '💼'
    },
    travel: {
      title: '旅行',
      description: '空港・ホテル・観光で役立つフレーズ',
      icon: '✈️'
    },
    restaurant: {
      title: 'レストラン',
      description: '注文・支払いで使うフレーズ',
      icon: '🍽️'
    },
    shopping: {
      title: 'ショッピング',
      description: '買い物・価格交渉のフレーズ',
      icon: '🛍️'
    },
    emergency: {
      title: '病院・緊急時',
      description: '症状説明・緊急連絡のフレーズ',
      icon: '🏥'
    }
  }
  return categories[categoryId.value] || categories.daily
})

const categoryTitle = computed(() => categoryInfo.value.title)
const categoryDescription = computed(() => categoryInfo.value.description)
const categoryIcon = computed(() => categoryInfo.value.icon)

// このカテゴリのフレーズ数
const totalPhrases = computed(() => {
  return contentStore.getPhrasesByCategory(categoryId.value).length
})

// ステージ設定（5フレーズずつステージ分け）
const stages = computed(() => {
  const phrasesPerStage = 5
  const stageCount = Math.ceil(totalPhrases.value / phrasesPerStage)
  return Array.from({ length: stageCount }, (_, i) => ({
    id: i + 1,
    phraseCount: Math.min(phrasesPerStage, totalPhrases.value - i * phrasesPerStage)
  }))
})

const totalStages = computed(() => stages.value.length)

// 進捗管理
const completedStages = computed(() => {
  const key = `phraseCategory_${categoryId.value}`
  return userStore.progress.phrases[key]?.completedStages?.length || 0
})

const isStageUnlocked = (stageId: number): boolean => {
  if (stageId === 1) return true
  const key = `phraseCategory_${categoryId.value}`
  const progress = userStore.progress.phrases[key]
  return progress?.completedStages?.includes(stageId - 1) || false
}

const isStageCompleted = (stageId: number): boolean => {
  const key = `phraseCategory_${categoryId.value}`
  const progress = userStore.progress.phrases[key]
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
  const key = `phraseCategory_${categoryId.value}`
  const progress = userStore.progress.phrases[key]
  if (progress?.currentStage === stageId) return 50
  return 0
}

const getStageStats = (stageId: number) => {
  const key = `phraseCategory_${categoryId.value}`
  const progress = userStore.progress.phrases[key]
  return {
    bestWPM: progress?.stageBestWpm?.[stageId] || 0,
    accuracy: progress?.stageBestAccuracy?.[stageId] || 0
  }
}

const handleStageClick = (stage: PhraseStage) => {
  if (!isStageUnlocked(stage.id)) {
    return
  }
  
  // ゲーム画面へ遷移（フレーズモード）
  router.push(`/phrases/game/${categoryId.value}/${stage.id}`)
}

onMounted(() => {
  contentStore.initializePhrasesContent()
})
</script>

<style lang="scss" scoped>
.phrase-stages-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.category-info {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  text-align: center;

  .category-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
  }

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

  .category-stats {
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
    border-color: var(--accent-purple);
  }

  &--completed {
    border-color: var(--accent-green);
    background: linear-gradient(135deg, 
      var(--bg-secondary) 0%, 
      rgba(var(--accent-green-rgb), 0.05) 100%);
  }

  &--current {
    border-color: var(--accent-purple);
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
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
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
    color: var(--accent-purple);
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
    border-color: var(--accent-purple);
  }
  50% {
    border-color: var(--accent-pink);
  }
}

@media (max-width: 768px) {
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>