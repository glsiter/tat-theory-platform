<template>
  <div class="theory-overview-view">
    <!-- 3D动画引导区域 -->
    <div class="hero-section" ref="heroRef">
      <div class="hero-background">
        <canvas ref="canvasRef" class="hero-canvas"></canvas>
      </div>
      
      <div class="hero-content">
        <div class="hero-text" :class="{ 'animate-in': isLoaded }">
          <h1 class="hero-title">
            <span class="title-line">特质激发理论</span>
            <span class="title-subtitle">Trait Activation Theory</span>
          </h1>
          
          <p class="hero-description">
            探索人格特质如何在特定情境中被激发，
            <br>
            理解个体行为背后的心理机制
          </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">2000</div>
              <div class="stat-label">理论提出年份</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">相关研究文献</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">15+</div>
              <div class="stat-label">应用领域</div>
            </div>
          </div>
          
          <div class="hero-actions">
            <button @click="startJourney" class="cta-button primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              开始探索之旅
            </button>
            
            <button @click="scrollToOverview" class="cta-button secondary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              了解更多
            </button>
          </div>
        </div>
        
        <div class="hero-visual" :class="{ 'animate-in': isLoaded }">
          <div class="floating-elements">
            <div class="element trait-element" :style="{ animationDelay: '0s' }">
              <div class="element-icon">🧠</div>
              <div class="element-label">人格特质</div>
            </div>
            
            <div class="element situation-element" :style="{ animationDelay: '0.5s' }">
              <div class="element-icon">🌍</div>
              <div class="element-label">情境线索</div>
            </div>
            
            <div class="element activation-element" :style="{ animationDelay: '1s' }">
              <div class="element-icon">⚡</div>
              <div class="element-label">特质激发</div>
            </div>
            
            <div class="element behavior-element" :style="{ animationDelay: '1.5s' }">
              <div class="element-icon">🎭</div>
              <div class="element-label">行为表达</div>
            </div>
          </div>
          
          <div class="connection-lines">
            <svg class="connections-svg" viewBox="0 0 400 300">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0" />
                  <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
                </linearGradient>
              </defs>
              
              <path 
                class="connection-path" 
                d="M 80 80 Q 200 50 320 80"
                :class="{ 'animate-path': isLoaded }"
                :style="{ animationDelay: '2s' }"
              />
              <path 
                class="connection-path" 
                d="M 80 150 Q 200 120 320 150"
                :class="{ 'animate-path': isLoaded }"
                :style="{ animationDelay: '2.2s' }"
              />
              <path 
                class="connection-path" 
                d="M 80 220 Q 200 190 320 220"
                :class="{ 'animate-path': isLoaded }"
                :style="{ animationDelay: '2.4s' }"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator" @click="scrollToOverview">
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <!-- 理论概述区域 -->
    <div class="overview-section" ref="overviewRef">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">理论核心概念</h2>
          <p class="section-subtitle">
            TAT理论的四个核心要素构成了完整的理论框架
          </p>
        </div>

        <div class="concept-grid">
          <div 
            v-for="(concept, index) in coreConcepts" 
            :key="concept.id"
            class="concept-card"
            :class="{ 'in-view': conceptsInView }"
            :style="{ animationDelay: `${index * 0.2}s` }"
            @click="openConceptDetail(concept)"
          >
            <div class="concept-icon">
              <component :is="concept.icon" class="w-8 h-8" />
            </div>
            
            <div class="concept-content">
              <h3 class="concept-title">{{ concept.title }}</h3>
              <p class="concept-description">{{ concept.description }}</p>
              
              <div class="concept-features">
                <div 
                  v-for="feature in concept.features" 
                  :key="feature"
                  class="feature-tag"
                >
                  {{ feature }}
                </div>
              </div>
            </div>
            
            <div class="concept-arrow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 理论背景信息图 -->
    <div class="background-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">理论发展背景</h2>
          <p class="section-subtitle">
            从传统特质理论到现代交互理论的演进历程
          </p>
        </div>

        <div class="timeline-container">
          <div class="timeline">
            <div 
              v-for="(event, index) in timelineEvents" 
              :key="event.id"
              class="timeline-item"
              :class="{ 'in-view': timelineInView }"
              :style="{ animationDelay: `${index * 0.3}s` }"
            >
              <div class="timeline-marker">
                <div class="marker-dot"></div>
                <div class="marker-year">{{ event.year }}</div>
              </div>
              
              <div class="timeline-content">
                <h3 class="timeline-title">{{ event.title }}</h3>
                <p class="timeline-description">{{ event.description }}</p>
                
                <div v-if="event.contributors" class="timeline-contributors">
                  <div class="contributors-label">主要贡献者:</div>
                  <div class="contributors-list">
                    <span 
                      v-for="contributor in event.contributors" 
                      :key="contributor"
                      class="contributor-tag"
                    >
                      {{ contributor }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 理论优势展示 -->
    <div class="advantages-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">理论优势与价值</h2>
          <p class="section-subtitle">
            TAT理论在心理学和管理学领域的独特贡献
          </p>
        </div>

        <div class="advantages-grid">
          <div 
            v-for="(advantage, index) in theoryAdvantages" 
            :key="advantage.id"
            class="advantage-card"
            :class="{ 'in-view': advantagesInView }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="advantage-header">
              <div class="advantage-icon">
                <component :is="advantage.icon" class="w-6 h-6" />
              </div>
              <h3 class="advantage-title">{{ advantage.title }}</h3>
            </div>
            
            <p class="advantage-description">{{ advantage.description }}</p>
            
            <div class="advantage-metrics">
              <div class="metric-item">
                <div class="metric-value">{{ advantage.metric.value }}</div>
                <div class="metric-label">{{ advantage.metric.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 概念详情模态框 -->
    <div v-if="selectedConcept" class="concept-modal" @click="closeConceptDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedConcept.title }}</h2>
          <button @click="closeConceptDetail" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="concept-detail">
            <div class="detail-icon">
              <component :is="selectedConcept.icon" class="w-12 h-12" />
            </div>
            
            <div class="detail-content">
              <p class="detail-description">{{ selectedConcept.detailedDescription }}</p>
              
              <div class="detail-examples">
                <h4>具体示例:</h4>
                <ul class="examples-list">
                  <li v-for="example in selectedConcept.examples" :key="example">
                    {{ example }}
                  </li>
                </ul>
              </div>
              
              <div class="detail-research">
                <h4>相关研究:</h4>
                <div class="research-list">
                  <div 
                    v-for="research in selectedConcept.research" 
                    :key="research.title"
                    class="research-item"
                  >
                    <div class="research-title">{{ research.title }}</div>
                    <div class="research-authors">{{ research.authors }}</div>
                    <div class="research-year">{{ research.year }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="exploreMore" class="action-btn primary">
            深入探索
          </button>
          <button @click="closeConceptDetail" class="action-btn secondary">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 引导提示 -->
    <div v-if="showGuidance" class="guidance-overlay">
      <div class="guidance-content">
        <div class="guidance-step" v-if="currentGuidanceStep === 0">
          <h3>欢迎来到TAT理论学习平台</h3>
          <p>让我们一起探索特质激发理论的奥秘</p>
          <button @click="nextGuidanceStep" class="guidance-btn">开始引导</button>
        </div>
        
        <div class="guidance-step" v-if="currentGuidanceStep === 1">
          <h3>理解核心概念</h3>
          <p>点击概念卡片可以查看详细信息</p>
          <button @click="nextGuidanceStep" class="guidance-btn">下一步</button>
        </div>
        
        <div class="guidance-step" v-if="currentGuidanceStep === 2">
          <h3>探索理论发展</h3>
          <p>时间轴展示了理论的发展历程</p>
          <button @click="nextGuidanceStep" class="guidance-btn">下一步</button>
        </div>
        
        <div class="guidance-step" v-if="currentGuidanceStep === 3">
          <h3>开始深度学习</h3>
          <p>准备好深入探索TAT理论了吗？</p>
          <button @click="finishGuidance" class="guidance-btn">开始学习</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// Refs
const heroRef = ref<HTMLElement>()
const overviewRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

// 状态
const isLoaded = ref(false)
const conceptsInView = ref(false)
const timelineInView = ref(false)
const advantagesInView = ref(false)
const selectedConcept = ref<any>(null)
const showGuidance = ref(false)
const currentGuidanceStep = ref(0)

// 3D动画相关
let animationId: number | null = null
let scene: any = null

// 核心概念数据
const coreConcepts = [
  {
    id: 'traits',
    title: '人格特质',
    description: '相对稳定的个体差异变量，代表个体的行为倾向',
    icon: 'BrainIcon',
    features: ['稳定性', '个体差异', '行为倾向'],
    detailedDescription: '人格特质是指个体在认知、情感和行为方面相对稳定的特征模式。在TAT理论中，特质被视为潜在的行为倾向，只有在适当的情境线索存在时才会被激发并表现为具体行为。',
    examples: [
      '外向性：在社交场合中表现出的活跃和健谈',
      '尽责性：在工作中表现出的认真和负责',
      '开放性：对新经验和创新想法的接受程度'
    ],
    research: [
      { title: 'Big Five personality traits and job performance', authors: 'Barrick & Mount', year: '1991' },
      { title: 'Personality and adaptive performance', authors: 'Huang et al.', year: '2014' }
    ]
  },
  {
    id: 'situations',
    title: '情境线索',
    description: '环境中能够激发特定特质的刺激因素',
    icon: 'WorldIcon',
    features: ['环境刺激', '激发条件', '情境特征'],
    detailedDescription: '情境线索是指环境中那些能够触发或激发个体特定人格特质的各种因素。这些线索可能包括任务特征、社会环境、物理环境等多个方面。',
    examples: [
      '团队合作任务激发宜人性特质',
      '创新项目激发开放性特质',
      '紧急情况激发尽责性特质'
    ],
    research: [
      { title: 'Situational strength and trait activation', authors: 'Meyer et al.', year: '2010' },
      { title: 'Context effects in personality research', authors: 'Funder', year: '2006' }
    ]
  },
  {
    id: 'activation',
    title: '特质激发',
    description: '特质在特定情境下被唤醒并影响行为的过程',
    icon: 'LightningIcon',
    features: ['动态过程', '匹配机制', '激发强度'],
    detailedDescription: '特质激发是TAT理论的核心机制，描述了个体特质如何在遇到相关情境线索时被唤醒的过程。这个过程涉及个体对情境的认知评估、特质与情境的匹配程度等多个环节。',
    examples: [
      '在需要创新的工作环境中，开放性特质被激发',
      '在需要团队协作的项目中，宜人性特质被激发',
      '在面临截止日期压力时，尽责性特质被激发'
    ],
    research: [
      { title: 'Trait activation theory applications', authors: 'Tett et al.', year: '2013' },
      { title: 'Personality trait activation in organizations', authors: 'Judge & Zapata', year: '2015' }
    ]
  },
  {
    id: 'behavior',
    title: '行为表达',
    description: '激发的特质通过具体行为得以表现',
    icon: 'TheaterIcon',
    features: ['行为表现', '绩效结果', '可观测性'],
    detailedDescription: '行为表达是特质激发过程的最终结果，指激发的特质通过个体的具体行为、态度和绩效表现出来。这些行为表达是可观测和可测量的，为验证TAT理论提供了实证基础。',
    examples: [
      '激发的外向性表现为积极的人际互动',
      '激发的尽责性表现为高质量的工作完成',
      '激发的开放性表现为创新性的解决方案'
    ],
    research: [
      { title: 'Personality and job performance', authors: 'Tett & Burnett', year: '2003' },
      { title: 'Behavioral expressions of personality', authors: 'Fleeson', year: '2001' }
    ]
  }
]

// 时间轴事件数据
const timelineEvents = [
  {
    id: 'origins',
    year: '1990s',
    title: '理论起源',
    description: 'Walter Mischel的情境主义观点挑战了传统特质理论，为TAT的产生奠定了基础',
    contributors: ['Walter Mischel']
  },
  {
    id: 'foundation',
    year: '2000',
    title: 'TAT理论正式提出',
    description: 'Tett和Guterman正式提出特质激发理论，整合了特质论和情境论的观点',
    contributors: ['Robert P. Tett', 'Hal A. Guterman']
  },
  {
    id: 'development',
    year: '2003',
    title: '理论框架完善',
    description: 'Tett和Burnett进一步完善了TAT的理论框架，提出了基于特质激发的工作绩效预测模型',
    contributors: ['Robert P. Tett', 'Dawn D. Burnett']
  },
  {
    id: 'expansion',
    year: '2010s',
    title: '应用领域扩展',
    description: '理论应用领域逐步扩展至组织行为、教育心理、临床心理等多个领域',
    contributors: ['多位学者']
  },
  {
    id: 'integration',
    year: '2020s',
    title: '跨学科整合',
    description: '与神经科学、人工智能等领域结合，探索特质激发的生理机制和智能应用',
    contributors: ['新一代研究者']
  }
]

// 理论优势数据
const theoryAdvantages = [
  {
    id: 'integration',
    title: '理论整合性',
    description: '成功整合了特质论和情境论，提供了个体-情境交互的动态模型',
    icon: 'IntegrationIcon',
    metric: { value: '85%', label: '理论整合度' }
  },
  {
    id: 'prediction',
    title: '预测精度提升',
    description: '相比传统特质理论，TAT将行为预测准确性提高了一倍',
    icon: 'TargetIcon',
    metric: { value: '2x', label: '预测精度提升' }
  },
  {
    id: 'application',
    title: '实用价值',
    description: '为人力资源管理、教育设计、临床干预提供科学依据',
    icon: 'ApplicationIcon',
    metric: { value: '15+', label: '应用领域' }
  },
  {
    id: 'research',
    title: '研究价值',
    description: '提供了研究个体-情境交互的新范式，促进了相关测量工具的发展',
    icon: 'ResearchIcon',
    metric: { value: '500+', label: '相关研究' }
  }
]

// 生命周期
onMounted(async () => {
  await nextTick()
  
  // 初始化3D动画
  initializeAnimation()
  
  // 设置交叉观察器
  setupIntersectionObservers()
  
  // 延迟显示加载动画
  setTimeout(() => {
    isLoaded.value = true
  }, 500)
  
  // 检查是否需要显示引导
  const hasSeenGuidance = localStorage.getItem('tat-theory-guidance-seen')
  if (!hasSeenGuidance) {
    showGuidance.value = true
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

// 初始化3D动画
function initializeAnimation(): void {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 设置画布大小
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 粒子系统
  const particles: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    color: string
  }> = []
  
  // 创建粒子
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'][Math.floor(Math.random() * 4)]
    })
  }
  
  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    
    // 更新和绘制粒子
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      // 边界检测
      if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1
      
      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.fill()
    })
    
    // 绘制连接线
    ctx.globalAlpha = 0.1
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
    
    ctx.globalAlpha = 1
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

// 设置交叉观察器
function setupIntersectionObservers(): void {
  const options = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('concept-grid')) {
          conceptsInView.value = true
        } else if (entry.target.classList.contains('timeline-container')) {
          timelineInView.value = true
        } else if (entry.target.classList.contains('advantages-grid')) {
          advantagesInView.value = true
        }
      }
    })
  }, options)
  
  // 观察目标元素
  const conceptGrid = document.querySelector('.concept-grid')
  const timelineContainer = document.querySelector('.timeline-container')
  const advantagesGrid = document.querySelector('.advantages-grid')
  
  if (conceptGrid) observer.observe(conceptGrid)
  if (timelineContainer) observer.observe(timelineContainer)
  if (advantagesGrid) observer.observe(advantagesGrid)
}

