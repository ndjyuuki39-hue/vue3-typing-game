<template>
  <PrimaryButton
    v-bind="$attrs"
    variant="secondary"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :full-width="fullWidth"
  >
    <slot />
  </PrimaryButton>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@/types'
import PrimaryButton from './PrimaryButton.vue'

interface Props extends ButtonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
})
</script>