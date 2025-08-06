<template>
  <svg
    :class="iconClasses"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TatIconProps {
  size?: number | string
  color?: string
  viewBox?: string
}

const props = withDefaults(defineProps<TatIconProps>(), {
  size: 24,
  color: 'currentColor',
  viewBox: '0 0 24 24'
})

const iconClasses = computed(() => [
  'inline-block',
  'flex-shrink-0'
])
</script>

<style scoped>
svg {
  color: v-bind(color);
}
</style>