<template>
  <div class="learning-path-generator">
    <!-- 生成器触发按钮 -->
    <button 
      @click="openGenerator"
      class="generator-trigger"
      title="生成个性化学习路径"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      生成学习路径
    </button>

    <!-- 生成器模态框 -->
    <div v-if="showGenerator" class="generator-modal" @click="closeGenerator">
      <div class="generator-content" @click.stop>
        <div class="generator-header">
          <h2>个性化学习路径生成器</h2>
          <button @click="closeGenerator" class="close-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="generator-body">
          <!-- 步骤指示器 -->
          <div class="step-indicator">
            <div
              v-for="(step, index) in steps"
              :key="step.id"
              :class="['step-item', {
                active: currentStep === index,
                completed: currentStep > index,
                disabled: currentStep < index
              }]"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-label">{{ step.label }}</div>
            </div>
          </div>

          <!-- 步骤内容 -->
          <div class="step-content">
            <!-- 步骤1: 学习目标 -->
            <div v-if="currentStep === 0" class="step-panel">
              <h3>设定学习目标</h3>
              <p class="step-description">选择您想要深入学习的TAT理论领域</p>

              <div class="goal-selection">
                <div class="goal-categories">
                  <button
                    v-for="category in goalCategories"
                    :key="category.id"
                    @click="toggleGoalCategory(category.id)"
                    :class="['goal-category', { selected: selectedGoals.includes(category.id) }]"
                  >
                    <div class="category-icon">{{ category.icon }}</div>
                    <div class="category-info">
                      <div class="category-title">{{ category.title }}</div>
                      <div class="category-description">{{ category.description }}</div>
                    </div>
                  </button>
                </div>

                <div v-if="selectedGoals.length > 0" class="selected-goals">
                  <h4>已选择的学习目标:</h4>
                  <div class="goal-tags">
                    <span
                      v-for="goalId in selectedGoals"
                      :key="goalId"
                      class="goal-tag"
                    >
                      {{ getGoalCategory(goalId)?.title }}
                      <button @click="removeGoal(goalId)" class="remove-goal">×</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 步骤2: 个人偏好 -->
            <div v-if="currentStep === 1" class="step-panel">
              <h3>个人学习偏好</h3>
              <p class="step-description">告诉我们您的学习习惯和偏好</p>

              <div class="preference-form">
                <div class="form-group">
                  <label>学习难度偏好</label>
                  <div class="radio-group">
                    <label
                      v-for="difficulty in difficultyOptions"
                      :key="difficulty.value"
                      class="radio-option"
                    >
                      <input
                        type="radio"
                        :value="difficulty.value"
                        v-model="preferences.difficulty"
                      />
                      <span class="radio-label">
                        <strong>{{ difficulty.label }}</strong>
                        <small>{{ difficulty.description }}</small>
                      </span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label>学习时间安排</label>
                  <div class="time-options">
                    <button
                      v-for="timeOption in timeOptions"
                      :key="timeOption.value"
                      @click="preferences.timePreference = timeOption.value as 'short' | 'medium' | 'long'"
                      :class="['time-option', { selected: preferences.timePreference === timeOption.value }]"
                    >
                      <div class="time-duration">{{ timeOption.duration }}</div>
                      <div class="time-label">{{ timeOption.label }}</div>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>学习风格偏好</label>
                  <div class="style-options">
                    <label
                      v-for="style in learningStyles"
                      :key="style.id"
                      class="style-option"
                    >
                      <input
                        type="checkbox"
                        :value="style.id"
                        v-model="preferences.learningStyles"
                      />
                      <div class="style-content">
                        <div class="style-icon">{{ style.icon }}</div>
                        <div class="style-info">
                          <div class="style-title">{{ style.title }}</div>
                          <div class="style-description">{{ style.description }}</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label>当前知识水平</label>
                  <div class="knowledge-slider">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      v-model="preferences.knowledgeLevel"
                      class="slider"
                    />
                    <div class="slider-labels">
                      <span>初学者</span>
                      <span class="current-level">{{ preferences.knowledgeLevel }}/10</span>
                      <span>专家</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 步骤3: 路径预览 -->
            <div v-if="currentStep === 2" class="step-panel">
              <h3>路径预览与调整</h3>
              <p class="step-description">预览生成的学习路径，您可以进行调整</p>

              <div v-if="generatedPaths.length > 0" class="path-preview">
                <div class="path-options">
                  <div
                    v-for="(path, index) in generatedPaths"
                    :key="path.id"
                    :class="['path-option', { selected: selectedPathIndex === index }]"
                    @click="selectedPathIndex = index"
                  >
                    <div class="path-header">
                      <h4>{{ path.title }}</h4>
                      <div class="path-badges">
                        <span class="difficulty-badge">{{ getDifficultyLabel(path.difficulty) }}</span>
                        <span class="time-badge">{{ path.estimatedTime }}分钟</span>
                      </div>
                    </div>
                    <div class="path-description">{{ path.description }}</div>
                    <div class="path-stats">
                      <span>{{ path.nodeSequence.length }}个节点</span>
                      <span>{{ path.objectives.length }}个学习目标</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedPath" class="path-details">
                  <div class="path-visualization">
                    <h4>学习路径图</h4>
                    <div class="path-flow">
                      <div
                        v-for="(nodeId, index) in selectedPath.nodeSequence"
                        :key="nodeId"
                        class="flow-node"
                      >
                        <div class="node-step">{{ index + 1 }}</div>
                        <div class="node-info">
                          <div class="node-title">{{ getNodeLabel(nodeId) }}</div>
                          <div class="node-category">{{ getNodeCategory(nodeId) }}</div>
                        </div>
                        <div v-if="index < selectedPath.nodeSequence.length - 1" class="flow-arrow">→</div>
                      </div>
                    </div>
                  </div>

                  <div class="path-objectives">
                    <h4>学习目标</h4>
                    <ul class="objectives-list">
                      <li v-for="objective in selectedPath.objectives" :key="objective">
                        {{ objective }}
                      </li>
                    </ul>
                  </div>

                  <div class="path-customization">
                    <h4>路径调整</h4>
                    <div class="customization-options">
                      <button @click="regeneratePath" class="customize-btn">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        重新生成
                      </button>
                      <button @click="customizePath" class="customize-btn">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        自定义调整
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="generating-state">
                <div class="spinner"></div>
                <p>正在生成个性化学习路径...</p>
              </div>
            </div>
          </div>

          <!-- 步骤导航 -->
          <div class="step-navigation">
            <button
              @click="previousStep"
              :disabled="currentStep === 0"
              class="nav-btn secondary"
            >
              上一步
            </button>

            <button
              v-if="currentStep < steps.length - 1"
              @click="nextStep"
              :disabled="!canProceedToNext"
              class="nav-btn primary"
            >
              下一步
            </button>

            <button
              v-else
              @click="startLearningPath"
              :disabled="!selectedPath"
              class="nav-btn primary"
            >
              开始学习
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习进度跟踪 -->
    <div v-if="activeLearningPath" class="learning-progress">
      <div class="progress-header">
        <h3>{{ activeLearningPath.title }}</h3>
        <button @click="pauseLearning" class="pause-btn">暂停</button>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: learningProgress + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ Math.round(learningProgress) }}%</span>
      </div>

      <div class="current-step">
        <div class="step-info">
          <span class="step-number">步骤 {{ currentLearningStep + 1 }}/{{ activeLearningPath.nodeSequence.length }}</span>
          <span class="step-title">{{ getCurrentStepTitle() }}</span>
        </div>
        
        <div class="step-actions">
          <button 
            @click="previousLearningStep" 
            :disabled="currentLearningStep === 0"
            class="step-btn"
          >
            上一步
          </button>
          <button 
            @click="nextLearningStep" 
            :disabled="currentLearningStep >= activeLearningPath.nodeSequence.length - 1"
            class="step-btn"
          >
            下一步
          </button>
        </div>
      </div>

      <div class="learning-stats">
        <div class="stat-item">
          <span class="stat-label">已完成</span>
          <span class="stat-value">{{ completedSteps }}/{{ activeLearningPath.nodeSequence.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">预计剩余</span>
          <span class="stat-value">{{ remainingTime }}分钟</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">学习效率</span>
          <span class="stat-value">{{ learningEfficiency }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mindMapService } from '@/services/mind-map-service'
import type { LearningPath, MindMapNode } from '@/types/mind-map'

// Emits
const emit = defineEmits<{
  pathGenerated: [path: LearningPath]
  pathStarted: [path: LearningPath]
  stepChanged: [stepIndex: number, nodeId: string]
  progressUpdated: [progress: number]
}>()

// State
const showGenerator = ref(false)
const currentStep = ref(0)
const selectedGoals = ref<string[]>([])
const selectedPathIndex = ref(0)
const generatedPaths = ref<LearningPath[]>([])

// 学习偏好
const preferences = ref({
  difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
  timePreference: 'medium' as 'short' | 'medium' | 'long',
  learningStyles: [] as string[],
  knowledgeLevel: 5
})

// 活跃学习路径
const activeLearningPath = ref<LearningPath | null>(null)
const currentLearningStep = ref(0)
const stepStartTimes = ref<number[]>([])
const stepCompletionTimes = ref<number[]>([])

// 步骤配置
const steps = [
  { id: 'goals', label: '学习目标' },
  { id: 'preferences', label: '个人偏好' },
  { id: 'preview', label: '路径预览' }
]

// 学习目标分类
const goalCategories = [
  {
    id: 'theory-foundation',
    title: '理论基础',
    description: '深入理解TAT理论的核心概念和发展历程',
    icon: '📚'
  },
  {
    id: 'practical-application',
    title: '实践应用',
    description: '学习如何在实际工作中应用TAT理论',
    icon: '🎯'
  },
  {
    id: 'research-methods',
    title: '研究方法',
    description: '掌握TAT理论相关的研究方法和测量工具',
    icon: '🔬'
  },
  {
    id: 'case-studies',
    title: '案例分析',
    description: '通过实际案例深入理解理论应用',
    icon: '📊'
  },
  {
    id: 'advanced-topics',
    title: '前沿发展',
    description: '了解TAT理论的最新发展和未来趋势',
    icon: '🚀'
  }
]

// 难度选项
const difficultyOptions = [
  {
    value: 'beginner',
    label: '初级',
    description: '适合初学者，注重基础概念理解'
  },
  {
    value: 'intermediate',
    label: '中级',
    description: '适合有一定基础的学习者，平衡理论与应用'
  },
  {
    value: 'advanced',
    label: '高级',
    description: '适合专业人士，深入探讨复杂概念'
  }
]

// 时间选项
const timeOptions = [
  { value: 'short', duration: '15-30分钟', label: '快速学习' },
  { value: 'medium', duration: '45-60分钟', label: '深度学习' },
  { value: 'long', duration: '90-120分钟', label: '系统学习' }
]

// 学习风格
const learningStyles = [
  {
    id: 'visual',
    title: '视觉学习',
    description: '通过图表、图像和可视化内容学习',
    icon: '👁️'
  },
  {
    id: 'reading',
    title: '阅读学习',
    description: '通过文本、文档和书面材料学习',
    icon: '📖'
  },
  {
    id: 'interactive',
    title: '互动学习',
    description: '通过实践操作和互动体验学习',
    icon: '🤝'
  },
  {
    id: 'structured',
    title: '结构化学习',
    description: '按照清晰的步骤和逻辑顺序学习',
    icon: '📋'
  }
]

// Computed
const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 0:
      return selectedGoals.value.length > 0
    case 1:
      return preferences.value.difficulty && preferences.value.timePreference
    case 2:
      return generatedPaths.value.length > 0
    default:
      return false
  }
})

