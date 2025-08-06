<template>
  <div class="path-animation-controller">
    <div class="controller-header">
      <h4 class="controller-title">理论作用机制演示</h4>
      <div class="controller-status">
        <span class="status-indicator" :class="{ active: isPlaying }"></span>
        <span class="status-text">{{ isPlaying ? '播放中' : '已暂停' }}</span>
      </div>
    </div>

    <div class="animation-controls">
      <button 
        @click="togglePlayPause" 
        class="control-btn primary"
        :disabled="!hasSequence"
      >
        <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
        {{ isPlaying ? '暂停' : '播放' }}
      </button>

      <button 
        @click="stopAnimation" 
        class="control-btn"
        :disabled="!hasSequence"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18"/>
        </svg>
        停止
      </button>

      <button 
        @click="resetAnimation" 
        class="control-btn"
        :disabled="!hasSequence"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M3 21v-5h5"/>
        </svg>
        重置
      </button>
    </div>

    <div class="sequence-selector">
      <label class="selector-label">选择演示序列:</label>
      <select v-model="selectedSequence" @change="onSequenceChange" class="sequence-select">
        <option value="">请选择演示序列</option>
        <option 
          v-for="sequence in animationSequences" 
          :key="sequence.id"
          :value="sequence.id"
        >
          {{ sequence.name }}
        </option>
      </select>
    </div>

    <div v-if="currentSequence" class="sequence-info">
      <h5 class="sequence-title">{{ currentSequence.name }}</h5>
      <p class="sequence-description">{{ currentSequence.description }}</p>
      
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">进度</span>
          <span class="progress-text">{{ currentStep + 1 }} / {{ currentSequence.steps.length }}</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(currentStep + 1) / currentSequence.steps.length * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="steps-list">
        <div 
          v-for="(step, index) in currentSequence.steps" 
          :key="step.id"
          class="step-item"
          :class="{ 
            active: index === currentStep, 
            completed: index < currentStep,
            upcoming: index > currentStep 
          }"
          @click="jumpToStep(index)"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description">{{ step.description }}</div>
            <div class="step-path" v-if="step.pathInfo">
              {{ step.pathInfo.source }} → {{ step.pathInfo.target }}
            </div>
          </div>
          <div class="step-status">
            <svg v-if="index < currentStep" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            <svg v-else-if="index === currentStep" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="speed-control">
      <label class="speed-label">播放速度:</label>
      <div class="speed-options">
        <button 
          v-for="speed in speedOptions" 
          :key="speed.value"
          @click="setAnimationSpeed(speed.value)"
          class="speed-btn"
          :class="{ active: animationSpeed === speed.value }"
        >
          {{ speed.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface AnimationStep {
  id: string
  title: string
  description: string
  pathInfo?: {
    source: string
    target: string
    type: 'direct' | 'mediated' | 'feedback'
  }
  duration: number
  delay: number
}

interface AnimationSequence {
  id: string
  name: string
  description: string
  steps: AnimationStep[]
}

const emit = defineEmits<{
  play: []
  pause: []
  stop: []
  reset: []
  stepChange: [step: number]
  sequenceChange: [sequenceId: string]
  speedChange: [speed: number]
}>()

// State
const isPlaying = ref(false)
const selectedSequence = ref('')
const currentStep = ref(0)
const animationSpeed = ref(1)

// Animation sequences
const animationSequences: AnimationSequence[] = [
  {
    id: 'basic-activation',
    name: '基础特质激发过程',
    description: '展示从情境因素到特质激发再到行为结果的基本过程',
    steps: [
      {
        id: 'step-1',
        title: '情境因素识别',
        description: '组织、社会、任务层面的情境因素被识别',
        duration: 2000,
        delay: 500
      },
      {
        id: 'step-2',
        title: '特质激发',
        description: '情境因素激发个体的相关人格特质',
        pathInfo: {
          source: '情境因素',
          target: '人格特质',
          type: 'direct'
        },
        duration: 2500,
        delay: 1000
      },
      {
        id: 'step-3',
        title: '行为表达',
        description: '激发的特质通过具体的工作行为表达出来',
        pathInfo: {
          source: '特质激发',
          target: '工作行为',
          type: 'mediated'
        },
        duration: 2000,
        delay: 800
      },
      {
        id: 'step-4',
        title: '绩效产出',
        description: '工作行为最终影响工作绩效',
        pathInfo: {
          source: '工作行为',
          target: '工作绩效',
          type: 'direct'
        },
        duration: 1500,
        delay: 600
      }
    ]
  },
  {
    id: 'motivation-pathway',
    name: '激励机制路径',
    description: '展示特质激发如何通过内在和外在激励影响绩效',
    steps: [
      {
        id: 'step-1',
        title: '特质激发启动',
        description: '个体特质被情境因素激发',
        duration: 2000,
        delay: 500
      },
      {
        id: 'step-2',
        title: '内在激励产生',
        description: '特质激发促进内在激励的产生',
        pathInfo: {
          source: '特质激发',
          target: '内在激励',
          type: 'mediated'
        },
        duration: 2500,
        delay: 1000
      },
      {
        id: 'step-3',
        title: '外在激励调节',
        description: '特质激发同时影响外在激励的效果',
        pathInfo: {
          source: '特质激发',
          target: '外在激励',
          type: 'mediated'
        },
        duration: 2000,
        delay: 800
      },
      {
        id: 'step-4',
        title: '绩效提升',
        description: '激励因素共同作用提升工作绩效',
        pathInfo: {
          source: '外在激励',
          target: '工作绩效',
          type: 'direct'
        },
        duration: 1500,
        delay: 600
      }
    ]
  },
  {
    id: 'feedback-loop',
    name: '反馈循环机制',
    description: '展示工作行为如何反向影响任务环境的反馈循环',
    steps: [
      {
        id: 'step-1',
        title: '初始行为',
        description: '个体表现出特定的工作行为',
        duration: 2000,
        delay: 500
      },
      {
        id: 'step-2',
        title: '环境反馈',
        description: '工作行为反向影响任务环境',
        pathInfo: {
          source: '工作行为',
          target: '任务层面',
          type: 'feedback'
        },
        duration: 2500,
        delay: 1000
      },
      {
        id: 'step-3',
        title: '环境调整',
        description: '任务环境发生相应调整',
        duration: 2000,
        delay: 800
      },
      {
        id: 'step-4',
        title: '循环强化',
        description: '调整后的环境进一步影响特质激发',
        pathInfo: {
          source: '任务层面',
          target: '人格特质',
          type: 'direct'
        },
        duration: 1500,
        delay: 600
      }
    ]
  }
]

// Speed options
const speedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 }
]

