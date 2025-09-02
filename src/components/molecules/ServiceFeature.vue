<template>
  <div class="service-feature">
    <div class="feature-icon">
      {{ icon }}
    </div>
    <div class="feature-content">
      <h3 class="feature-title">
        {{ title }}
      </h3>
      <p class="feature-description">
        {{ description }}
      </p>
    </div>
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
.service-feature {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-cyan);
  }
}

.feature-icon {
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
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

// Mobile responsive
@media (max-width: 480px) {
  .service-feature {
    flex-direction: column;
    text-align: center;
  }
  
  .feature-icon {
    align-self: center;
  }
}
</style>