const selectedPath = computed(() => {
  return generatedPaths.value[selectedPathIndex.value] || null
})

const learningProgress = computed(() => {
  if (!activeLearningPath.value) return 0
  return (currentLearningStep.value / Math.max(1, activeLearningPath.value.nodeSequence.length - 1)) * 100
})

const completedSteps = computed(() => currentLearningStep.value)

const remainingTime = computed(() => {
  if (!activeLearningPath.value) return 0
  const totalTime = activeLearningPath.value.estimatedTime
  const progressRatio = learningProgress.value / 100
  return Math.round(totalTime * (1 - progressRatio))
})

const learningEfficiency = computed(() => {
  if (stepCompletionTimes.value.length === 0) return 100
  
  // 计算平均完成时间与预期时间的比率
  const avgCompletionTime = stepCompletionTimes.value.reduce((sum, time) => sum + time, 0) / stepCompletionTimes.value.length
  const expectedTimePerStep = activeLearningPath.value ? activeLearningPath.value.estimatedTime / activeLearningPath.value.nodeSequence.length : 15
  
  return Math.round(Math.max(0, Math.min(100, (expectedTimePerStep / avgCompletionTime) * 100)))
})

// 方法
function openGenerator(): void {
  showGenerator.value = true
  currentStep.value = 0
  resetGeneratorState()
}

