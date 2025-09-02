<template>
  <div class="stats-card">
    <div class="stats-icon">
      {{ icon }}
    </div>
    <div class="stats-content">
      <div class="stats-value">
        {{ value }}
        <span v-if="suffix" class="stats-suffix">{{ suffix }}</span>
      </div>
      <div class="stats-title">{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  suffix?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.stats-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-blue);
  }
}

.stats-icon {
  font-size: 2rem;
  line-height: 1;
  opacity: 0.8;
}

.stats-content {
  flex: 1;
  min-width: 0;
}

.stats-value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
}

.stats-suffix {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.stats-title {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

// Responsive
@media (max-width: 480px) {
  .stats-card {
    flex-direction: column;
    text-align: center;
    padding: var(--space-md);
  }
  
  .stats-content {
    text-align: center;
  }
}
</style>