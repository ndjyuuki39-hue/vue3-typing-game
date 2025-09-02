<template>
  <div 
    :class="cardClasses" 
    @click="handleClick"
  >
    <!-- Header -->
    <div class="card-header">
      <div class="card-icon">
        {{ icon }}
      </div>
      <div class="card-info">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-description">{{ description }}</p>
      </div>
      <div v-if="$slots.badge" class="card-badge">
        <slot name="badge" />
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="progress !== undefined" class="progress-section">
      <ProgressBar 
        :value="progress" 
        :variant="progressVariant"
        show-label
      />
    </div>

    <!-- Stats -->
    <div v-if="stats" class="stats-section">
      <div 
        v-for="(value, key) in stats" 
        :key="key" 
        class="stat-item"
      >
        <span class="stat-label">{{ formatStatLabel(key) }}</span>
        <span class="stat-value">{{ value }}</span>
      </div>
    </div>

    <!-- Action Button -->
    <div v-if="$slots.action" class="action-section">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'

interface Props {
  title: string
  description: string
  icon: string
  progress?: number
  stats?: Record<string, string | number>
  variant?: 'primary' | 'secondary' | 'accent'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  clickable: true
})

const emit = defineEmits<{
  click: []
}>()

const cardClasses = computed(() => [
  'learning-card',
  `learning-card--${props.variant}`,
  {
    'learning-card--clickable': props.clickable
  }
])

const progressVariant = computed(() => {
  if (props.progress === undefined) return 'default'
  if (props.progress >= 80) return 'success'
  if (props.progress >= 50) return 'default'
  return 'warning'
})

const handleClick = (): void => {
  if (props.clickable) {
    emit('click')
  }
}

const formatStatLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    stages: 'ステージ',
    progress: '進捗',
    words: '英単語',
    phrases: '英語フレーズ',
    level: 'レベル',
    category: 'カテゴリー'
  }
  return labelMap[key] || key
}
</script>

<style lang="scss" scoped>
.learning-card {
  padding: var(--space-xl);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  border: 2px solid var(--border-color);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &--clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--accent-color);
      
      &::before {
        opacity: 1;
      }
    }
    
    &:active {
      transform: translateY(-2px);
    }
  }
}

// Variants
.learning-card--primary {
  --accent-color: var(--accent-blue);
}

.learning-card--secondary {
  --accent-color: var(--accent-green);
}

.learning-card--accent {
  --accent-color: var(--accent-purple);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.card-icon {
  font-size: 3rem;
  line-height: 1;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.card-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

.card-badge {
  flex-shrink: 0;
}

.progress-section {
  margin-bottom: var(--space-lg);
}

.stats-section {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 80px;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--accent-color);
}

.action-section {
  margin-top: auto;
}

// Responsive
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stats-section {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .learning-card {
    padding: var(--space-lg);
  }
  
  .card-icon {
    font-size: 2.5rem;
  }
  
  .card-title {
    font-size: var(--text-lg);
  }
}
</style>