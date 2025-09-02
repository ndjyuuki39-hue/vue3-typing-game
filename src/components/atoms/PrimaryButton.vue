<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <LoadingSpinner v-if="loading" size="sm" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from '@/types'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
})

const buttonClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--disabled': props.disabled,
    'btn--loading': props.loading,
    'btn--full-width': props.fullWidth
  }
])
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--accent-blue);
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }
  
  &:hover::before {
    opacity: 1;
  }
}

// Variants
.btn--primary {
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--primary-cyan) 100%);
  color: white;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
}

.btn--secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--accent-blue);
  }
}

.btn--accent {
  background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%);
  color: white;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
}

.btn--outline {
  background: transparent;
  color: var(--accent-blue);
  border: 2px solid var(--accent-blue);
  
  &:hover {
    background: var(--accent-blue);
    color: white;
  }
}

.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

// Sizes
.btn--sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--text-sm);
  border-radius: var(--border-radius-sm);
}

.btn--md {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-base);
}

.btn--lg {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-lg);
  border-radius: var(--border-radius-lg);
}

.btn--xl {
  padding: var(--space-lg) var(--space-xl);
  font-size: var(--text-xl);
  font-weight: 600;
  border-radius: var(--border-radius-lg);
}

// States
.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
  
  &::before {
    display: none;
  }
}

.btn--loading {
  cursor: wait;
  
  &:hover {
    transform: none;
  }
}

.btn--full-width {
  width: 100%;
}
</style>