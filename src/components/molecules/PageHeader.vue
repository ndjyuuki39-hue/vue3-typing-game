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
  margin-bottom: 0; // 下マージンを削除して均等に
  padding-bottom: var(--space-sm); // パディングを最小限に
  border-bottom: 2px solid var(--border-color);
  flex-shrink: 0; // 縮小を防ぐ
  min-height: 60px; // 最小高さを設定
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0; // 上下マージンを削除して均等に
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