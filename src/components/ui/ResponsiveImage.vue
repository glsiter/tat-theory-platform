<template>
  <div class="responsive-image-container" :style="containerStyles">
    <img
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :class="imageClasses"
      :style="imageStyles"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    
    <!-- 加载占位符 -->
    <div v-if="isLoading" class="image-placeholder">
      <div class="placeholder-shimmer" />
      <div class="placeholder-icon">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    
    <!-- 错误状态 -->
    <div v-if="hasError" class="image-error">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm text-gray-500 mt-2">图片加载失败</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useResponsive } from '@/composables/useResponsive'
import { usePerformanceOptimization } from '@/composables/usePerformanceOptimization'

export interface ResponsiveImageProps {
  src: string
  alt: string
  sizes?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  aspectRatio?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  lazyLoad?: boolean
  placeholder?: string
  fallback?: string
  quality?: 'low' | 'medium' | 'high' | 'auto'
}

const props = withDefaults(defineProps<ResponsiveImageProps>(), {
  aspectRatio: 'auto',
  objectFit: 'cover',
  lazyLoad: true,
  quality: 'auto'
})

const { deviceInfo, isMobile, isTablet, isDesktop } = useResponsive()
const { performanceConfig, getOptimalImageSrc } = usePerformanceOptimization()

const imageRef = ref<HTMLImageElement>()
const isLoading = ref(true)
const hasError = ref(false)

// 根据设备和性能选择最佳图片源
const currentSrc = computed(() => {
  if (props.quality === 'auto') {
    return getOptimalImageSrc(props.src, ['small', 'medium', 'large'])
  }
  
  const qualityMap = {
    low: 'small',
    medium: 'medium',
    high: 'large'
  }
  
  const quality = qualityMap[props.quality]
  return props.src.replace(/\.(jpg|jpeg|png|webp)$/i, `_${quality}.$1`)
})

// 容器样式
const containerStyles = computed(() => ({
  aspectRatio: props.aspectRatio !== 'auto' ? props.aspectRatio : undefined,
  position: 'relative' as const,
  overflow: 'hidden' as const
}))

// 图片类名
const imageClasses = computed(() => [
  'responsive-image',
  {
    'image-loaded': !isLoading.value && !hasError.value,
    'image-loading': isLoading.value,
    'image-error': hasError.value
  }
])

// 图片样式
const imageStyles = computed(() => ({
  objectFit: props.objectFit,
  width: '100%',
  height: '100%',
  transition: performanceConfig.value.enableAnimations ? 'opacity 0.3s ease' : 'none'
}))

// 处理图片加载完成
const handleImageLoad = () => {
  isLoading.value = false
  hasError.value = false
}

// 处理图片加载错误
const handleImageError = () => {
  isLoading.value = false
  hasError.value = true
  
  // 尝试加载备用图片
  if (props.fallback && imageRef.value) {
    imageRef.value.src = props.fallback
  }
}

onMounted(() => {
  // 如果不支持懒加载，立即开始加载
  if (!props.lazyLoad) {
    isLoading.value = true
  }
})
</script>

<style scoped>
.responsive-image-container {
  @apply relative bg-gray-100 rounded-lg overflow-hidden;
}

.responsive-image {
  @apply w-full h-full object-cover transition-opacity duration-300;
}

.image-loading {
  @apply opacity-0;
}

.image-loaded {
  @apply opacity-100;
}

.image-error {
  @apply opacity-50;
}

.image-placeholder {
  @apply absolute inset-0 flex items-center justify-center bg-gray-100;
}

.placeholder-shimmer {
  @apply absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100;
  animation: shimmer 2s infinite;
}

.placeholder-icon {
  @apply relative z-10;
}

.image-error {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-gray-50;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 性能优化：低性能设备禁用动画 */
.performance-low .responsive-image,
.performance-low .placeholder-shimmer {
  transition: none;
  animation: none;
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .responsive-image,
  .placeholder-shimmer {
    transition: none;
    animation: none;
  }
}
</style>