function closeGenerator(): void {
  showGenerator.value = false
}

function resetGeneratorState(): void {
  selectedGoals.value = []
  preferences.value = {
    difficulty: 'intermediate',
    timePreference: 'medium',
    learningStyles: [],
    knowledgeLevel: 5
  }
  generatedPaths.value = []
  selectedPathIndex.value = 0
}

function toggleGoalCategory(categoryId: string): void {
  const index = selectedGoals.value.indexOf(categoryId)
  if (index > -1) {
    selectedGoals.value.splice(index, 1)
  } else {
    selectedGoals.value.push(categoryId)
  }
}

function removeGoal(goalId: string): void {
  const index = selectedGoals.value.indexOf(goalId)
  if (index > -1) {
    selectedGoals.value.splice(index, 1)
  }
}

function getGoalCategory(id: string) {
  return goalCategories.find(cat => cat.id === id)
}

function previousStep(): void {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function nextStep(): void {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    
    // 如果进入预览步骤，生成学习路径
    if (currentStep.value === 2) {
      generateLearningPaths()
    }
  }
}

async function generateLearningPaths(): Promise<void> {
  generatedPaths.value = []
  
  try {
    // 模拟路径生成过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 基于用户选择生成多个路径选项
    const paths: LearningPath[] = []
    
    for (let i = 0; i < 3; i++) {
      const path = await generateSinglePath(i)
      if (path) {
        paths.push(path)
      }
    }
    
    generatedPaths.value = paths
    selectedPathIndex.value = 0
    
    emit('pathGenerated', paths[0])
  } catch (error) {
    console.error('生成学习路径失败:', error)
  }
}

