<template>
  <div class="mind-map-test-view">
    <div class="page-header">
      <h1>TAT理论思维导图</h1>
      <p>探索特质激发理论的完整知识图谱</p>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 搜索栏 -->
      <div class="search-container">
        <MindMapSearch
          :max-results="10"
          :show-history="true"
          :show-popular="true"
          @search="handleSearch"
          @select="handleSearchSelect"
          @focus="handleSearchFocus"
          @clear="handleSearchClear"
        />
      </div>

      <!-- 学习路径生成器 -->
      <div class="generator-container">
        <LearningPathGenerator
          @path-generated="handlePathGenerated"
          @path-started="handlePathStarted"
          @step-changed="handleStepChanged"
          @progress-updated="handleProgressUpdated"
        />
      </div>
    </div>

    <div class="mind-map-container">
      <InteractiveMindMap
        :width="1200"
        :height="800"
        :theme="selectedTheme"
        :focus-node-id="focusNodeId"
        @node-click="handleNodeClick"
        @node-double-click="handleNodeDoubleClick"
        @node-hover="handleNodeHover"
      />

      <!-- 导航组件 -->
      <MindMapNavigation
        :current-node-id="focusNodeId"
        @navigate="handleNavigate"
        @path-start="handlePathStart"
        @path-step="handlePathStep"
      />
    </div>

    <div class="test-controls">
      <div class="control-group">
        <label>主题:</label>
        <select v-model="selectedTheme">
          <option value="light">明亮</option>
          <option value="dark">深色</option>
          <option value="colorful">彩色</option>
        </select>
      </div>

      <div class="control-group">
        <label>焦点节点:</label>
        <select v-model="focusNodeId">
          <option value="tat-theory-center">中心主题</option>
          <option value="theoretical-foundation">理论基础</option>
          <option value="core-mechanisms">核心机制</option>
          <option value="key-concepts">关键概念</option>
          <option value="research-applications">研究应用</option>
          <option value="measurement-tools">测量工具</option>
          <option value="future-directions">未来方向</option>
        </select>
      </div>
    </div>

    <div class="event-log">
      <h3>事件日志</h3>
      <div class="log-content">
        <div 
          v-for="(event, index) in eventLog" 
          :key="index"
          class="log-entry"
        >
          <span class="log-time">{{ event.time }}</span>
          <span class="log-type">{{ event.type }}</span>
          <span class="log-message">{{ event.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InteractiveMindMap, MindMapSearch, MindMapNavigation, LearningPathGenerator } from '@/components/mind-map'
import type { MindMapNode, SearchResult, LearningPath } from '@/types/mind-map'

// 状态
const selectedTheme = ref<'light' | 'dark' | 'colorful'>('light')
const focusNodeId = ref('tat-theory-center')
const eventLog = ref<Array<{ time: string; type: string; message: string }>>([])

// 添加事件日志
function addLogEntry(type: string, message: string): void {
  const time = new Date().toLocaleTimeString()
  eventLog.value.unshift({ time, type, message })
  
  // 限制日志条数
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20)
  }
}

// 事件处理
function handleNodeClick(node: MindMapNode): void {
  addLogEntry('点击', `点击节点: ${node.label} (${node.id})`)
}

function handleNodeDoubleClick(node: MindMapNode): void {
  addLogEntry('双击', `双击节点: ${node.label} (${node.id})`)
}

function handleNodeHover(node: MindMapNode | null): void {
  if (node) {
    addLogEntry('悬停', `悬停节点: ${node.label} (${node.id})`)
  }
}

// 搜索事件处理
function handleSearch(query: string, results: SearchResult[]): void {
  addLogEntry('搜索', `搜索 "${query}" 找到 ${results.length} 个结果`)
}

function handleSearchSelect(result: SearchResult): void {
  addLogEntry('搜索选择', `选择搜索结果: ${result.node.label}`)
  focusNodeId.value = result.nodeId
}

function handleSearchFocus(nodeId: string): void {
  addLogEntry('搜索定位', `定位到节点: ${nodeId}`)
  focusNodeId.value = nodeId
}

function handleSearchClear(): void {
  addLogEntry('搜索', '清除搜索')
}

// 导航事件处理
function handleNavigate(nodeId: string): void {
  addLogEntry('导航', `导航到节点: ${nodeId}`)
  focusNodeId.value = nodeId
}

function handlePathStart(path: LearningPath): void {
  addLogEntry('学习路径', `开始学习路径: ${path.title}`)
}

function handlePathStep(stepIndex: number, nodeId: string): void {
  addLogEntry('路径步骤', `路径步骤 ${stepIndex + 1}: ${nodeId}`)
  focusNodeId.value = nodeId
}

// 学习路径生成器事件处理
function handlePathGenerated(path: LearningPath): void {
  addLogEntry('路径生成', `生成学习路径: ${path.title}`)
}

function handlePathStarted(path: LearningPath): void {
  addLogEntry('路径开始', `开始学习路径: ${path.title}`)
  if (path.nodeSequence.length > 0) {
    focusNodeId.value = path.nodeSequence[0]
  }
}

function handleStepChanged(stepIndex: number, nodeId: string): void {
  addLogEntry('学习步骤', `学习步骤 ${stepIndex + 1}: ${nodeId}`)
  focusNodeId.value = nodeId
}

function handleProgressUpdated(progress: number): void {
  addLogEntry('学习进度', `学习进度更新: ${Math.round(progress)}%`)
}
</script>

<style scoped>
.mind-map-test-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1rem;
  color: #6b7280;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.search-container {
  flex: 1;
  max-width: 500px;
}

.generator-container {
  flex-shrink: 0;
}

.mind-map-container {
  position: relative;
  margin-bottom: 30px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.test-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 500;
  color: #374151;
  min-width: 80px;
}

.control-group select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.event-log {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.event-log h3 {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
}

.log-content {
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  gap: 15px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  color: #6b7280;
  font-family: monospace;
  min-width: 80px;
}

.log-type {
  color: #3b82f6;
  font-weight: 500;
  min-width: 60px;
}

.log-message {
  color: #374151;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .mind-map-container {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .mind-map-test-view {
    padding: 15px;
  }
  
  .test-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .control-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .control-group label {
    min-width: auto;
  }
}
</style>