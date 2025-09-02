<template>
  <div class="feature-card">
    <div class="feature-icon">
      {{ icon }}
    </div>
    <h3 class="feature-title">
      {{ title }}
    </h3>
    <p class="feature-description">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.feature-card {
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-blue);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
  line-height: 1;
}

.feature-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.feature-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>