// 方法
function startJourney(): void {
  router.push('/mind-map-test')
}

function scrollToOverview(): void {
  overviewRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function openConceptDetail(concept: any): void {
  selectedConcept.value = concept
}

function closeConceptDetail(): void {
  selectedConcept.value = null
}

function exploreMore(): void {
  closeConceptDetail()
  router.push('/mind-map-test')
}

function nextGuidanceStep(): void {
  currentGuidanceStep.value++
}

function finishGuidance(): void {
  showGuidance.value = false
  localStorage.setItem('tat-theory-guidance-seen', 'true')
}

// 图标组件（简化版）
const BrainIcon = { template: '<div class="icon-brain">🧠</div>' }
const WorldIcon = { template: '<div class="icon-world">🌍</div>' }
const LightningIcon = { template: '<div class="icon-lightning">⚡</div>' }
const TheaterIcon = { template: '<div class="icon-theater">🎭</div>' }
const IntegrationIcon = { template: '<div class="icon-integration">🔗</div>' }
const TargetIcon = { template: '<div class="icon-target">🎯</div>' }
const ApplicationIcon = { template: '<div class="icon-application">🛠️</div>' }
const ResearchIcon = { template: '<div class="icon-research">🔬</div>' }
</script>

<style scoped>
.theory-overview-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-canvas {
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1200px;
  padding: 0 40px;
  width: 100%;
}

.hero-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out;
}

