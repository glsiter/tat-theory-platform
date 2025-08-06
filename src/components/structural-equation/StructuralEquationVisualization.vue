<template>
  <div class="structural-equation-visualization">
    <div class="visualization-header">
      <div class="header-content">
        <h2 class="visualization-title">TAT理论结构方程可视化</h2>
        <p class="visualization-description">
          基于特质激发理论的完整结构方程模型，展示特质相关线索的来源/水平与各要素间的关系
        </p>
      </div>
      <div class="header-actions">
        <button 
          @click="showModelInfo = !showModelInfo"
          class="info-btn"
          :class="{ active: showModelInfo }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9,9h0a3,3,0,0,1,6,0c0,2-3,3-3,3"/>
            <path d="M12,17h0"/>
          </svg>
          模型信息
        </button>
        <button 
          @click="showSettings = !showSettings"
          class="settings-btn"
          :class="{ active: showSettings }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12,1V5"/>
            <path d="M12,19v4"/>
            <path d="M4.22,4.22l2.83,2.83"/>
            <path d="M16.95,16.95l2.83,2.83"/>
            <path d="M1,12H5"/>
            <path d="M19,12h4"/>
            <path d="M4.22,19.78l2.83-2.83"/>
            <path d="M16.95,7.05l2.83-2.83"/>
          </svg>
          设置
        </button>
      </div>
    </div>

    <!-- 模型信息面板 -->
    <div v-if="showModelInfo && model" class="info-panel">
      <div class="info-content">
        <div class="info-section">
          <h4>模型概述</h4>
          <p>{{ model.description }}</p>
          <div class="info-stats">
            <div class="stat-item">
              <span class="stat-label">节点数量:</span>
              <span class="stat-value">{{ Object.keys(model.nodes).length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">关系数量:</span>
              <span class="stat-value">{{ model.relationships.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">版本:</span>
              <span class="stat-value">{{ model.version }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最后更新:</span>
              <span class="stat-value">{{ formatDate(model.lastUpdated) }}</span>
            </div>
          </div>
        </div>
        <div class="info-section">
          <h4>原始图片信息</h4>
          <p><strong>文件名:</strong> {{ model.originalImage.filename }}</p>
          <p><strong>来源:</strong> {{ model.originalImage.source }}</p>
          <p><strong>分析日期:</strong> {{ model.originalImage.analysisDate }}</p>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div v-if="showSettings" class="settings-panel">
      <div class="settings-content">
        <div class="setting-group">
          <h4>显示选项</h4>
          <label class="setting-item">
            <input 
              type="checkbox" 
              v-model="settings.showPathNumbers"
              @change="updateVisualization"
            >
            <span>显示路径编号</span>
          </label>
          <label class="setting-item">
            <input 
              type="checkbox" 
              v-model="settings.showNodeLabels"
              @change="updateVisualization"
            >
            <span>显示节点标签</span>
          </label>
          <label class="setting-item">
            <input 
              type="checkbox" 
              v-model="settings.showLinkLabels"
              @change="updateVisualization"
            >
            <span>显示连线标签</span>
          </label>
        </div>
        <div class="setting-group">
          <h4>布局参数</h4>
          <div class="setting-item">
            <label>连线距离: {{ settings.linkDistance }}</label>
            <input 
              type="range" 
              min="50" 
              max="300" 
              v-model="settings.linkDistance"
              @input="updateVisualization"
            >
          </div>
          <div class="setting-item">
            <label>节点排斥力: {{ Math.abs(settings.chargeStrength) }}</label>
            <input 
              type="range" 
              min="100" 
              max="500" 
              v-model="settings.chargeStrength"
              @input="updateVisualization"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 主要可视化区域 -->
    <div class="visualization-main">
      <StructuralEquationRenderer 
        v-if="model && !isLoading"
        :model="model"
        :key="visualizationKey"
        ref="rendererRef"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>正在加载结构方程模型...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-overlay">
      <div class="error-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="retryLoad" class="retry-btn">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import StructuralEquationRenderer from './StructuralEquationRenderer.vue'
import { structuralEquationService } from '@/services/structural-equation-service'
import type { StructuralEquationModel } from '@/types/structural-equation'

// State
const isLoading = ref(true)
const error = ref<string | null>(null)
const model = ref<StructuralEquationModel>()
const showModelInfo = ref(false)
const showSettings = ref(false)
const visualizationKey = ref(0)
const rendererRef = ref()

// Settings
const settings = reactive({
  showPathNumbers: true,
  showNodeLabels: true,
  showLinkLabels: true,
  linkDistance: 150,
  chargeStrength: -300
})

// Methods
const loadModel = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // 获取结构方程模型
    model.value = structuralEquationService.getModel()
    
    // 验证模型
    const validation = structuralEquationService.validateModel()
    if (!validation.structuralConsistency || !validation.theoreticalAlignment) {
      console.warn('模型验证警告:', validation.recommendations)
    }
    
    await nextTick()
    isLoading.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    isLoading.value = false
  }
}

const retryLoad = () => {
  loadModel()
}

const updateVisualization = () => {
  // 强制重新渲染可视化组件
  visualizationKey.value++
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Lifecycle
onMounted(() => {
  loadModel()
})
</script>

<style scoped>
.structural-equation-visualization {
  @apply w-full h-full flex flex-col bg-gray-50;
}

.visualization-header {
  @apply flex items-start justify-between p-6 bg-white border-b border-gray-200;
}

.header-content {
  @apply flex-1;
}

.visualization-title {
  @apply text-2xl font-bold text-gray-900 mb-2;
}

.visualization-description {
  @apply text-gray-600 max-w-2xl;
}

.header-actions {
  @apply flex items-center gap-3;
}

.info-btn,
.settings-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors;
}

.info-btn.active,
.settings-btn.active {
  @apply bg-blue-50 border-blue-300 text-blue-700;
}

.info-panel,
.settings-panel {
  @apply bg-white border-b border-gray-200 p-6;
}

.info-content {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.info-section h4 {
  @apply text-lg font-semibold text-gray-900 mb-3;
}

.info-section p {
  @apply text-gray-600 mb-4;
}

.info-stats {
  @apply grid grid-cols-2 gap-3;
}

.stat-item {
  @apply flex justify-between;
}

.stat-label {
  @apply text-gray-500;
}

.stat-value {
  @apply font-medium text-gray-900;
}

.settings-content {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.setting-group h4 {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.setting-item {
  @apply flex items-center gap-3 mb-3;
}

.setting-item input[type="checkbox"] {
  @apply w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500;
}

.setting-item input[type="range"] {
  @apply flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

.visualization-main {
  @apply flex-1 relative;
  min-height: 600px;
}

.loading-overlay,
.error-overlay {
  @apply absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10;
}

.loading-spinner {
  @apply text-center;
}

.spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4;
}

.error-content {
  @apply text-center;
}

.error-content svg {
  @apply mx-auto mb-4 text-red-500;
}

.error-content h3 {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.error-content p {
  @apply text-gray-600 mb-4;
}

.retry-btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}
</style>