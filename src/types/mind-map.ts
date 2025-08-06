// TAT理论思维导图数据模型
// 基于Mind Map.png重构完整的知识图谱结构

export interface MindMapNode {
  id: string
  label: string
  level: number
  category: 'core' | 'concept' | 'application' | 'research' | 'example' | 'method' | 'theory'
  description: string
  children: string[]
  parent?: string
  resources: MindMapResource[]
  position?: { x: number; y: number }
  color: string
  size: 'small' | 'medium' | 'large'
  keywords: string[]
  relatedConcepts: string[]
  importance: number // 1-10 重要性评分
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lastUpdated: Date
}

export interface MindMapResource {
  id: string
  type: 'video' | 'article' | 'case' | 'data' | 'book' | 'paper' | 'website'
  url: string
  title: string
  description: string
  duration?: number // 对于视频资源
  pages?: number // 对于文档资源
  language: 'zh' | 'en'
  quality: 'high' | 'medium' | 'low'
  accessLevel: 'free' | 'premium' | 'academic'
}

export interface MindMapStructure {
  id: string
  title: string
  description: string
  version: string
  createdAt: Date
  lastUpdated: Date
  centralTopic: MindMapNode
  nodes: Record<string, MindMapNode>
  relationships: MindMapRelationship[]
  searchIndex: SearchIndex
  learningPaths: LearningPath[]
  originalImage: {
    filename: string
    description: string
    extractedElements: string[]
    processingDate: string
  }
}

export interface MindMapRelationship {
  id: string
  source: string
  target: string
  type: 'parent-child' | 'related' | 'prerequisite' | 'application' | 'example'
  strength: number
  description: string
  bidirectional: boolean
}

export interface SearchIndex {
  keywords: Record<string, string[]> // keyword -> nodeIds
  concepts: Record<string, string[]> // concept -> nodeIds
  categories: Record<string, string[]> // category -> nodeIds
  fullText: Record<string, string> // nodeId -> searchable text
}

export interface LearningPath {
  id: string
  title: string
  description: string
  startNodeId: string
  endNodeId: string
  nodeSequence: string[]
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  objectives: string[]
  pathType: 'linear' | 'branching' | 'circular'
}

export interface SearchResult {
  nodeId: string
  node: MindMapNode
  relevanceScore: number
  matchType: 'exact' | 'partial' | 'related' | 'concept'
  matchedTerms: string[]
  context: string
}

export interface NavigationState {
  currentNodeId: string
  visitedNodes: string[]
  bookmarkedNodes: string[]
  learningProgress: Record<string, number> // nodeId -> progress (0-1)
  lastVisited: Date
}

export interface RecommendationResult {
  nodeId: string
  node: MindMapNode
  recommendationType: 'related' | 'next-step' | 'prerequisite' | 'application' | 'similar'
  score: number
  reason: string
}