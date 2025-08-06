<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TatCardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<TatCardProps>(), {
  variant: 'default',
  padding: 'md',
  rounded: 'md',
  shadow: 'sm',
  hover: false
})

const cardClasses = computed(() => {
  const baseClasses = ['bg-white', 'transition-all', 'duration-200']

  // Variant classes
  const variantClasses = {
    default: ['border', 'border-gray-200'],
    elevated: ['shadow-md'],
    outlined: ['border-2', 'border-primary-200'],
    filled: ['bg-gray-50', 'border', 'border-gray-100']
  }

  // Padding classes
  const paddingClasses = {
    none: [],
    sm: ['p-3'],
    md: ['p-6'],
    lg: ['p-8']
  }

  // Rounded classes
  const roundedClasses = {
    none: [],
    sm: ['rounded-sm'],
    md: ['rounded-md'],
    lg: ['rounded-lg'],
    xl: ['rounded-xl']
  }

  // Shadow classes
  const shadowClasses = {
    none: [],
    sm: ['shadow-sm'],
    md: ['shadow-md'],
    lg: ['shadow-lg']
  }

  // Hover classes
  const hoverClasses = props.hover
    ? ['hover:shadow-lg', 'hover:-translate-y-1', 'cursor-pointer']
    : []

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...paddingClasses[props.padding],
    ...roundedClasses[props.rounded],
    ...shadowClasses[props.shadow],
    ...hoverClasses
  ]
})
</script>

<style scoped>
.card-header {
  @apply border-b border-gray-200 pb-4 mb-4;
}

.card-footer {
  @apply border-t border-gray-200 pt-4 mt-4;
}

.card-body {
  @apply flex-1;
}
</style>