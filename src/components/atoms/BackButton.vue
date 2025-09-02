<template>
  <IconButton
    @click="handleBack"
    :aria-label="t('navigation.back')"
    variant="ghost"
    size="md"
  >
    <ArrowLeftIcon />
  </IconButton>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import IconButton from './IconButton.vue'
import ArrowLeftIcon from './ArrowLeftIcon.vue'

const router = useRouter()
const { t } = useI18n()

const handleBack = (): void => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/home')
  }
}
</script>