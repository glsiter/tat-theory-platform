<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :style="buttonStyles"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'RouterLink' ? to : undefined"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="button-loading">
      <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>

    <!-- 图标 -->
    <span v-if="icon && !loading" class="button-icon" :class="iconPosition">
      <component :is="icon" class="w-4 h-4" />
    </span>

    <!-- 文本内容 -->
    <span v-if="$slots.default" class="button-text">
      <slot />
    </span>

    <!-- 触摸反馈 -->
    <div v-if="showTouchFeedback" class="touch-feedback" :style="touchFeedbackStyle" />
  </component>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { useResponsive } from '@/composables/useResponsive'
import { usePerformanceOptimization } from '@/composables/usePerformanceOptimization'

export interface AdaptiveButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tag?: 'button' | 'a' | 'RouterLink'
  type?: 'button' | 'submit' | 'reset'
  href?: string
  to?: string | object
  disabled?: boolean
  loading?: boolean
  icon?: Component
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  adaptiveSize?: boolean
  touchOptimized?: boolean
  ariaLabel?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<AdaptiveButtonProps>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  type: 'button',
  iconPosition: 'left',
  fullWidth: false,
  adaptiveSize: true,
  touchOptimized: true
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const { deviceInfo, isMobile } = useResponsive()
const { performanceConfig } = usePerformanceOptimization()

const showTouchFeedback = ref(false)
const touchFeedbackStyle = ref({})

// 自适应尺寸
const adaptiveSize = computed(() => {
  if (!props.adaptiveSize) return props.size
  
  if (isMobile.value) {
    const mobileMap = {
      xs: 'sm',
      sm: 'md',
      md: 'lg',
      lg: 'xl',
      xl: 'xl'
    }
    return mobileMap[props.size] || props.size
  }
  
  return props.size
})

// 按钮类名
const buttonClasses = computed(() => [
  'adaptive-button',
  `button-${props.variant}`,
  `button-${adaptiveSize.value}`,
  {
    'button-full-width': props.fullWidth,
    'button-loading': props.loading,
    'button-disabled': props.disabled,
    'button-touch-optimized': props.touchOptimized && deviceInfo.value.touchSupport,
    'button-with-icon': props.icon,
    'button-icon-only': props.icon && !props.$slots.default,
    'button-reduced-motion': !performanceConfig.value.enableAnimations
  }
])

// 按钮样式
const buttonStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  // 触摸设备优化
  if (deviceInfo.value.touchSupport && props.touchOptimized) {
    styles.minHeight = '44px'
    styles.minWidth = '44px'
  }
  
  return styles
})

// 处理点击事件
const handleClick = (event: Event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  
  emit('click', event)
}

// 处理触摸开始
const handleTouchStart = (event: TouchEvent) => {
  if (!deviceInfo.value.touchSupport || !performanceConfig.value.enableAnimations) return
  
  const touch = event.touches[0]
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  
  touchFeedbackStyle.value = {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'scale(0)',
    opacity: '0.3'
  }
  
  showTouchFeedback.value = true
  
  // 动画效果
  requestAnimationFrame(() => {
    touchFeedbackStyle.value = {
      ...touchFeedbackStyle.value,
      transform: 'scale(1)',
      opacity: '0'
    }
  })
}

// 处理触摸结束
const handleTouchEnd = () => {
  setTimeout(() => {
    showTouchFeedback.value = false
  }, 300)
}
</script>

<style scoped>
.adaptive-button {
  @apply relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  position: relative;
  overflow: hidden;
}

/* 变体样式 */
.button-primary {
  @apply bg-tat-blue-600 text-white hover:bg-tat-blue-700 focus:ring-tat-blue-500;
}

.button-secondary {
  @apply bg-tat-purple-600 text-white hover:bg-tat-purple-700 focus:ring-tat-purple-500;
}

.button-outline {
  @apply border-2 border-tat-blue-600 text-tat-blue-600 hover:bg-tat-blue-50 focus:ring-tat-blue-500;
}

.button-ghost {
  @apply text-gray-700 hover:bg-gray-100 focus:ring-gray-500;
}

.button-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}

/* 尺寸样式 */
.button-xs {
  @apply px-2 py-1 text-xs;
}

.button-sm {
  @apply px-3 py-1.5 text-sm;
}

.button-md {
  @apply px-4 py-2 text-base;
}

.button-lg {
  @apply px-6 py-3 text-lg;
}

.button-xl {
  @apply px-8 py-4 text-xl;
}

/* 全宽样式 */
.button-full-width {
  @apply w-full;
}

/* 加载状态 */
.button-loading {
  @apply cursor-wait;
}

.button-loading .button-text {
  @apply opacity-70;
}

/* 图标样式 */
.button-icon {
  @apply flex-shrink-0;
}

.button-icon.left {
  @apply mr-2;
}

.button-icon.right {
  @apply ml-2 order-2;
}

.button-icon-only {
  @apply p-2;
}

.button-icon-only .button-icon {
  @apply m-0;
}

/* 触摸优化 */
.button-touch-optimized {
  @apply min-h-[44px] min-w-[44px];
}

/* 触摸反馈 */
.touch-feedback {
  @apply absolute w-8 h-8 bg-white rounded-full pointer-events-none;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

/* 性能优化 */
.button-reduced-motion {
  @apply transition-none;
}

.button-reduced-motion .touch-feedback {
  display: none;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .button-ghost {
    @apply text-gray-300 hover:bg-gray-800;
  }
  
  .button-outline {
    @apply border-tat-blue-400 text-tat-blue-400 hover:bg-tat-blue-900;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .adaptive-button {
    @apply border-2 border-current;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .adaptive-button {
    @apply transition-none;
  }
  
  .touch-feedback {
    display: none;
  }
}

/* 移动端特定样式 */
@media (max-width: 640px) {
  .adaptive-button {
    @apply min-h-[44px];
  }
  
  .button-xs {
    @apply px-3 py-2 text-sm;
  }
  
  .button-sm {
    @apply px-4 py-2.5 text-base;
  }
  
  .button-md {
    @apply px-5 py-3 text-base;
  }
}

/* 焦点可见性 */
.adaptive-button:focus-visible {
  @apply ring-2 ring-offset-2;
}

/* 活动状态 */
.adaptive-button:active {
  @apply transform scale-95;
}

.button-reduced-motion:active {
  @apply transform-none;
}
</style>