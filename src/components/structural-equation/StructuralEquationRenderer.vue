<template>
  <div class="structural-equation-renderer">
    <div class="renderer-header">
      <h3 class="renderer-title">{{ model.title }}</h3>
      <div class="renderer-controls">
        <button 
          @click="resetView" 
          class="control-btn"
          title="重置视图"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M3 21v-5h5"/>
          </svg>
        </button>
        <button 
          @click="toggleFullscreen" 
          class="control-btn"
          title="全屏模式"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div 
      ref="svgContainer" 
      class="svg-container"
      :class="{ 'fullscreen': isFullscreen }"
    >
      <!-- SVG will be rendered here by D3.js -->
    </div>
    
    <div class="renderer-footer">
      <div class="zoom-controls">
        <button @click="zoomIn" class="zoom-btn">+</button>
        <span class="zoom-level">{{ Math.round(currentZoom * 100) }}%</span>
        <button @click="zoomOut" class="zoom-btn">-</button>
      </div>
      <div class="legend">
        <div class="legend-item" v-for="nodeType in nodeTypes" :key="nodeType.type">
          <div class="legend-color" :style="{ backgroundColor: nodeType.color }"></div>
          <span class="legend-label">{{ nodeType.label }}</span>
        </div>
      </div>
    </div>

    <!-- 路径动画控制器 -->
    <div class="animation-panel" v-if="showAnimationPanel">
      <PathAnimationController
        ref="animationControllerRef"
        @play="handleAnimationPlay"
        @pause="handleAnimationPause"
        @stop="handleAnimationStop"
        @reset="handleAnimationReset"
        @step-change="handleStepChange"
        @sequence-change="handleSequenceChange"
        @speed-change="handleSpeedChange"
      />
    </div>

    <!-- 动画控制按钮 -->
    <button 
      @click="toggleAnimationPanel"
      class="animation-toggle-btn"
      :class="{ active: showAnimationPanel }"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5,3 19,12 5,21"/>
      </svg>
      动画演示
    </button>

    <!-- 节点详情模态框 -->
    <NodeDetailModal
      :is-visible="showNodeDetail"
      :node="selectedNode!"
      :incoming-relationships="selectedNodeIncoming"
      :outgoing-relationships="selectedNodeOutgoing"
      :related-nodes="selectedNodeRelated"
      @close="closeNodeDetail"
      @bookmark="handleBookmark"
      @note="handleNote"
      @share="handleShare"
      v-if="selectedNode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as d3 from 'd3'
import type { StructuralEquationModel, StructuralEquationNode, StructuralEquationRelationship } from '@/types/structural-equation'
import { StructuralEquationD3Renderer } from './StructuralEquationD3Renderer'
import { structuralEquationService } from '@/services/structural-equation-service'
import NodeDetailModal from './NodeDetailModal.vue'
import PathAnimationController from './PathAnimationController.vue'

interface Props {
  model: StructuralEquationModel
}

const props = defineProps<Props>()

// Template refs
const svgContainer = ref<HTMLDivElement>()

// State
const isFullscreen = ref(false)
const currentZoom = ref(1)
const renderer = ref<StructuralEquationD3Renderer>()
const showNodeDetail = ref(false)
const selectedNode = ref<StructuralEquationNode | null>(null)
const selectedNodeIncoming = ref<StructuralEquationRelationship[]>([])
const selectedNodeOutgoing = ref<StructuralEquationRelationship[]>([])
const selectedNodeRelated = ref<StructuralEquationNode[]>([])
const showAnimationPanel = ref(false)
const animationControllerRef = ref()
const currentAnimationSequence = ref<string | null>(null)
const isAnimationPlaying = ref(false)

// Node types for legend
const nodeTypes = [
  { type: 'situational-cue', label: '情境线索', color: '#F3F4F6' },
  { type: 'core-construct', label: '核心构念', color: '#DBEAFE' },
  { type: 'mediator', label: '中介变量', color: '#FEF3C7' },
  { type: 'outcome', label: '结果变量', color: '#ECFDF5' },
  { type: 'final-outcome', label: '最终结果', color: '#FDF2F8' },
  { type: 'motivation', label: '激励因素', color: '#EFF6FF' }
]

