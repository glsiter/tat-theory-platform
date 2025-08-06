<template>
  <div class="tat-layout">
    <!-- Header -->
    <header v-if="$slots.header" class="tat-header">
      <slot name="header" />
    </header>

    <!-- Main Content Area -->
    <div class="tat-main-wrapper">
      <!-- Sidebar -->
      <aside v-if="$slots.sidebar" :class="sidebarClasses">
        <slot name="sidebar" />
      </aside>

      <!-- Main Content -->
      <main :class="mainClasses">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer v-if="$slots.footer" class="tat-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TatLayoutProps {
  sidebarWidth?: 'sm' | 'md' | 'lg'
  sidebarPosition?: 'left' | 'right'
  headerHeight?: 'sm' | 'md' | 'lg'
  footerHeight?: 'sm' | 'md' | 'lg'
  fullHeight?: boolean
}

const props = withDefaults(defineProps<TatLayoutProps>(), {
  sidebarWidth: 'md',
  sidebarPosition: 'left',
  headerHeight: 'md',
  footerHeight: 'sm',
  fullHeight: true
})

const sidebarClasses = computed(() => {
  const baseClasses = ['tat-sidebar', 'bg-white', 'border-gray-200']
  
  const widthClasses = {
    sm: ['w-48'],
    md: ['w-64'],
    lg: ['w-80']
  }

  const positionClasses = {
    left: ['border-r'],
    right: ['border-l', 'order-2']
  }

  return [
    ...baseClasses,
    ...widthClasses[props.sidebarWidth],
    ...positionClasses[props.sidebarPosition]
  ]
})

const mainClasses = computed(() => {
  const baseClasses = ['tat-content', 'flex-1', 'overflow-auto']
  
  return baseClasses
})
</script>

<style scoped>
.tat-layout {
  @apply flex flex-col min-h-screen bg-gray-50;
}

.tat-header {
  @apply bg-white border-b border-gray-200 shadow-sm z-10;
}

.tat-main-wrapper {
  @apply flex flex-1 overflow-hidden;
}

.tat-sidebar {
  @apply flex-shrink-0 overflow-y-auto;
}

.tat-content {
  @apply p-6;
}

.tat-footer {
  @apply bg-white border-t border-gray-200 p-4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tat-main-wrapper {
    @apply flex-col;
  }
  
  .tat-sidebar {
    @apply w-full border-r-0 border-b;
  }
}
</style>