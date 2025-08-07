// TAT理论结构方程数据模型
// 基于TAT理论的结构方程.png创建完整的节点和关系数据结构

export interface StructuralEquationNode {
  id: string
  label: string
  type:
    | 'context-group'
    | 'situational-cue'
    | 'core-construct'
    | 'mediator'
    | 'outcome'
    | 'final-outcome'
    | 'outcome-group'
    | 'motivation'
    | 'independent-variable'
    | 'dependent-variable'
  description: string
  examples: string[]
  position: { x: number; y: number }
  pathNumber?: string
  color: string
  children?: string[]
  researchEvidence: ResearchEvidence[]
  caseStudies: CaseStudy[]
  relatedConcepts: string[]
  version: string
  lastUpdated: Date
  measurementItems?: string[]
}

export interface StructuralEquationRelationship {
  id: string
  source: string
  target: string
  label: string
  description: string
  strength: number
  type:
    | 'activation'
    | 'direct-effect'
    | 'mediation'
    | 'moderation'
    | 'feedback'
    | 'positive-effect'
    | 'negative-effect'
    | 'marginal-effect'
    | 'non-significant'
  researchEvidence: ResearchEvidence[]
  pathCoefficient?: number
  significance?: 'p<0.001' | 'p<0.01' | 'p<0.05' | 'ns' | string
  tStatistic?: number
  standardError?: number
  version: string
  lastUpdated: Date
}

export interface ResearchEvidence {
  id: string
  citation: string
  year: number
  journal: string
  sampleSize: number
  methodology: string
  keyFindings: string
  effectSize?: number
  reliability: number
  validity: 'high' | 'medium' | 'low'
  cronbachAlpha?: number
}

export interface CaseStudy {
  id: string
  title: string
  industry: string
  context: string
  participants: number
  scenario: string
  tatApplication: string
  outcomes: string[]
  lessons: string[]
}

export interface StructuralEquationModel {
  id: string
  title: string
  description: string
  version: string
  createdAt: Date
  lastUpdated: Date
  nodes: Record<string, StructuralEquationNode>
  relationships: StructuralEquationRelationship[]
  originalImage?: {
    filename: string
    description: string
    source: string
    analysisDate: string
  }
  validationResults: ValidationResult[]
  changeHistory: ChangeHistoryEntry[]
  modelFitStatistics?: {
    cronbachAlpha: Record<string, number>
    compositeReliability: Record<string, number>
    averageVarianceExtracted: Record<string, number>
    rSquared: Record<string, number>
    fSquared: Record<string, number>
    qSquared: Record<string, number>
  }
  originalStudy?: {
    title: string
    authors: string
    year: number
    journal: string
    doi: string
    sampleSize: number
    methodology: string
    participants: string
    setting: string
  }
  theoreticalFoundation?: {
    mainTheory: string
    supportingTheories: string[]
    keyPrinciples: string[]
  }
  researchHypotheses?: {
    id: string
    hypothesis: string
    result: string
    interpretation: string
  }[]
}

export interface ValidationResult {
  id: string
  validationType:
    | 'structural'
    | 'theoretical'
    | 'empirical'
    | 'measurement-model'
    | 'structural-model'
    | 'discriminant-validity'
  status: 'valid' | 'warning' | 'error'
  message: string
  timestamp: Date
  validator: string
}

export interface ChangeHistoryEntry {
  id: string
  timestamp: Date
  changeType:
    | 'node-added'
    | 'node-modified'
    | 'node-removed'
    | 'relationship-added'
    | 'relationship-modified'
    | 'relationship-removed'
    | 'model-creation'
  elementId: string
  changes: Record<string, { old: unknown; new: unknown }>
  author: string
  reason: string
}

// 路径计算相关类型
export interface PathCalculationResult {
  directPaths: PathInfo[]
  indirectPaths: PathInfo[]
  totalEffect: number
  directEffect: number
  indirectEffect: number
}

export interface PathInfo {
  id: string
  nodes: string[]
  relationships: string[]
  totalStrength: number
  pathType: 'direct' | 'mediated' | 'moderated'
  description: string
}

// 动态验证相关类型
export interface DynamicValidation {
  structuralConsistency: boolean
  theoreticalAlignment: boolean
  empiricalSupport: boolean
  missingConnections: string[]
  redundantConnections: string[]
  recommendations: string[]
}