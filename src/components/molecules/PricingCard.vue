<template>
  <div :class="cardClasses">
    <!-- Highlight Badge -->
    <div v-if="highlight" class="highlight-badge">
      おすすめ
    </div>
    
    <!-- Current Badge -->
    <div v-if="current" class="current-badge">
      現在のプラン
    </div>
    
    <!-- Header -->
    <div class="pricing-header">
      <h3 class="plan-title">{{ title }}</h3>
      <div class="plan-price">
        <span class="price">{{ price }}</span>
        <span v-if="period" class="period">{{ period }}</span>
      </div>
    </div>
    
    <!-- Features List -->
    <ul class="features-list">
      <li v-for="feature in features" :key="feature" class="feature-item">
        <CheckIcon class="check-icon" />
        <span>{{ feature }}</span>
      </li>
    </ul>
    
    <!-- CTA Button -->
    <div class="cta-section">
      <PrimaryButton
        v-if="!current && !comingSoon"
        :variant="highlight ? 'primary' : 'outline'"
        full-width
        size="lg"
        @click="selectPlan"
      >
        プランを選択
      </PrimaryButton>
      <SecondaryButton
        v-else-if="current"
        full-width
        size="lg"
        disabled
      >
        現在のプラン
      </SecondaryButton>
      <SecondaryButton
        v-else
        full-width
        size="lg"
        disabled
      >
        近日公開
      </SecondaryButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PrimaryButton from '@/components/atoms/PrimaryButton.vue'
import SecondaryButton from '@/components/atoms/SecondaryButton.vue'
import CheckIcon from '@/components/atoms/CheckIcon.vue'

interface Props {
  title: string
  price: string
  period?: string
  features: string[]
  highlight?: boolean
  current?: boolean
  comingSoon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  highlight: false,
  current: false,
  comingSoon: false
})

const emit = defineEmits<{
  select: []
}>()

const cardClasses = computed(() => [
  'pricing-card',
  {
    'pricing-card--highlight': props.highlight,
    'pricing-card--current': props.current
  }
])

const selectPlan = (): void => {
  emit('select')
}
</script>

<style lang="scss" scoped>
.pricing-card {
  position: relative;
  padding: var(--space-xl);
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
  
  &--highlight {
    border-color: var(--accent-blue);
    background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(59, 130, 246, 0.05) 100%);
    transform: scale(1.05);
    
    &:hover {
      transform: scale(1.05) translateY(-4px);
    }
  }
  
  &--current {
    border-color: var(--accent-green);
    background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(16, 185, 129, 0.05) 100%);
  }
}

.highlight-badge,
.current-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius-lg);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.highlight-badge {
  background: var(--accent-blue);
  color: white;
}

.current-badge {
  background: var(--accent-green);
  color: white;
}

.pricing-header {
  text-align: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.plan-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-xs);
}

.price {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--accent-blue);
  line-height: 1;
}

.period {
  font-size: var(--text-lg);
  color: var(--text-secondary);
}

.features-list {
  list-style: none;
  margin-bottom: var(--space-xl);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
}

.check-icon {
  color: var(--accent-green);
  flex-shrink: 0;
}

.cta-section {
  margin-top: auto;
}
</style>