async function generateSinglePath(variant: number): Promise<LearningPath | null> {
  const structure = mindMapService.getStructure()
  const startNodeId = structure.centralTopic.id
  
  // 根据选择的目标找到目标节点
  const targetNodes = selectedGoals.value.map(goalId => {
    switch (goalId) {
      case 'theory-foundation':
        return 'theoretical-foundation'
      case 'practical-application':
        return 'research-applications'
      case 'research-methods':
        return 'measurement-tools'
      case 'case-studies':
        return 'digital-transformation'
      case 'advanced-topics':
        return 'future-directions'
      default:
        return 'theoretical-foundation'
    }
  })
  
  if (targetNodes.length === 0) return null
  
  const targetNodeId = targetNodes[variant % targetNodes.length]
  
  // 生成路径
  const path = mindMapService.generateLearningPath(startNodeId, targetNodeId, {
    difficulty: preferences.value.difficulty,
    maxSteps: getMaxStepsForTimePreference(),
    includePrerequisites: true
  })
  
  if (path) {
    // 自定义路径标题和描述
    path.title = generatePathTitle(variant)
    path.description = generatePathDescription(variant)
    path.estimatedTime = calculateEstimatedTime(path.nodeSequence.length)
  }
  
  return path
}

function getMaxStepsForTimePreference(): number {
  switch (preferences.value.timePreference) {
    case 'short': return 5
    case 'medium': return 8
    case 'long': return 12
    default: return 8
  }
}

