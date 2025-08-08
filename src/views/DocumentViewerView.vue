<template>
  <div class="document-viewer">
    <!-- 文档头部 -->
    <div class="document-header">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回文档列表
        </button>

        <div class="document-info">
          <h1 class="document-title">{{ documentTitle }}</h1>
          <div class="document-meta">
            <span class="doc-type">{{ documentType }}</span>
            <span class="doc-date">最后更新: {{ lastModified }}</span>
          </div>
        </div>

        <div class="document-actions">
          <button @click="toggleToc" class="action-btn" :class="{ active: showToc }">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            目录
          </button>
          <button @click="downloadDocument" class="action-btn">
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

    <!-- 文档内容区域 -->
    <div class="document-body">
      <!-- 目录侧边栏 -->
      <div v-if="showToc && tableOfContents.length > 0" class="toc-sidebar">
        <div class="toc-header">
          <h3>目录</h3>
          <button @click="showToc = false" class="close-toc">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav class="toc-nav">
          <a
            v-for="heading in tableOfContents"
            :key="heading.id"
            :href="`#${heading.id}`"
            :class="['toc-link', `level-${heading.level}`]"
            @click.prevent="scrollToHeading(heading.id)"
          >
            {{ heading.text }}
          </a>
        </nav>
      </div>

      <!-- 主要内容 -->
      <div class="document-content" :class="{ 'with-toc': showToc && tableOfContents.length > 0 }">
        <article
          class="markdown-content prose prose-lg max-w-none"
          v-html="renderedContent"
        ></article>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>正在加载文档...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-overlay">
      <div class="error-message">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="retryLoad" class="retry-btn">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import mermaid from 'mermaid'

// 路由
const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(true)
const error = ref<string | null>(null)
const showToc = ref(false)
const documentContent = ref('')
const documentTitle = ref('')
const documentType = ref('Markdown')
const lastModified = ref('')

// 目录数据
interface TocItem {
  id: string
  text: string
  level: number
}

const tableOfContents = ref<TocItem[]>([])

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

// 配置 mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#1f2937',
    primaryBorderColor: '#e5e7eb',
    lineColor: '#6b7280',
    secondaryColor: '#f3f4f6',
    tertiaryColor: '#ffffff',
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    // @ts-expect-error - fontFamily is not defined in Mermaid's Gantt config types
    fontFamily: '"Inter", "Noto Sans SC", system-ui, sans-serif',
    fontSize: 11,
    gridLineStartPadding: 35,
    bottomPadding: 25,
    leftPadding: 75,
    rightPadding: 50,
  },
})

// 计算属性
const renderedContent = computed(() => {
  if (!documentContent.value) return ''

  try {
    // 先用 marked 解析 markdown
    let html = marked(documentContent.value) as string

    // 然后为标题添加 ID
    html = html.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match, level, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '') // 移除HTML标签
      const id = `heading-${cleanText.replace(/[^\w\u4e00-\u9fa5]/g, '-').toLowerCase()}`
      return `<h${level} id="${id}">${text}</h${level}>`
    })

    return html
  } catch (err) {
    console.error('Markdown 解析失败:', err)
    return `<p>Markdown 解析失败: ${err}</p>`
  }
})

// 渲染 Mermaid 图表
async function renderMermaidCharts() {
  await nextTick()

  const mermaidElements = document.querySelectorAll('.markdown-content pre code.language-mermaid')

  for (let i = 0; i < mermaidElements.length; i++) {
    const element = mermaidElements[i] as HTMLElement
    const code = element.textContent || ''
    const id = `mermaid-${Date.now()}-${i}`

    try {
      const { svg } = await mermaid.render(id, code)
      const wrapper = document.createElement('div')
      wrapper.className = 'mermaid-wrapper'
      wrapper.innerHTML = svg

      // 替换原来的 code 元素
      const preElement = element.parentElement
      if (preElement && preElement.tagName === 'PRE') {
        preElement.parentElement?.replaceChild(wrapper, preElement)
      }
    } catch (error) {
      console.error('Mermaid 渲染失败:', error)
      element.textContent = `Mermaid 渲染失败: ${error}`
    }
  }
}

// 监听路由变化
watch(
  () => route.params.path,
  () => {
    if (route.name === 'document-viewer') {
      loadDocument()
    }
  },
)

// 监听内容变化，重新渲染Mermaid
watch(renderedContent, async () => {
  if (renderedContent.value) {
    await nextTick()
    await renderMermaidCharts()
  }
})

// 生命周期
onMounted(async () => {
  await loadDocument()
})

// 方法
async function loadDocument(): Promise<void> {
  try {
    loading.value = true
    error.value = null

    const docPath = Array.isArray(route.params.path)
      ? route.params.path.join('/')
      : (route.params.path as string)

    if (!docPath) {
      throw new Error('文档路径不存在')
    }

    console.log('加载文档:', docPath)

    // 尝试从根目录加载文档
    const response = await fetch(`/${docPath}`)

    if (!response.ok) {
      throw new Error(`无法加载文档: ${response.status} ${response.statusText}`)
    }

    const content = await response.text()
    documentContent.value = content

    // 设置文档标题
    documentTitle.value = docPath.replace('.md', '').replace(/_/g, ' ').split('/').pop() || docPath

    // 设置最后修改时间（这里使用当前时间，实际应该从文件系统获取）
    lastModified.value = new Date().toLocaleDateString('zh-CN')

    // 生成目录
    generateTableOfContents()

    loading.value = false

    // 渲染 Mermaid 图表
    await renderMermaidCharts()
  } catch (err) {
    console.error('加载文档失败:', err)
    error.value = err instanceof Error ? err.message : '未知错误'
    loading.value = false
  }
}

