<template>
  <div class="interactive-mind-map" ref="containerRef">
    <!-- 控制面板 -->
    <div class="mind-map-controls" :class="{ 'controls-hidden': !showControls }">
      <div class="control-group">
        <button
          @click="toggleControls"
          class="control-toggle"
          :title="showControls ? '隐藏控制面板' : '显示控制面板'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="showControls ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
            />
          </svg>
        </button>
      </div>

      <div v-show="showControls" class="control-panels">
        <!-- 主题切换 -->
        <div class="control-panel">
          <h4>主题</h4>
          <div class="theme-buttons">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="setTheme(theme.value)"
              :class="['theme-btn', { active: currentTheme === theme.value }]"
              :title="theme.label"
            >
              <div :class="['theme-preview', theme.value]"></div>
              {{ theme.label }}
            </button>
          </div>
        </div>

        <!-- 视图控制 -->
        <div class="control-panel">
          <h4>视图</h4>
          <div class="view-controls">
            <button @click="resetView" class="control-btn" title="重置视图">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              重置
            </button>
            <button @click="centerView" class="control-btn" title="居中显示">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              居中
            </button>
            <button @click="fitToScreen" class="control-btn" title="适应屏幕">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              适应
            </button>
          </div>
        </div>

        <!-- 显示选项 -->
        <div class="control-panel">
          <h4>显示</h4>
          <div class="display-options">
            <label class="option-item">
              <input type="checkbox" v-model="showLabels" @change="updateDisplayOptions" />
              <span>显示标签</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="enableAnimation" @change="updateDisplayOptions" />
              <span>启用动画</span>
            </label>
          </div>
        </div>

        <!-- 节点大小 -->
        <div class="control-panel">
          <h4>节点大小</h4>
          <div class="size-controls">
            <button
              v-for="size in nodeSizes"
              :key="size.value"
              @click="setNodeSize(size.value)"
              :class="['size-btn', { active: currentNodeSize === size.value }]"
              :title="size.label"
            >
              {{ size.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SVG 画布 -->
    <svg
      ref="svgRef"
      class="mind-map-svg"
      :class="[`theme-${currentTheme}`, { 'labels-hidden': !showLabels }]"
    ></svg>

    <!-- 节点详情面板 -->
    <div
      v-if="selectedNode"
      class="node-details-panel"
      :style="{
        left: nodeDetailsPosition.x + 'px',
        top: nodeDetailsPosition.y + 'px',
      }"
    >
      <div class="panel-header">
        <h3>{{ selectedNode.data.label }}</h3>
        <button @click="closeNodeDetails" class="close-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="panel-content">
        <div class="node-info">
          <div class="info-item">
            <span class="label">类别:</span>
            <span class="value">{{ getCategoryLabel(selectedNode.data.category) }}</span>
          </div>
          <div class="info-item">
            <span class="label">难度:</span>
            <span class="value">{{ getDifficultyLabel(selectedNode.data.difficulty) }}</span>
          </div>
          <div class="info-item">
            <span class="label">重要性:</span>
            <div class="importance-stars">
              <span
                v-for="i in 10"
                :key="i"
                :class="['star', { filled: i <= selectedNode.data.importance }]"
                >★</span
              >
            </div>
          </div>
        </div>

        <div class="node-description">
          <p>{{ selectedNode.data.description }}</p>
        </div>

        <div v-if="selectedNode.data.keywords.length > 0" class="node-keywords">
          <h4>关键词</h4>
          <div class="keywords-list">
            <span v-for="keyword in selectedNode.data.keywords" :key="keyword" class="keyword-tag">
              {{ keyword }}
            </span>
          </div>
        </div>

        <div v-if="selectedNode.data.relatedConcepts.length > 0" class="related-concepts">
          <h4>相关概念</h4>
          <div class="concepts-list">
            <span
              v-for="concept in selectedNode.data.relatedConcepts"
              :key="concept"
              class="concept-tag"
            >
              {{ concept }}
            </span>
          </div>
        </div>

        <div v-if="selectedNode.data.resources.length > 0" class="node-resources">
          <h4>学习资源</h4>
          <div class="resources-list">
            <div
              v-for="resource in selectedNode.data.resources"
              :key="resource.id"
              class="resource-item"
            >
              <div class="resource-icon">
                {{ getResourceIcon(resource.type) }}
              </div>
              <div class="resource-info">
                <div class="resource-title">{{ resource.title }}</div>
                <div class="resource-description">{{ resource.description }}</div>
                <div class="resource-meta">
                  <span class="resource-type">{{ getResourceTypeLabel(resource.type) }}</span>
                  <span class="resource-quality">{{ getQualityLabel(resource.quality) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-actions">
          <button @click="expandNode" class="action-btn primary">
            {{ selectedNode.expanded ? '折叠节点' : '展开节点' }}
          </button>
          <button @click="focusNode" class="action-btn">聚焦节点</button>
          <button @click="toggleBookmark" class="action-btn">
            {{ isBookmarked ? '取消收藏' : '添加收藏' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>正在加载思维导图...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-overlay">
      <div class="error-message">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="retry" class="retry-btn">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import type { ZoomTransform } from 'd3'
import {
  MindMapD3Renderer,
  type D3Node,
  type RenderOptions,
  type InteractionCallbacks,
} from './MindMapD3Renderer'
import { mindMapService } from '@/services/mind-map-service'
import type { MindMapNode, MindMapStructure } from '@/types/mind-map'

// Props
interface Props {
  focusNodeId?: string
  width?: number
  height?: number
  theme?: 'light' | 'dark' | 'colorful'
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  focusNodeId: 'tat-theory-center',
  width: 1200,
  height: 800,
  theme: 'light',
  readonly: false,
})

// Emits
const emit = defineEmits<{
  nodeClick: [node: MindMapNode]
  nodeDoubleClick: [node: MindMapNode]
  nodeHover: [node: MindMapNode | null]
  structureChange: [structure: MindMapStructure]
}>()

// Refs
const containerRef = ref<HTMLDivElement>()
const svgRef = ref<SVGElement>()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const renderer = ref<MindMapD3Renderer | null>(null)
const structure = ref<MindMapStructure | null>(null)

// UI State
const showControls = ref(true)
const selectedNode = ref<D3Node | null>(null)
const nodeDetailsPosition = ref({ x: 0, y: 0 })
const currentTheme = ref(props.theme)
const showLabels = ref(true)
const enableAnimation = ref(true)
const currentNodeSize = ref<'small' | 'medium' | 'large'>('medium')

// 主题选项
const themes = [
  { value: 'light', label: '明亮' },
  { value: 'dark', label: '深色' },
  { value: 'colorful', label: '彩色' },
] as const

// 节点大小选项
const nodeSizes = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
] as const

// Computed
const isBookmarked = computed(() => {
  if (!selectedNode.value) return false
  const navState = mindMapService.getNavigationState()
  return navState.bookmarkedNodes.includes(selectedNode.value.id)
})

// 初始化
onMounted(async () => {
  await initializeMindMap()
})

// 清理
onUnmounted(() => {
  if (renderer.value) {
    renderer.value.destroy()
  }
})

// 监听焦点节点变化
watch(
  () => props.focusNodeId,
  (newFocusId) => {
    if (newFocusId && renderer.value && structure.value) {
      renderer.value.render(structure.value, newFocusId)
    }
  },
)

// 监听主题变化
watch(
  () => props.theme,
  (newTheme) => {
    currentTheme.value = newTheme
    if (renderer.value) {
      renderer.value.setTheme(newTheme)
    }
  },
)

// 初始化思维导图
async function initializeMindMap(): Promise<void> {
  try {
    loading.value = true
    error.value = null

    // 等待DOM更新
    await nextTick()

    if (!svgRef.value) {
      throw new Error('SVG容器未找到')
    }

    // 获取思维导图结构
    structure.value = mindMapService.getStructure()

    // 创建渲染选项
    const renderOptions: RenderOptions = {
      width: props.width,
      height: props.height,
      theme: currentTheme.value,
      showLabels: showLabels.value,
      enableAnimation: enableAnimation.value,
      nodeSize: currentNodeSize.value,
    }

    // 创建交互回调
    const callbacks: InteractionCallbacks = {
      onNodeClick: handleNodeClick,
      onNodeDoubleClick: handleNodeDoubleClick,
      onNodeHover: handleNodeHover,
      onBackgroundClick: handleBackgroundClick,
      onZoom: handleZoom,
    }

    // 创建渲染器
    renderer.value = new MindMapD3Renderer(svgRef.value, renderOptions, callbacks)

    // 渲染思维导图
    renderer.value.render(structure.value, props.focusNodeId)

    loading.value = false
  } catch (err) {
    console.error('初始化思维导图失败:', err)
    error.value = err instanceof Error ? err.message : '未知错误'
    loading.value = false
  }
}

// 节点点击处理
function handleNodeClick(node: D3Node, _event: MouseEvent): void {
  selectedNode.value = node

  // 计算详情面板位置
  const rect = svgRef.value?.getBoundingClientRect()
  if (rect) {
    nodeDetailsPosition.value = {
      x: Math.min(_event.clientX - rect.left + 20, props.width - 320),
      y: Math.max(_event.clientY - rect.top - 100, 20),
    }
  }

  // 更新导航状态
  mindMapService.updateNavigationState(node.id)

  // 触发事件
  emit('nodeClick', node.data)
}

// 节点双击处理
function handleNodeDoubleClick(node: D3Node, _event: MouseEvent): void {
  // 展开/折叠节点
  if (renderer.value) {
    renderer.value.toggleNode(node.id)
  }

  emit('nodeDoubleClick', node.data)
}

// 节点悬停处理
function handleNodeHover(node: D3Node | null, _event: MouseEvent): void {
  emit('nodeHover', node?.data || null)
}

// 背景点击处理
function handleBackgroundClick(_event: MouseEvent): void {
  selectedNode.value = null
}

// 缩放处理
function handleZoom(_transform: ZoomTransform): void {
  // 可以在这里处理缩放相关的逻辑
}

// 控制面板切换
function toggleControls(): void {
  showControls.value = !showControls.value
}

// 设置主题
function setTheme(theme: 'light' | 'dark' | 'colorful'): void {
  currentTheme.value = theme
  if (renderer.value) {
    renderer.value.setTheme(theme)
  }
}

// 重置视图
function resetView(): void {
  if (renderer.value) {
    renderer.value.resetView()
  }
}

// 居中视图
function centerView(): void {
  if (renderer.value && structure.value) {
    renderer.value.focusNode(structure.value.centralTopic.id)
  }
}

// 适应屏幕
function fitToScreen(): void {
  // 实现适应屏幕的逻辑
  resetView()
}

// 设置节点大小
function setNodeSize(size: 'small' | 'medium' | 'large'): void {
  currentNodeSize.value = size
  // 重新渲染以应用新的节点大小
  if (renderer.value && structure.value) {
    renderer.value.render(structure.value, props.focusNodeId)
  }
}

// 更新显示选项
function updateDisplayOptions(): void {
  if (renderer.value && structure.value) {
    renderer.value.render(structure.value, props.focusNodeId)
  }
}

// 关闭节点详情
function closeNodeDetails(): void {
  selectedNode.value = null
}

// 展开节点
function expandNode(): void {
  if (selectedNode.value && renderer.value) {
    renderer.value.toggleNode(selectedNode.value.id)
    selectedNode.value.expanded = !selectedNode.value.expanded
  }
}

// 聚焦节点
function focusNode(): void {
  if (selectedNode.value && renderer.value) {
    renderer.value.focusNode(selectedNode.value.id)
  }
}

// 切换收藏
function toggleBookmark(): void {
  if (!selectedNode.value) return

  if (isBookmarked.value) {
    mindMapService.removeBookmark(selectedNode.value.id)
  } else {
    mindMapService.addBookmark(selectedNode.value.id)
  }
}

// 重试
function retry(): void {
  initializeMindMap()
}

// 工具函数
function getCategoryLabel(category: string): string {
  const labels = {
    core: '核心',
    concept: '概念',
    application: '应用',
    research: '研究',
    method: '方法',
    theory: '理论',
  }
  return labels[category as keyof typeof labels] || category
}

function getDifficultyLabel(difficulty: string): string {
  const labels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  }
  return labels[difficulty as keyof typeof labels] || difficulty
}

function getResourceIcon(type: string): string {
  const icons = {
    video: '🎥',
    article: '📄',
    case: '📋',
    data: '📊',
    book: '📚',
    paper: '📑',
    website: '🌐',
  }
  return icons[type as keyof typeof icons] || '📄'
}

function getResourceTypeLabel(type: string): string {
  const labels = {
    video: '视频',
    article: '文章',
    case: '案例',
    data: '数据',
    book: '书籍',
    paper: '论文',
    website: '网站',
  }
  return labels[type as keyof typeof labels] || type
}

function getQualityLabel(quality: string): string {
  const labels = {
    high: '高质量',
    medium: '中等',
    low: '一般',
  }
  return labels[quality as keyof typeof labels] || quality
}
</script>

<style scoped>
.interactive-mind-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.mind-map-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.mind-map-svg:active {
  cursor: grabbing;
}

/* 控制面板样式 */
.mind-map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.controls-hidden .control-panels {
  display: none;
}

.control-toggle {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.control-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}

.control-panels {
  padding: 16px;
  min-width: 200px;
}

.control-panel {
  margin-bottom: 16px;
}

.control-panel:last-child {
  margin-bottom: 0;
}

.control-panel h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* 主题按钮 */
.theme-buttons {
  display: flex;
  gap: 8px;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.theme-btn:hover {
  border-color: #3b82f6;
}

.theme-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.theme-preview {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid #e5e7eb;
}

.theme-preview.light {
  background: linear-gradient(45deg, #ffffff 50%, #f3f4f6 50%);
}

.theme-preview.dark {
  background: linear-gradient(45deg, #1f2937 50%, #374151 50%);
}

.theme-preview.colorful {
  background: linear-gradient(
    45deg,
    #3b82f6 25%,
    #10b981 25%,
    #10b981 50%,
    #f59e0b 50%,
    #f59e0b 75%,
    #ef4444 75%
  );
}

/* 视图控制 */
.view-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.control-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 显示选项 */
.display-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  cursor: pointer;
}

.option-item input[type='checkbox'] {
  width: 14px;
  height: 14px;
}

/* 大小控制 */
.size-controls {
  display: flex;
  gap: 4px;
}

.size-btn {
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.size-btn:hover {
  border-color: #3b82f6;
}

.size-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

/* 节点详情面板 */
.node-details-panel {
  position: absolute;
  width: 300px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 20;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.panel-content {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.node-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item .label {
  font-weight: 500;
  color: #6b7280;
}

.info-item .value {
  color: #1f2937;
}

.importance-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 12px;
}

.star.filled {
  color: #fbbf24;
}

.node-description {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.node-keywords,
.related-concepts {
  margin-bottom: 16px;
}

.node-keywords h4,
.related-concepts h4,
.node-resources h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.keywords-list,
.concepts-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword-tag,
.concept-tag {
  padding: 4px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.concept-tag {
  background: #f0fdf4;
  color: #16a34a;
}

.node-resources {
  margin-bottom: 16px;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
}

.resource-icon {
  font-size: 16px;
  line-height: 1;
}

.resource-info {
  flex: 1;
}

.resource-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.resource-description {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.resource-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.resource-type {
  color: #3b82f6;
}

.resource-quality {
  color: #16a34a;
}

.panel-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn.primary:hover {
  background: #2563eb;
}

/* 加载和错误状态 */
.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 30;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  max-width: 300px;
}

.error-message h3 {
  margin: 16px 0 8px;
  color: #dc2626;
}

.error-message p {
  margin: 0 0 16px;
  color: #6b7280;
}

.retry-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
}

/* 主题样式 */
.theme-dark {
  background: #1f2937;
}

.theme-dark .mind-map-controls {
  background: rgba(31, 41, 55, 0.95);
  color: #f9fafb;
}

.theme-dark .control-panel h4 {
  color: #f9fafb;
}

.theme-dark .node-details-panel {
  background: #374151;
  color: #f9fafb;
}

.theme-dark .panel-header {
  background: #4b5563;
  border-bottom-color: #6b7280;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mind-map-controls {
    top: 10px;
    left: 10px;
    right: 10px;
    width: auto;
  }

  .control-panels {
    padding: 12px;
    min-width: auto;
  }

  .node-details-panel {
    width: 280px;
    max-height: 400px;
  }

  .theme-buttons,
  .view-controls {
    flex-wrap: wrap;
  }
}
</style>