function generatePathTitle(variant: number): string {
  const titles = [
    '基础到应用完整路径',
    '理论深度探索路径',
    '实践导向学习路径'
  ]
  return titles[variant] || `学习路径 ${variant + 1}`
}

function generatePathDescription(variant: number): string {
  const descriptions = [
    '从基础概念开始，逐步深入到实际应用，适合系统性学习',
    '深入探讨理论内涵和发展脉络，适合理论研究者',
    '注重实践应用和案例分析，适合实务工作者'
  ]
  return descriptions[variant] || '个性化定制的学习路径'
}

function calculateEstimatedTime(nodeCount: number): number {
  const baseTimePerNode = {
    short: 5,
    medium: 8,
    long: 12
  }[preferences.value.timePreference] || 8
  
  const difficultyMultiplier = {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.3
  }[preferences.value.difficulty] || 1.0
  
  return Math.round(nodeCount * baseTimePerNode * difficultyMultiplier)
}

function regeneratePath(): void {
  generateLearningPaths()
}

function customizePath(): void {
  // 实现路径自定义功能
  console.log('自定义路径功能')
}

function startLearningPath(): void {
  if (!selectedPath.value) return
  
  activeLearningPath.value = selectedPath.value
  currentLearningStep.value = 0
  stepStartTimes.value = [Date.now()]
  stepCompletionTimes.value = []
  
  showGenerator.value = false
  
  emit('pathStarted', selectedPath.value)
  
  // 导航到第一个节点
  if (selectedPath.value.nodeSequence.length > 0) {
    emit('stepChanged', 0, selectedPath.value.nodeSequence[0])
  }
}

function pauseLearning(): void {
  activeLearningPath.value = null
  currentLearningStep.value = 0
}

function previousLearningStep(): void {
  if (currentLearningStep.value > 0) {
    currentLearningStep.value--
    updateStepProgress()
  }
}

function nextLearningStep(): void {
  if (activeLearningPath.value && currentLearningStep.value < activeLearningPath.value.nodeSequence.length - 1) {
    // 记录当前步骤完成时间
    const now = Date.now()
    const stepStartTime = stepStartTimes.value[currentLearningStep.value]
    const completionTime = (now - stepStartTime) / 1000 / 60 // 转换为分钟
    stepCompletionTimes.value[currentLearningStep.value] = completionTime
    
    currentLearningStep.value++
    stepStartTimes.value[currentLearningStep.value] = now
    
    updateStepProgress()
  }
}

function updateStepProgress(): void {
  if (!activeLearningPath.value) return
  
  const nodeId = activeLearningPath.value.nodeSequence[currentLearningStep.value]
  emit('stepChanged', currentLearningStep.value, nodeId)
  emit('progressUpdated', learningProgress.value)
  
  // 更新学习进度到服务
  mindMapService.updateLearningProgress(nodeId, 1.0)
}

function getCurrentStepTitle(): string {
  if (!activeLearningPath.value) return ''
  
  const nodeId = activeLearningPath.value.nodeSequence[currentLearningStep.value]
  return getNodeLabel(nodeId)
}

// 工具函数
function getNodeLabel(nodeId: string): string {
  const structure = mindMapService.getStructure()
  const node = structure.nodes[nodeId]
  return node ? node.label : '未知节点'
}

function getNodeCategory(nodeId: string): string {
  const structure = mindMapService.getStructure()
  const node = structure.nodes[nodeId]
  if (!node) return ''
  
  const categoryLabels: Record<string, string> = {
    core: '核心',
    concept: '概念',
    application: '应用',
    research: '研究',
    method: '方法',
    theory: '理论'
  }
  
  return categoryLabels[node.category] || node.category
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return labels[difficulty] || difficulty
}

// 生命周期
onMounted(() => {
  // 初始化组件
})
</script>

<style scoped>
.learning-path-generator {
  position: relative;
}

/* 生成器触发按钮 */
.generator-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.generator-trigger:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
}

