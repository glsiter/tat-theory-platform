<template>
  <div class="theory-overview">
    <!-- 3D动画引导区域 -->
    <div class="hero-section" ref="heroRef">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-line">特质激发理论</span>
            <span class="title-subtitle">Trait Activation Theory</span>
          </h1>
          <p class="hero-description">
            探索人格特质如何在特定情境中被激发并影响个体行为的科学理论
          </p>
          <div class="hero-actions">
            <button @click="startJourney" class="cta-button primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              开始探索
            </button>
            <button @click="scrollToContent" class="cta-button secondary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              了解更多
            </button>
          </div>
        </div>
        
        <!-- 3D可视化容器 -->
        <div class="hero-visual">
          <canvas ref="canvasRef" class="hero-canvas"></canvas>
          <div class="visual-overlay">
            <div class="floating-concepts">
              <div 
                v-for="(concept, index) in floatingConcepts" 
                :key="concept.id"
                :class="['concept-bubble', `concept-${index}`]"
                :style="{ animationDelay: `${index * 0.5}s` }"
              >
                <div class="concept-icon">{{ concept.icon }}</div>
                <div class="concept-label">{{ concept.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动指示器 -->
      <div class="scroll-indicator" @click="scrollToContent">
        <div class="scroll-arrow"></div>
      </div>
    </div>

    <!-- 理论核心概念介绍 -->
    <div class="content-section" ref="contentRef">
      <div class="container">
        <!-- 理论定义卡片 -->
        <div class="definition-card">
          <div class="card-header">
            <h2>理论核心定义</h2>
            <div class="header-decoration"></div>
          </div>
          <div class="card-content">
            <div class="definition-text">
              <p class="definition-main">
                特质激发理论（TAT）是由 Tett 和 Guterman（2000）提出的重要人格心理学理论，
                旨在解释<strong>人格特质如何在特定情境中被激发并影响个体行为</strong>。
              </p>
              <div class="definition-highlight">
                <div class="highlight-icon">💡</div>
                <div class="highlight-text">
                  核心观点：人格特质只有在相关的情境线索存在时才会被激发，进而预测和影响个体的行为表现。
                </div>
              </div>
            </div>
            <div class="definition-visual">
              <div class="concept-diagram">
                <div class="diagram-node central">
                  <div class="node-content">
                    <div class="node-icon">🎯</div>
                    <div class="node-label">TAT理论</div>
                  </div>
                </div>
                <div class="diagram-node trait">
                  <div class="node-content">
                    <div class="node-icon">👤</div>
                    <div class="node-label">人格特质</div>
                  </div>
                </div>
                <div class="diagram-node situation">
                  <div class="node-content">
                    <div class="node-icon">🌍</div>
                    <div class="node-label">情境线索</div>
                  </div>
                </div>
                <div class="diagram-node behavior">
                  <div class="node-content">
                    <div class="node-icon">⚡</div>
                    <div class="node-label">行为表现</div>
                  </div>
                </div>
                <svg class="diagram-connections" viewBox="0 0 400 300">
                  <path d="M 75 150 Q 200 75 325 150" stroke="#3b82f6" stroke-width="2" fill="none" />
                  <path d="M 75 150 Q 200 225 325 150" stroke="#10b981" stroke-width="2" fill="none" />
                  <path d="M 200 150 L 325 150" stroke="#f59e0b" stroke-width="3" fill="none" />
                  <!-- 人格特质到工作行为的单向箭头 -->
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                    </marker>
                  </defs>
                  <path d="M 75 150 L 325 150" stroke="#6366f1" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 核心概念网格 -->
        <div class="concepts-grid">
          <h2 class="section-title">核心概念解析</h2>
          <div class="concepts-container">
            <div
              v-for="(concept, index) in coreConceptsData"
              :key="concept.id"
              :class="['concept-card', { 'active': activeConcept === index }]"
              @click="setActiveConcept(index)"
              @mouseenter="setActiveConcept(index)"
            >
              <div class="concept-header">
                <div class="concept-icon-large">{{ concept.icon }}</div>
                <h3>{{ concept.title }}</h3>
                <div class="concept-subtitle">{{ concept.subtitle }}</div>
              </div>
              
              <div class="concept-body">
                <p class="concept-description">{{ concept.description }}</p>
                
                <div class="concept-details">
                  <div class="detail-item" v-for="detail in concept.details" :key="detail.label">
                    <span class="detail-label">{{ detail.label }}:</span>
                    <span class="detail-value">{{ detail.value }}</span>
                  </div>
                </div>

                <div class="concept-examples">
                  <h4>典型示例</h4>
                  <ul>
                    <li v-for="example in concept.examples" :key="example">{{ example }}</li>
                  </ul>
                </div>
              </div>

              <div class="concept-footer">
                <button class="learn-more-btn" @click.stop="learnMore(concept)">
                  深入了解
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 理论基本假设 -->
        <div class="assumptions-section">
          <h2 class="section-title">理论基本假设</h2>
          <div class="assumptions-timeline">
            <div
              v-for="(assumption, index) in theoryAssumptions"
              :key="assumption.id"
              :class="['assumption-item', { 'revealed': revealedAssumptions > index }]"
              :style="{ animationDelay: `${index * 0.3}s` }"
            >
              <div class="assumption-number">{{ index + 1 }}</div>
              <div class="assumption-content">
                <h3>{{ assumption.title }}</h3>
                <p>{{ assumption.description }}</p>
                <div class="assumption-implications">
                  <h4>理论意义</h4>
                  <ul>
                    <li v-for="implication in assumption.implications" :key="implication">
                      {{ implication }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="assumption-visual">
                <div class="visual-icon">{{ assumption.icon }}</div>
              </div>
            </div>
          </div>
          
          <div class="assumptions-controls">
            <button 
              @click="revealNextAssumption" 
              :disabled="revealedAssumptions >= theoryAssumptions.length"
              class="reveal-btn"
            >
              {{ revealedAssumptions >= theoryAssumptions.length ? '全部展示完成' : '展示下一个假设' }}
            </button>
            <button @click="resetAssumptions" class="reset-btn">重新开始</button>
          </div>
        </div>

        <!-- 理论发展历程预览 -->
        <div class="history-preview">
          <h2 class="section-title">理论发展历程</h2>
          <div class="timeline-preview">
            <div class="timeline-item" v-for="milestone in historyMilestones" :key="milestone.year">
              <div class="timeline-year">{{ milestone.year }}</div>
              <div class="timeline-content">
                <h3>{{ milestone.title }}</h3>
                <p>{{ milestone.description }}</p>
                <div class="timeline-contributors">
                  <span v-for="contributor in milestone.contributors" :key="contributor" class="contributor-tag">
                    {{ contributor }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="history-cta">
            <button @click="exploreHistory" class="explore-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              探索完整发展历程
            </button>
          </div>
        </div>

        <!-- 学习路径推荐 -->
        <div class="learning-paths">
          <h2 class="section-title">推荐学习路径</h2>
          <div class="paths-grid">
            <div
              v-for="path in learningPaths"
              :key="path.id"
              class="path-card"
              @click="startLearningPath(path)"
            >
              <div class="path-header">
                <div class="path-icon">{{ path.icon }}</div>
                <div class="path-info">
                  <h3>{{ path.title }}</h3>
                  <div class="path-meta">
                    <span class="path-level">{{ path.level }}</span>
                    <span class="path-duration">{{ path.duration }}</span>
                  </div>
                </div>
              </div>
              
              <div class="path-description">
                <p>{{ path.description }}</p>
              </div>

              <div class="path-topics">
                <div class="topics-label">主要内容</div>
                <div class="topics-list">
                  <span v-for="topic in path.topics" :key="topic" class="topic-tag">
                    {{ topic }}
                  </span>
                </div>
              </div>

              <div class="path-footer">
                <div class="path-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: path.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ path.progress }}% 完成</span>
                </div>
                <button class="start-path-btn">
                  {{ path.progress > 0 ? '继续学习' : '开始学习' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'

// Emits
const emit = defineEmits<{
  startJourney: []
  exploreConcept: [conceptId: string]
  exploreHistory: []
  startLearningPath: [pathId: string]
}>()

// Refs
const heroRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const contentRef = ref<HTMLElement>()

// State
const activeConcept = ref(0)
const revealedAssumptions = ref(0)

// Three.js相关
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number

// 浮动概念数据
const floatingConcepts = [
  { id: 'trait', label: '人格特质', icon: '👤' },
  { id: 'situation', label: '情境线索', icon: '🌍' },
  { id: 'activation', label: '激发过程', icon: '⚡' },
  { id: 'behavior', label: '行为表现', icon: '🎯' }
]

// 核心概念数据
const coreConceptsData = [
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
  },
  {
    id: 'activation',
    title: '激发 (Activation)',
    subtitle: '特质被唤醒并影响行为的过程',
    icon: '⚡',
    description: '特质在特定情境下被唤醒并影响行为的动态过程，是TAT理论的核心机制。',
    details: [
      { label: '触发条件', value: '需要相关情境线索' },
      { label: '动态性', value: '随情境变化而变化' },
      { label: '选择性', value: '只激发相关特质' }
    ],
    examples: [
      '竞争环境激发成就动机',
      '团队合作激发宜人性特质',
      '创新任务激发开放性特质'
    ]
  },
  {
    id: 'situational-cues',
    title: '情境线索 (Situational Cues)',
    subtitle: '环境中激发特定特质的刺激因素',
    icon: '🌍',
    description: '环境中能够激发特定特质的刺激因素，是特质激发的必要条件。',
    details: [
      { label: '多样性', value: '包含多种环境因素' },
      { label: '特异性', value: '不同线索激发不同特质' },
      { label: '强度性', value: '线索强度影响激发程度' }
    ],
    examples: [
      '时间压力激发尽责性',
      '社交场合激发外向性',
      '复杂问题激发开放性'
    ]
  },
  {
    id: 'trait-relevance',
    title: '特质相关性 (Trait Relevance)',
    subtitle: '特定情境与某一特质的匹配程度',
    icon: '🔗',
    description: '特定情境与某一特质之间的匹配程度，决定了激发的可能性和强度。',
    details: [
      { label: '匹配度', value: '情境与特质的相关程度' },
      { label: '预测力', value: '高相关性提高预测准确性' },
      { label: '个体差异', value: '不同个体相关性不同' }
    ],
    examples: [
      '销售工作与外向性高度相关',
      '研究工作与开放性密切相关',
      '管理工作与尽责性强相关'
    ]
  }
]

// 理论基本假设
const theoryAssumptions = [
  {
    id: 'situational-sensitivity',
    title: '情境敏感性',
    description: '人格特质的行为表达依赖于情境因素，不同情境会激发不同的特质表现。',
    icon: '🎭',
    implications: [
      '特质表现具有情境依赖性',
      '同一个体在不同情境中可能表现出不同行为',
      '情境设计对行为预测至关重要'
    ]
  },
  {
    id: 'selective-activation',
    title: '选择性激发',
    description: '并非所有特质在所有情境中都会被激发，只有相关的特质才会被激活。',
    icon: '🎯',
    implications: [
      '特质激发具有选择性和针对性',
      '无关特质在特定情境中保持潜在状态',
      '激发效率取决于特质-情境匹配度'
    ]
  },
  {
    id: 'dynamic-interaction',
    title: '动态交互',
    description: '个体与情境之间存在持续的动态交互过程，相互影响和调节。',
    icon: '🔄',
    implications: [
      '个体会主动选择和塑造情境',
      '情境也会反过来影响个体特质表现',
      '交互过程是动态和持续的'
    ]
  },
  {
    id: 'predictive-validity',
    title: '预测有效性',
    description: '激发的特质比非激发特质具有更强的行为预测力和解释力。',
    icon: '📊',
    implications: [
      '考虑激发机制能提高预测准确性',
      '传统特质测量需要结合情境因素',
      '个性化预测模型更加有效'
    ]
  }
]

// 历史里程碑
const historyMilestones = [
  {
    year: '1990s',
    title: '理论背景形成',
    description: 'Walter Mischel的情境主义观点挑战传统特质理论，为TAT奠定基础',
    contributors: ['Walter Mischel']
  },
  {
    year: '2000',
    title: 'TAT理论诞生',
    description: 'Tett和Guterman正式提出特质激发理论，整合特质论和情境论',
    contributors: ['Robert P. Tett', 'Hal A. Guterman']
  },
  {
    year: '2003',
    title: '理论框架完善',
    description: 'Tett和Burnett进一步完善TAT理论框架，扩展应用领域',
    contributors: ['Robert P. Tett', 'Dawn D. Burnett']
  },
  {
    year: '2010s',
    title: '广泛应用发展',
    description: '理论在组织行为、教育心理等多个领域得到广泛应用和验证',
    contributors: ['多位学者']
  }
]

// 学习路径
const learningPaths = [
  {
    id: 'beginner',
    title: '理论基础入门',
    level: '初级',
    duration: '2-3小时',
    icon: '🌱',
    description: '从零开始了解TAT理论的基本概念、发展历程和核心观点',
    topics: ['基本概念', '理论背景', '核心假设', '简单应用'],
    progress: 0
  },
  {
    id: 'intermediate',
    title: '深度理论探索',
    level: '中级',
    duration: '4-6小时',
    icon: '🔍',
    description: '深入理解TAT理论机制、实证研究和应用方法',
    topics: ['激发机制', '实证研究', '测量方法', '应用案例'],
    progress: 25
  },
  {
    id: 'advanced',
    title: '研究应用实践',
    level: '高级',
    duration: '6-8小时',
    icon: '🚀',
    description: '掌握TAT理论的研究方法、数据分析和实际应用技能',
    topics: ['研究设计', '数据分析', '实践应用', '前沿发展'],
    progress: 0
  }
]

// 生命周期
onMounted(async () => {
  await nextTick()
  initThreeJS()
  setupScrollAnimations()
  startAssumptionReveal()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})

// Three.js初始化
function initThreeJS(): void {
  if (!canvasRef.value) return

  // 场景设置
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    alpha: true,
    antialias: true 
  })

  const size = 400
  renderer.setSize(size, size)
  renderer.setClearColor(0x000000, 0)

  // 创建粒子系统
  createParticleSystem()
  
  // 创建几何体
  createGeometry()

  // 相机位置
  camera.position.z = 5

  // 开始动画循环
  animate()
}

function createParticleSystem(): void {
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 100
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.8
  })

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)
}

