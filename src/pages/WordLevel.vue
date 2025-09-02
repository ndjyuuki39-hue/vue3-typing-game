<template>
  <div class="word-level-page">
    <PageHeader title="英単語レベル選択" :showBack="true" />
    
    <div class="content-container">
      <div class="level-intro">
        <h2>{{ t('words.levelSelection.title') }}</h2>
        <p>{{ t('words.levelSelection.description') }}</p>
      </div>

      <div class="level-grid">
        <div
          v-for="level in levels"
          :key="level.id"
          class="level-card"
          :class="{
            'level-card--locked': !isLevelUnlocked(level.id),
            'level-card--completed': isLevelCompleted(level.id),
            'level-card--current': isCurrentLevel(level.id)
          }"
          @click="handleLevelClick(level)"
        >
          <div class="level-header">
            <div class="level-number">{{ level.id }}</div>
            <div class="level-status">
              <CheckIcon v-if="isLevelCompleted(level.id)" class="status-icon completed" />
              <LockIcon v-else-if="!isLevelUnlocked(level.id)" class="status-icon locked" />
              <PlayIcon v-else class="status-icon available" />
            </div>
          </div>
          
          <div class="level-content">
            <h3 class="level-title">{{ level.title }}</h3>
            <p class="level-description">{{ level.description }}</p>
            
            <div class="level-stats">
              <div class="stat-item">
                <span class="stat-label">{{ t('words.stats.wordCount') }}</span>
                <span class="stat-value">{{ level.wordCount }}個</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('words.stats.progress') }}</span>
                <span class="stat-value">{{ getLevelProgress(level.id) }}%</span>
              </div>
            </div>

            <div class="level-progress">
              <ProgressBar 
                :value="getLevelProgress(level.id)" 
                :showLabel="false"
                size="sm"
              />
            </div>
          </div>
          
          <div class="level-footer">
            <div class="level-performance">
              <div class="performance-stat">
                <span class="performance-label">{{ t('words.stats.bestWPM') }}</span>
                <span class="performance-value">{{ getLevelStats(level.id).bestWPM || '-' }}</span>
              </div>
              <div class="performance-stat">
                <span class="performance-label">{{ t('words.stats.accuracy') }}</span>
                <span class="performance-value">{{ getLevelStats(level.id).accuracy || '-' }}%</span>
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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useContentStore } from '@/stores/content'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'
import LockIcon from '@/components/atoms/LockIcon.vue'
import PlayIcon from '@/components/atoms/PlayIcon.vue'

interface WordLevelInfo {
  id: number
  title: string
  description: string
  wordCount: number
}

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const contentStore = useContentStore()

const levels = computed(() => [
  {
    id: 1,
    title: t('words.levels.level1.title'),
    description: t('words.levels.level1.description'),
    wordCount: contentStore.getWordsByLevel(1).length
  },
  {
    id: 2,
    title: t('words.levels.level2.title'),
    description: t('words.levels.level2.description'),
    wordCount: contentStore.getWordsByLevel(2).length
  },
  {
    id: 3,
    title: t('words.levels.level3.title'),
    description: t('words.levels.level3.description'),
    wordCount: contentStore.getWordsByLevel(3).length
  }
])

const isLevelUnlocked = (levelId: number): boolean => {
  if (levelId === 1) return true
  return userStore.progress.words.completedLevels.includes(levelId - 1)
}

const isLevelCompleted = (levelId: number): boolean => {
  return userStore.progress.words.completedLevels.includes(levelId)
}

const isCurrentLevel = (levelId: number): boolean => {
  if (!isLevelUnlocked(levelId)) return false
  if (isLevelCompleted(levelId)) return false
  
  for (let i = 1; i < levelId; i++) {
    if (!isLevelCompleted(i)) return false
  }
  return true
}

const getLevelProgress = (levelId: number): number => {
  const key = `wordLevel${levelId}`
  const progress = userStore.progress.words[key]
  
  if (!progress) return 0
  
  const totalStages = Math.ceil(contentStore.getWordsByLevel(levelId).length / 10)
  const completedStages = progress.completedStages?.length || 0
  
  return Math.round((completedStages / totalStages) * 100)
}

const getLevelStats = (levelId: number) => {
  const key = `wordLevel${levelId}`
  const progress = userStore.progress.words[key]
  
  if (!progress) return { bestWPM: 0, accuracy: 0 }
  
  const bestWPMs = Object.values(progress.stageBestWpm || {})
  const accuracies = Object.values(progress.stageBestAccuracy || {})
  
  return {
    bestWPM: bestWPMs.length > 0 ? Math.max(...bestWPMs) : 0,
    accuracy: accuracies.length > 0 ? Math.max(...accuracies) : 0
  }
}

const handleLevelClick = (level: WordLevelInfo) => {
  if (!isLevelUnlocked(level.id)) {
    return
  }
  
  router.push(`/words/${level.id}`)
}

onMounted(() => {
  contentStore.initializeWordsContent()
})
</script>

<style lang="scss" scoped>
.word-level-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.level-intro {
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
  }
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.level-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  
  &:hover:not(.level-card--locked) {
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

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.level-number {
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

.level-content {
  margin-bottom: var(--spacing-lg);
}

.level-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.level-description {
  font-size: var(--text-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.level-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  display: block;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.level-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.level-performance {
  display: flex;
  justify-content: space-around;
}

.performance-stat {
  text-align: center;
}

.performance-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.performance-value {
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
  .level-grid {
    grid-template-columns: 1fr;
  }
}
</style>