// Methods
const initializeRenderer = async () => {
  if (!svgContainer.value) return
  
  renderer.value = new StructuralEquationD3Renderer(
    svgContainer.value,
    props.model
  )
  
  await renderer.value.initialize()
  
  // Listen to zoom changes
  renderer.value.onZoomChange((zoom: number) => {
    currentZoom.value = zoom
  })

  // Listen to node clicks
  renderer.value.onNodeClick((node: any) => {
    handleNodeClick(node.id)
  })
}

const handleNodeClick = (nodeId: string) => {
  const nodeDetails = structuralEquationService.getNodeDetails(nodeId)
  
  if (nodeDetails.node) {
    selectedNode.value = nodeDetails.node
    selectedNodeIncoming.value = nodeDetails.incomingRelationships
    selectedNodeOutgoing.value = nodeDetails.outgoingRelationships
    selectedNodeRelated.value = nodeDetails.relatedNodes
    showNodeDetail.value = true
  }
}

const closeNodeDetail = () => {
  showNodeDetail.value = false
  selectedNode.value = null
  selectedNodeIncoming.value = []
  selectedNodeOutgoing.value = []
  selectedNodeRelated.value = []
}

const handleBookmark = (nodeId: string) => {
  // TODO: 实现收藏功能
  console.log('Bookmark node:', nodeId)
}

const handleNote = (nodeId: string) => {
  // TODO: 实现笔记功能
  console.log('Add note for node:', nodeId)
}

const handleShare = (nodeId: string) => {
  // TODO: 实现分享功能
  console.log('Share node:', nodeId)
}

const toggleAnimationPanel = () => {
  showAnimationPanel.value = !showAnimationPanel.value
}

// Animation handlers
const handleAnimationPlay = async () => {
  if (!renderer.value || !currentAnimationSequence.value) return
  
  isAnimationPlaying.value = true
  renderer.value.setAnimationState(true, 0, currentAnimationSequence.value)
  
  // 执行动画序列
  await executeAnimationSequence(currentAnimationSequence.value)
}

const handleAnimationPause = () => {
  isAnimationPlaying.value = false
  renderer.value?.setAnimationState(false, 0, currentAnimationSequence.value)
  animationControllerRef.value?.setPlaying(false)
}

const handleAnimationStop = () => {
  isAnimationPlaying.value = false
  renderer.value?.setAnimationState(false, 0, null)
  renderer.value?.resetAllHighlights()
  animationControllerRef.value?.setPlaying(false)
}

const handleAnimationReset = () => {
  isAnimationPlaying.value = false
  renderer.value?.setAnimationState(false, 0, currentAnimationSequence.value)
  renderer.value?.resetAllHighlights()
  animationControllerRef.value?.setPlaying(false)
}

const handleStepChange = (step: number) => {
  renderer.value?.setAnimationState(isAnimationPlaying.value, step, currentAnimationSequence.value)
}

const handleSequenceChange = (sequenceId: string) => {
  currentAnimationSequence.value = sequenceId
  renderer.value?.setAnimationState(false, 0, sequenceId)
  renderer.value?.resetAllHighlights()
}

const handleSpeedChange = (speed: number) => {
  renderer.value?.setAnimationSpeed(speed)
}

const executeAnimationSequence = async (sequenceId: string) => {
  if (!renderer.value) return

  // 根据序列ID执行不同的动画
  switch (sequenceId) {
    case 'basic-activation':
      await executeBasicActivationSequence()
      break
    case 'motivation-pathway':
      await executeMotivationPathwaySequence()
      break
    case 'feedback-loop':
      await executeFeedbackLoopSequence()
      break
  }
  
  isAnimationPlaying.value = false
  animationControllerRef.value?.setPlaying(false)
}