function createGeometry(): void {
  // 创建中心球体
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
  const sphereMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.7,
    wireframe: true
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  // 创建环绕的小球体
  for (let i = 0; i < 4; i++) {
    const smallSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    )
    
    const angle = (i / 4) * Math.PI * 2
    smallSphere.position.x = Math.cos(angle) * 2
    smallSphere.position.y = Math.sin(angle) * 2
    
    scene.add(smallSphere)
  }
}

function animate(): void {
  animationId = requestAnimationFrame(animate)

  // 旋转动画
  scene.children.forEach((child, index) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.x += 0.01
      child.rotation.y += 0.01
    }
    if (child instanceof THREE.Points) {
      child.rotation.y += 0.002
    }
  })

  renderer.render(scene, camera)
}

// 滚动动画设置
function setupScrollAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    },
    { threshold: 0.1 }
  )

  // 观察所有需要动画的元素
  document.querySelectorAll('.concept-card, .assumption-item, .timeline-item').forEach((el) => {
    observer.observe(el)
  })
}

// 方法
function startJourney(): void {
  emit('startJourney')
}

function scrollToContent(): void {
  contentRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function setActiveConcept(index: number): void {
  activeConcept.value = index
}

function learnMore(concept: any): void {
  emit('exploreConcept', concept.id)
}

function startAssumptionReveal(): void {
  // 自动逐个展示假设
  const interval = setInterval(() => {
    if (revealedAssumptions.value < theoryAssumptions.length) {
      revealedAssumptions.value++
    } else {
      clearInterval(interval)
    }
  }, 2000)
}

function revealNextAssumption(): void {
  if (revealedAssumptions.value < theoryAssumptions.length) {
    revealedAssumptions.value++
  }
}

function resetAssumptions(): void {
  revealedAssumptions.value = 0
  startAssumptionReveal()
}

function exploreHistory(): void {
  emit('exploreHistory')
}

function startLearningPath(path: any): void {
  emit('startLearningPath', path.id)
}
</script>

<style scoped>
.theory-overview {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  z-index: 2;
}

.hero-text {
  color: white;
}

.hero-title {
  margin: 0 0 24px 0;
}

.title-line {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 8px;
}

.title-subtitle {
  display: block;
  font-size: 1.5rem;
  font-weight: 300;
  opacity: 0.9;
  font-style: italic;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 32px;
  opacity: 0.9;
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
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cta-button.primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta-button.primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-canvas {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.visual-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-concepts {
  position: relative;
  width: 100%;
  height: 100%;
}

.concept-bubble {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

.concept-0 { top: 10%; left: 10%; }
.concept-1 { top: 20%; right: 10%; }
.concept-2 { bottom: 20%; left: 15%; }
.concept-3 { bottom: 10%; right: 15%; }

.concept-icon {
  font-size: 24px;
}

.concept-label {
  font-size: 12px;
  color: white;
  font-weight: 500;
  text-align: center;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

/* Content Section */
.content-section {
  background: #f8fafc;
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Definition Card */
.definition-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  margin-bottom: 80px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 32px;
  text-align: center;
  position: relative;
}

.card-header h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.header-decoration {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  margin: 16px auto 0;
  border-radius: 2px;
}

.card-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  padding: 40px;
}

.definition-main {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 24px;
}

.definition-highlight {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #eff6ff;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.highlight-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.highlight-text {
  font-size: 1rem;
  color: #1e40af;
  font-weight: 500;
  line-height: 1.6;
}

.concept-diagram {
  position: relative;
  width: 300px;
  height: 200px;
  margin: 0 auto;
}

.diagram-node {
  position: absolute;
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diagram-node.central {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.diagram-node.trait {
  top: 20%;
  left: 10%;
}

.diagram-node.situation {
  bottom: 20%;
  left: 10%;
}

.diagram-node.behavior {
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
}

.node-icon {
  font-size: 20px;
}

.node-label {
  font-size: 10px;
  font-weight: 500;
  color: #374151;
  text-align: center;
}

.diagram-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.diagram-connections text {
  font-family: Arial, sans-serif;
  font-weight: bold;
}

/* Concepts Grid */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 48px;
}

.concepts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

.concept-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid transparent;
}

.concept-card:hover,
.concept-card.active {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.concept-header {
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.concept-icon-large {
  font-size: 48px;
  margin-bottom: 12px;
}

.concept-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.concept-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.concept-body {
  padding: 24px;
}

.concept-description {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 20px;
}

.concept-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  color: #374151;
}

.concept-examples h4 {
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.concept-examples ul {
  margin: 0;
  padding-left: 16px;
}

.concept-examples li {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 4px;
}

.concept-footer {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.learn-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.learn-more-btn:hover {
  background: #2563eb;
}

/* Assumptions Section */
.assumptions-timeline {
  margin-bottom: 40px;
}

.assumption-item {
  display: grid;
  grid-template-columns: 60px 1fr 80px;
  gap: 24px;
  align-items: start;
  padding: 24px;
  margin-bottom: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.6s ease;
}

.assumption-item.revealed {
  opacity: 1;
  transform: translateX(0);
}

.assumption-number {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1.25rem;
}

.assumption-content h3 {
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.assumption-content p {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 16px;
}

.assumption-implications h4 {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.assumption-implications ul {
  margin: 0;
  padding-left: 16px;
}

.assumption-implications li {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 4px;
}

.assumption-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-icon {
  font-size: 48px;
  opacity: 0.7;
}

.assumptions-controls {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.reveal-btn,
.reset-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reveal-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.reveal-btn:hover:not(:disabled) {
  background: #2563eb;
}

.reveal-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.reset-btn {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.reset-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* History Preview */
.timeline-preview {
  position: relative;
  margin-bottom: 40px;
}

.timeline-preview::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
}

.timeline-year {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  z-index: 2;
}

.timeline-content {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.timeline-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.timeline-content p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
}

.timeline-contributors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.contributor-tag {
  padding: 4px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.history-cta {
  text-align: center;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Learning Paths */
.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.path-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.path-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.path-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.path-icon {
  font-size: 32px;
}

.path-info h3 {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.path-meta {
  display: flex;
  gap: 12px;
}

.path-level,
.path-duration {
  padding: 2px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.path-description {
  padding: 0 24px 16px;
}

.path-description p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.path-topics {
  padding: 0 24px 20px;
}

.topics-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.topic-tag {
  padding: 4px 8px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 8px;
  font-size: 0.75rem;
}

.path-footer {
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.path-progress {
  display: flex;
  align-items: center;
  gap: 12px;
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
  background: #10b981;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.start-path-btn {
  width: 100%;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.start-path-btn:hover {
  background: #2563eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 20px;
  }

  .title-line {
    font-size: 2.5rem;
  }

  .container {
    padding: 0 20px;
  }

  .card-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .concepts-container {
    grid-template-columns: 1fr;
  }

  .assumption-item {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }

  .timeline-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .timeline-preview::before {
    display: none;
  }

  .paths-grid {
    grid-template-columns: 1fr;
  }
}

/* 动画类 */
.animate-in {
  animation: slideInUp 0.6s ease-out forwards;
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
</style>