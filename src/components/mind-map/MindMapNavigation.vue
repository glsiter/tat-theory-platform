<template>
  <div class="mind-map-navigation">
    <!-- 导航面板切换按钮 -->
    <button 
      @click="togglePanel"
      class="nav-toggle"
      :class="{ 'panel-open': isPanelOpen }"
      title="导航面板"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- 导航面板 -->
    <div v-if="isPanelOpen" class="nav-panel">
      <!-- 面板头部 -->
      <div class="panel-header">
        <h3>导航面板</h3>
        <button @click="closePanel" class="close-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 导航标签页 -->
      <div class="nav-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- 标签页内容 -->
      <div class="tab-content">
        <!-- 层级导航 -->
        <div v-if="activeTab === 'hierarchy'" class="hierarchy-nav">
          <div class="nav-section">
            <h4>当前位置</h4>
            <div class="breadcrumb">
              <button
                v-for="(node, index) in breadcrumb"
                :key="node.id"
                @click="navigateToNode(node.id)"
                class="breadcrumb-item"
              >
                {{ node.label }}
                <svg v-if="index < breadcrumb.length - 1" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div class="nav-section">
            <h4>子节点</h4>
            <div class="node-list">
              <button
                v-for="child in currentChildren"
                :key="child.id"
                @click="navigateToNode(child.id)"
                class="node-item"
              >
                <span class="node-icon">{{ getCategoryIcon(child.category) }}</span>
                <span class="node-label">{{ child.label }}</span>
                <span class="node-meta">{{ getDifficultyLabel(child.difficulty) }}</span>
              </button>
            </div>
          </div>

          <div v-if="siblings.length > 0" class="nav-section">
            <h4>同级节点</h4>
            <div class="node-list">
              <button
                v-for="sibling in siblings"
                :key="sibling.id"
                @click="navigateToNode(sibling.id)"
                :class="['node-item', { current: sibling.id === currentNodeId }]"
              >
                <span class="node-icon">{{ getCategoryIcon(sibling.category) }}</span>
                <span class="node-label">{{ sibling.label }}</span>
                <span class="node-meta">{{ getDifficultyLabel(sibling.difficulty) }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 学习路径 -->
        <div v-if="activeTab === 'paths'" class="learning-paths">
          <div class="nav-section">
            <div class="section-header">
              <h4>推荐学习路径</h4>
              <button @click="generateCustomPath" class="generate-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                生成路径
              </button>
            </div>

            <div class="path-list">
              <div
                v-for="path in learningPaths"
                :key="path.id"
                class="path-item"
              >
                <div class="path-header">
                  <h5>{{ path.title }}</h5>
                  <span class="path-difficulty">{{ getDifficultyLabel(path.difficulty) }}</span>
                </div>
                
                <div class="path-description">{{ path.description }}</div>
                
                <div class="path-meta">
                  <span class="path-time">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ path.estimatedTime }}分钟
                  </span>
                  <span class="path-nodes">{{ path.nodeSequence.length }}个节点</span>
                </div>

                <div class="path-actions">
                  <button @click="startLearningPath(path)" class="action-btn primary">
                    开始学习
                  </button>
                  <button @click="previewPath(path)" class="action-btn">
                    预览路径
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前学习路径 -->
          <div v-if="currentPath" class="nav-section">
            <h4>当前学习路径</h4>
            <div class="current-path">
              <div class="path-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: pathProgress + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ Math.round(pathProgress) }}%</span>
              </div>

              <div class="path-steps">
                <div
                  v-for="(nodeId, index) in currentPath.nodeSequence"
                  :key="nodeId"
                  :class="['path-step', {
                    completed: index < currentPathStep,
                    current: index === currentPathStep,
                    upcoming: index > currentPathStep
                  }]"
                  @click="navigateToPathStep(index)"
                >
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-content">
                    <div class="step-title">{{ getNodeLabel(nodeId) }}</div>
                    <div class="step-status">
                      <svg v-if="index < currentPathStep" class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span v-else-if="index === currentPathStep" class="current-indicator">●</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="path-controls">
                <button 
                  @click="previousStep" 
                  :disabled="currentPathStep <= 0"
                  class="control-btn"
                >
                  上一步
                </button>
                <button 
                  @click="nextStep" 
                  :disabled="currentPathStep >= currentPath.nodeSequence.length - 1"
                  class="control-btn"
                >
                  下一步
                </button>
                <button @click="exitPath" class="control-btn exit">
                  退出路径
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 收藏夹 -->
        <div v-if="activeTab === 'bookmarks'" class="bookmarks">
          <div class="nav-section">
            <div class="section-header">
              <h4>收藏的节点</h4>
              <span class="bookmark-count">{{ bookmarkedNodes.length }}</span>
            </div>

            <div v-if="bookmarkedNodes.length === 0" class="empty-state">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p>还没有收藏任何节点</p>
              <p class="text-sm">点击节点详情中的收藏按钮来添加收藏</p>
            </div>

            <div v-else class="bookmark-list">
              <div
                v-for="node in bookmarkedNodes"
                :key="node.id"
                class="bookmark-item"
              >
                <button @click="navigateToNode(node.id)" class="bookmark-content">
                  <span class="node-icon">{{ getCategoryIcon(node.category) }}</span>
                  <div class="bookmark-info">
                    <div class="bookmark-title">{{ node.label }}</div>
                    <div class="bookmark-description">{{ node.description }}</div>
                    <div class="bookmark-meta">
                      <span class="category">{{ getCategoryLabel(node.category) }}</span>
                      <span class="difficulty">{{ getDifficultyLabel(node.difficulty) }}</span>
                    </div>
                  </div>
                </button>
                
                <button 
                  @click="removeBookmark(node.id)"
                  class="remove-bookmark"
                  title="取消收藏"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 访问历史 -->
        <div v-if="activeTab === 'history'" class="visit-history">
          <div class="nav-section">
            <div class="section-header">
              <h4>访问历史</h4>
              <button @click="clearHistory" class="clear-btn">清除</button>
            </div>

            <div v-if="visitHistory.length === 0" class="empty-state">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>暂无访问历史</p>
            </div>

            <div v-else class="history-list">
              <button
                v-for="(nodeId, index) in visitHistory"
                :key="`${nodeId}-${index}`"
                @click="navigateToNode(nodeId)"
                class="history-item"
              >
                <span class="node-icon">{{ getCategoryIcon(getNode(nodeId)?.category || 'core') }}</span>
                <span class="node-label">{{ getNodeLabel(nodeId) }}</span>
                <span class="visit-time">{{ getRelativeTime(index) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速导航按钮 -->
    <div class="quick-nav">
      <button 
        @click="navigateToCenter"
        class="quick-nav-btn"
        title="回到中心"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      </button>

      <button 
        @click="goBack"
        :disabled="!canGoBack"
        class="quick-nav-btn"
        title="后退"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        @click="goForward"
        :disabled="!canGoForward"
        class="quick-nav-btn"
        title="前进"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { mindMapService } from '@/services/mind-map-service'
import type { MindMapNode, LearningPath, NavigationState } from '@/types/mind-map'

// Props
interface Props {
  currentNodeId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  navigate: [nodeId: string]
  pathStart: [path: LearningPath]
  pathStep: [stepIndex: number, nodeId: string]
}>()

// State
const isPanelOpen = ref(false)
const activeTab = ref('hierarchy')
const currentPath = ref<LearningPath | null>(null)
const currentPathStep = ref(0)
const navigationHistory = ref<string[]>([])
const historyIndex = ref(-1)

// 标签页配置
const tabs = [
  { id: 'hierarchy', label: '层级', icon: 'TreeIcon' },
  { id: 'paths', label: '路径', icon: 'RouteIcon' },
  { id: 'bookmarks', label: '收藏', icon: 'BookmarkIcon' },
  { id: 'history', label: '历史', icon: 'ClockIcon' }
]

// Computed
const structure = computed(() => mindMapService.getStructure())
const navState = computed(() => mindMapService.getNavigationState())

const currentNode = computed(() => {
  return structure.value.nodes[props.currentNodeId] || null
})

const breadcrumb = computed(() => {
  if (!currentNode.value) return []
  
  const hierarchy = mindMapService.getNodeHierarchy(props.currentNodeId)
  return [...hierarchy.ancestors, hierarchy.node].filter(Boolean) as MindMapNode[]
})

const currentChildren = computed(() => {
  if (!currentNode.value) return []
  
  return currentNode.value.children
    .map(childId => structure.value.nodes[childId])
    .filter(Boolean)
    .sort((a, b) => a.importance - b.importance)
})

const siblings = computed(() => {
  if (!currentNode.value) return []
  
  const hierarchy = mindMapService.getNodeHierarchy(props.currentNodeId)
  return hierarchy.siblings.filter(sibling => sibling.id !== props.currentNodeId)
})

const learningPaths = computed(() => {
  // 生成一些推荐的学习路径
  const paths: LearningPath[] = []
  
  if (currentNode.value) {
    // 从当前节点到相关应用的路径
    const applicationNodes = Object.values(structure.value.nodes)
      .filter(node => node.category === 'application')
      .slice(0, 3)
    
    for (const appNode of applicationNodes) {
      const path = mindMapService.generateLearningPath(
        props.currentNodeId,
        appNode.id,
        { difficulty: 'intermediate', maxSteps: 8 }
      )
      if (path) {
        paths.push(path)
      }
    }
  }
  
  return paths
})

const bookmarkedNodes = computed(() => {
  return navState.value.bookmarkedNodes
    .map(nodeId => structure.value.nodes[nodeId])
    .filter(Boolean)
})

const visitHistory = computed(() => {
  return navState.value.visitedNodes.slice(-20).reverse()
})

const pathProgress = computed(() => {
  if (!currentPath.value) return 0
  return (currentPathStep.value / Math.max(1, currentPath.value.nodeSequence.length - 1)) * 100
})

const canGoBack = computed(() => historyIndex.value > 0)
const canGoForward = computed(() => historyIndex.value < navigationHistory.value.length - 1)

// 生命周期
onMounted(() => {
  // 初始化导航历史
  navigationHistory.value = [props.currentNodeId]
  historyIndex.value = 0
})

// 监听当前节点变化
watch(() => props.currentNodeId, (newNodeId, oldNodeId) => {
  if (newNodeId !== oldNodeId) {
    addToNavigationHistory(newNodeId)
  }
})

// 方法
function togglePanel(): void {
  isPanelOpen.value = !isPanelOpen.value
}

function closePanel(): void {
  isPanelOpen.value = false
}

function navigateToNode(nodeId: string): void {
  emit('navigate', nodeId)
  closePanel()
}

function navigateToCenter(): void {
  navigateToNode(structure.value.centralTopic.id)
}

function addToNavigationHistory(nodeId: string): void {
  // 如果不是通过前进后退导航的，清除后续历史
  if (historyIndex.value < navigationHistory.value.length - 1) {
    navigationHistory.value = navigationHistory.value.slice(0, historyIndex.value + 1)
  }
  
  // 添加新节点到历史
  if (navigationHistory.value[navigationHistory.value.length - 1] !== nodeId) {
    navigationHistory.value.push(nodeId)
    historyIndex.value = navigationHistory.value.length - 1
  }
  
  // 限制历史长度
  if (navigationHistory.value.length > 50) {
    navigationHistory.value = navigationHistory.value.slice(-50)
    historyIndex.value = navigationHistory.value.length - 1
  }
}

function goBack(): void {
  if (canGoBack.value) {
    historyIndex.value--
    const nodeId = navigationHistory.value[historyIndex.value]
    emit('navigate', nodeId)
  }
}

function goForward(): void {
  if (canGoForward.value) {
    historyIndex.value++
    const nodeId = navigationHistory.value[historyIndex.value]
    emit('navigate', nodeId)
  }
}

function generateCustomPath(): void {
  // 实现自定义路径生成逻辑
  console.log('生成自定义学习路径')
}

function startLearningPath(path: LearningPath): void {
  currentPath.value = path
  currentPathStep.value = 0
  
  // 导航到路径的第一个节点
  if (path.nodeSequence.length > 0) {
    navigateToNode(path.nodeSequence[0])
  }
  
  emit('pathStart', path)
}

function previewPath(path: LearningPath): void {
  // 实现路径预览逻辑
  console.log('预览学习路径:', path)
}

function navigateToPathStep(stepIndex: number): void {
  if (!currentPath.value) return
  
  currentPathStep.value = stepIndex
  const nodeId = currentPath.value.nodeSequence[stepIndex]
  
  if (nodeId) {
    navigateToNode(nodeId)
    emit('pathStep', stepIndex, nodeId)
  }
}

function previousStep(): void {
  if (currentPathStep.value > 0) {
    navigateToPathStep(currentPathStep.value - 1)
  }
}

function nextStep(): void {
  if (currentPath.value && currentPathStep.value < currentPath.value.nodeSequence.length - 1) {
    navigateToPathStep(currentPathStep.value + 1)
  }
}

function exitPath(): void {
  currentPath.value = null
  currentPathStep.value = 0
}

function removeBookmark(nodeId: string): void {
  mindMapService.removeBookmark(nodeId)
}

function clearHistory(): void {
  // 清除访问历史的逻辑需要在service中实现
  console.log('清除访问历史')
}

// 工具函数
function getNode(nodeId: string): MindMapNode | null {
  return structure.value.nodes[nodeId] || null
}

function getNodeLabel(nodeId: string): string {
  const node = getNode(nodeId)
  return node ? node.label : '未知节点'
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    core: '●',
    concept: '◆',
    application: '▲',
    research: '■',
    method: '◇',
    theory: '○',
    example: '◯'
  }
  return icons[category] || '●'
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    core: '核心',
    concept: '概念',
    application: '应用',
    research: '研究',
    method: '方法',
    theory: '理论',
    example: '示例'
  }
  return labels[category] || category
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return labels[difficulty] || difficulty
}

