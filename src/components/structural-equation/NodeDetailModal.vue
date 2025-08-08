<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="node-icon" :style="{ backgroundColor: node.color }">
            <svg v-if="node.pathNumber" width="20" height="20" viewBox="0 0 24 24" fill="white">
              <text x="12" y="16" text-anchor="middle" font-size="14" font-weight="bold">
                {{ node.pathNumber }}
              </text>
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9,9h0a3,3,0,0,1,6,0c0,2-3,3-3,3" />
              <path d="M12,17h0" />
            </svg>
          </div>
          <div class="header-text">
            <h2 class="node-title">{{ node.label }}</h2>
            <p class="node-type">{{ getNodeTypeLabel(node.type) }}</p>
          </div>
        </div>
        <button @click="closeModal" class="close-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="content-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
          >
            <component :is="tab.icon" class="tab-icon" />
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <!-- 基本信息标签页 -->
          <div v-if="activeTab === 'basic'" class="tab-panel">
            <div class="info-section">
              <h3>概念描述</h3>
              <p class="description">{{ node.description }}</p>
            </div>

            <div class="info-section" v-if="node.examples.length > 0">
              <h3>典型例子</h3>
              <div class="examples-grid">
                <div v-for="example in node.examples" :key="example" class="example-item">
                  {{ example }}
                </div>
              </div>
            </div>

            <div class="info-section" v-if="node.relatedConcepts.length > 0">
              <h3>相关概念</h3>
              <div class="concepts-list">
                <span v-for="concept in node.relatedConcepts" :key="concept" class="concept-tag">
                  {{ concept }}
                </span>
              </div>
            </div>

            <div class="info-section">
              <h3>版本信息</h3>
              <div class="version-info">
                <div class="version-item">
                  <span class="version-label">版本:</span>
                  <span class="version-value">{{ node.version }}</span>
                </div>
                <div class="version-item">
                  <span class="version-label">最后更新:</span>
                  <span class="version-value">{{ formatDate(node.lastUpdated) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 研究证据标签页 -->
          <div v-if="activeTab === 'evidence'" class="tab-panel">
            <div v-if="node.researchEvidence.length === 0" class="empty-state">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              <p>暂无研究证据</p>
            </div>

            <div v-else class="evidence-list">
              <div
                v-for="evidence in node.researchEvidence"
                :key="evidence.id"
                class="evidence-item"
              >
                <div class="evidence-header">
                  <h4 class="evidence-title">{{ evidence.citation }}</h4>
                  <div class="evidence-meta">
                    <span class="evidence-year">{{ evidence.year }}</span>
                    <span class="evidence-journal">{{ evidence.journal }}</span>
                  </div>
                </div>

                <div class="evidence-content">
                  <p class="evidence-findings">{{ evidence.keyFindings }}</p>

                  <div class="evidence-details">
                    <div class="detail-item">
                      <span class="detail-label">研究方法:</span>
                      <span class="detail-value">{{ evidence.methodology }}</span>
                    </div>
                    <div class="detail-item" v-if="evidence.sampleSize > 0">
                      <span class="detail-label">样本量:</span>
                      <span class="detail-value">{{ evidence.sampleSize }}</span>
                    </div>
                    <div class="detail-item" v-if="evidence.effectSize">
                      <span class="detail-label">效应量:</span>
                      <span class="detail-value">{{ evidence.effectSize }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">信度:</span>
                      <span class="detail-value">{{ evidence.reliability }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">效度:</span>
                      <span class="detail-value badge" :class="`validity-${evidence.validity}`">
                        {{ getValidityLabel(evidence.validity) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 案例研究标签页 -->
          <div v-if="activeTab === 'cases'" class="tab-panel">
            <div v-if="node.caseStudies.length === 0" class="empty-state">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
              >
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                />
                <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <p>暂无案例研究</p>
            </div>

            <div v-else class="cases-list">
              <div v-for="caseStudy in node.caseStudies" :key="caseStudy.id" class="case-item">
                <div class="case-header">
                  <h4 class="case-title">{{ caseStudy.title }}</h4>
                  <div class="case-meta">
                    <span class="case-industry">{{ caseStudy.industry }}</span>
                    <span class="case-participants">{{ caseStudy.participants }}人</span>
                  </div>
                </div>

                <div class="case-content">
                  <div class="case-section">
                    <h5>研究背景</h5>
                    <p>{{ caseStudy.context }}</p>
                  </div>

                  <div class="case-section">
                    <h5>研究场景</h5>
                    <p>{{ caseStudy.scenario }}</p>
                  </div>

                  <div class="case-section">
                    <h5>TAT理论应用</h5>
                    <p>{{ caseStudy.tatApplication }}</p>
                  </div>

                  <div class="case-section">
                    <h5>研究结果</h5>
                    <ul class="outcomes-list">
                      <li v-for="outcome in caseStudy.outcomes" :key="outcome">
                        {{ outcome }}
                      </li>
                    </ul>
                  </div>

                  <div class="case-section">
                    <h5>经验教训</h5>
                    <ul class="lessons-list">
                      <li v-for="lesson in caseStudy.lessons" :key="lesson">
                        {{ lesson }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 关系网络标签页 -->
          <div v-if="activeTab === 'relationships'" class="tab-panel">
            <div class="relationships-section">
              <h3>输入关系</h3>
              <div v-if="incomingRelationships.length === 0" class="empty-relationships">
                <p>无输入关系</p>
              </div>
              <div v-else class="relationships-list">
                <div
                  v-for="rel in incomingRelationships"
                  :key="rel.id"
                  class="relationship-item incoming"
                >
                  <div class="relationship-arrow">←</div>
                  <div class="relationship-content">
                    <div class="relationship-source">{{ getNodeLabel(rel.source) }}</div>
                    <div class="relationship-description">{{ rel.description }}</div>
                    <div class="relationship-meta">
                      <span class="relationship-strength">强度: {{ rel.strength }}</span>
                      <span class="relationship-type">{{
                        getRelationshipTypeLabel(rel.type)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="relationships-section">
              <h3>输出关系</h3>
              <div v-if="outgoingRelationships.length === 0" class="empty-relationships">
                <p>无输出关系</p>
              </div>
              <div v-else class="relationships-list">
                <div
                  v-for="rel in outgoingRelationships"
                  :key="rel.id"
                  class="relationship-item outgoing"
                >
                  <div class="relationship-content">
                    <div class="relationship-target">{{ getNodeLabel(rel.target) }}</div>
                    <div class="relationship-description">{{ rel.description }}</div>
                    <div class="relationship-meta">
                      <span class="relationship-strength">强度: {{ rel.strength }}</span>
                      <span class="relationship-type">{{
                        getRelationshipTypeLabel(rel.type)
                      }}</span>
                    </div>
                  </div>
                  <div class="relationship-arrow">→</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="footer-actions">
          <button @click="toggleBookmark" class="action-btn" :class="{ active: isBookmarked }">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {{ isBookmarked ? '已收藏' : '收藏' }}
          </button>
          <button @click="openNoteEditor" class="action-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            笔记
          </button>
          <button @click="shareNode" class="action-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            分享
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {
  StructuralEquationNode,
  StructuralEquationRelationship,
} from '@/types/structural-equation'

interface Props {
  isVisible: boolean
  node: StructuralEquationNode
  incomingRelationships: StructuralEquationRelationship[]
  outgoingRelationships: StructuralEquationRelationship[]
  relatedNodes: StructuralEquationNode[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  bookmark: [nodeId: string]
  note: [nodeId: string]
  share: [nodeId: string]
}>()

// State
const activeTab = ref('basic')
const isBookmarked = ref(false)

// Tabs configuration
const tabs = [
  { id: 'basic', label: '基本信息', icon: 'InfoIcon' },
  { id: 'evidence', label: '研究证据', icon: 'DocumentIcon' },
  { id: 'cases', label: '案例研究', icon: 'CaseIcon' },
  { id: 'relationships', label: '关系网络', icon: 'NetworkIcon' },
]

// Methods
const closeModal = () => {
  emit('close')
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  emit('bookmark', props.node.id)
}

const openNoteEditor = () => {
  emit('note', props.node.id)
}

const shareNode = () => {
  emit('share', props.node.id)
}

const getNodeTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'context-group': '情境组',
    'situational-cue': '情境线索',
    'core-construct': '核心构念',
    mediator: '中介变量',
    outcome: '结果变量',
    'final-outcome': '最终结果',
    'outcome-group': '结果组',
    motivation: '激励因素',
  }
  return typeLabels[type] || type
}

const getValidityLabel = (validity: string): string => {
  const validityLabels: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
  }
  return validityLabels[validity] || validity
}

const getRelationshipTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    activation: '激活',
    'direct-effect': '直接效应',
    mediation: '中介',
    moderation: '调节',
    feedback: '反馈',
  }
  return typeLabels[type] || type
}

const getNodeLabel = (nodeId: string): string => {
  const relatedNode = props.relatedNodes.find((n) => n.id === nodeId)
  return relatedNode?.label || nodeId
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-container {
  @apply bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.header-content {
  @apply flex items-center gap-4;
}

.node-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center;
}

.header-text {
  @apply flex-1;
}

.node-title {
  @apply text-xl font-bold text-gray-900 mb-1;
}

.node-type {
  @apply text-sm text-gray-500;
}

.close-btn {
  @apply p-2 rounded-lg hover:bg-gray-100 transition-colors;
}

.modal-body {
  @apply flex-1 overflow-hidden;
}

.content-tabs {
  @apply flex border-b border-gray-200 px-6;
}

.tab-btn {
  @apply flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors;
}

.tab-btn.active {
  @apply text-blue-600 border-blue-600;
}

.tab-icon {
  @apply w-4 h-4;
}

.tab-content {
  @apply flex-1 overflow-y-auto;
}

.tab-panel {
  @apply p-6 space-y-6;
}

.info-section {
  @apply space-y-3;
}

.info-section h3 {
  @apply text-lg font-semibold text-gray-900;
}

.description {
  @apply text-gray-700 leading-relaxed;
}

.examples-grid {
  @apply grid grid-cols-2 md:grid-cols-3 gap-2;
}

.example-item {
  @apply px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm;
}

.concepts-list {
  @apply flex flex-wrap gap-2;
}

.concept-tag {
  @apply px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm;
}

.version-info {
  @apply grid grid-cols-2 gap-4;
}

.version-item {
  @apply flex justify-between;
}

.version-label {
  @apply text-gray-500;
}

.version-value {
  @apply font-medium text-gray-900;
}

.empty-state {
  @apply text-center py-12 text-gray-500;
}

.empty-state svg {
  @apply mx-auto mb-4;
}

.evidence-list,
.cases-list {
  @apply space-y-6;
}

.evidence-item,
.case-item {
  @apply border border-gray-200 rounded-lg p-4;
}

.evidence-header,
.case-header {
  @apply mb-4;
}

.evidence-title,
.case-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.evidence-meta,
.case-meta {
  @apply flex items-center gap-4 text-sm text-gray-500;
}

.evidence-findings {
  @apply text-gray-700 mb-4;
}

.evidence-details {
  @apply grid grid-cols-2 md:grid-cols-3 gap-3;
}

.detail-item {
  @apply flex flex-col;
}

.detail-label {
  @apply text-xs text-gray-500 mb-1;
}

.detail-value {
  @apply text-sm font-medium text-gray-900;
}

.badge {
  @apply px-2 py-1 rounded text-xs;
}

.validity-high {
  @apply bg-green-100 text-green-800;
}

.validity-medium {
  @apply bg-yellow-100 text-yellow-800;
}

.validity-low {
  @apply bg-red-100 text-red-800;
}

.case-section {
  @apply mb-4;
}

.case-section h5 {
  @apply font-semibold text-gray-900 mb-2;
}

.outcomes-list,
.lessons-list {
  @apply list-disc list-inside space-y-1 text-gray-700;
}

.relationships-section {
  @apply mb-8;
}

.relationships-section h3 {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.empty-relationships {
  @apply text-center py-8 text-gray-500;
}

.relationships-list {
  @apply space-y-3;
}

.relationship-item {
  @apply flex items-center gap-4 p-4 border border-gray-200 rounded-lg;
}

.relationship-item.incoming {
  @apply bg-blue-50;
}

.relationship-item.outgoing {
  @apply bg-green-50;
}

.relationship-arrow {
  @apply text-2xl font-bold text-gray-400;
}

.relationship-content {
  @apply flex-1;
}

.relationship-source,
.relationship-target {
  @apply font-semibold text-gray-900 mb-1;
}

.relationship-description {
  @apply text-gray-700 mb-2;
}

.relationship-meta {
  @apply flex items-center gap-4 text-sm text-gray-500;
}

.modal-footer {
  @apply border-t border-gray-200 p-6;
}

.footer-actions {
  @apply flex items-center justify-end gap-3;
}

.action-btn {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors;
}

.action-btn.active {
  @apply bg-blue-50 border-blue-300 text-blue-700;
}
</style>