function generateTableOfContents(): void {
  // 解析markdown标题生成目录
  const headings = documentContent.value.match(/^#{1,6}\s+.+$/gm) || []

  tableOfContents.value = headings.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 1
    const text = heading.replace(/^#+\s+/, '').trim()
    const id = `heading-${text.replace(/[^\w\u4e00-\u9fa5]/g, '-').toLowerCase()}`

    return { id, text, level }
  })
}

function toggleToc(): void {
  showToc.value = !showToc.value
}

function scrollToHeading(id: string): void {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function goBack(): void {
  router.push('/documents')
}

function downloadDocument(): void {
  // 创建下载链接
  const blob = new Blob([documentContent.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${documentTitle.value}.md`
  link.click()
  URL.revokeObjectURL(url)
}

function retryLoad(): void {
  loadDocument()
}
</script>

<style scoped>
.document-viewer {
  min-height: 100vh;
  background: #f8fafc;
}

/* 文档头部 */
.document-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  /* 使用布局组件暴露的 CSS 变量，保证与导航高度一致 */
  top: var(--desktop-header-height);
  z-index: 10;
}
@media (max-width: 768px) {
  .document-header {
    top: var(--mobile-header-height);
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  font-weight: 500;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e5e7eb;
}

.document-info {
  flex: 1;
  margin: 0 32px;
}

.document-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.document-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doc-type {
  padding: 4px 8px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.doc-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.document-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.action-btn.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 文档主体 */
.document-body {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
}

/* 目录侧边栏 */
.toc-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 24px;
  position: sticky;
  top: 144px;
  height: fit-content;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.toc-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.close-toc {
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-toc:hover {
  background: #f3f4f6;
  color: #374151;
}

.toc-nav {
  display: flex;
  flex-direction: column;
}

.toc-link {
  display: block;
  padding: 8px 0;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.4;
  transition: color 0.2s;
  border-left: 2px solid transparent;
  padding-left: 12px;
}

.toc-link:hover {
  color: #3b82f6;
}

.toc-link.level-1 {
  font-weight: 600;
  margin-top: 8px;
}

.toc-link.level-2 {
  padding-left: 24px;
}

.toc-link.level-3 {
  padding-left: 36px;
  font-size: 0.8125rem;
}

.toc-link.level-4,
.toc-link.level-5,
.toc-link.level-6 {
  padding-left: 48px;
  font-size: 0.8125rem;
  opacity: 0.8;
}

/* 文档内容 */
.document-content {
  flex: 1;
  padding: 32px;
  background: white;
  transition: all 0.3s ease;
}

.document-content.with-toc {
  margin-left: 0;
}

.markdown-content {
  max-width: none;
  line-height: 1.7;
  color: #374151;
}

/* Markdown 样式增强 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: #1f2937;
}

.markdown-content :deep(h1) {
  font-size: 2.25rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.875rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.25rem;
}

.markdown-content :deep(h3) {
  font-size: 1.5rem;
}

.markdown-content :deep(h4) {
  font-size: 1.25rem;
}

.markdown-content :deep(h5) {
  font-size: 1.125rem;
}

.markdown-content :deep(h6) {
  font-size: 1rem;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  background: #f8fafc;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
}

.markdown-content :deep(code) {
  background: #f1f5f9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.markdown-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.markdown-content :deep(th) {
  background: #f8fafc;
  font-weight: 600;
}

.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.2s;
}

.markdown-content :deep(a:hover) {
  text-decoration-color: #3b82f6;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2rem 0;
}

/* Mermaid 图表样式 */
.markdown-content :deep(.mermaid-wrapper) {
  margin: 2rem 0;
  text-align: center;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.markdown-content :deep(.mermaid-wrapper svg) {
  max-width: 100%;
  height: auto;
}

.markdown-content :deep(.mermaid-wrapper .node rect) {
  fill: #ffffff;
  stroke: #3b82f6;
  stroke-width: 2px;
}

.markdown-content :deep(.mermaid-wrapper .node .label) {
  color: #1f2937;
  font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
  font-size: 14px;
}

.markdown-content :deep(.mermaid-wrapper .edgePath .path) {
  stroke: #6b7280;
  stroke-width: 2px;
}

.markdown-content :deep(.mermaid-wrapper .edgeLabel) {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  color: #4b5563;
}

/* 时间线样式 */
.markdown-content :deep(.mermaid-wrapper .timeline-wrapper) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
}

/* 甘特图样式 */
.markdown-content :deep(.mermaid-wrapper .gantt) {
  font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif;
}

.markdown-content :deep(.mermaid-wrapper .gantt .grid .tick text) {
  font-size: 11px;
  fill: #6b7280;
}

/* 流程图样式增强 */
.markdown-content :deep(.mermaid-wrapper .flowchart-link) {
  stroke: #3b82f6;
  stroke-width: 2px;
}

.markdown-content :deep(.mermaid-wrapper .flowchart-link.dotted) {
  stroke-dasharray: 5, 5;
}

/* 子图样式 */
.markdown-content :deep(.mermaid-wrapper .cluster rect) {
  fill: #f8fafc;
  stroke: #cbd5e1;
  stroke-width: 1px;
  stroke-dasharray: 5, 5;
}

.markdown-content :deep(.mermaid-wrapper .cluster .label) {
  color: #475569;
  font-weight: 600;
  font-size: 16px;
}

/* 加载和错误状态 */
.loading-overlay,
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 50;
}

.loading-spinner,
.error-message {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message h3 {
  margin: 16px 0 8px;
  color: #dc2626;
}

.error-message p {
  margin: 0 0 16px;
  color: #6b7280;
}

.retry-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .document-info {
    margin: 0;
  }

  .document-body {
    flex-direction: column;
  }

  .toc-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .document-content {
    padding: 20px;
  }
}
</style>
