// Component type definitions for TAT Theory Platform

export interface BaseComponentProps {
  class?: string
  style?: string | Record<string, any>
}

export interface ButtonVariant {
  primary: string
  secondary: string
  outline: string
  ghost: string
  danger: string
}

export interface ComponentSize {
  sm: string
  md: string
  lg: string
}

export interface ThemeColors {
  primary: Record<number, string>
  secondary: Record<number, string>
  accent: Record<number, string>
  warning: Record<number, string>
  error: Record<number, string>
  gray: Record<number, string>
}

export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
}

// TAT Theory specific types
export interface TATNode {
  id: string
  label: string
  type: 'trait' | 'situation' | 'activation' | 'behavior' | 'performance'
  position: { x: number; y: number }
  description: string
  examples: string[]
  relatedConcepts: string[]
}

export interface TATEdge {
  id: string
  source: string
  target: string
  label: string
  strength: number
  description: string
  researchEvidence: string[]
}

export interface MindMapNode {
  id: string
  label: string
  level: number
  category: 'core' | 'concept' | 'application' | 'research' | 'example'
  description: string
  children: string[]
  resources: {
    type: 'video' | 'article' | 'case' | 'data'
    url: string
    title: string
  }[]
  position?: { x: number; y: number }
  color: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  prerequisites: string[]
  icon: string
  color: string
}

export interface ResearchPaper {
  id: string
  title: string
  authors: string
  year: number
  journal: string
  abstract: string
  methodology: {
    sample: string
    measures: string[]
    analysis: string
  }
  findings: string
  tatApplication: string
  implications: string
}

export interface Scale {
  id: string
  name: string
  category: 'traits' | 'situations' | 'activation' | 'behaviors'
  description: string
  items: number
  reliability: number
  validity: string
  usageNotes: string[]
  applications: {
    context: string
    example: string
  }[]
}