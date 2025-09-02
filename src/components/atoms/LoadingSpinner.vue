<template>
  <div :class="spinnerClasses">
    <div class="spinner-ring"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor'
})

const spinnerClasses = computed(() => [
  'loading-spinner',
  `loading-spinner--${props.size}`
])
</script>

<style lang="scss" scoped>
.loading-spinner {
  display: inline-block;
  position: relative;
}

.spinner-ring {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid v-bind(color);
  animation: spin 1s linear infinite;
}

// Size variants
.loading-spinner--xs .spinner-ring {
  width: 12px;
  height: 12px;
  border-width: 1px;
}

.loading-spinner--sm .spinner-ring {
  width: 16px;
  height: 16px;
  border-width: 1.5px;
}

.loading-spinner--md .spinner-ring {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.loading-spinner--lg .spinner-ring {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.loading-spinner--xl .spinner-ring {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>