function getRelativeTime(index: number): string {
  // 简单的相对时间计算
  if (index === 0) return '刚刚'
  if (index < 5) return `${index}步前`
  return '较早'
}
</script>

<style scoped>
.mind-map-navigation {
  position: relative;
}

/* 导航切换按钮 */
.nav-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 40;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.nav-toggle:hover {
  background: #f8fafc;
  border-color: #3b82f6;
}

.nav-toggle.panel-open {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* 导航面板 */
.nav-panel {
  position: fixed;
  top: 20px;
  right: 80px;
  width: 350px;
  max-height: calc(100vh - 40px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 30;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* 导航标签页 */
.nav-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.nav-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #6b7280;
  transition: all 0.2s;
}

.nav-tab:hover {
  background: #e5e7eb;
  color: #374151;
}

.nav-tab.active {
  background: white;
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

/* 标签页内容 */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.nav-section {
  margin-bottom: 20px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #3b82f6;
  border-radius: 4px;
  transition: all 0.2s;
}

.breadcrumb-item:hover {
  background: #eff6ff;
}

.breadcrumb-item:last-child {
  color: #1f2937;
  font-weight: 500;
}

/* 节点列表 */
.node-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.node-item:hover {
  background: #f8fafc;
  border-color: #e5e7eb;
}

.node-item.current {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.node-icon {
  font-size: 14px;
  color: #3b82f6;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.node-meta {
  font-size: 11px;
  color: #6b7280;
}

/* 学习路径 */
.generate-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.generate-btn:hover {
  background: #2563eb;
}

.path-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.path-item {
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.path-header h5 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.path-difficulty {
  padding: 2px 6px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.path-description {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.4;
}

.path-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 11px;
  color: #6b7280;
}

.path-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.path-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 11px;
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

/* 当前学习路径 */
.current-path {
  padding: 12px;
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 8px;
}

.path-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  font-weight: 500;
  color: #3b82f6;
}

.path-steps {
  margin-bottom: 12px;
}

.path-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.path-step:hover {
  background: rgba(59, 130, 246, 0.1);
}

.path-step.completed {
  background: rgba(34, 197, 94, 0.1);
}

.path-step.current {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid #3b82f6;
}

.step-number {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.path-step.completed .step-number {
  background: #22c55e;
  color: white;
}

.path-step.current .step-number {
  background: #3b82f6;
  color: white;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.step-status {
  display: flex;
  align-items: center;
}

.current-indicator {
  color: #3b82f6;
  font-size: 8px;
}

.path-controls {
  display: flex;
  gap: 6px;
}

.control-btn {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.exit {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.control-btn.exit:hover {
  background: #dc2626;
}

/* 收藏夹 */
.bookmark-count {
  padding: 2px 6px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
}

.bookmark-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bookmark-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.bookmark-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.bookmark-info {
  flex: 1;
  min-width: 0;
}

.bookmark-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.bookmark-description {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  line-height: 1.3;
}

.bookmark-meta {
  display: flex;
  gap: 8px;
  font-size: 10px;
}

.category {
  color: #3b82f6;
}

.difficulty {
  color: #f59e0b;
}

.remove-bookmark {
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.remove-bookmark:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* 访问历史 */
.clear-btn {
  padding: 4px 8px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  color: #6b7280;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  border-radius: 4px;
  transition: all 0.2s;
}

.history-item:hover {
  background: #f8fafc;
}

.visit-time {
  font-size: 10px;
  color: #9ca3af;
  margin-left: auto;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.empty-state p {
  margin: 8px 0;
  font-size: 13px;
}

.empty-state .text-sm {
  font-size: 11px;
}

/* 快速导航 */
.quick-nav {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 20;
}

.quick-nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.quick-nav-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.quick-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-panel {
    right: 10px;
    left: 10px;
    width: auto;
    max-height: calc(100vh - 20px);
  }

  .nav-toggle {
    right: 10px;
  }

  .quick-nav {
    right: 10px;
    bottom: 10px;
  }

  .tab-content {
    padding: 12px;
  }

  .nav-tabs {
    overflow-x: auto;
  }

  .nav-tab {
    white-space: nowrap;
    min-width: 80px;
  }
}
</style>