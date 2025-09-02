<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="close-icon"
  >
    <path
      d="M18 6L6 18"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  strokeWidth?: number
}

withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 2
})
</script>

<style lang="scss" scoped>
.close-icon {
  display: inline-block;
  vertical-align: middle;
  transition: transform var(--transition-fast);
}

.close-icon:hover {
  transform: scale(1.1);
}
</style>