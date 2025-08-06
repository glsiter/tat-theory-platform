<template>
  <div class="mind-map-search" :class="{ 'search-expanded': isExpanded }">
    <!-- 搜索输入框 -->
    <div class="search-input-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="搜索TAT理论概念..."
          class="search-input"
          @input="handleSearchInput"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @keydown="handleKeyDown"
        />
        
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-button"
          title="清除搜索"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 搜索选项 -->
      <div v-if="isExpanded" class="search-options">
        <div class="option-group">
          <label class="option-label">分类:</label>
          <select v-model="searchFilters.category" @change="performSearch" class="option-select">
            <option value="">全部</option>
            <option value="core">核心</option>
            <option value="concept">概念</option>
            <option value="application">应用</option>
            <option value="research">研究</option>
            <option value="method">方法</option>
            <option value="theory">理论</option>
          </select>
        </div>

        <div class="option-group">
          <label class="option-label">难度:</label>
          <select v-model="searchFilters.difficulty" @change="performSearch" class="option-select">
            <option value="">全部</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="showResults && (searchResults.length > 0 || searchQuery)" class="search-results">
      <div class="results-header">
        <span class="results-count">
          {{ searchResults.length > 0 ? `找到 ${searchResults.length} 个结果` : '未找到结果' }}
        </span>
        <button @click="closeResults" class="close-results">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="results-list">
        <div
          v-for="(result, index) in searchResults"
          :key="result.nodeId"
          :class="['result-item', { 'result-selected': selectedResultIndex === index }]"
          @click="selectResult(result, index)"
          @mouseenter="selectedResultIndex = index"
        >
          <div class="result-icon">
            {{ getCategoryIcon(result.node.category) }}
          </div>
          
          <div class="result-content">
            <div class="result-title">
              <span v-html="highlightText(result.node.label, searchQuery)"></span>
              <span class="result-category">{{ getCategoryLabel(result.node.category) }}</span>
            </div>
            
            <div class="result-description">
              <span v-html="highlightText(result.node.description, searchQuery)"></span>
            </div>
            
            <div class="result-meta">
              <span class="match-type">{{ getMatchTypeLabel(result.matchType) }}</span>
              <span class="relevance-score">相关度: {{ Math.round(result.relevanceScore * 100) }}%</span>
              <span class="difficulty">{{ getDifficultyLabel(result.node.difficulty) }}</span>
            </div>
          </div>

          <div class="result-actions">
            <button 
              @click.stop="focusNode(result.nodeId)"
              class="action-btn"
              title="定位节点"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 搜索建议 -->
      <div v-if="searchSuggestions.length > 0" class="search-suggestions">
        <div class="suggestions-header">相关建议:</div>
        <div class="suggestions-list">
          <button
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="applySuggestion(suggestion)"
            class="suggestion-item"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div v-if="showHistory && searchHistory.length > 0" class="search-history">
      <div class="history-header">
        <span>搜索历史</span>
        <button @click="clearHistory" class="clear-history">清除</button>
      </div>
      <div class="history-list">
        <button
          v-for="(item, index) in searchHistory"
          :key="index"
          @click="applyHistoryItem(item)"
          class="history-item"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ item }}
        </button>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div v-if="showPopular && popularSearches.length > 0" class="popular-searches">
      <div class="popular-header">热门搜索:</div>
      <div class="popular-list">
        <button
          v-for="term in popularSearches"
          :key="term"
          @click="applyPopularSearch(term)"
          class="popular-item"
        >
          {{ term }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { mindMapService } from '@/services/mind-map-service'
import type { SearchResult, MindMapNode } from '@/types/mind-map'

// Props
interface Props {
  placeholder?: string
  maxResults?: number
  showHistory?: boolean
  showPopular?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索TAT理论概念...',
  maxResults: 10,
  showHistory: true,
  showPopular: true,
  autoFocus: false
})

// Emits
const emit = defineEmits<{
  search: [query: string, results: SearchResult[]]
  select: [result: SearchResult]
  focus: [nodeId: string]
  clear: []
}>()

// Refs
const searchInputRef = ref<HTMLInputElement>()

// State
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const selectedResultIndex = ref(-1)
const isExpanded = ref(false)
const showResults = ref(false)
const showHistory = ref(false)

// 搜索过滤器
const searchFilters = ref({
  category: '',
  difficulty: '',
  maxResults: props.maxResults
})

// 搜索历史和建议
const searchHistory = ref<string[]>([])
const searchSuggestions = ref<string[]>([])
const popularSearches = ref([
  '特质激发理论',
  '人格特质',
  '情境线索',
  '组织行为',
  '大五人格',
  '特质匹配',
  '激发过程',
  '行为表达'
])