// Computed
const currentSequence = computed(() => {
  return animationSequences.find(seq => seq.id === selectedSequence.value) || null
})

const hasSequence = computed(() => {
  return !!currentSequence.value
})

// Methods
const togglePlayPause = () => {
  if (isPlaying.value) {
    pauseAnimation()
  } else {
    playAnimation()
  }
}

const playAnimation = () => {
  if (!currentSequence.value) return
  isPlaying.value = true
  emit('play')
}

const pauseAnimation = () => {
  isPlaying.value = false
  emit('pause')
}

const stopAnimation = () => {
  isPlaying.value = false
  currentStep.value = 0
  emit('stop')
}

const resetAnimation = () => {
  isPlaying.value = false
  currentStep.value = 0
  emit('reset')
}

const jumpToStep = (stepIndex: number) => {
  if (!currentSequence.value) return
  currentStep.value = stepIndex
  emit('stepChange', stepIndex)
}

const onSequenceChange = () => {
  currentStep.value = 0
  isPlaying.value = false
  emit('sequenceChange', selectedSequence.value)
}

const setAnimationSpeed = (speed: number) => {
  animationSpeed.value = speed
  emit('speedChange', speed)
}

// Watchers
watch(currentStep, (newStep) => {
  emit('stepChange', newStep)
})

// Expose methods for parent component
defineExpose({
  nextStep: () => {
    if (currentSequence.value && currentStep.value < currentSequence.value.steps.length - 1) {
      currentStep.value++
    }
  },
  prevStep: () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  },
  setPlaying: (playing: boolean) => {
    isPlaying.value = playing
  }
})
</script>

<style scoped>
.path-animation-controller {
  @apply bg-white rounded-lg shadow-lg p-4 space-y-4;
}

.controller-header {
  @apply flex items-center justify-between;
}

.controller-title {
  @apply text-lg font-semibold text-gray-900;
}

.controller-status {
  @apply flex items-center gap-2;
}

.status-indicator {
  @apply w-3 h-3 rounded-full bg-gray-300;
}

.status-indicator.active {
  @apply bg-green-500 animate-pulse;
}

.status-text {
  @apply text-sm text-gray-600;
}

.animation-controls {
  @apply flex items-center gap-2;
}

.control-btn {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.control-btn.primary {
  @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700;
}

.sequence-selector {
  @apply space-y-2;
}

.selector-label {
  @apply block text-sm font-medium text-gray-700;
}

.sequence-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.sequence-info {
  @apply space-y-4;
}

.sequence-title {
  @apply text-base font-semibold text-gray-900;
}

.sequence-description {
  @apply text-sm text-gray-600;
}

.progress-section {
  @apply space-y-2;
}

.progress-header {
  @apply flex items-center justify-between;
}

.progress-label {
  @apply text-sm font-medium text-gray-700;
}

.progress-text {
  @apply text-sm text-gray-500;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2;
}

.progress-fill {
  @apply bg-blue-600 h-2 rounded-full transition-all duration-300;
}

.steps-list {
  @apply space-y-2;
}

.step-item {
  @apply flex items-start gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors;
}

.step-item.active {
  @apply bg-blue-50 border-blue-300;
}

.step-item.completed {
  @apply bg-green-50 border-green-300;
}

.step-item.upcoming {
  @apply opacity-60;
}

.step-number {
  @apply w-6 h-6 rounded-full bg-gray-300 text-white text-xs font-bold flex items-center justify-center flex-shrink-0;
}

.step-item.active .step-number {
  @apply bg-blue-600;
}

.step-item.completed .step-number {
  @apply bg-green-600;
}

.step-content {
  @apply flex-1 space-y-1;
}

.step-title {
  @apply font-medium text-gray-900;
}

.step-description {
  @apply text-sm text-gray-600;
}

.step-path {
  @apply text-xs text-blue-600 font-mono;
}

.step-status {
  @apply flex-shrink-0;
}

.speed-control {
  @apply space-y-2;
}

.speed-label {
  @apply block text-sm font-medium text-gray-700;
}

.speed-options {
  @apply flex items-center gap-1;
}

.speed-btn {
  @apply px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors;
}

.speed-btn.active {
  @apply bg-blue-600 text-white border-blue-600;
}
</style>