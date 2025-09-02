<template>
  <header class="page-header">
    <div class="header-content">
      <h1 class="page-title">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="page-subtitle">
        {{ subtitle }}
      </p>
    </div>
    
    <div v-if="$slots.actions" class="header-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid var(--border-color);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.6;
}

.header-actions {
  flex-shrink: 0;
}

// Responsive
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
  }
  
  .page-title {
    font-size: var(--text-2xl);
  }
  
  .page-subtitle {
    font-size: var(--text-base);
  }
  
  .header-actions {
    align-self: stretch;
  }
}
</style>