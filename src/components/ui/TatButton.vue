<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    @click="handleClick"
  >
    <slot name="icon-left" />
    <span v-if="$slots.default" class="button-text">
      <slot />
    </span>
    <slot name="icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TatButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<TatButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-primary-600',
      'text-white',
      'hover:bg-primary-700',
      'focus:ring-primary-500',
      'shadow-sm'
    ],
    secondary: [
      'bg-secondary-600',
      'text-white',
      'hover:bg-secondary-700',
      'focus:ring-secondary-500',
      'shadow-sm'
    ],
    outline: [
      'border',
      'border-gray-300',
      'bg-white',
      'text-gray-700',
      'hover:bg-gray-50',
      'focus:ring-primary-500'
    ],
    ghost: [
      'text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-primary-500'
    ],
    danger: [
      'bg-error-600',
      'text-white',
      'hover:bg-error-700',
      'focus:ring-error-500',
      'shadow-sm'
    ]
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant]
  ]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.button-text {
  @apply flex items-center gap-2;
}
</style>