// 防抖定时器
let searchDebounceTimer: number | null = null

// Computed
const hasActiveSearch = computed(() => searchQuery.value.trim().length > 0)

// 生命周期
onMounted(() => {
  loadSearchHistory()
  if (props.autoFocus) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
  
  // 添加全局键盘事件监听
  document.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown)
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
})

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    generateSearchSuggestions(newQuery)
  } else {
    searchSuggestions.value = []
  }
})

// 搜索输入处理
function handleSearchInput(): void {
  // 清除之前的防抖定时器
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  // 设置新的防抖定时器
  searchDebounceTimer = window.setTimeout(() => {
    performSearch()
  }, 300)
}

// 执行搜索
function performSearch(): void {
  const query = searchQuery.value.trim()
  
  if (!query) {
    searchResults.value = []
    showResults.value = false
    emit('clear')
    return
  }

  try {
    const results = mindMapService.search(query, {
      category: searchFilters.value.category || undefined,
      difficulty: searchFilters.value.difficulty || undefined,
      maxResults: searchFilters.value.maxResults
    })

    searchResults.value = results
    selectedResultIndex.value = results.length > 0 ? 0 : -1
    showResults.value = true
    showHistory.value = false

    // 添加到搜索历史
    addToSearchHistory(query)

    emit('search', query, results)
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
    showResults.value = false
  }
}

// 搜索焦点处理
function handleSearchFocus(): void {
  isExpanded.value = true
  
  if (!hasActiveSearch.value) {
    showHistory.value = props.showHistory && searchHistory.value.length > 0
    showResults.value = false
  }
}

// 搜索失焦处理
function handleSearchBlur(): void {
  // 延迟隐藏，允许点击结果
  setTimeout(() => {
    if (!searchInputRef.value?.matches(':focus')) {
      isExpanded.value = false
      showResults.value = false
      showHistory.value = false
    }
  }, 200)
}

// 键盘事件处理
function handleKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (searchResults.value.length > 0) {
        selectedResultIndex.value = Math.min(
          selectedResultIndex.value + 1,
          searchResults.value.length - 1
        )
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (searchResults.value.length > 0) {
        selectedResultIndex.value = Math.max(selectedResultIndex.value - 1, 0)
      }
      break

    case 'Enter':
      event.preventDefault()
      if (selectedResultIndex.value >= 0 && searchResults.value[selectedResultIndex.value]) {
        selectResult(searchResults.value[selectedResultIndex.value], selectedResultIndex.value)
      }
      break

    case 'Escape':
      event.preventDefault()
      clearSearch()
      searchInputRef.value?.blur()
      break
  }
}

// 全局键盘事件处理
function handleGlobalKeyDown(event: KeyboardEvent): void {
  // Ctrl/Cmd + K 快速搜索
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    searchInputRef.value?.focus()
  }
}

// 选择搜索结果
function selectResult(result: SearchResult, index: number): void {
  selectedResultIndex.value = index
  searchQuery.value = result.node.label
  showResults.value = false
  showHistory.value = false
  
  emit('select', result)
  emit('focus', result.nodeId)
}

// 定位节点
function focusNode(nodeId: string): void {
  emit('focus', nodeId)
  showResults.value = false
}

// 清除搜索
function clearSearch(): void {
  searchQuery.value = ''
  searchResults.value = []
  selectedResultIndex.value = -1
  showResults.value = false
  showHistory.value = false
  searchSuggestions.value = []
  
  emit('clear')
}

// 关闭结果
function closeResults(): void {
  showResults.value = false
}

// 应用搜索建议
function applySuggestion(suggestion: string): void {
  searchQuery.value = suggestion
  performSearch()
}

// 应用历史搜索
function applyHistoryItem(item: string): void {
  searchQuery.value = item
  performSearch()
}

// 应用热门搜索
function applyPopularSearch(term: string): void {
  searchQuery.value = term
  performSearch()
}

// 添加到搜索历史
function addToSearchHistory(query: string): void {
  if (!query.trim()) return

  // 移除重复项
  const index = searchHistory.value.indexOf(query)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }

  // 添加到开头
  searchHistory.value.unshift(query)

  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }

  // 保存到本地存储
  saveSearchHistory()
}

// 加载搜索历史
function loadSearchHistory(): void {
  try {
    const saved = localStorage.getItem('tat-search-history')
    if (saved) {
      searchHistory.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error)
  }
}

