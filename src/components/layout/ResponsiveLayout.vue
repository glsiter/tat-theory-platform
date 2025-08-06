<template>
  <div :class="layoutClasses" :style="layoutStyles">
    <!-- Mobile Header -->
    <header v-if="isMobile" class="mobile-header">
      <div class="mobile-header-content">
        <button 
          @click="toggleMobileSidebar"
          class="mobile-menu-toggle"
          :aria-label="showMobileSidebar ? '关闭菜单' : '打开菜单'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!showMobileSidebar"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        
        <div class="mobile-header-title">
          <slot name="mobile-title">TAT理论平台</slot>
        </div>
        
        <div class="mobile-header-actions">
          <slot name="mobile-actions" />
        </div>
      </div>
    </header>

    <!-- Desktop/Tablet Header -->
    <header v-else-if="$slots.header" class="desktop-header">
      <slot name="header" />
    </header>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <!-- Sidebar -->
      <aside 
        v-if="$slots.sidebar" 
        :class="sidebarClasses"
        :style="sidebarStyles"
      >
        <!-- Mobile Sidebar Overlay -->
        <div 
          v-if="isMobile && showMobileSidebar"
          class="mobile-sidebar-overlay"
          @click="closeMobileSidebar"
        />
        
        <!-- Sidebar Content -->
        <div class="sidebar-content">
          <slot name="sidebar" />
        </div>
      </aside>

      <!-- Main Content -->
      <main :class="mainClasses" :style="mainStyles">
        <div class="main-content">
          <slot />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer v-if="$slots.footer" class="layout-footer">
      <slot name="footer" />
    </footer>

    <!-- Touch Gesture Indicators -->
    <div v-if="showGestureHints && deviceInfo.touchSupport" class="gesture-hints">
      <div class="gesture-hint" v-if="canSwipeBack">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>滑动返回</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useResponsive } from '@/composables/useResponsive'
import { useTouchGestures } from '@/composables/useTouchGestures'
import { usePerformanceOptimization } from '@/composables/usePerformanceOptimization'

export interface ResponsiveLayoutProps {
  sidebarWidth?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  headerHeight?: {
    mobile?: string
    desktop?: string
  }
  enableGestures?: boolean
  showGestureHints?: boolean
  adaptiveSpacing?: boolean
  performanceMode?: 'auto' | 'high' | 'balanced' | 'battery'
}

const props = withDefaults(defineProps<ResponsiveLayoutProps>(), {
  sidebarWidth: () => ({
    mobile: '280px',
    tablet: '240px', 
    desktop: '320px'
  }),
  headerHeight: () => ({
    mobile: '56px',
    desktop: '64px'
  }),
  enableGestures: true,
  showGestureHints: false,
  adaptiveSpacing: true,
  performanceMode: 'auto'
})

const emit = defineEmits<{
  sidebarToggle: [isOpen: boolean]
  gestureDetected: [gesture: string]
  layoutChange: [layout: string]
}>()

const { deviceInfo, isMobile, isTablet, isDesktop } = useResponsive()
const { performanceConfig, shouldUseReducedMotion } = usePerformanceOptimization()

const showMobileSidebar = ref(false)
const layoutContainer = ref<HTMLElement | null>(null)
const canSwipeBack = ref(false)

// 触摸手势设置
const { onSwipe } = useTouchGestures(layoutContainer, {
  threshold: 50,
  velocity: 0.3,
  preventScroll: false
})

// 布局类名
const layoutClasses = computed(() => [
  'responsive-layout',
  `device-${deviceInfo.value.type}`,
  `orientation-${deviceInfo.value.orientation}`,
  `performance-${deviceInfo.value.performanceLevel}`,
  {
    'mobile-sidebar-open': isMobile.value && showMobileSidebar.value,
    'reduced-motion': shouldUseReducedMotion.value,
    'adaptive-spacing': props.adaptiveSpacing,
    'touch-device': deviceInfo.value.touchSupport
  }
])

// 布局样式
const layoutStyles = computed(() => ({
  '--mobile-header-height': props.headerHeight.mobile,
  '--desktop-header-height': props.headerHeight.desktop,
  '--mobile-sidebar-width': props.sidebarWidth.mobile,
  '--tablet-sidebar-width': props.sidebarWidth.tablet,
  '--desktop-sidebar-width': props.sidebarWidth.desktop,
  '--device-width': `${deviceInfo.value.width}px`,
  '--device-height': `${deviceInfo.value.height}px`
}))

// 侧边栏类名
const sidebarClasses = computed(() => [
  'layout-sidebar',
  {
    'sidebar-mobile': isMobile.value,
    'sidebar-tablet': isTablet.value,
    'sidebar-desktop': isDesktop.value,
    'sidebar-open': isMobile.value ? showMobileSidebar.value : true
  }
])

// 侧边栏样式
const sidebarStyles = computed(() => {
  if (isMobile.value) {
    return {
      transform: showMobileSidebar.value ? 'translateX(0)' : 'translateX(-100%)',
      width: props.sidebarWidth.mobile
    }
  } else if (isTablet.value) {
    return {
      width: props.sidebarWidth.tablet
    }
  } else {
    return {
      width: props.sidebarWidth.desktop
    }
  }
})

// 主内容类名
const mainClasses = computed(() => [
  'layout-main',
  {
    'main-with-sidebar': !!props.sidebarWidth,
    'main-mobile': isMobile.value,
    'main-tablet': isTablet.value,
    'main-desktop': isDesktop.value
  }
])

// 获取当前组件实例
const instance = getCurrentInstance()

