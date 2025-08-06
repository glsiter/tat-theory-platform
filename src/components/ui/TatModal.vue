<template>
  <Teleport to="body">
    <Transition
      name="modal"
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50" />
        
        <!-- Modal Content -->
        <Transition
          name="modal-content"
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="modelValue"
            :class="modalClasses"
            @click.stop
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="modal-header">
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </h3>
              </slot>
              <button
                v-if="closable"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                @click="close"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

export interface TatModalProps {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<TatModalProps>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalClasses = computed(() => {
  const baseClasses = [
    'relative',
    'bg-white',
    'rounded-lg',
    'shadow-xl',
    'max-h-[90vh]',
    'overflow-hidden',
    'flex',
    'flex-col'
  ]

  const sizeClasses = {
    sm: ['w-full', 'max-w-md', 'mx-4'],
    md: ['w-full', 'max-w-lg', 'mx-4'],
    lg: ['w-full', 'max-w-2xl', 'mx-4'],
    xl: ['w-full', 'max-w-4xl', 'mx-4'],
    full: ['w-full', 'h-full', 'm-4']
  }

  return [...baseClasses, ...sizeClasses[props.size]]
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Handle escape key
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.closable) {
        close()
      }
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-body {
  @apply flex-1 p-6 overflow-y-auto;
}

.modal-footer {
  @apply flex items-center justify-end gap-3 p-6 border-t border-gray-200;
}
</style>