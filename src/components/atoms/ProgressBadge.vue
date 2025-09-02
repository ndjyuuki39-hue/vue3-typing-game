<template>
  <div :class="badgeClasses">
    <span class="progress-value">{{ displayValue }}</span>
    <span class="progress-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  max?: number
  label?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  showPercentage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  label: '',
  variant: 'default',
  showPercentage: true
})

const badgeClasses = computed(() => [
  'progress-badge',
  `progress-badge--${props.variant}`
])

const displayValue = computed(() => {
  if (props.showPercentage) {
    const percentage = Math.round((props.value / props.max) * 100)
    return `${percentage}%`
  }
  return props.value.toString()
})
</script>

<style lang="scss" scoped>
.progress-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-lg);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-value {
  font-weight: 700;
}

.progress-label {
  opacity: 0.8;
}

// Variants
.progress-badge--default {
  background: var(--accent-blue);
  color: white;
}

.progress-badge--success {
  background: var(--accent-green);
  color: white;
}

.progress-badge--warning {
  background: var(--accent-orange);
  color: white;
}

.progress-badge--error {
  background: var(--accent-red);
  color: white;
}
</style>