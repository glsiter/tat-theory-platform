<template>
  <div :class="gridClasses" :style="gridStyles">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResponsive } from '@/composables/useResponsive'

export interface ResponsiveGridProps {
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
  }
  gap?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  autoFit?: boolean
  minItemWidth?: string
  maxItemWidth?: string
  aspectRatio?: string
}

const props = withDefaults(defineProps<ResponsiveGridProps>(), {
  cols: () => ({
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  }),
  gap: () => ({
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  }),
  align: 'stretch',
  justify: 'start',
  autoFit: false,
  minItemWidth: '250px',
  maxItemWidth: '1fr',
})

const { isMobile: _isMobile, isTablet, isDesktop, isWide } = useResponsive()

const gridClasses = computed(() => [
  'responsive-grid',
  `align-${props.align}`,
  `justify-${props.justify}`,
  {
    'auto-fit': props.autoFit,
  },
])

const gridStyles = computed(() => {
  const styles: Record<string, string> = {}

  // 确定当前设备的列数
  let currentCols = props.cols.mobile || 1
  if (isWide.value && props.cols.wide) {
    currentCols = props.cols.wide
  } else if (isDesktop.value && props.cols.desktop) {
    currentCols = props.cols.desktop
  } else if (isTablet.value && props.cols.tablet) {
    currentCols = props.cols.tablet
  }

  // 确定当前设备的间距
  let currentGap = props.gap.mobile || '1rem'
  if (isDesktop.value && props.gap.desktop) {
    currentGap = props.gap.desktop
  } else if (isTablet.value && props.gap.tablet) {
    currentGap = props.gap.tablet
  }

  // 设置网格模板
  if (props.autoFit) {
    styles.gridTemplateColumns = `repeat(auto-fit, minmax(${props.minItemWidth}, ${props.maxItemWidth}))`
  } else {
    styles.gridTemplateColumns = `repeat(${currentCols}, 1fr)`
  }

  styles.gap = currentGap

  // 设置宽高比
  if (props.aspectRatio) {
    styles.aspectRatio = props.aspectRatio
  }

  return styles
})
</script>

<style scoped>
.responsive-grid {
  display: grid;
  width: 100%;
}

/* 对齐方式 */
.align-start {
  align-items: start;
}

.align-center {
  align-items: center;
}

.align-end {
  align-items: end;
}

.align-stretch {
  align-items: stretch;
}

/* 分布方式 */
.justify-start {
  justify-content: start;
}

.justify-center {
  justify-content: center;
}

.justify-end {
  justify-content: end;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.justify-evenly {
  justify-content: space-evenly;
}

/* 自适应网格 */
.auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(var(--min-item-width, 250px), 1fr));
}

/* 响应式断点调整 */
@media (max-width: 640px) {
  .responsive-grid {
    gap: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .responsive-grid {
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    gap: 2rem;
  }
}
</style>
