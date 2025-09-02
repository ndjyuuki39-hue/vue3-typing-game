<template>
  <div class="phrase-category-page">
    <PageHeader title="英語フレーズカテゴリー選択" :showBack="true" />
    
    <div class="content-container">
      <div class="category-intro">
        <h2>{{ t('phrases.categorySelection.title') }}</h2>
        <p>{{ t('phrases.categorySelection.description') }}</p>
      </div>

      <div class="category-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          :class="{
            'category-card--locked': !isCategoryUnlocked(category.id),
            'category-card--completed': isCategoryCompleted(category.id),
            'category-card--current': isCurrentCategory(category.id)
          }"
          @click="handleCategoryClick(category)"
        >
          <div class="category-header">
            <div class="category-icon">{{ category.icon }}</div>
            <div class="category-status">
              <CheckIcon v-if="isCategoryCompleted(category.id)" class="status-icon completed" />
              <LockIcon v-else-if="!isCategoryUnlocked(category.id)" class="status-icon locked" />
              <PlayIcon v-else class="status-icon available" />
            </div>
          </div>
          
          <div class="category-content">
            <h3 class="category-title">{{ category.title }}</h3>
            <p class="category-description">{{ category.description }}</p>
            
            <div class="category-stats">
              <div class="stat-item">
                <span class="stat-label">{{ t('phrases.stats.phraseCount') }}</span>
                <span class="stat-value">{{ category.phraseCount }}個</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('phrases.stats.progress') }}</span>
                <span class="stat-value">{{ getCategoryProgress(category.id) }}%</span>
              </div>
            </div>

            <div class="category-progress">
              <ProgressBar 
                :value="getCategoryProgress(category.id)" 
                :showLabel="false"
                size="sm"
              />
            </div>
          </div>
          
          <div class="category-footer">
            <div class="category-performance">
              <div class="performance-stat">
                <span class="performance-label">{{ t('phrases.stats.bestWPM') }}</span>
                <span class="performance-value">{{ getCategoryStats(category.id).bestWPM || '-' }}</span>
              </div>
              <div class="performance-stat">
                <span class="performance-label">{{ t('phrases.stats.accuracy') }}</span>
                <span class="performance-value">{{ getCategoryStats(category.id).accuracy || '-' }}%</span>
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

interface PhraseCategoryInfo {
  id: string
  title: string
  description: string
  icon: string
  phraseCount: number
}

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const contentStore = useContentStore()

const categories = computed(() => [
  {
    id: 'daily',
    title: t('phrases.categories.daily.title'),
    description: t('phrases.categories.daily.description'),
    icon: '☕',
    phraseCount: contentStore.getPhrasesByCategory('daily').length
  },
  {
    id: 'business',
    title: t('phrases.categories.business.title'),
    description: t('phrases.categories.business.description'),
    icon: '💼',
    phraseCount: contentStore.getPhrasesByCategory('business').length
  },
  {
    id: 'travel',
    title: t('phrases.categories.travel.title'),
    description: t('phrases.categories.travel.description'),
    icon: '✈️',
    phraseCount: contentStore.getPhrasesByCategory('travel').length
  },
  {
    id: 'restaurant',
    title: t('phrases.categories.restaurant.title'),
    description: t('phrases.categories.restaurant.description'),
    icon: '🍽️',
    phraseCount: contentStore.getPhrasesByCategory('restaurant').length
  },
  {
    id: 'shopping',
    title: t('phrases.categories.shopping.title'),
    description: t('phrases.categories.shopping.description'),
    icon: '🛍️',
    phraseCount: contentStore.getPhrasesByCategory('shopping').length
  },
  {
    id: 'emergency',
    title: t('phrases.categories.emergency.title'),
    description: t('phrases.categories.emergency.description'),
    icon: '🏥',
    phraseCount: contentStore.getPhrasesByCategory('emergency').length
  }
])

const isCategoryUnlocked = (categoryId: string): boolean => {
  if (categoryId === 'daily') return true
  const categoryOrder = ['daily', 'business', 'travel', 'restaurant', 'shopping', 'emergency']
  const currentIndex = categoryOrder.indexOf(categoryId)
  if (currentIndex === -1) return false
  
  const previousCategory = categoryOrder[currentIndex - 1]
  return userStore.progress.phrases.completedCategories.includes(previousCategory)
}

const isCategoryCompleted = (categoryId: string): boolean => {
  return userStore.progress.phrases.completedCategories.includes(categoryId)
}

const isCurrentCategory = (categoryId: string): boolean => {
  if (!isCategoryUnlocked(categoryId)) return false
  if (isCategoryCompleted(categoryId)) return false
  
  const categoryOrder = ['daily', 'business', 'travel', 'restaurant', 'shopping', 'emergency']
  const currentIndex = categoryOrder.indexOf(categoryId)
  if (currentIndex === -1) return false
  
  for (let i = 0; i < currentIndex; i++) {
    if (!isCategoryCompleted(categoryOrder[i])) return false
  }
  return true
}

const getCategoryProgress = (categoryId: string): number => {
  const key = `phraseCategory_${categoryId}`
  const progress = userStore.progress.phrases[key]
  
  if (!progress) return 0
  
  const totalPhrases = contentStore.getPhrasesByCategory(categoryId).length
  const totalStages = Math.ceil(totalPhrases / 5) // 5フレーズずつステージ分け
  const completedStages = progress.completedStages?.length || 0
  
  return Math.round((completedStages / totalStages) * 100)
}

const getCategoryStats = (categoryId: string) => {
  const key = `phraseCategory_${categoryId}`
  const progress = userStore.progress.phrases[key]
  
  if (!progress) return { bestWPM: 0, accuracy: 0 }
  
  const bestWPMs = Object.values(progress.stageBestWpm || {})
  const accuracies = Object.values(progress.stageBestAccuracy || {})
  
  return {
    bestWPM: bestWPMs.length > 0 ? Math.max(...bestWPMs) : 0,
    accuracy: accuracies.length > 0 ? Math.max(...accuracies) : 0
  }
}

const handleCategoryClick = (category: PhraseCategoryInfo) => {
  if (!isCategoryUnlocked(category.id)) {
    return
  }
  
  router.push(`/phrases/${category.id}`)
}

onMounted(() => {
  contentStore.initializePhrasesContent()
})
</script>

<style lang="scss" scoped>
.phrase-category-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.category-intro {
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

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  
  &:hover:not(.category-card--locked) {
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

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.category-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
  border-radius: var(--radius-md);
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
    color: var(--accent-purple);
  }
}

.category-content {
  margin-bottom: var(--spacing-lg);
}

.category-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.category-description {
  font-size: var(--text-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.category-stats {
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

.category-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.category-performance {
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
    border-color: var(--accent-purple);
  }
  50% {
    border-color: var(--accent-pink);
  }
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>