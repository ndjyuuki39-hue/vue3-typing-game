<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="play-icon"
  >
    <path
      d="M5 3L19 12L5 21V3Z"
      fill="currentColor"
      stroke="currentColor"
      :stroke-width="strokeWidth"
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
.play-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>