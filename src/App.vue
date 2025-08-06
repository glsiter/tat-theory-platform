<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import ResponsiveLayout from './components/layout/ResponsiveLayout.vue'
import AppNavigation from './components/layout/AppNavigation.vue'
import { useResponsive } from './composables/useResponsive'
import { usePerformanceOptimization } from './composables/usePerformanceOptimization'

const { deviceInfo, isMobile } = useResponsive()
const { performanceConfig } = usePerformanceOptimization()

const showSidebar = ref(false)

const handleSidebarToggle = (isOpen: boolean) => {
  showSidebar.value = isOpen
}

const handleGestureDetected = (gesture: string) => {
  console.log('Gesture detected:', gesture)
}

const handleLayoutChange = (layout: string) => {
  console.log('Layout changed to:', layout)
}

onMounted(() => {
  // 设置CSS自定义属性用于响应式设计
  document.documentElement.style.setProperty('--device-width', `${deviceInfo.value.width}px`)
  document.documentElement.style.setProperty('--device-height', `${deviceInfo.value.height}px`)
  document.documentElement.style.setProperty('--device-pixel-ratio', deviceInfo.value.pixelRatio.toString())
  
  // 根据设备性能调整动画
  if (!performanceConfig.value.enableAnimations) {
    document.documentElement.classList.add('reduce-animations')
  }
  
  // 添加设备类型类名
  document.documentElement.classList.add(`device-${deviceInfo.value.type}`)
  
  if (deviceInfo.value.touchSupport) {
    document.documentElement.classList.add('touch-device')
  }
})
</script>

<template>
  <ResponsiveLayout
    :sidebar-width="{
      mobile: '280px',
      tablet: '240px',
      desktop: '320px'
    }"
    :header-height="{
      mobile: '56px',
      desktop: '64px'
    }"
    :enable-gestures="true"
    :show-gesture-hints="isMobile"
    :adaptive-spacing="true"
    performance-mode="auto"
    @sidebar-toggle="handleSidebarToggle"
    @gesture-detected="handleGestureDetected"
    @layout-change="handleLayoutChange"
  >
    <!-- Header -->
    <template #header>
      <AppNavigation />
    </template>

    <!-- Mobile Title -->
    <template #mobile-title>
      TAT理论平台
    </template>

    <!-- Mobile Actions -->
    <template #mobile-actions>
      <button class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </template>

    <!-- Sidebar (for future navigation) -->
    <template #sidebar v-if="false">
      <nav class="p-4">
        <div class="space-y-2">
          <RouterLink to="/" class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            首页
          </RouterLink>
          <RouterLink to="/theory-learning" class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            理论学习
          </RouterLink>
          <RouterLink to="/mind-map-test" class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            思维导图
          </RouterLink>
          <RouterLink to="/structural-equation" class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            结构方程
          </RouterLink>
        </div>
      </nav>
    </template>

    <!-- Main Content -->
    <RouterView />

    <!-- Footer -->
    <template #footer>
      <div class="text-center text-sm text-gray-500 py-4">
        <p>&copy; 2024 TAT理论学习平台. 专注于特质激发理论的深度学习与应用.</p>
      </div>
    </template>
  </ResponsiveLayout>
</template>

<style>
/* 全局重置和基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
  line-height: 1.6;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  color: #111827;
  background-color: #f9fafb;
  overflow-x: hidden;
}

/* 响应式字体大小 */
html {
  font-size: 16px;
}

@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 18px;
  }
}

/* 性能优化类 */
.reduce-animations * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* 触摸设备优化 */
.touch-device {
  -webkit-tap-highlight-color: transparent;
}

.touch-device button,
.touch-device a,
.touch-device [role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* 设备特定样式 */
.device-mobile {
  --base-spacing: 1rem;
  --content-padding: 1rem;
}

.device-tablet {
  --base-spacing: 1.5rem;
  --content-padding: 1.5rem;
}

.device-desktop {
  --base-spacing: 2rem;
  --content-padding: 2rem;
}

/* 高对比度支持 */
@media (prefers-contrast: high) {
  body {
    background-color: white;
    color: black;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #111827;
    color: #f9fafb;
  }
}

/* 减少动画支持 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 打印样式 */
@media print {
  body {
    background: white;
    color: black;
  }
  
  .no-print {
    display: none !important;
  }
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 选择文本样式 */
::selection {
  background-color: #3b82f6;
  color: white;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 深色模式滚动条 */
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track {
    background: #1e293b;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #475569;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
}
</style>