/* 生成器模态框 */
.generator-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.generator-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.generator-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.generator-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  position: relative;
}

.step-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 25%;
  right: 25%;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.step-item.active .step-number {
  background: #3b82f6;
  color: white;
}

.step-item.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

.step-item.active .step-label {
  color: #3b82f6;
}

.step-item.completed .step-label {
  color: #10b981;
}

/* 步骤内容 */
.step-content {
  min-height: 400px;
}

.step-panel h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.step-description {
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 16px;
}

/* 目标选择 */
.goal-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.goal-category {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.goal-category:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.goal-category.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.category-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.category-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.selected-goals {
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.selected-goals h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #166534;
}

.goal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.goal-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #dcfce7;
  color: #166534;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.remove-goal {
  background: none;
  border: none;
  cursor: pointer;
  color: #166534;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  margin-left: 4px;
}

/* 偏好表单 */
.preference-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group label {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.radio-option input[type="radio"] {
  margin-top: 2px;
}

.radio-label {
  flex: 1;
}

.radio-label strong {
  display: block;
  color: #1f2937;
  margin-bottom: 2px;
}

.radio-label small {
  color: #6b7280;
  font-size: 14px;
}

.time-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.time-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-option:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.time-option.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.time-duration {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.time-label {
  font-size: 14px;
  color: #6b7280;
}

.style-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.style-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.style-option:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.style-option input[type="checkbox"]:checked + .style-content {
  color: #3b82f6;
}

.style-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.style-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.style-info {
  flex: 1;
}

.style-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.style-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.knowledge-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #6b7280;
}

.current-level {
  font-weight: 600;
  color: #3b82f6;
}

/* 路径预览 */
.path-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.path-option {
  padding: 16px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.path-option:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.path-option.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.path-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.path-badges {
  display: flex;
  gap: 8px;
}

.difficulty-badge,
.time-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.difficulty-badge {
  background: #fef3c7;
  color: #92400e;
}

.time-badge {
  background: #dbeafe;
  color: #1e40af;
}

.path-description {
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.4;
}

.path-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
}

.path-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.path-visualization h4,
.path-objectives h4,
.path-customization h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.path-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.flow-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.node-step {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #10b981;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.node-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.node-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
}

.node-category {
  font-size: 11px;
  color: #6b7280;
}

.flow-arrow {
  color: #10b981;
  font-size: 18px;
  font-weight: bold;
}

.objectives-list {
  margin: 0;
  padding-left: 20px;
}

.objectives-list li {
  margin-bottom: 6px;
  color: #374151;
  line-height: 1.4;
}

.customization-options {
  display: flex;
  gap: 12px;
}

.customize-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s;
}

.customize-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.generating-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 步骤导航 */
.step-navigation {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 24px;
}

.nav-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.secondary {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.nav-btn.secondary:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.nav-btn.primary {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.nav-btn.primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

/* 学习进度跟踪 */
.learning-progress {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 100;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.pause-btn {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.pause-btn:hover {
  background: #dc2626;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
  min-width: 40px;
}

.current-step {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-number {
  font-size: 12px;
  color: #6b7280;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.step-actions {
  display: flex;
  gap: 8px;
}

.step-btn {
  padding: 6px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #374151;
  transition: all 0.2s;
}

.step-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.step-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.learning-stats {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .generator-modal {
    padding: 10px;
  }

  .generator-content {
    max-height: 95vh;
  }

  .generator-body {
    padding: 16px;
  }

  .goal-categories {
    grid-template-columns: 1fr;
  }

  .time-options {
    grid-template-columns: 1fr;
  }

  .style-options {
    grid-template-columns: 1fr;
  }

  .path-flow {
    flex-direction: column;
    align-items: flex-start;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .customization-options {
    flex-direction: column;
  }

  .step-navigation {
    flex-direction: column;
    gap: 12px;
  }

  .learning-progress {
    left: 10px;
    right: 10px;
    bottom: 10px;
  }

  .current-step {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .learning-stats {
    flex-direction: column;
    gap: 8px;
  }
}
</style>