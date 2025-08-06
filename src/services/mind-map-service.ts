// TAT理论思维导图服务类
// 实现节点层级关系和内容关联逻辑
// 创建搜索索引和快速定位功能
// 建立学习路径生成和推荐算法

import type { 
  MindMapStructure, 
  MindMapNode, 
  SearchResult, 
  SearchIndex,
  LearningPath,
  NavigationState,
  RecommendationResult
} from '@/types/mind-map'
import { mindMapStructure } from '@/data/mind-map-structure'

export class MindMapService {
  private structure: MindMapStructure
  private searchIndex: SearchIndex
  private navigationState: NavigationState

  constructor() {
    this.structure = { ...mindMapStructure }
    this.searchIndex = this.buildSearchIndex()
    this.navigationState = {
      currentNodeId: 'tat-theory-center',
      visitedNodes: [],
      bookmarkedNodes: [],
      learningProgress: {},
      lastVisited: new Date()
    }
  }

  // 获取完整结构
  getStructure(): MindMapStructure {
    return this.structure
  }

  // 获取节点信息
  getNode(nodeId: string): MindMapNode | null {
    return this.structure.nodes[nodeId] || null
  }

  // 获取节点的完整层级信息
  getNodeHierarchy(nodeId: string): {
    node: MindMapNode | null
    ancestors: MindMapNode[]
    descendants: MindMapNode[]
    siblings: MindMapNode[]
    level: number
  } {
    const node = this.getNode(nodeId)
    if (!node) {
      return {
        node: null,
        ancestors: [],
        descendants: [],
        siblings: [],
        level: 0
      }
    }

    const ancestors = this.getAncestors(nodeId)
    const descendants = this.getDescendants(nodeId)
    const siblings = this.getSiblings(nodeId)

    return {
      node,
      ancestors,
      descendants,
      siblings,
      level: node.level
    }
  }

  // 获取祖先节点
  private getAncestors(nodeId: string): MindMapNode[] {
    const ancestors: MindMapNode[] = []
    let currentNode = this.getNode(nodeId)
    
    while (currentNode && currentNode.parent) {
      const parentNode = this.getNode(currentNode.parent)
      if (parentNode) {
        ancestors.unshift(parentNode)
        currentNode = parentNode
      } else {
        break
      }
    }
    
    return ancestors
  }

  // 获取后代节点
  private getDescendants(nodeId: string): MindMapNode[] {
    const descendants: MindMapNode[] = []
    const node = this.getNode(nodeId)
    
    if (!node) return descendants

    const collectDescendants = (currentNodeId: string): void => {
      const currentNode = this.getNode(currentNodeId)
      if (!currentNode) return

      for (const childId of currentNode.children) {
        const childNode = this.getNode(childId)
        if (childNode) {
          descendants.push(childNode)
          collectDescendants(childId)
        }
      }
    }

    collectDescendants(nodeId)
    return descendants
  }

  // 获取兄弟节点
  private getSiblings(nodeId: string): MindMapNode[] {
    const node = this.getNode(nodeId)
    if (!node || !node.parent) return []

    const parentNode = this.getNode(node.parent)
    if (!parentNode) return []

    return parentNode.children
      .filter(childId => childId !== nodeId)
      .map(childId => this.getNode(childId))
      .filter(Boolean) as MindMapNode[]
  }

  // 构建搜索索引
  private buildSearchIndex(): SearchIndex {
    const index: SearchIndex = {
      keywords: {},
      concepts: {},
      categories: {},
      fullText: {}
    }

    for (const [nodeId, node] of Object.entries(this.structure.nodes)) {
      // 构建关键词索引
      for (const keyword of node.keywords) {
        const normalizedKeyword = keyword.toLowerCase()
        if (!index.keywords[normalizedKeyword]) {
          index.keywords[normalizedKeyword] = []
        }
        index.keywords[normalizedKeyword].push(nodeId)
      }

      // 构建概念索引
      for (const concept of node.relatedConcepts) {
        const normalizedConcept = concept.toLowerCase()
        if (!index.concepts[normalizedConcept]) {
          index.concepts[normalizedConcept] = []
        }
        index.concepts[normalizedConcept].push(nodeId)
      }

      // 构建分类索引
      if (!index.categories[node.category]) {
        index.categories[node.category] = []
      }
      index.categories[node.category].push(nodeId)

      // 构建全文索引
      const fullText = [
        node.label,
        node.description,
        ...node.keywords,
        ...node.relatedConcepts
      ].join(' ').toLowerCase()
      index.fullText[nodeId] = fullText
    }

    return index
  }

