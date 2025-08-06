<template>
  <div class="theory-learning-view">
    <!-- 理论概述部分 -->
    <TheoryOverview
      @start-journey="handleStartJourney"
      @explore-concept="handleExploreConcept"
      @explore-history="handleExploreHistory"
      @start-learning-path="handleStartLearningPath"
    />

    <!-- 渐进式学习引导 -->
    <div v-if="showLearningGuide" class="learning-guide-section">
      <div class="section-header">
        <h2>个性化学习路径</h2>
        <p>根据您的学习目标和进度，为您定制的学习体验</p>
      </div>
      
      <ProgressiveLearningGuide
        @step-completed="handleStepCompleted"
        @material-opened="handleMaterialOpened"
        @recommendation-executed="handleRecommendationExecuted"
      />
    </div>

    <!-- 概念深度探索 -->
    <div v-if="selectedConcept" class="concept-exploration">
      <div class="exploration-header">
        <button @click="closeConceptExploration" class="back-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回概述
        </button>
        <h2>深度探索：{{ selectedConcept.title }}</h2>
      </div>

      <div class="exploration-content">
        <ConceptCard
          :concept="selectedConcept"
          :initial-expanded="true"
          @explore="handleConceptExplore"
          @add-to-learning="handleAddToLearning"
        />

        <!-- 相关概念推荐 -->
        <div class="related-concepts">
          <h3>相关概念</h3>
          <div class="related-grid">
            <ConceptCard
              v-for="relatedConcept in relatedConcepts"
              :key="relatedConcept.id"
              :concept="relatedConcept"
              @explore="handleConceptExplore"
              @add-to-learning="handleAddToLearning"
            />
          </div>
        </div>

        <!-- 实际应用案例 -->
        <div class="application-cases">
          <h3>实际应用案例</h3>
          <div class="cases-grid">
            <div
              v-for="case_ in applicationCases"
              :key="case_.id"
              class="case-card"
              @click="openCase(case_)"
            >
              <div class="case-header">
                <div class="case-icon">{{ case_.icon }}</div>
                <div class="case-info">
                  <h4>{{ case_.title }}</h4>
                  <p class="case-domain">{{ case_.domain }}</p>
                </div>
              </div>
              
              <div class="case-description">
                <p>{{ case_.description }}</p>
              </div>

              <div class="case-tags">
                <span v-for="tag in case_.tags" :key="tag" class="case-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习进度面板 -->
    <div class="learning-progress-panel" :class="{ 'panel-open': showProgressPanel }">
      <button @click="toggleProgressPanel" class="panel-toggle">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        学习进度
      </button>

      <div v-if="showProgressPanel" class="panel-content">
        <div class="progress-header">
          <h3>学习进度</h3>
          <button @click="showProgressPanel = false" class="close-panel">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-circle">
              <svg class="progress-ring" width="60" height="60">
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  stroke="#e5e7eb"
                  stroke-width="4"
                  fill="none"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  stroke="#3b82f6"
                  stroke-width="4"
                  fill="none"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (learningProgress.overall / 100) * circumference"
                  transform="rotate(-90 30 30)"
                />
              </svg>
              <div class="stat-percentage">{{ learningProgress.overall }}%</div>
            </div>
            <div class="stat-label">总体进度</div>
          </div>

          <div class="progress-details">
            <div class="detail-item">
              <span class="detail-label">已完成概念</span>
              <span class="detail-value">{{ learningProgress.completedConcepts }}/{{ learningProgress.totalConcepts }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">学习时间</span>
              <span class="detail-value">{{ learningProgress.studyTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">测试分数</span>
              <span class="detail-value">{{ learningProgress.testScore }}%</span>
            </div>
          </div>
        </div>

        <div class="recent-activities">
          <h4>最近活动</h4>
          <div class="activities-list">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon">{{ activity.icon }}</div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <button @click="resumeLearning" class="quick-action-btn primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            继续学习
          </button>
          <button @click="takeQuiz" class="quick-action-btn secondary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            开始测试
          </button>
        </div>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <div class="floating-actions">
      <button @click="openNotepad" class="fab" title="学习笔记">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      
      <button @click="openBookmarks" class="fab" title="收藏夹">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      <button @click="openHelp" class="fab" title="帮助">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TheoryOverview, ConceptCard, ProgressiveLearningGuide } from '@/components/theory'

// State
const showLearningGuide = ref(false)
const selectedConcept = ref<any>(null)
const showProgressPanel = ref(false)

// 学习进度数据
const learningProgress = ref({
  overall: 65,
  completedConcepts: 8,
  totalConcepts: 12,
  studyTime: '3小时45分钟',
  testScore: 85
})

// 最近活动
const recentActivities = ref([
  {
    id: '1',
    title: '完成了"特质激发机制"学习',
    time: '2小时前',
    icon: '✅'
  },
  {
    id: '2',
    title: '通过了概念理解测试',
    time: '4小时前',
    icon: '🎯'
  },
  {
    id: '3',
    title: '收藏了"情境线索识别"',
    time: '1天前',
    icon: '⭐'
  }
])

// 相关概念数据
const relatedConcepts = ref([
  {
    id: 'personality-traits',
    title: '人格特质理论',
    subtitle: '个体稳定的心理特征',
    icon: '🧠',
    description: '研究个体在行为、思维和情感方面的稳定模式',
    details: [
      { label: '理论基础', value: '大五人格模型' },
      { label: '测量工具', value: 'NEO-PI-R量表' },
      { label: '应用领域', value: '人力资源管理' }
    ],
    examples: [
      '外向性：社交活跃度',
      '尽责性：工作责任心',
      '神经质：情绪稳定性'
    ]
  }
])

// 应用案例数据
const applicationCases = ref([
  {
    id: 'case-1',
    title: '销售团队人员选拔',
    domain: '人力资源管理',
    description: '运用TAT理论优化销售人员的招聘和配置，提高团队绩效',
    icon: '💼',
    tags: ['人员选拔', '绩效提升', '团队管理']
  },
  {
    id: 'case-2',
    title: '教学环境设计',
    domain: '教育心理学',
    description: '基于TAT理论设计学习环境，激发学生的积极特质',
    icon: '🎓',
    tags: ['教学设计', '学习环境', '学生发展']
  },
  {
    id: 'case-3',
    title: '领导力发展项目',
    domain: '组织发展',
    description: '利用TAT理论制定个性化的领导力发展方案',
    icon: '👑',
    tags: ['领导力', '个性化发展', '组织效能']
  }
])

// Computed
const circumference = computed(() => 2 * Math.PI * 25)

// Methods
function handleStartJourney(): void {
  showLearningGuide.value = true
  // 滚动到学习引导部分
  setTimeout(() => {
    document.querySelector('.learning-guide-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }, 100)
}

function handleExploreConcept(conceptId: string): void {
  // 根据conceptId找到对应的概念数据
  const conceptsData = [
    {
      id: 'traits',
      title: '特质 (Traits)',
      subtitle: '相对稳定的个体差异变量',
      icon: '👤',
      description: '代表个体的行为倾向，是相对稳定的个体差异变量，包括五大人格因素等。',
      details: [
        { label: '稳定性', value: '跨时间相对稳定' },
        { label: '个体性', value: '存在显著个体差异' },
        { label: '预测性', value: '能预测行为倾向' }
      ],
      examples: [
        '外向性：喜欢社交互动的倾向',
        '尽责性：做事认真负责的特质',
        '开放性：对新体验的接受程度'
      ]
    }
  ]
  
  selectedConcept.value = conceptsData.find(c => c.id === conceptId) || conceptsData[0]
}

function handleExploreHistory(): void {
  // 导航到历史页面
  console.log('探索理论发展历程')
}

function handleStartLearningPath(pathId: string): void {
  showLearningGuide.value = true
  console.log('开始学习路径:', pathId)
}

function handleStepCompleted(stepIndex: number): void {
  console.log('完成学习步骤:', stepIndex)
  // 更新学习进度
  learningProgress.value.overall = Math.min(100, learningProgress.value.overall + 10)
}

function handleMaterialOpened(materialId: string): void {
  console.log('打开学习材料:', materialId)
}

function handleRecommendationExecuted(recommendationId: string): void {
  console.log('执行推荐操作:', recommendationId)
}

function closeConceptExploration(): void {
  selectedConcept.value = null
}

function handleConceptExplore(conceptId: string): void {
  console.log('深入探索概念:', conceptId)
}

function handleAddToLearning(conceptId: string): void {
  console.log('添加到学习计划:', conceptId)
}

function openCase(case_: any): void {
  console.log('打开案例:', case_.title)
}

function toggleProgressPanel(): void {
  showProgressPanel.value = !showProgressPanel.value
}

function resumeLearning(): void {
  showLearningGuide.value = true
  showProgressPanel.value = false
}

function takeQuiz(): void {
  console.log('开始测试')
}

function openNotepad(): void {
  console.log('打开学习笔记')
}

function openBookmarks(): void {
  console.log('打开收藏夹')
}

function openHelp(): void {
  console.log('打开帮助')
}

// 生命周期
onMounted(() => {
  // 初始化页面
})
</script>

<style scoped>
.theory-learning-view {
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
}

/* Learning Guide Section */
.learning-guide-section {
  padding: 80px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.section-header p {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

/* Concept Exploration */
.concept-exploration {
  padding: 40px;
  background: white;
  min-height: 100vh;
}

.exploration-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e5e7eb;
}

.exploration-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.exploration-content {
  max-width: 1200px;
  margin: 0 auto;
}

.related-concepts,
.application-cases {
  margin-top: 48px;
}

.related-concepts h3,
.application-cases h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.case-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.case-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.case-icon {
  font-size: 32px;
}

.case-info h4 {
  margin: 0 0 4px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.case-domain {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.case-description {
  margin-bottom: 16px;
}

.case-description p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.case-tag {
  padding: 4px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Learning Progress Panel */
.learning-progress-panel {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 100;
  transition: all 0.3s ease;
}

.panel-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.panel-toggle:hover {
  background: #2563eb;
}

.panel-content {
  position: absolute;
  right: 100%;
  top: 0;
  width: 320px;
  background: white;
  border-radius: 12px 0 0 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.close-panel {
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-panel:hover {
  background: #e5e7eb;
  color: #374151;
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-circle {
  position: relative;
  width: 60px;
  height: 60px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.stat-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.progress-details {
  flex: 1;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.recent-activities {
  padding: 20px;
  border-top: 1px solid #f3f4f6;
}

.recent-activities h4 {
  margin: 0 0 16px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.quick-actions {
  display: flex;
  gap: 8px;
  padding: 20px;
  border-top: 1px solid #f3f4f6;
}

.quick-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn.primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.quick-action-btn.primary:hover {
  background: #2563eb;
}

.quick-action-btn.secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.quick-action-btn.secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* Floating Actions */
.floating-actions {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 50;
}

.fab {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.fab:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .concept-exploration {
    padding: 20px;
  }

  .exploration-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .related-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }

  .learning-progress-panel {
    position: static;
    transform: none;
    margin: 20px;
  }

  .panel-content {
    position: static;
    width: 100%;
    border-radius: 12px;
  }

  .progress-stats {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .floating-actions {
    bottom: 20px;
    right: 20px;
  }

  .fab {
    width: 48px;
    height: 48px;
  }
}
</style>