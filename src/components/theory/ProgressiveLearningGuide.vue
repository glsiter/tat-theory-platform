<template>
  <div class="progressive-learning-guide">
    <!-- 学习进度指示器 -->
    <div class="progress-header">
      <div class="progress-info">
        <h2>渐进式学习引导</h2>
        <p>按照科学的学习路径，逐步掌握TAT理论</p>
      </div>
      <div class="progress-stats">
        <div class="stat-item">
          <span class="stat-value">{{ currentStep + 1 }}</span>
          <span class="stat-label">当前步骤</span>
        </div>
        <div class="stat-divider">/</div>
        <div class="stat-item">
          <span class="stat-value">{{ learningSteps.length }}</span>
          <span class="stat-label">总步骤</span>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <span class="progress-percentage">{{ Math.round(progressPercentage) }}%</span>
    </div>

    <!-- 学习步骤 -->
    <div class="learning-steps">
      <div
        v-for="(step, index) in learningSteps"
        :key="step.id"
        :class="['learning-step', {
          'active': index === currentStep,
          'completed': index < currentStep,
          'locked': index > currentStep && !step.unlocked
        }]"
      >
        <!-- 步骤指示器 -->
        <div class="step-indicator">
          <div class="step-number">
            <svg v-if="index < currentStep" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div v-if="index < learningSteps.length - 1" class="step-connector"></div>
        </div>

        <!-- 步骤内容 -->
        <div class="step-content">
          <div class="step-header">
            <h3>{{ step.title }}</h3>
            <div class="step-meta">
              <span class="step-duration">{{ step.duration }}</span>
              <span class="step-difficulty">{{ getDifficultyLabel(step.difficulty) }}</span>
            </div>
          </div>

          <div class="step-description">
            <p>{{ step.description }}</p>
          </div>

          <!-- 学习目标 -->
          <div class="step-objectives">
            <h4>学习目标</h4>
            <ul>
              <li v-for="objective in step.objectives" :key="objective">{{ objective }}</li>
            </ul>
          </div>

          <!-- 学习内容 -->
          <div v-if="index === currentStep" class="step-materials">
            <h4>学习内容</h4>
            <div class="materials-grid">
              <div
                v-for="material in step.materials"
                :key="material.id"
                class="material-item"
                @click="openMaterial(material)"
              >
                <div class="material-icon">{{ getMaterialIcon(material.type) }}</div>
                <div class="material-info">
                  <div class="material-title">{{ material.title }}</div>
                  <div class="material-meta">
                    <span class="material-type">{{ getMaterialTypeLabel(material.type) }}</span>
                    <span v-if="material.duration" class="material-duration">{{ material.duration }}</span>
                  </div>
                </div>
                <div class="material-status">
                  <svg v-if="material.completed" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <div v-else class="completion-circle"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 知识检查 -->
          <div v-if="index === currentStep && step.quiz" class="step-quiz">
            <h4>知识检查</h4>
            <div class="quiz-container">
              <div v-if="!showQuizResults && currentQuizQuestion" class="quiz-question">
                <p>{{ currentQuizQuestion.question }}</p>
                <div class="quiz-options">
                  <button
                    v-for="(option, optionIndex) in currentQuizQuestion.options"
                    :key="optionIndex"
                    @click="selectQuizOption(optionIndex)"
                    :class="['quiz-option', { 'selected': selectedQuizOption === optionIndex }]"
                  >
                    {{ option }}
                  </button>
                </div>
                <button 
                  @click="submitQuizAnswer"
                  :disabled="selectedQuizOption === null"
                  class="submit-quiz-btn"
                >
                  提交答案
                </button>
              </div>

              <div v-else class="quiz-results">
                <div :class="['result-icon', { 'correct': quizCorrect, 'incorrect': !quizCorrect }]">
                  <svg v-if="quizCorrect" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="result-text">
                  <h5>{{ quizCorrect ? '回答正确！' : '回答错误' }}</h5>
                  <p>{{ currentQuizQuestion?.explanation || '' }}</p>
                </div>
                <button @click="nextQuizQuestion" class="next-quiz-btn">
                  {{ hasMoreQuizQuestions ? '下一题' : '完成检查' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 步骤操作 -->
          <div class="step-actions">
            <button
              v-if="index === currentStep && canCompleteStep"
              @click="completeStep"
              class="complete-step-btn"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              完成此步骤
            </button>

            <button
              v-if="index > currentStep && step.unlocked"
              @click="jumpToStep(index)"
              class="jump-step-btn"
            >
              跳转到此步骤
            </button>

            <button
              v-if="index < currentStep"
              @click="reviewStep(index)"
              class="review-step-btn"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              复习此步骤
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习统计 -->
    <div class="learning-stats">
      <h3>学习统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-number">{{ totalLearningTime }}</div>
            <div class="stat-label">总学习时间</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-number">{{ completedMaterials }}</div>
            <div class="stat-label">完成材料</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-number">{{ quizAccuracy }}%</div>
            <div class="stat-label">测试准确率</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-number">{{ earnedBadges }}</div>
            <div class="stat-label">获得徽章</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习建议 -->
    <div v-if="learningRecommendations.length > 0" class="learning-recommendations">
      <h3>个性化建议</h3>
      <div class="recommendations-list">
        <div
          v-for="recommendation in learningRecommendations"
          :key="recommendation.id"
          class="recommendation-item"
        >
          <div class="recommendation-icon">{{ recommendation.icon }}</div>
          <div class="recommendation-content">
            <h4>{{ recommendation.title }}</h4>
            <p>{{ recommendation.description }}</p>
          </div>
          <button
            v-if="recommendation.action"
            @click="executeRecommendation(recommendation)"
            class="recommendation-action"
          >
            {{ recommendation.actionLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface LearningMaterial {
  id: string
  title: string
  type: 'video' | 'article' | 'interactive' | 'quiz' | 'case-study'
  duration?: string
  completed: boolean
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface LearningStep {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  objectives: string[]
  materials: LearningMaterial[]
  quiz?: QuizQuestion[]
  unlocked: boolean
}

interface LearningRecommendation {
  id: string
  title: string
  description: string
  icon: string
  action?: string
  actionLabel?: string
}

// Emits
const emit = defineEmits<{
  stepCompleted: [stepIndex: number]
  materialOpened: [materialId: string]
  recommendationExecuted: [recommendationId: string]
}>()

// State
const currentStep = ref(0)
const selectedQuizOption = ref<number | null>(null)
const showQuizResults = ref(false)
const quizCorrect = ref(false)
const currentQuizIndex = ref(0)

// 学习步骤数据
const learningSteps = ref<LearningStep[]>([
  {
    id: 'introduction',
    title: '理论概述与背景',
    description: '了解TAT理论的基本定义、发展背景和重要意义',
    duration: '30分钟',
    difficulty: 'beginner',
    objectives: [
      '理解TAT理论的基本定义',
      '了解理论的发展历程',
      '掌握理论的核心观点',
      '认识理论的重要意义'
    ],
    materials: [
      {
        id: 'intro-video',
        title: 'TAT理论概述视频',
        type: 'video',
        duration: '15分钟',
        completed: false
      },
      {
        id: 'background-article',
        title: '理论发展背景阅读',
        type: 'article',
        duration: '10分钟',
        completed: false
      },
      {
        id: 'timeline-interactive',
        title: '发展历程互动时间轴',
        type: 'interactive',
        duration: '5分钟',
        completed: false
      }
    ],
    quiz: [
      {
        question: 'TAT理论的核心观点是什么？',
        options: [
          '人格特质决定所有行为',
          '情境因素是行为的唯一决定因素',
          '人格特质只有在相关情境线索存在时才会被激发',
          '行为完全由遗传因素决定'
        ],
        correctAnswer: 2,
        explanation: 'TAT理论的核心观点是人格特质只有在相关的情境线索存在时才会被激发，进而预测和影响个体的行为表现。'
      }
    ],
    unlocked: true
  },
  {
    id: 'core-concepts',
    title: '核心概念深入理解',
    description: '深入学习特质、激发、情境线索等核心概念',
    duration: '45分钟',
    difficulty: 'intermediate',
    objectives: [
      '深入理解特质的概念和特征',
      '掌握激发过程的机制',
      '识别不同类型的情境线索',
      '理解特质相关性的重要性'
    ],
    materials: [
      {
        id: 'concepts-interactive',
        title: '核心概念互动学习',
        type: 'interactive',
        duration: '20分钟',
        completed: false
      },
      {
        id: 'examples-case',
        title: '概念应用案例分析',
        type: 'case-study',
        duration: '15分钟',
        completed: false
      },
      {
        id: 'concepts-quiz',
        title: '概念理解测试',
        type: 'quiz',
        duration: '10分钟',
        completed: false
      }
    ],
    quiz: [
      {
        question: '以下哪个最能体现"情境线索"的概念？',
        options: [
          '个体的人格特质',
          '工作环境中的时间压力',
          '个体的学习能力',
          '遗传基因'
        ],
        correctAnswer: 1,
        explanation: '情境线索是环境中能够激发特定特质的刺激因素，时间压力是典型的情境线索，能够激发个体的尽责性等特质。'
      }
    ],
    unlocked: false
  },
  {
    id: 'mechanisms',
    title: '激发机制与过程',
    description: '学习特质激发的具体机制和动态过程',
    duration: '60分钟',
    difficulty: 'advanced',
    objectives: [
      '理解特质激发的完整过程',
      '掌握激发强度的影响因素',
      '学会分析特质-情境匹配',
      '了解激发的调节机制'
    ],
    materials: [
      {
        id: 'mechanism-video',
        title: '激发机制详解视频',
        type: 'video',
        duration: '25分钟',
        completed: false
      },
      {
        id: 'process-interactive',
        title: '激发过程模拟',
        type: 'interactive',
        duration: '20分钟',
        completed: false
      },
      {
        id: 'analysis-case',
        title: '机制分析案例',
        type: 'case-study',
        duration: '15分钟',
        completed: false
      }
    ],
    quiz: [
      {
        question: '特质激发强度主要受哪些因素影响？',
        options: [
          '只受个体特质强度影响',
          '只受情境强度影响',
          '受特质强度、情境强度和个体敏感性共同影响',
          '完全随机'
        ],
        correctAnswer: 2,
        explanation: '特质激发强度受到特质强度、情境强度、个体敏感性等多个因素的共同影响，是一个复杂的交互过程。'
      }
    ],
    unlocked: false
  }
])

// Computed
const progressPercentage = computed(() => {
  return (currentStep.value / learningSteps.value.length) * 100
})

const currentQuizQuestion = computed(() => {
  const step = learningSteps.value[currentStep.value]
  if (!step.quiz || currentQuizIndex.value >= step.quiz.length) {
    return null
  }
  return step.quiz[currentQuizIndex.value]
})

const hasMoreQuizQuestions = computed(() => {
  const step = learningSteps.value[currentStep.value]
  return step.quiz && currentQuizIndex.value < step.quiz.length - 1
})

const canCompleteStep = computed(() => {
  const step = learningSteps.value[currentStep.value]
  const allMaterialsCompleted = step.materials.every(m => m.completed)
  const quizCompleted = !step.quiz || currentQuizIndex.value >= step.quiz.length
  return allMaterialsCompleted && quizCompleted
})

const totalLearningTime = computed(() => {
  // 计算总学习时间的逻辑
  return '2小时30分钟'
})

const completedMaterials = computed(() => {
  return learningSteps.value
    .flatMap(step => step.materials)
    .filter(material => material.completed).length
})

const quizAccuracy = computed(() => {
  // 计算测试准确率的逻辑
  return 85
})

const earnedBadges = computed(() => {
  // 计算获得徽章数量的逻辑
  return 3
})

const learningRecommendations = computed((): LearningRecommendation[] => {
  const recommendations: LearningRecommendation[] = []
  
  // 基于学习进度生成建议
  if (currentStep.value === 0) {
    recommendations.push({
      id: 'start-learning',
      title: '开始学习之旅',
      description: '建议先观看概述视频，建立对TAT理论的整体认识',
      icon: '🚀',
      action: 'open-material',
      actionLabel: '观看视频'
    })
  }
  
  return recommendations
})

// Methods
function getDifficultyLabel(difficulty: string): string {
  const labels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return labels[difficulty as keyof typeof labels] || difficulty
}

function getMaterialIcon(type: string): string {
  const icons = {
    video: '🎥',
    article: '📄',
    interactive: '🎮',
    quiz: '❓',
    'case-study': '📋'
  }
  return icons[type as keyof typeof icons] || '📄'
}

function getMaterialTypeLabel(type: string): string {
  const labels = {
    video: '视频',
    article: '文章',
    interactive: '互动',
    quiz: '测试',
    'case-study': '案例'
  }
  return labels[type as keyof typeof labels] || type
}

function openMaterial(material: LearningMaterial): void {
  // 标记材料为已完成
  material.completed = true
  emit('materialOpened', material.id)
}

function selectQuizOption(optionIndex: number): void {
  selectedQuizOption.value = optionIndex
}

function submitQuizAnswer(): void {
  if (selectedQuizOption.value === null || !currentQuizQuestion.value) return
  
  quizCorrect.value = selectedQuizOption.value === currentQuizQuestion.value.correctAnswer
  showQuizResults.value = true
}

function nextQuizQuestion(): void {
  if (hasMoreQuizQuestions.value) {
    currentQuizIndex.value++
    selectedQuizOption.value = null
    showQuizResults.value = false
  } else {
    // 完成所有测试题
    showQuizResults.value = false
    currentQuizIndex.value = 0
  }
}

function completeStep(): void {
  if (canCompleteStep.value) {
    // 解锁下一步
    if (currentStep.value + 1 < learningSteps.value.length) {
      learningSteps.value[currentStep.value + 1].unlocked = true
    }
    
    emit('stepCompleted', currentStep.value)
    
    // 自动进入下一步
    if (currentStep.value + 1 < learningSteps.value.length) {
      currentStep.value++
    }
  }
}

function jumpToStep(stepIndex: number): void {
  currentStep.value = stepIndex
}

function reviewStep(stepIndex: number): void {
  currentStep.value = stepIndex
}

function executeRecommendation(recommendation: LearningRecommendation): void {
  emit('recommendationExecuted', recommendation.id)
}

// 生命周期
onMounted(() => {
  // 初始化学习数据
})
</script>

<style scoped>
.progressive-learning-guide {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

/* Progress Header */
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.progress-info h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.progress-info p {
  margin: 0;
  color: #6b7280;
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-divider {
  font-size: 1.25rem;
  color: #d1d5db;
  margin: 0 8px;
}

/* Progress Bar */
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
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
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  min-width: 40px;
}

/* Learning Steps */
.learning-steps {
  margin-bottom: 40px;
}

.learning-step {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
}

.learning-step.locked {
  opacity: 0.5;
  pointer-events: none;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.learning-step .step-number {
  background: #e5e7eb;
  color: #6b7280;
}

.learning-step.active .step-number {
  background: #3b82f6;
  color: white;
}

.learning-step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-connector {
  width: 2px;
  height: 60px;
  background: #e5e7eb;
  margin-top: 8px;
}

.learning-step.completed .step-connector {
  background: #10b981;
}

.step-content {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.learning-step.active .step-content {
  border: 2px solid #3b82f6;
}

.step-header {
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-bottom: 1px solid #e5e7eb;
}

.step-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.step-meta {
  display: flex;
  gap: 12px;
}

.step-duration,
.step-difficulty {
  padding: 2px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.step-description {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.step-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.step-objectives {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.step-objectives h4 {
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.step-objectives ul {
  margin: 0;
  padding-left: 16px;
}

.step-objectives li {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 4px;
}

/* Materials */
.step-materials {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.step-materials h4 {
  margin: 0 0 16px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.materials-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.material-item:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.material-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.material-info {
  flex: 1;
}

.material-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.material-meta {
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  color: #6b7280;
}

.material-status {
  flex-shrink: 0;
}

.completion-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
}

/* Quiz */
.step-quiz {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.step-quiz h4 {
  margin: 0 0 16px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.quiz-container {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.quiz-question p {
  margin: 0 0 16px 0;
  font-weight: 500;
  color: #1f2937;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.quiz-option {
  padding: 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.quiz-option:hover {
  border-color: #3b82f6;
}

.quiz-option.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.submit-quiz-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-quiz-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-quiz-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.quiz-results {
  display: flex;
  align-items: center;
  gap: 16px;
}

.result-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.result-icon.correct {
  background: #dcfce7;
  color: #16a34a;
}

.result-icon.incorrect {
  background: #fee2e2;
  color: #dc2626;
}

.result-text {
  flex: 1;
}

.result-text h5 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.result-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.next-quiz-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.next-quiz-btn:hover {
  background: #059669;
}

/* Step Actions */
.step-actions {
  padding: 20px;
  display: flex;
  gap: 12px;
}

.complete-step-btn,
.jump-step-btn,
.review-step-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.complete-step-btn {
  background: #10b981;
  color: white;
  border: none;
}

.complete-step-btn:hover {
  background: #059669;
}

.jump-step-btn,
.review-step-btn {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.jump-step-btn:hover,
.review-step-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* Learning Stats */
.learning-stats {
  margin-bottom: 32px;
}

.learning-stats h3 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Learning Recommendations */
.learning-recommendations h3 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 8px;
}

.recommendation-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.recommendation-content {
  flex: 1;
}

.recommendation-content h4 {
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
}

.recommendation-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #b45309;
  line-height: 1.4;
}

.recommendation-action {
  padding: 6px 12px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.recommendation-action:hover {
  background: #d97706;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progressive-learning-guide {
    padding: 16px;
  }

  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .learning-step {
    flex-direction: column;
    gap: 16px;
  }

  .step-indicator {
    flex-direction: row;
    align-items: center;
  }

  .step-connector {
    width: 60px;
    height: 2px;
    margin-top: 0;
    margin-left: 8px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recommendation-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>