// 保存搜索历史
function saveSearchHistory(): void {
  try {
    localStorage.setItem('tat-search-history', JSON.stringify(searchHistory.value))
  } catch (error) {
    console.error('保存搜索历史失败:', error)
  }
}

// 清除搜索历史
function clearHistory(): void {
  searchHistory.value = []
  saveSearchHistory()
  showHistory.value = false
}

// 生成搜索建议
function generateSearchSuggestions(query: string): void {
  if (!query.trim()) {
    searchSuggestions.value = []
    return
  }

  const suggestions: string[] = []
  const queryLower = query.toLowerCase()

  // 从热门搜索中匹配
  for (const term of popularSearches.value) {
    if (term.toLowerCase().includes(queryLower) && term !== query) {
      suggestions.push(term)
    }
  }

  // 从搜索历史中匹配
  for (const term of searchHistory.value) {
    if (term.toLowerCase().includes(queryLower) && term !== query && !suggestions.includes(term)) {
      suggestions.push(term)
    }
  }

  searchSuggestions.value = suggestions.slice(0, 5)
}

// 高亮搜索文本
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

// 工具函数
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    core: '●',
    concept: '◆',
    application: '▲',
    research: '■',
    method: '◇',
    theory: '○',
    example: '◯'
  }
  return icons[category] || '●'
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    core: '核心',
    concept: '概念',
    application: '应用',
    research: '研究',
    method: '方法',
    theory: '理论',
    example: '示例'
  }
  return labels[category] || category
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return labels[difficulty] || difficulty
}

function getMatchTypeLabel(matchType: string): string {
  const labels: Record<string, string> = {
    exact: '精确匹配',
    partial: '部分匹配',
    related: '相关匹配',
    concept: '概念匹配'
  }
  return labels[matchType] || matchType
}

// 暴露方法给父组件
defineExpose({
  focus: () => searchInputRef.value?.focus(),
  clear: clearSearch,
  search: (query: string) => {
    searchQuery.value = query
    performSearch()
  }
})
</script>

<style scoped>
.mind-map-search {
  position: relative;
  width: 100%;
  max-width: 500px;
}

/* 搜索输入容器 */
.search-input-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-expanded .search-input-container {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
  margin-right: 12px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1f2937;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-button {
  padding: 4px;
  margin-left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #f3f4f6;
  color: #374151;
}

/* 搜索选项 */
.search-options {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.option-select {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

/* 搜索结果 */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 400px;
  overflow: hidden;
  margin-top: 8px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.results-count {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.close-results {
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-results:hover {
  background: #e5e7eb;
  color: #374151;
}

.results-list {
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.result-item:hover,
.result-selected {
  background: #f8fafc;
}

.result-item:last-child {
  border-bottom: none;
}

.result-icon {
  font-size: 16px;
  color: #3b82f6;
  margin-top: 2px;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-weight: 500;
  color: #1f2937;
}

.result-category {
  padding: 2px 6px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.result-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
  line-height: 1.4;
}

.result-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.match-type {
  color: #16a34a;
  font-weight: 500;
}

.relevance-score {
  color: #3b82f6;
}

.difficulty {
  color: #f59e0b;
}

.result-actions {
  display: flex;
  gap: 4px;
  margin-top: 2px;
}

.action-btn {
  padding: 6px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 搜索建议 */
.search-suggestions {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.suggestions-header {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-item {
  padding: 4px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-item:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 搜索历史 */
.search-history {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  margin-top: 8px;
  max-height: 200px;
  overflow: hidden;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.clear-history {
  font-size: 12px;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-history:hover {
  background: #e5e7eb;
  color: #374151;
}

.history-list {
  max-height: 150px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
}

.history-item:hover {
  background: #f8fafc;
}

/* 热门搜索 */
.popular-searches {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.popular-header {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.popular-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.popular-item {
  padding: 4px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.popular-item:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* 高亮样式 */
:deep(.search-highlight) {
  background: #fef08a;
  color: #92400e;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .search-options {
    flex-direction: column;
    gap: 8px;
  }

  .option-group {
    justify-content: space-between;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .result-actions {
    align-self: flex-end;
  }

  .suggestions-list,
  .popular-list {
    flex-direction: column;
  }
}

/* 无障碍访问 */
@media (prefers-reduced-motion: reduce) {
  .search-input-container,
  .result-item,
  .suggestion-item,
  .popular-item,
  .history-item {
    transition: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .search-input-container {
    border: 2px solid #000;
  }
  
  .result-item:hover,
  .result-selected {
    background: #000;
    color: #fff;
  }
}
</style>