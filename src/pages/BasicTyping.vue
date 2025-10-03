<template>
  <div class="basic-typing-page">
    <div class="page-header-wrapper">
      <PageHeader :title="t('basicTyping.title')" :showBack="true" />
    </div>
    
    <div class="content-container">
      <div class="stage-grid">
        <div
          v-for="stage in stages"
          :key="stage.stage"
          class="stage-card"
          :class="{
            'stage-card--locked': !isStageUnlocked(stage.stage),
            'stage-card--completed': isStageCompleted(stage.stage),
            'stage-card--current': isCurrentStage(stage.stage)
          }"
          @click="handleStageClick(stage)"
        >
          <div class="stage-header">
            <div class="stage-number">{{ stage.stage }}</div>
            <div class="stage-status">
              <CheckIcon v-if="isStageCompleted(stage.stage)" class="status-icon completed" />
              <LockIcon v-else-if="!isStageUnlocked(stage.stage)" class="status-icon locked" />
              <PlayIcon v-else class="status-icon available" />
            </div>
          </div>
          
          <div class="stage-content">
            <h3 class="stage-title">{{ t(`basicTyping.stages.stage${stage.stage}.title`) }}</h3>
            <p class="stage-description">{{ t(`basicTyping.stages.stage${stage.stage}.description`) }}</p>
            
            <div class="stage-keys">
              <span v-for="key in stage.targetKeys" :key="key" class="key-badge">
                {{ key }}
              </span>
            </div>
            
            <div class="stage-progress">
              <ProgressBar 
                :value="getStageProgress(stage.stage)" 
                :showLabel="true"
                size="sm"
              />
            </div>
          </div>
          
          <div class="stage-footer">
            <div class="stage-stats">
              <div class="stat">
                <span class="stat-label">{{ t('basicTyping.bestWPM') }}</span>
                <span class="stat-value">{{ getStageStats(stage.stage).bestWPM || '-' }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">{{ t('basicTyping.accuracy') }}</span>
                <span class="stat-value">{{ getStageStats(stage.stage).accuracy || '-' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="page-footer">
        <div class="overall-progress">
          <h3 class="progress-title">{{ t('basicTyping.overallProgress') }}</h3>
          <ProgressBar 
            :value="overallProgress" 
            :showLabel="true"
            variant="success"
          />
          <p class="progress-text">
            {{ t('basicTyping.stagesCompleted', { 
              completed: completedStages, 
              total: totalStages 
            }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useContentStore } from '@/stores/content'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import LockIcon from '@/components/atoms/LockIcon.vue'
import PlayIcon from '@/components/atoms/PlayIcon.vue'
import type { BasicStage } from '@/types'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const contentStore = useContentStore()

// 12段階のステージデータ
const stages = computed<BasicStage[]>(() => contentStore.basicStages)

// ステージのロック状態を確認
const isStageUnlocked = (stageId: number): boolean => {
  if (stageId === 1) return true
  // 前のステージが完了していればアンロック
  return userStore.progress.basicTyping.completedStages.includes(stageId - 1)
}

// ステージの完了状態を確認
const isStageCompleted = (stageId: number): boolean => {
  return userStore.progress.basicTyping.completedStages.includes(stageId)
}

// 現在のステージかどうか
const isCurrentStage = (stageId: number): boolean => {
  if (!isStageUnlocked(stageId)) return false
  if (isStageCompleted(stageId)) return false
  
  // 前のステージが全て完了していて、このステージが未完了
  for (let i = 1; i < stageId; i++) {
    if (!isStageCompleted(i)) return false
  }
  return true
}

// ステージの進捗を取得
const getStageProgress = (stageId: number): number => {
  if (isStageCompleted(stageId)) return 100
  if (stageId === userStore.progress.basicTyping.currentStage) {
    // 現在のステージは進行中として50%表示
    return 50
  }
  return 0
}

// ステージの統計情報を取得
const getStageStats = (stageId: number) => {
  const basicTyping = userStore.progress.basicTyping
  return {
    bestWPM: basicTyping.bestWpm[stageId] || 0,
    accuracy: basicTyping.bestAccuracy[stageId] || 0
  }
}

// 全体の進捗
const completedStages = computed(() => {
  return userStore.progress.basicTyping.completedStages.length
})

const totalStages = computed(() => stages.value.length)

const overallProgress = computed(() => {
  return (completedStages.value / totalStages.value) * 100
})

// ステージクリック処理
const handleStageClick = (stage: BasicStage) => {
  if (!isStageUnlocked(stage.stage)) {
    // ロックされているステージ
    return
  }
  
  // Gameページへ遷移（基本タイピングモード）
  router.push(`/game/basic/${stage.stage}`)
}

// デバッグ用: マウント時に進捗データを表示
onMounted(() => {
  console.log('📋 BasicTyping.vue mounted')
  console.log('Progress data:', userStore.progress.basicTyping)
})
</script>

<style lang="scss" scoped>
.basic-typing-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.stage-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--bg-tertiary);
    transition: background var(--transition-base);
  }

  &:hover:not(.stage-card--locked) {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-blue);

    &::before {
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
    }
  }

  &--completed {
    border-color: var(--accent-green);

    &::before {
      background: var(--accent-green);
    }
  }

  &--current {
    border-color: var(--accent-blue);
    animation: pulse 2s infinite;

    &::before {
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
      animation: shimmer 2s infinite;
    }
  }

  &--locked {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.stage-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: 700;
  color: white;
}

.status-icon {
  width: 24px;
  height: 24px;

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
  margin-bottom: var(--spacing-lg);
}

.stage-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.stage-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
}

.stage-keys {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.key-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: 600;
}

.stage-progress {
  margin-top: var(--spacing-md);
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  display: block;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.page-footer {
  margin-top: var(--spacing-3xl);
}

.overall-progress {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  text-align: center;
}

.progress-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.progress-text {
  margin-top: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

// アニメーション
@keyframes pulse {
  0%, 100% {
    border-color: var(--accent-blue);
  }
  50% {
    border-color: var(--accent-purple);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .content-container {
    padding: var(--spacing-lg);
  }

  .stage-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

// Page header wrapper for consistent layout
.page-header-wrapper {
  .page-header {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md) var(--space-md);
  }
}
</style>