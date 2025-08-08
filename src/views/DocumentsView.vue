<template>
  <div class="documents-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">文档资源中心</h1>
        <p class="page-subtitle">TAT理论相关的研究文档、分析报告和学习资料</p>
      </div>

      <!-- 搜索和筛选 -->
      <div class="search-filters">
        <div class="search-box">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="搜索文档..." class="search-input" />
        </div>

        <div class="filter-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            :class="['filter-tab', { active: activeCategory === category.id }]"
          >
            <span class="tab-icon">{{ category.icon }}</span>
            {{ category.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 文档网格 -->
    <div class="documents-container">
      <div class="documents-grid">
        <div
          v-for="doc in filteredDocuments"
          :key="doc.id"
          class="document-card"
          @click="openDocument(doc)"
        >
          <div class="card-header">
            <div class="doc-icon">{{ getDocumentIcon(doc.type) }}</div>
            <div class="doc-meta">
              <span class="doc-type">{{ getDocumentTypeLabel(doc.type) }}</span>
              <span class="doc-size">{{ doc.size }}</span>
            </div>
          </div>

          <div class="card-content">
            <h3 class="doc-title">{{ doc.title }}</h3>
            <p class="doc-description">{{ doc.description }}</p>

            <div class="doc-tags">
              <span v-for="tag in doc.tags" :key="tag" class="doc-tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="doc-info">
              <span class="doc-date">{{ formatDate(doc.lastModified) }}</span>
            </div>
            <div class="doc-actions">
              <button @click.stop="previewDocument(doc)" class="action-btn preview">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                预览
              </button>
              <button @click.stop="downloadDocument(doc)" class="action-btn download">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-4-4m4 4l4-4m-4 4V3"
                  />
                </svg>
                下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 文档类型定义
interface Document {
  id: string
  title: string
  description: string
  type: 'markdown' | 'pdf' | 'html' | 'image'
  category: string
  tags: string[]
  size: string
  lastModified: Date
  filePath: string
}

// 路由
const router = useRouter()

// 状态
const searchQuery = ref('')
const activeCategory = ref('all')

// 分类定义
const categories = [
  { id: 'all', label: '全部', icon: '📚' },
  { id: 'theory', label: '理论分析', icon: '🧠' },
  { id: 'research', label: '研究报告', icon: '📊' },
  { id: 'application', label: '应用案例', icon: '💼' },
  { id: 'method', label: '方法工具', icon: '🔧' },
  { id: 'visualization', label: '可视化', icon: '🎨' },
]

// 文档数据
const documents = ref<Document[]>([
  {
    id: 'tat-analysis',
    title: '特质激发理论(TAT)全面分析',
    description: 'TAT理论的核心概念、发展历程、应用领域和实证研究的全面分析文档',
    type: 'markdown',
    category: 'theory',
    tags: ['TAT理论', '特质激发', '理论基础'],
    size: '156 KB',
    lastModified: new Date('2024-01-15'),
    filePath: '特质激发理论_TAT_全面分析.md',
  },
  {
    id: 'tat-evolution',
    title: 'TAT理论演化',
    description: 'TAT理论从诞生到发展的完整演化历程，包括关键里程碑和理论完善过程',
    type: 'markdown',
    category: 'theory',
    tags: ['理论演化', '发展历程', '学术史'],
    size: '89 KB',
    lastModified: new Date('2024-01-12'),
    filePath: 'TAT理论演化.md',
  },
  {
    id: 'comprehensive-report',
    title: 'TAT理论综合研究报告',
    description: '基于大量文献的TAT理论综合研究报告，涵盖理论应用和实证发现',
    type: 'markdown',
    category: 'research',
    tags: ['综合报告', '文献综述', '实证研究'],
    size: '234 KB',
    lastModified: new Date('2024-01-10'),
    filePath: 'TAT理论综合研究报告.md',
  },
  {
    id: 'data-analysis',
    title: 'TAT理论数据分析',
    description: '使用SPSS进行的TAT理论相关数据分析，包括描述性统计和结构方程模型',
    type: 'markdown',
    category: 'method',
    tags: ['数据分析', 'SPSS', '统计方法'],
    size: '178 KB',
    lastModified: new Date('2024-01-08'),
    filePath: 'TAT理论数据分析.md',
  },
  {
    id: 'structural-equation',
    title: 'TAT结构方程分析',
    description: 'TAT理论的结构方程模型分析，包括模型拟合和路径系数解释',
    type: 'markdown',
    category: 'method',
    tags: ['结构方程', '模型分析', '路径分析'],
    size: '145 KB',
    lastModified: new Date('2024-01-05'),
    filePath: 'TAT结构方程分析.md',
  },
  {
    id: 'top-journal-research',
    title: 'TAT顶刊研究复现',
    description: '近5年高质量TAT理论研究的复现分析，包括研究方法和发现总结',
    type: 'markdown',
    category: 'research',
    tags: ['顶级期刊', '研究复现', '实证分析'],
    size: '198 KB',
    lastModified: new Date('2024-01-03'),
    filePath: 'TAT顶刊研究复现.md',
  },
  {
    id: 'scale-map',
    title: 'TAT量表地图及应用',
    description: 'TAT理论相关量表的分类地图和应用指导，包括量表选择决策树',
    type: 'markdown',
    category: 'method',
    tags: ['量表', '测量工具', '应用指导'],
    size: '167 KB',
    lastModified: new Date('2024-01-01'),
    filePath: 'TAT量表地图及应用.md',
  },
  {
    id: 'service-quality-application',
    title: 'TAT理论在服务质量研究中的应用',
    description: 'TAT理论在服务质量管理和研究中的具体应用案例和方法',
    type: 'markdown',
    category: 'application',
    tags: ['服务质量', '应用案例', '管理实践'],
    size: '134 KB',
    lastModified: new Date('2023-12-28'),
    filePath: 'TAT理论在服务质量研究中的应用.md',
  },
  {
    id: 'hotel-personality-research',
    title: '基于人格特质的酒店服务个性化管理策略',
    description: '酒店行业中基于人格特质的服务个性化管理策略研究',
    type: 'markdown',
    category: 'application',
    tags: ['酒店管理', '个性化服务', '人格特质'],
    size: '112 KB',
    lastModified: new Date('2023-12-25'),
    filePath: '基于人格特质的酒店服务个性化管理策略.md',
  },
  {
    id: 'digital-framework',
    title: '数字时代激励企业合伙人的概念框架模型',
    description: '数字化转型背景下企业合伙人激励机制的概念框架和实施模型',
    type: 'markdown',
    category: 'application',
    tags: ['数字化转型', '合伙人制度', '激励机制'],
    size: '156 KB',
    lastModified: new Date('2023-12-20'),
    filePath: '数字时代激励企业合伙人的概念框架模型.md',
  },
  {
    id: 'pls-sem-application',
    title: 'PLS-SEM方法在服务质量研究中的应用',
    description: 'PLS-SEM结构方程建模方法在服务质量研究中的应用指南',
    type: 'markdown',
    category: 'method',
    tags: ['PLS-SEM', '结构方程', '服务质量'],
    size: '143 KB',
    lastModified: new Date('2023-12-18'),
    filePath: 'PLS-SEM方法在服务质量研究中的应用.md',
  },
  {
    id: 'servqual-model',
    title: 'SERVQUAL模型在酒店服务质量评估中的应用',
    description: 'SERVQUAL服务质量评估模型在酒店行业的应用研究',
    type: 'markdown',
    category: 'method',
    tags: ['SERVQUAL', '服务质量', '酒店评估'],
    size: '128 KB',
    lastModified: new Date('2023-12-15'),
    filePath: 'SERVQUAL模型在酒店服务质量评估中的应用.md',
  },
  {
    id: 'management-theories',
    title: '组织管理十大经典理论',
    description: '组织管理领域的十大经典理论详解，包括理论背景和应用案例',
    type: 'pdf',
    category: 'theory',
    tags: ['管理理论', '组织行为', '经典理论'],
    size: '2.3 MB',
    lastModified: new Date('2023-12-10'),
    filePath: '组织管理十大经典理论.pdf',
  },
  {
    id: 'introversion-extroversion-study',
    title: '内外向人格特质与服务质量维度关系研究',
    description: '基于TAT理论的内外向人格特质对服务质量影响的实证研究',
    type: 'pdf',
    category: 'research',
    tags: ['人格特质', '服务质量', '实证研究'],
    size: '1.8 MB',
    lastModified: new Date('2023-12-05'),
    filePath:
      'The Influence of Introversion–Extroversion on Service Quality Dimensions：A Trait Activation Theory Study.pdf',
  },
  {
    id: 'tat-learning-platform',
    title: 'TAT理论深度学习平台',
    description: '交互式TAT理论学习平台的HTML演示版本',
    type: 'html',
    category: 'visualization',
    tags: ['学习平台', '交互式', 'HTML'],
    size: '456 KB',
    lastModified: new Date('2023-12-01'),
    filePath: 'TAT理论深度学习平台.html',
  },
  {
    id: 'tat-learning-apple-style',
    title: 'TAT理论深度学习平台(Apple风格)',
    description: 'Apple风格设计的TAT理论学习平台HTML版本',
    type: 'html',
    category: 'visualization',
    tags: ['Apple风格', '学习平台', '设计'],
    size: '523 KB',
    lastModified: new Date('2023-11-28'),
    filePath: 'TAT理论深度学习平台_Apple风格.html',
  },
  {
    id: 'customer-segmentation',
    title: '顾客细分与个性化服务设计',
    description: '基于顾客特征的细分策略和个性化服务设计方法研究',
    type: 'markdown',
    category: 'application',
    tags: ['顾客细分', '个性化服务', '服务设计'],
    size: '98 KB',
    lastModified: new Date('2024-01-20'),
    filePath: '顾客细分与个性化服务设计.md',
  },
  {
    id: 'personality-hotel-service',
    title: '基于人格特质的酒店服务个性化管理策略',
    description: '酒店行业中基于人格特质的服务个性化管理策略研究',
    type: 'markdown',
    category: 'application',
    tags: ['酒店管理', '个性化服务', '人格特质'],
    size: '112 KB',
    lastModified: new Date('2023-12-25'),
    filePath: '基于人格特质的酒店服务个性化管理策略.md',
  },
  {
    id: 'hotel-customer-personality-research',
    title: '酒店顾客人格特质与服务质量关系的实证研究报告',
    description: '酒店顾客人格特质对服务质量感知影响的实证研究分析',
    type: 'markdown',
    category: 'research',
    tags: ['实证研究', '人格特质', '服务质量'],
    size: '187 KB',
    lastModified: new Date('2024-01-18'),
    filePath: '酒店顾客人格特质与服务质量关系的实证研究报告.md',
  },
  {
    id: 'introversion-extroversion-research',
    title: '内外向人格特质与服务质量维度关系研究',
    description: '基于TAT理论的内外向人格特质对服务质量维度影响的深入研究',
    type: 'markdown',
    category: 'research',
    tags: ['内外向', '人格特质', '服务质量维度'],
    size: '145 KB',
    lastModified: new Date('2024-01-16'),
    filePath: '内外向人格特质与服务质量维度关系研究.md',
  },
  {
    id: 'requirements',
    title: '项目需求文档',
    description: 'TAT理论平台的功能需求和技术规格说明',
    type: 'markdown',
    category: 'method',
    tags: ['需求分析', '项目规划', '技术规格'],
    size: '67 KB',
    lastModified: new Date('2024-01-22'),
    filePath: '需求.md',
  },
  {
    id: 'pdf-content-plan',
    title: 'PDF内容拆解文档计划',
    description: 'PDF文档内容提取和结构化处理的实施计划',
    type: 'markdown',
    category: 'method',
    tags: ['文档处理', 'PDF解析', '内容提取'],
    size: '45 KB',
    lastModified: new Date('2024-01-14'),
    filePath: 'PDF内容拆解文档计划.md',
  },
  {
    id: 'tat-structural-equation-detailed',
    title: 'TAT理论结构方程详细分析',
    description: 'TAT理论结构方程模型的深度解析，包含路径分析、拟合度指标和实证验证',
    type: 'markdown',
    category: 'method',
    tags: ['结构方程', '路径分析', '模型拟合', '统计分析'],
    size: '287 KB',
    lastModified: new Date('2024-01-25'),
    filePath: 'TAT理论结构方程详细分析.md',
  },
  {
    id: 'tat-core-mechanism',
    title: 'TAT理论核心机制深度解析',
    description: '特质激发理论的核心机制详细说明，包含神经生物学基础和文化心理学视角',
    type: 'markdown',
    category: 'theory',
    tags: ['核心机制', '神经科学', '发展心理学', '文化心理学'],
    size: '324 KB',
    lastModified: new Date('2024-01-25'),
    filePath: 'TAT理论核心机制深度解析.md',
  },
  {
    id: 'tat-empirical-data',
    title: 'TAT理论实证研究数据集',
    description: '全面的TAT理论实证研究数据汇总，包含经典研究、行业研究和大数据分析',
    type: 'markdown',
    category: 'research',
    tags: ['实证研究', '数据分析', '元分析', '大数据'],
    size: '412 KB',
    lastModified: new Date('2024-01-25'),
    filePath: 'TAT理论实证研究数据集.md',
  },
  {
    id: 'tat-structure-visualization',
    title: 'TAT理论结构图可视化说明',
    description: 'TAT理论结构方程模型的详细可视化解释，包含图形符号、路径分析和应用场景',
    type: 'markdown',
    category: 'visualization',
    tags: ['结构图', '可视化', '模型解释', '图形说明'],
    size: '198 KB',
    lastModified: new Date('2024-01-25'),
    filePath: 'TAT理论结构图可视化说明.md',
  },
  {
    id: 'tat-application-cases',
    title: 'TAT理论应用案例集',
    description: '涵盖人力资源、教育培训、医疗健康、零售服务等领域的TAT理论实际应用案例',
    type: 'markdown',
    category: 'application',
    tags: ['应用案例', '实践经验', '行业应用', '成功案例'],
    size: '456 KB',
    lastModified: new Date('2024-01-26'),
    filePath: 'TAT理论应用案例集.md',
  },
  {
    id: 'tat-measurement-tools',
    title: 'TAT理论测量工具与量表详解',
    description: '详细介绍TAT理论相关的测量工具、量表使用方法和数据分析技术',
    type: 'markdown',
    category: 'method',
    tags: ['测量工具', '量表', '数据分析', '研究方法'],
    size: '378 KB',
    lastModified: new Date('2024-01-26'),
    filePath: 'TAT理论测量工具与量表详解.md',
  },
  {
    id: 'tat-research-visualization',
    title: 'TAT理论研究结果可视化',
    description: '全面的TAT理论研究结果可视化展示，包含理论模型图、实证数据图表和应用效果分析',
    type: 'markdown',
    category: 'visualization',
    tags: ['数据可视化', '研究结果', '图表分析', 'Mermaid图表'],
    size: '298 KB',
    lastModified: new Date('2024-01-26'),
    filePath: 'TAT理论研究结果可视化.md',
  },
  {
    id: 'mermaid-test',
    title: 'Mermaid图表测试文档',
    description: '用于测试Mermaid图表渲染功能的示例文档，包含流程图、序列图、甘特图等',
    type: 'markdown',
    category: 'visualization',
    tags: ['Mermaid', '图表测试', '可视化', '功能验证'],
    size: '12 KB',
    lastModified: new Date('2024-01-26'),
    filePath: 'Mermaid测试文档.md',
  },
  {
    id: 'tat-research-methodology',
    title: 'TAT理论研究方法论',
    description: '完整的TAT理论研究方法论框架，包含研究设计、数据收集、分析技术和质量控制',
    type: 'markdown',
    category: 'method',
    tags: ['研究方法论', '研究设计', '数据分析', '质量控制'],
    size: '267 KB',
    lastModified: new Date('2024-01-26'),
    filePath: 'TAT理论研究方法论.md',
  },
])

// 计算属性
const filteredDocuments = computed(() => {
  let filtered = documents.value

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter((doc) => doc.category === activeCategory.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  return filtered
})

// 方法
function getDocumentIcon(type: string): string {
  const icons = {
    markdown: '📝',
    pdf: '📄',
    html: '🌐',
    image: '🖼️',
  }
  return icons[type as keyof typeof icons] || '📄'
}

function getDocumentTypeLabel(type: string): string {
  const labels = {
    markdown: 'Markdown',
    pdf: 'PDF',
    html: 'HTML',
    image: '图片',
  }
  return labels[type as keyof typeof labels] || type.toUpperCase()
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function openDocument(doc: Document): void {
  // 根据文档类型打开不同的查看器
  if (doc.type === 'markdown') {
    // 导航到文档详情页
    router.push(`/document/${encodeURIComponent(doc.filePath)}`)
  } else if (doc.type === 'pdf') {
    // 在新窗口打开PDF
    window.open(`/${encodeURIComponent(doc.filePath)}`.replace(/%2F/g, '/'), '_blank')
  } else if (doc.type === 'html') {
    // 在新窗口打开HTML
    window.open(`/${encodeURIComponent(doc.filePath)}`.replace(/%2F/g, '/'), '_blank')
  }
}

function previewDocument(doc: Document): void {
  console.log('预览文档:', doc.title)
}

function downloadDocument(doc: Document): void {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = `/${encodeURIComponent(doc.filePath)}`.replace(/%2F/g, '/')
  link.download = doc.filePath
  link.click()
}
</script>

<style scoped>
.documents-view {
  min-height: 100vh;
  background: #f8fafc;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px 40px;
}

.header-content {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* 搜索和筛选 */
.search-filters {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto 32px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 16px;
  color: #1f2937;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.filter-tab.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 16px;
}

/* 文档容器 */
.documents-container {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

/* 文档卡片 */
.document-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid transparent;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-bottom: 1px solid #e5e7eb;
}

.doc-icon {
  font-size: 32px;
}

.doc-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.doc-type {
  padding: 4px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.doc-size {
  font-size: 0.75rem;
  color: #6b7280;
}

.card-content {
  padding: 20px;
}

.doc-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
}

.doc-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.875rem;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.doc-tag {
  padding: 4px 8px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.doc-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.doc-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.preview {
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #dbeafe;
}

.action-btn.preview:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

.action-btn.download {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
}

.action-btn.download:hover {
  background: #dcfce7;
  border-color: #16a34a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .filter-tab {
    flex-shrink: 0;
  }
}
</style>
