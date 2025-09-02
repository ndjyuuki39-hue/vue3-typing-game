<template>
  <div 
    class="quick-action-card" 
    :style="{ '--action-color': color }"
    @click="handleClick"
  >
    <div class="action-icon">
      {{ icon }}
    </div>
    <div class="action-content">
      <h3 class="action-title">{{ title }}</h3>
      <p class="action-description">{{ description }}</p>
    </div>
    <div class="action-arrow">
      <ArrowRightIcon />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowRightIcon from '@/components/atoms/ArrowRightIcon.vue'

interface Props {
  title: string
  description: string
  icon: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: 'var(--accent-blue)'
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = (): void => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.quick-action-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--action-color);
    
    .action-arrow {
      transform: translateX(4px);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.action-icon {
  font-size: 2rem;
  line-height: 1;
  color: var(--action-color);
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.action-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.action-arrow {
  color: var(--action-color);
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}

// Responsive
@media (max-width: 480px) {
  .quick-action-card {
    flex-direction: column;
    text-align: center;
    padding: var(--space-md);
  }
  
  .action-content {
    text-align: center;
  }
}
</style>