<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TatContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  center?: boolean
}

const props = withDefaults(defineProps<TatContainerProps>(), {
  size: 'lg',
  padding: 'md',
  center: true
})

const containerClasses = computed(() => {
  const baseClasses = ['w-full']

  // Size classes
  const sizeClasses = {
    sm: ['max-w-2xl'],
    md: ['max-w-4xl'],
    lg: ['max-w-6xl'],
    xl: ['max-w-7xl'],
    full: ['max-w-none']
  }

  // Padding classes
  const paddingClasses = {
    none: [],
    sm: ['px-4', 'py-2'],
    md: ['px-6', 'py-4'],
    lg: ['px-8', 'py-6']
  }

  // Center classes
  const centerClasses = props.center ? ['mx-auto'] : []

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...paddingClasses[props.padding],
    ...centerClasses
  ]
})
</script>