// 主内容样式
const mainStyles = computed(() => {
  const styles: Record<string, string> = {}  
  // 只有当侧边栏存在且不是移动设备时才设置marginLeft
  if (!isMobile.value && props.sidebarWidth && instance?.slots.sidebar) {
    const sidebarWidth = isTablet.value 
      ? props.sidebarWidth.tablet 
      : props.sidebarWidth.desktop
    styles.marginLeft = sidebarWidth || '0'
  } else {
    // 否则让内容居中
    styles.marginLeft = 'auto'
    styles.marginRight = 'auto'
  }  
  return styles
})

// 切换移动端侧边栏
const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
  emit('sidebarToggle', showMobileSidebar.value)
}

// 关闭移动端侧边栏
const closeMobileSidebar = () => {
  showMobileSidebar.value = false
  emit('sidebarToggle', false)
}

// 处理手势
if (props.enableGestures) {
  onSwipe.value = (gesture) => {
    emit('gestureDetected', gesture.direction)
    
    if (isMobile.value) {
      switch (gesture.direction) {
        case 'right':
          if (!showMobileSidebar.value && gesture.distance > 100) {
            toggleMobileSidebar()
          }
          break
        case 'left':
          if (showMobileSidebar.value) {
            closeMobileSidebar()
          }
          break
      }
    }
  }
}

// 监听设备变化
const handleDeviceChange = () => {
  if (!isMobile.value && showMobileSidebar.value) {
    showMobileSidebar.value = false
  }
  
  emit('layoutChange', deviceInfo.value.type)
}

// 键盘导航支持
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showMobileSidebar.value) {
    closeMobileSidebar()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  
  // 检测是否可以滑动返回（基于路由历史）
  canSwipeBack.value = window.history.length > 1
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.responsive-layout {
  @apply min-h-screen bg-gray-50 flex flex-col;
  --transition-duration: 0.3s;
}

.responsive-layout.reduced-motion {
  --transition-duration: 0s;
}

/* Mobile Header */
.mobile-header {
  @apply bg-white border-b border-gray-200 sticky top-0 z-50;
  height: var(--mobile-header-height);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}

.mobile-header-content {
  @apply flex items-center justify-between h-full px-4;
}

.mobile-menu-toggle {
  @apply p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors;
  transition-duration: var(--transition-duration);
}

.mobile-header-title {
  @apply font-semibold text-gray-900 text-lg;
}

.mobile-header-actions {
  @apply flex items-center gap-2;
}

/* Desktop Header */
.desktop-header {
  @apply bg-white border-b border-gray-200 sticky top-0 z-40;
  height: var(--desktop-header-height);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}

/* Main Wrapper */
.main-wrapper {
  @apply flex flex-1 overflow-hidden;
}

/* Sidebar */
.layout-sidebar {
  @apply bg-white border-r border-gray-200 flex-shrink-0;
  transition: transform var(--transition-duration) ease-in-out;
}

.sidebar-mobile {
  @apply fixed top-0 left-0 h-full z-40;
  padding-top: var(--mobile-header-height);
}

.sidebar-tablet,
.sidebar-desktop {
  @apply relative;
}

.mobile-sidebar-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-30;
  backdrop-filter: blur(2px);
}

.sidebar-content {
  @apply h-full overflow-y-auto;
}

/* Main Content */
.layout-main {
  @apply flex-1 overflow-auto;
  transition: margin-left var(--transition-duration) ease-in-out;
}

.main-content {
  @apply min-h-full;
}

.main-mobile .main-content {
  @apply p-4;
}

.main-tablet .main-content {
  @apply p-6;
}

.main-desktop .main-content {
  @apply p-8;
}

/* Adaptive Spacing */
.adaptive-spacing .main-content {
  @apply space-y-4 md:space-y-6 lg:space-y-8;
}

/* Footer */
.layout-footer {
  @apply bg-white border-t border-gray-200 mt-auto;
}

/* Gesture Hints */
.gesture-hints {
  @apply fixed bottom-4 left-4 z-50 pointer-events-none;
}

.gesture-hint {
  @apply flex items-center gap-2 bg-black bg-opacity-75 text-white text-sm px-3 py-2 rounded-full;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;
}

/* Touch Device Optimizations */
.touch-device .mobile-menu-toggle {
  @apply min-w-[44px] min-h-[44px];
}

.touch-device button,
.touch-device a {
  @apply min-h-[44px];
}

/* Performance Optimizations */
.performance-low * {
  @apply transition-none;
}

.performance-low .layout-sidebar {
  transition: none;
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  .mobile-header,
  .desktop-header,
  .layout-sidebar {
    @apply border-gray-900;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .responsive-layout {
    --transition-duration: 0s;
  }
  
  .gesture-hint {
    animation: none;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .responsive-layout {
    @apply bg-gray-900;
  }
  
  .mobile-header,
  .desktop-header,
  .layout-sidebar {
    @apply bg-gray-800 border-gray-700;
  }
  
  .mobile-header-title {
    @apply text-white;
  }
  
  .mobile-menu-toggle {
    @apply text-gray-300 hover:text-white hover:bg-gray-700;
  }
}

/* Landscape Orientation Adjustments */
@media (orientation: landscape) and (max-height: 600px) {
  .main-content {
    @apply py-2;
  }
}

/* Print Styles */
@media print {
  .mobile-header,
  .desktop-header,
  .layout-sidebar,
  .gesture-hints {
    @apply hidden;
  }
  
  .layout-main {
    @apply m-0;
  }
}
</style>