  // 搜索功能
  search(query: string, options: {
    category?: string
    difficulty?: string
    maxResults?: number
  } = {}): SearchResult[] {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return []

    const results: SearchResult[] = []
    const { category, difficulty, maxResults = 20 } = options

    // 精确匹配关键词
    if (this.searchIndex.keywords[normalizedQuery]) {
      for (const nodeId of this.searchIndex.keywords[normalizedQuery]) {
        const node = this.getNode(nodeId)
        if (node && this.matchesFilters(node, category, difficulty)) {
          results.push({
            nodeId,
            node,
            relevanceScore: 1.0,
            matchType: 'exact',
            matchedTerms: [normalizedQuery],
            context: `关键词匹配: ${normalizedQuery}`
          })
        }
      }
    }

    // 概念匹配
    if (this.searchIndex.concepts[normalizedQuery]) {
      for (const nodeId of this.searchIndex.concepts[normalizedQuery]) {
        const node = this.getNode(nodeId)
        if (node && this.matchesFilters(node, category, difficulty) && 
            !results.some(r => r.nodeId === nodeId)) {
          results.push({
            nodeId,
            node,
            relevanceScore: 0.8,
            matchType: 'related',
            matchedTerms: [normalizedQuery],
            context: `相关概念: ${normalizedQuery}`
          })
        }
      }
    }

    // 部分匹配和模糊搜索
    const queryTerms = normalizedQuery.split(/\s+/)
    for (const [nodeId, fullText] of Object.entries(this.searchIndex.fullText)) {
      const node = this.getNode(nodeId)
      if (!node || !this.matchesFilters(node, category, difficulty)) continue
      
      if (results.some(r => r.nodeId === nodeId)) continue

      const matchedTerms: string[] = []
      let relevanceScore = 0

      for (const term of queryTerms) {
        if (fullText.includes(term)) {
          matchedTerms.push(term)
          relevanceScore += 0.3
        }
      }

      if (matchedTerms.length > 0) {
        // 根据匹配程度调整相关性分数
        relevanceScore = Math.min(relevanceScore * (matchedTerms.length / queryTerms.length), 0.7)
        
        results.push({
          nodeId,
          node,
          relevanceScore,
          matchType: 'partial',
          matchedTerms,
          context: `部分匹配: ${matchedTerms.join(', ')}`
        })
      }
    }

    // 按相关性排序并限制结果数量
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults)
  }

  // 过滤器匹配
  private matchesFilters(node: MindMapNode, category?: string, difficulty?: string): boolean {
    if (category && node.category !== category) return false
    if (difficulty && node.difficulty !== difficulty) return false
    return true
  }

  // 快速定位节点
  locateNode(nodeId: string): {
    found: boolean
    path: string[]
    breadcrumb: MindMapNode[]
  } {
    const node = this.getNode(nodeId)
    if (!node) {
      return { found: false, path: [], breadcrumb: [] }
    }

    const ancestors = this.getAncestors(nodeId)
    const path = [...ancestors.map(n => n.id), nodeId]
    const breadcrumb = [...ancestors, node]

    return { found: true, path, breadcrumb }
  }

  // 生成学习路径
  generateLearningPath(startNodeId: string, endNodeId: string, options: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    maxSteps?: number
    includePrerequisites?: boolean
  } = {}): LearningPath | null {
    const startNode = this.getNode(startNodeId)
    const endNode = this.getNode(endNodeId)
    
    if (!startNode || !endNode) return null

    const { difficulty, maxSteps = 10, includePrerequisites = true } = options

    // 使用广度优先搜索找到最短路径
    const path = this.findShortestPath(startNodeId, endNodeId, maxSteps)
    if (!path) return null

    // 如果需要包含前置条件，添加必要的前置节点
    let finalPath = path
    if (includePrerequisites) {
      finalPath = this.addPrerequisites(path)
    }

    // 过滤难度不匹配的节点
    if (difficulty) {
      finalPath = this.filterByDifficulty(finalPath, difficulty)
    }

    // 计算预估时间
    const estimatedTime = this.calculateEstimatedTime(finalPath)

    // 生成学习目标
    const objectives = this.generateLearningObjectives(finalPath)

    return {
      id: `path-${Date.now()}`,
      title: `从 ${startNode.label} 到 ${endNode.label}`,
      description: `系统学习路径，从${startNode.label}开始，逐步掌握${endNode.label}`,
      startNodeId,
      endNodeId,
      nodeSequence: finalPath,
      estimatedTime,
      difficulty: difficulty || 'intermediate',
      prerequisites: this.getPathPrerequisites(finalPath),
      objectives,
      pathType: this.determinePathType(finalPath)
    }
  }

  // 寻找最短路径
  private findShortestPath(startId: string, endId: string, maxSteps: number): string[] | null {
    if (startId === endId) return [startId]

    const queue: { nodeId: string; path: string[] }[] = [{ nodeId: startId, path: [startId] }]
    const visited = new Set<string>([startId])

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!
      
      if (path.length > maxSteps) continue

      const node = this.getNode(nodeId)
      if (!node) continue

      // 检查子节点
      for (const childId of node.children) {
        if (childId === endId) {
          return [...path, childId]
        }
        
        if (!visited.has(childId)) {
          visited.add(childId)
          queue.push({ nodeId: childId, path: [...path, childId] })
        }
      }

      // 检查相关节点
      const relatedNodes = this.getRelatedNodes(nodeId)
      for (const relatedId of relatedNodes) {
        if (relatedId === endId) {
          return [...path, relatedId]
        }
        
        if (!visited.has(relatedId)) {
          visited.add(relatedId)
          queue.push({ nodeId: relatedId, path: [...path, relatedId] })
        }
      }
    }

    return null
  }

  // 获取相关节点
  private getRelatedNodes(nodeId: string): string[] {
    return this.structure.relationships
      .filter(rel => rel.source === nodeId && rel.type === 'related')
      .map(rel => rel.target)
  }

  // 添加前置条件
  private addPrerequisites(path: string[]): string[] {
    const expandedPath: string[] = []
    const processed = new Set<string>()

    for (const nodeId of path) {
      const node = this.getNode(nodeId)
      if (!node) continue

      // 添加前置节点
      const prerequisites = this.getNodePrerequisites(nodeId)
      for (const prereqId of prerequisites) {
        if (!processed.has(prereqId)) {
          expandedPath.push(prereqId)
          processed.add(prereqId)
        }
      }

      // 添加当前节点
      if (!processed.has(nodeId)) {
        expandedPath.push(nodeId)
        processed.add(nodeId)
      }
    }

    return expandedPath
  }

  // 获取节点前置条件
  private getNodePrerequisites(nodeId: string): string[] {
    return this.structure.relationships
      .filter(rel => rel.target === nodeId && rel.type === 'prerequisite')
      .map(rel => rel.source)
  }

  // 按难度过滤
  private filterByDifficulty(path: string[], targetDifficulty: string): string[] {
    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
    const targetLevel = difficultyOrder[targetDifficulty as keyof typeof difficultyOrder]

    return path.filter(nodeId => {
      const node = this.getNode(nodeId)
      if (!node) return false
      const nodeLevel = difficultyOrder[node.difficulty as keyof typeof difficultyOrder]
      return nodeLevel <= targetLevel
    })
  }

  // 计算预估时间
  private calculateEstimatedTime(path: string[]): number {
    const baseTimePerNode = 15 // 每个节点基础学习时间（分钟）
    let totalTime = 0

    for (const nodeId of path) {
      const node = this.getNode(nodeId)
      if (!node) continue

      let nodeTime = baseTimePerNode
      
      // 根据难度调整时间
      switch (node.difficulty) {
        case 'beginner': nodeTime *= 0.8; break
        case 'advanced': nodeTime *= 1.5; break
      }

      // 根据重要性调整时间
      nodeTime *= (node.importance / 10)

      // 根据资源数量调整时间
      nodeTime += node.resources.length * 5

      totalTime += nodeTime
    }

    return Math.round(totalTime)
  }

  // 生成学习目标
  private generateLearningObjectives(path: string[]): string[] {
    const objectives: string[] = []
    const categories = new Set<string>()

    for (const nodeId of path) {
      const node = this.getNode(nodeId)
      if (!node) continue
      categories.add(node.category)
    }

    for (const category of categories) {
      switch (category) {
        case 'theory':
          objectives.push('理解相关理论基础和发展背景')
          break
        case 'concept':
          objectives.push('掌握核心概念和术语定义')
          break
        case 'application':
          objectives.push('学会在实际场景中应用理论知识')
          break
        case 'method':
          objectives.push('熟悉相关测量方法和工具使用')
          break
        case 'research':
          objectives.push('了解最新研究进展和发展趋势')
          break
      }
    }

    return objectives
  }

  // 获取路径前置条件
  private getPathPrerequisites(path: string[]): string[] {
    const prerequisites = new Set<string>()
    
    for (const nodeId of path) {
      const nodePrereqs = this.getNodePrerequisites(nodeId)
      for (const prereq of nodePrereqs) {
        if (!path.includes(prereq)) {
          prerequisites.add(prereq)
        }
      }
    }

    return Array.from(prerequisites)
  }

  // 确定路径类型
  private determinePathType(path: string[]): 'linear' | 'branching' | 'circular' {
    if (path.length <= 2) return 'linear'

    // 检查是否有分支结构
    let hasBranching = false
    for (let i = 0; i < path.length - 1; i++) {
      const node = this.getNode(path[i])
      if (node && node.children.length > 1) {
        hasBranching = true
        break
      }
    }

    // 检查是否有循环
    const hasCircular = path[0] === path[path.length - 1]

    if (hasCircular) return 'circular'
    if (hasBranching) return 'branching'
    return 'linear'
  }

  // 获取推荐节点
  getRecommendations(currentNodeId: string, count: number = 5): RecommendationResult[] {
    const currentNode = this.getNode(currentNodeId)
    if (!currentNode) return []

    const recommendations: RecommendationResult[] = []

    // 推荐相关节点
    const relatedNodes = this.getRelatedNodes(currentNodeId)
    for (const nodeId of relatedNodes.slice(0, 2)) {
      const node = this.getNode(nodeId)
      if (node) {
        recommendations.push({
          nodeId,
          node,
          recommendationType: 'related',
          score: 0.9,
          reason: '与当前主题密切相关'
        })
      }
    }

    // 推荐子节点
    for (const childId of currentNode.children.slice(0, 2)) {
      const node = this.getNode(childId)
      if (node) {
        recommendations.push({
          nodeId: childId,
          node,
          recommendationType: 'next-step',
          score: 0.8,
          reason: '深入学习的下一步'
        })
      }
    }

    // 推荐同类别节点
    const sameCategory = Object.values(this.structure.nodes)
      .filter(node => 
        node.category === currentNode.category && 
        node.id !== currentNodeId &&
        !relatedNodes.includes(node.id) &&
        !currentNode.children.includes(node.id)
      )
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 1)

    for (const node of sameCategory) {
      recommendations.push({
        nodeId: node.id,
        node,
        recommendationType: 'similar',
        score: 0.6,
        reason: '同类别的重要概念'
      })
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
  }

  // 更新导航状态
  updateNavigationState(nodeId: string): void {
    this.navigationState.currentNodeId = nodeId
    this.navigationState.visitedNodes.push(nodeId)
    this.navigationState.lastVisited = new Date()

    // 限制访问历史长度
    if (this.navigationState.visitedNodes.length > 50) {
      this.navigationState.visitedNodes = this.navigationState.visitedNodes.slice(-50)
    }
  }

  // 获取导航状态
  getNavigationState(): NavigationState {
    return { ...this.navigationState }
  }

  // 添加书签
  addBookmark(nodeId: string): boolean {
    if (!this.getNode(nodeId)) return false
    
    if (!this.navigationState.bookmarkedNodes.includes(nodeId)) {
      this.navigationState.bookmarkedNodes.push(nodeId)
    }
    return true
  }

  // 移除书签
  removeBookmark(nodeId: string): boolean {
    const index = this.navigationState.bookmarkedNodes.indexOf(nodeId)
    if (index > -1) {
      this.navigationState.bookmarkedNodes.splice(index, 1)
      return true
    }
    return false
  }

  // 更新学习进度
  updateLearningProgress(nodeId: string, progress: number): boolean {
    if (!this.getNode(nodeId)) return false
    
    this.navigationState.learningProgress[nodeId] = Math.max(0, Math.min(1, progress))
    return true
  }

  // 获取学习统计
  getLearningStats(): {
    totalNodes: number
    visitedNodes: number
    completedNodes: number
    bookmarkedNodes: number
    averageProgress: number
  } {
    const totalNodes = Object.keys(this.structure.nodes).length
    const visitedNodes = new Set(this.navigationState.visitedNodes).size
    const completedNodes = Object.values(this.navigationState.learningProgress)
      .filter(progress => progress >= 1.0).length
    const bookmarkedNodes = this.navigationState.bookmarkedNodes.length
    const averageProgress = Object.values(this.navigationState.learningProgress)
      .reduce((sum, progress) => sum + progress, 0) / Math.max(1, Object.keys(this.navigationState.learningProgress).length)

    return {
      totalNodes,
      visitedNodes,
      completedNodes,
      bookmarkedNodes,
      averageProgress
    }
  }
}

// 单例实例
export const mindMapService = new MindMapService()