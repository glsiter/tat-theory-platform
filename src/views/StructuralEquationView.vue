<template>
  <div class="structural-equation-view">
    <StructuralEquationVisualization />
  </div>
</template>

<script setup lang="ts">
import { StructuralEquationVisualization } from '@/components'
</script>

<style scoped>
.structural-equation-view {
  width: 100%;
  /* 为避免与顶部导航重叠，按不同设备头部高度计算可视区高度 */
  height: calc(100vh - var(--desktop-header-height));
}

@media (max-width: 768px) {
  .structural-equation-view {
    height: calc(100vh - var(--mobile-header-height));
  }
}
</style>
