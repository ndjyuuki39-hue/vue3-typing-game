<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  round?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  round: true
})

const buttonClasses = computed(() => [
  'icon-button',
  `icon-button--${props.variant}`,
  `icon-button--${props.size}`,
  {
    'icon-button--disabled': props.disabled,
    'icon-button--round': props.round
  }
])
</script>

<style lang="scss" scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    transition: opacity var(--transition-fast);
  }
  
  &:hover::before {
    opacity: 0.1;
  }
  
  &:active::before {
    opacity: 0.2;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--accent-blue);
  }
}

// Variants
.icon-button--default {
  &:hover {
    color: var(--text-primary);
  }
}

.icon-button--primary {
  color: var(--accent-blue);
  
  &:hover {
    color: var(--primary-cyan);
  }
}

.icon-button--secondary {
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--accent-blue);
  }
}

.icon-button--ghost {
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
    background: var(--bg-secondary);
  }
}

.icon-button--outline {
  color: var(--accent-blue);
  border: 1px solid var(--accent-blue);
  
  &:hover {
    background: var(--accent-blue);
    color: white;
  }
}

// Sizes
.icon-button--sm {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.icon-button--md {
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.icon-button--lg {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

// Shape
.icon-button--round {
  border-radius: 50%;
}

.icon-button:not(.icon-button--round) {
  border-radius: var(--border-radius-md);
}

// States
.icon-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  
  &:hover::before {
    opacity: 0;
  }
}
</style>