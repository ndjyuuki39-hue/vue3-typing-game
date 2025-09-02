<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="app-logo"
  >
    <!-- Background circle -->
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="url(#gradient1)"
      stroke="url(#gradient2)"
      stroke-width="2"
    />
    
    <!-- Keyboard keys representation -->
    <rect x="8" y="12" width="4" height="3" rx="1" fill="white" opacity="0.9" />
    <rect x="13" y="12" width="4" height="3" rx="1" fill="white" opacity="0.9" />
    <rect x="18" y="12" width="4" height="3" rx="1" fill="white" opacity="0.9" />
    
    <!-- Typing indicator dots -->
    <circle cx="10" cy="20" r="1" fill="white" opacity="0.8">
      <animate
        attributeName="opacity"
        values="0.3;1;0.3"
        dur="1.5s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
    <circle cx="16" cy="20" r="1" fill="white" opacity="0.8">
      <animate
        attributeName="opacity"
        values="0.3;1;0.3"
        dur="1.5s"
        repeatCount="indefinite"
        begin="0.5s"
      />
    </circle>
    <circle cx="22" cy="20" r="1" fill="white" opacity="0.8">
      <animate
        attributeName="opacity"
        values="0.3;1;0.3"
        dur="1.5s"
        repeatCount="indefinite"
        begin="1s"
      />
    </circle>
    
    <!-- Gradients -->
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--accent-blue)" />
        <stop offset="100%" stop-color="var(--primary-cyan)" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--primary-cyan)" />
        <stop offset="100%" stop-color="var(--accent-purple)" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
}

withDefaults(defineProps<Props>(), {
  size: 32
})
</script>

<style lang="scss" scoped>
.app-logo {
  display: inline-block;
  vertical-align: middle;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
</style>