.hero-text.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.hero-title {
  margin-bottom: 24px;
}

.title-line {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  line-height: 1.1;
  margin-bottom: 8px;
}

.title-subtitle {
  display: block;
  font-size: 1.5rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

.hero-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cta-button.primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateX(30px);
  transition: all 1s ease-out 0.3s;
}

.hero-visual.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.floating-elements {
  position: relative;
  width: 400px;
  height: 300px;
}

.element {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  animation: floatIn 1s ease-out forwards;
}

.trait-element {
  top: 20px;
  left: 20px;
}

.situation-element {
  top: 20px;
  right: 20px;
}

.activation-element {
  bottom: 80px;
  left: 20px;
}

.behavior-element {
  bottom: 80px;
  right: 20px;
}

.element-icon {
  font-size: 2rem;
}

.element-label {
  font-size: 0.875rem;
  color: white;
  font-weight: 500;
  text-align: center;
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.connections-svg {
  width: 100%;
  height: 100%;
}

.connection-path {
  fill: none;
  stroke: url(#connectionGradient);
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  opacity: 0;
}

.connection-path.animate-path {
  animation: pathDraw 2s ease-out forwards;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 3;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
  animation: bounce 2s infinite;
}

/* Overview Section */
.overview-section {
  background: white;
  padding: 100px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.concept-card {
  display: flex;
  flex-direction: column;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
}

.concept-card.in-view {
  animation: slideInUp 0.6s ease-out forwards;
}

.concept-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.concept-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 16px;
  margin-bottom: 20px;
  color: white;
  font-size: 2rem;
}

.concept-content {
  flex: 1;
}

.concept-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.concept-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.concept-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.feature-tag {
  padding: 4px 12px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.concept-arrow {
  align-self: flex-end;
  color: #3b82f6;
  transition: transform 0.3s ease;
}

.concept-card:hover .concept-arrow {
  transform: translateX(4px);
}

/* Background Section */
.background-section {
  background: #f8fafc;
  padding: 100px 0;
}

.timeline-container {
  max-width: 800px;
  margin: 0 auto;
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item {
  position: relative;
  padding-left: 80px;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateX(-30px);
}

.timeline-item.in-view {
  animation: slideInLeft 0.6s ease-out forwards;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 0 0 4px #e5e7eb;
  margin-bottom: 8px;
}

.marker-year {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  white-space: nowrap;
}

.timeline-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.timeline-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
}

.timeline-contributors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.contributors-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.contributors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.contributor-tag {
  padding: 2px 8px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Advantages Section */
.advantages-section {
  background: white;
  padding: 100px 0;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.advantage-card {
  text-align: center;
  padding: 40px 24px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
}

.advantage-card.in-view {
  animation: slideInUp 0.6s ease-out forwards;
}

.advantage-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  background: white;
}

.advantage-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.advantage-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  color: white;
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.advantage-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.advantage-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

.advantage-metrics {
  display: flex;
  justify-content: center;
}

.metric-item {
  text-align: center;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Modal */
.concept-modal {
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

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.concept-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-icon {
  align-self: center;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 20px;
  color: white;
  font-size: 2.5rem;
}

.detail-description {
  color: #374151;
  line-height: 1.7;
  font-size: 1rem;
}

.detail-examples h4,
.detail-research h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.examples-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.examples-list li {
  padding: 8px 0;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.examples-list li:last-child {
  border-bottom: none;
}

.research-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.research-item {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.research-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.research-authors {
  color: #6b7280;
  font-size: 0.875rem;
}

.research-year {
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

/* Guidance */
.guidance-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.guidance-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  text-align: center;
}

.guidance-step h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.guidance-step p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.guidance-btn {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.guidance-btn:hover {
  background: #2563eb;
}

/* Animations */
@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pathDraw {
  from {
    opacity: 0;
    stroke-dashoffset: 100;
  }
  to {
    opacity: 0.6;
    stroke-dashoffset: 0;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0) rotate(45deg);
  }
  40% {
    transform: translateX(-50%) translateY(-10px) rotate(45deg);
  }
  60% {
    transform: translateX(-50%) translateY(-5px) rotate(45deg);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .title-line {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .floating-elements {
    width: 300px;
    height: 250px;
  }
  
  .container {
    padding: 0 20px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .concept-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline-item {
    padding-left: 60px;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
  }
}
</style>