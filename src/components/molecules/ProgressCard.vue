<template>
  <div class="progress-card">
    <div class="progress-header">
      <h3 class="progress-title">{{ title }}</h3>
      <div class="progress-percentage">{{ percentage }}%</div>
    </div>
    <div class="progress-body">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>
      <div class="progress-stats">
        <span class="progress-current">{{ current }}</span>
        <span class="progress-separator">/</span>
        <span class="progress-total">{{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  current: number
  total: number
  percentage: number
}

defineProps<Props>()
</script>

<style lang="scss" scoped>

.progress-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  max-width: 300px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.progress-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.progress-percentage {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--accent-purple);
}

.progress-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: var(--border-color);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink));
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.progress-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  gap: var(--spacing-xs);
}

.progress-current {
  font-weight: 600;
  color: var(--text-primary);
}

.progress-separator {
  color: var(--text-tertiary);
}

.progress-total {
  color: var(--text-tertiary);
}
</style>