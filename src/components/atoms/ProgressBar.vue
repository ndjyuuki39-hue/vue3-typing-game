<template>
  <div :class="progressClasses">
    <div 
      class="progress-fill"
      :style="{ width: `${percentage}%` }"
    >
      <div class="progress-shine"></div>
    </div>
    <div v-if="showLabel" class="progress-label">
      {{ percentage }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressBarProps } from '@/types'

interface Props extends ProgressBarProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  variant: 'default',
  size: 'md',
  showLabel: false
})

const progressClasses = computed(() => [
  'progress-bar',
  `progress-bar--${props.variant}`,
  `progress-bar--${props.size}`,
  {
    'progress-bar--labeled': props.showLabel
  }
])

const percentage = computed(() => {
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100)
})
</script>

<style lang="scss" scoped>
.progress-bar {
  position: relative;
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    opacity: 0.8;
  }
}

.progress-shine {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 2s infinite;
}

.progress-label {
  position: absolute;
  top: 50%;
  right: var(--space-sm);
  transform: translateY(-50%);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

// Size variants
.progress-bar--sm {
  height: 8px;
  
  .progress-label {
    right: var(--space-xs);
    font-size: 10px;
  }
}

.progress-bar--md {
  height: 12px;
}

.progress-bar--lg {
  height: 20px;
  
  .progress-label {
    font-size: var(--text-sm);
  }
}

// Color variants
.progress-bar--default .progress-fill {
  background: linear-gradient(90deg, var(--accent-blue), var(--primary-cyan));
}

.progress-bar--success .progress-fill {
  background: linear-gradient(90deg, var(--accent-green), #10B981);
}

.progress-bar--warning .progress-fill {
  background: linear-gradient(90deg, var(--accent-orange), #F59E0B);
}

.progress-bar--error .progress-fill {
  background: linear-gradient(90deg, var(--accent-red), #EF4444);
}

// Animations
@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

// Labeled variant adjustments
.progress-bar--labeled {
  padding-right: var(--space-xl);
}
</style>