const executeBasicActivationSequence = async () => {
  if (!renderer.value) return

  // Step 1: 情境因素识别
  renderer.value.pulseNode('organizational-level', 1000)
  renderer.value.pulseNode('social-level', 1000)
  renderer.value.pulseNode('task-level', 1000)
  animationControllerRef.value?.nextStep()
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 2: 特质激发
  await renderer.value.startPathAnimation('task-level', 'personality-traits', 2500)
  await renderer.value.startPathAnimation('personality-traits', 'trait-activation', 2000)
  animationControllerRef.value?.nextStep()

  // Step 3: 行为表达
  await renderer.value.startPathAnimation('trait-activation', 'work-behavior', 2000)
  animationControllerRef.value?.nextStep()

  // Step 4: 绩效产出
  await renderer.value.startPathAnimation('work-behavior', 'work-performance', 1500)
  animationControllerRef.value?.nextStep()
}

const executeMotivationPathwaySequence = async () => {
  if (!renderer.value) return

  // Step 1: 特质激发启动
  renderer.value.pulseNode('trait-activation', 2000)
  animationControllerRef.value?.nextStep()
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 2: 内在激励产生
  await renderer.value.startPathAnimation('trait-activation', 'intrinsic-motivation', 2500)
  animationControllerRef.value?.nextStep()

  // Step 3: 外在激励调节
  await renderer.value.startPathAnimation('trait-activation', 'extrinsic-motivation', 2000)
  animationControllerRef.value?.nextStep()

  // Step 4: 绩效提升
  await renderer.value.startPathAnimation('extrinsic-motivation', 'work-performance', 1500)
  animationControllerRef.value?.nextStep()
}

const executeFeedbackLoopSequence = async () => {
  if (!renderer.value) return

  // Step 1: 初始行为
  renderer.value.pulseNode('work-behavior', 2000)
  animationControllerRef.value?.nextStep()
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 2: 环境反馈
  await renderer.value.startPathAnimation('work-behavior', 'task-level', 2500)
  animationControllerRef.value?.nextStep()

  // Step 3: 环境调整
  renderer.value.pulseNode('task-level', 2000)
  animationControllerRef.value?.nextStep()
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 4: 循环强化
  await renderer.value.startPathAnimation('task-level', 'personality-traits', 1500)
  animationControllerRef.value?.nextStep()
}

const resetView = () => {
  renderer.value?.resetView()
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  nextTick(() => {
    renderer.value?.resize()
  })
}

const zoomIn = () => {
  renderer.value?.zoomIn()
}

const zoomOut = () => {
  renderer.value?.zoomOut()
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  await initializeRenderer()
})

onUnmounted(() => {
  renderer.value?.destroy()
})
</script>

<style scoped>
.structural-equation-renderer {
  @apply w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden;
}

.renderer-header {
  @apply flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200;
}

.renderer-title {
  @apply text-lg font-semibold text-gray-800;
}

.renderer-controls {
  @apply flex items-center gap-2;
}

.control-btn {
  @apply p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors;
}

.svg-container {
  @apply flex-1 relative overflow-hidden;
  min-height: 600px;
}

.svg-container.fullscreen {
  @apply fixed inset-0 z-50 bg-white;
}

.renderer-footer {
  @apply flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200;
}

.zoom-controls {
  @apply flex items-center gap-2;
}

.zoom-btn {
  @apply w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center font-bold;
}

.zoom-level {
  @apply text-sm text-gray-600 min-w-12 text-center;
}

.legend {
  @apply flex items-center gap-4;
}

.legend-item {
  @apply flex items-center gap-2;
}

.legend-color {
  @apply w-4 h-4 rounded border border-gray-300;
}

.legend-label {
  @apply text-sm text-gray-600;
}

.animation-panel {
  @apply absolute top-4 right-4 w-80 z-10;
}

.animation-toggle-btn {
  @apply fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-20;
}

.animation-toggle-btn.active {
  @apply bg-purple-600 hover:bg-purple-700;
}
</style>