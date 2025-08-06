// TAT理论思维导图完整数据结构
// 基于Mind Map.png重构的知识图谱

import type { MindMapStructure, MindMapNode, MindMapRelationship } from '@/types/mind-map'

// 中心主题
const centralTopic: MindMapNode = {
  id: 'tat-theory-center',
  label: '特质激发理论(TAT)',
  level: 0,
  category: 'core',
  description: 'Trait Activation Theory - 解释特质与情境交互影响行为的理论框架',
  children: ['theoretical-foundation', 'core-mechanisms', 'key-concepts', 'research-applications', 'measurement-tools', 'future-directions'],
  resources: [
    {
      id: 'resource-1',
      type: 'article',
      url: '/theory/overview',
      title: 'TAT理论综合概述',
      description: '特质激发理论的全面介绍和核心要点',
      language: 'zh',
      quality: 'high',
      accessLevel: 'free'
    },
    {
      id: 'resource-2',
      type: 'paper',
      url: '/papers/tett-burnett-2003',
      title: 'A personality trait-based interactionist model of job performance',
      description: 'TAT理论的奠基性论文',
      pages: 25,
      language: 'en',
      quality: 'high',
      accessLevel: 'academic'
    }
  ],
  position: { x: 400, y: 300 },
  color: '#3B82F6',
  size: 'large',
  keywords: ['特质激发理论', 'TAT', 'Trait Activation Theory', '人格特质', '情境交互'],
  relatedConcepts: ['人格心理学', '组织行为学', '工业心理学'],
  importance: 10,
  difficulty: 'intermediate',
  lastUpdated: new Date('2024-01-15')
}

// 主要分支节点
const nodes: Record<string, MindMapNode> = {
  'tat-theory-center': centralTopic,

  // 理论基础分支
  'theoretical-foundation': {
    id: 'theoretical-foundation',
    label: '理论基础',
    level: 1,
    category: 'theory',
    description: 'TAT理论的理论根基和发展背景',
    children: ['personality-psychology', 'situational-psychology', 'interactionist-approach'],
    parent: 'tat-theory-center',
    resources: [
      {
        id: 'resource-3',
        type: 'book',
        url: '/books/personality-theories',
        title: '人格心理学理论基础',
        description: '人格心理学的经典理论回顾',
        pages: 320,
        language: 'zh',
        quality: 'high',
        accessLevel: 'free'
      }
    ],
    position: { x: 200, y: 150 },
    color: '#8B5CF6',
    size: 'medium',
    keywords: ['理论基础', '人格心理学', '情境心理学', '交互作用'],
    relatedConcepts: ['特质理论', '情境理论', '交互主义'],
    importance: 9,
    difficulty: 'intermediate',
    lastUpdated: new Date('2024-01-15')
  },

  'personality-psychology': {
    id: 'personality-psychology',
    label: '人格心理学',
    level: 2,
    category: 'theory',
    description: '研究个体稳定心理特征的心理学分支',
    children: ['big-five-model', 'trait-theory', 'personality-measurement'],
    parent: 'theoretical-foundation',
    resources: [
      {
        id: 'resource-4',
        type: 'video',
        url: '/videos/personality-psychology-intro',
        title: '人格心理学入门',
        description: '人格心理学的基本概念和理论',
        duration: 45,
        language: 'zh',
        quality: 'high',
        accessLevel: 'free'
      }
    ],
    position: { x: 100, y: 100 },
    color: '#10B981',
    size: 'medium',
    keywords: ['人格心理学', '个体差异', '心理特征', '稳定性'],
    relatedConcepts: ['差异心理学', '发展心理学', '社会心理学'],
    importance: 8,
    difficulty: 'beginner',
    lastUpdated: new Date('2024-01-15')
  },

  'big-five-model': {
    id: 'big-five-model',
    label: '大五人格模型',
    level: 3,
    category: 'concept',
    description: '包含开放性、尽责性、外向性、宜人性、神经质的人格模型',
    children: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],
    parent: 'personality-psychology',
    resources: [
      {
        id: 'resource-5',
        type: 'case',
        url: '/cases/big-five-workplace',
        title: '大五人格在职场中的应用',
        description: '大五人格模型在组织管理中的实际应用案例',
        language: 'zh',
        quality: 'high',
        accessLevel: 'free'
      }
    ],
    position: { x: 50, y: 50 },
    color: '#F59E0B',
    size: 'small',
    keywords: ['大五人格', 'Big Five', 'OCEAN', '人格维度'],
    relatedConcepts: ['NEO-PI-R', '人格测量', '跨文化研究'],
    importance: 9,
    difficulty: 'beginner',
    lastUpdated: new Date('2024-01-15')
  },

  'situational-psychology': {
    id: 'situational-psychology',
    label: '情境心理学',
    level: 2,
    category: 'theory',
    description: '强调环境因素对行为影响的心理学理论',
    children: ['situational-strength', 'environmental-factors', 'context-effects'],
    parent: 'theoretical-foundation',
    resources: [
      {
        id: 'resource-6',
        type: 'article',
        url: '/articles/situational-psychology',
        title: '情境心理学的发展与应用',
        description: '情境因素在行为预测中的重要作用',
        language: 'zh',
        quality: 'medium',
        accessLevel: 'free'
      }
    ],
    position: { x: 150, y: 100 },
    color: '#EF4444',
    size: 'medium',
    keywords: ['情境心理学', '环境因素', '情境强度', '行为预测'],
    relatedConcepts: ['环境心理学', '社会心理学', '行为主义'],
    importance: 7,
    difficulty: 'intermediate',
    lastUpdated: new Date('2024-01-15')
  },

  'interactionist-approach': {
    id: 'interactionist-approach',
    label: '交互作用观',
    level: 2,
    category: 'theory',
    description: '认为行为是人格特质与情境因素交互作用的结果',
    children: ['person-situation-interaction', 'trait-situation-fit', 'dynamic-interaction'],
    parent: 'theoretical-foundation',
    resources: [
      {
        id: 'resource-7',
        type: 'paper',
        url: '/papers/interactionist-theory',
        title: 'The person-situation interaction in personality psychology',
        description: '人格心理学中的人-情境交互理论',
        pages: 18,
        language: 'en',
        quality: 'high',
        accessLevel: 'academic'
      }
    ],
    position: { x: 250, y: 100 },
    color: '#06B6D4',
    size: 'medium',
    keywords: ['交互作用', '人-情境交互', '动态交互', '适配理论'],
    relatedConcepts: ['系统理论', '生态心理学', '动态系统理论'],
    importance: 9,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  },

  // 核心机制分支
  'core-mechanisms': {
    id: 'core-mechanisms',
    label: '核心机制',
    level: 1,
    category: 'concept',
    description: '特质激发的基本过程和运作机制',
    children: ['trait-situation-fit', 'activation-process', 'behavioral-expression'],
    parent: 'tat-theory-center',
    resources: [
      {
        id: 'resource-8',
        type: 'video',
        url: '/videos/tat-mechanisms',
        title: 'TAT理论核心机制解析',
        description: '深入解析特质激发的运作机制',
        duration: 60,
        language: 'zh',
        quality: 'high',
        accessLevel: 'premium'
      }
    ],
    position: { x: 600, y: 150 },
    color: '#10B981',
    size: 'medium',
    keywords: ['核心机制', '激发过程', '行为表达', '特质匹配'],
    relatedConcepts: ['认知过程', '动机理论', '行为机制'],
    importance: 10,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  },

  'trait-situation-fit': {
    id: 'trait-situation-fit',
    label: '特质-情境匹配',
    level: 2,
    category: 'concept',
    description: '特质与情境要求的匹配程度决定激发效果',
    children: ['fit-assessment', 'matching-criteria', 'optimal-conditions'],
    parent: 'core-mechanisms',
    resources: [
      {
        id: 'resource-9',
        type: 'data',
        url: '/data/fit-analysis',
        title: '特质-情境匹配数据分析',
        description: '不同匹配程度下的行为表现数据',
        language: 'zh',
        quality: 'high',
        accessLevel: 'academic'
      }
    ],
    position: { x: 550, y: 100 },
    color: '#8B5CF6',
    size: 'medium',
    keywords: ['特质匹配', '情境适配', '匹配度', '最优条件'],
    relatedConcepts: ['人-职匹配', '胜任力模型', '适应性行为'],
    importance: 9,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  },

  'activation-process': {
    id: 'activation-process',
    label: '激发过程',
    level: 2,
    category: 'concept',
    description: '特质被情境线索激发的动态过程',
    children: ['cue-detection', 'trait-arousal', 'expression-pathway'],
    parent: 'core-mechanisms',
    resources: [
      {
        id: 'resource-10',
        type: 'article',
        url: '/articles/activation-process',
        title: '特质激发的心理过程',
        description: '从线索识别到行为表达的完整过程',
        language: 'zh',
        quality: 'high',
        accessLevel: 'free'
      }
    ],
    position: { x: 600, y: 100 },
    color: '#F59E0B',
    size: 'medium',
    keywords: ['激发过程', '线索识别', '特质唤醒', '表达路径'],
    relatedConcepts: ['认知加工', '注意机制', '信息处理'],
    importance: 10,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  },

  'behavioral-expression': {
    id: 'behavioral-expression',
    label: '行为表达',
    level: 2,
    category: 'concept',
    description: '激发的特质通过具体行为得以表现',
    children: ['expression-forms', 'intensity-levels', 'duration-patterns'],
    parent: 'core-mechanisms',
    resources: [
      {
        id: 'resource-11',
        type: 'case',
        url: '/cases/behavioral-expression',
        title: '行为表达的多样化形式',
        description: '不同情境下特质的行为表达案例',
        language: 'zh',
        quality: 'medium',
        accessLevel: 'free'
      }
    ],
    position: { x: 650, y: 100 },
    color: '#EF4444',
    size: 'medium',
    keywords: ['行为表达', '表达形式', '强度水平', '持续模式'],
    relatedConcepts: ['行为测量', '观察方法', '行为分析'],
    importance: 8,
    difficulty: 'intermediate',
    lastUpdated: new Date('2024-01-15')
  },

  // 关键概念分支
  'key-concepts': {
    id: 'key-concepts',
    label: '关键概念',
    level: 1,
    category: 'concept',
    description: 'TAT理论的核心概念和术语体系',
    children: ['situational-cues', 'trait-relevance', 'activation-strength'],
    parent: 'tat-theory-center',
    resources: [
      {
        id: 'resource-12',
        type: 'website',
        url: '/glossary/tat-concepts',
        title: 'TAT理论概念词典',
        description: '完整的TAT理论术语解释',
        language: 'zh',
        quality: 'high',
        accessLevel: 'free'
      }
    ],
    position: { x: 200, y: 450 },
    color: '#F59E0B',
    size: 'medium',
    keywords: ['关键概念', '术语体系', '理论词汇', '概念框架'],
    relatedConcepts: ['理论构念', '操作定义', '概念模型'],
    importance: 8,
    difficulty: 'intermediate',
    lastUpdated: new Date('2024-01-15')
  },

  'situational-cues': {
    id: 'situational-cues',
    label: '情境线索',
    level: 2,
    category: 'concept',
    description: '环境中能够激发特定特质的信号或刺激',
    children: ['cue-types', 'cue-strength', 'cue-recognition'],
    parent: 'key-concepts',
    resources: [
      {
        id: 'resource-13',
        type: 'article',
        url: '/articles/situational-cues',
        title: '情境线索的识别与分类',
        description: '如何识别和分类不同类型的情境线索',
        language: 'zh',
        quality: 'high',
        accessLevel: 'free'
      }
    ],
    position: { x: 150, y: 400 },
    color: '#8B5CF6',
    size: 'small',
    keywords: ['情境线索', '环境刺激', '激发信号', '线索强度'],
    relatedConcepts: ['刺激-反应', '环境心理学', '知觉理论'],
    importance: 9,
    difficulty: 'intermediate',
    lastUpdated: new Date('2024-01-15')
  },

  'trait-relevance': {
    id: 'trait-relevance',
    label: '特质相关性',
    level: 2,
    category: 'concept',
    description: '特质与情境要求的相关程度',
    children: ['relevance-assessment', 'matching-degree', 'contextual-fit'],
    parent: 'key-concepts',
    resources: [
      {
        id: 'resource-14',
        type: 'data',
        url: '/data/trait-relevance',
        title: '特质相关性评估数据',
        description: '不同情境下特质相关性的量化分析',
        language: 'zh',
        quality: 'high',
        accessLevel: 'academic'
      }
    ],
    position: { x: 200, y: 400 },
    color: '#10B981',
    size: 'small',
    keywords: ['特质相关性', '相关程度', '匹配度', '情境适配'],
    relatedConcepts: ['相关分析', '适配理论', '预测效度'],
    importance: 8,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  },

  'activation-strength': {
    id: 'activation-strength',
    label: '激发强度',
    level: 2,
    category: 'concept',
    description: '特质被激发的程度和强度',
    children: ['intensity-measurement', 'strength-factors', 'duration-effects'],
    parent: 'key-concepts',
    resources: [
      {
        id: 'resource-15',
        type: 'paper',
        url: '/papers/activation-strength',
        title: 'Measuring trait activation strength in organizational settings',
        description: '组织情境中特质激发强度的测量方法',
        pages: 22,
        language: 'en',
        quality: 'high',
        accessLevel: 'academic'
      }
    ],
    position: { x: 250, y: 400 },
    color: '#EF4444',
    size: 'small',
    keywords: ['激发强度', '强度测量', '激发程度', '持续效应'],
    relatedConcepts: ['强度理论', '测量方法', '效应大小'],
    importance: 7,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  },

  // 研究应用分支
  'research-applications': {
    id: 'research-applications',
    label: '研究应用',
    level: 1,
    category: 'application',
    description: 'TAT理论在各领域的研究和实践应用',
    children: ['organizational-behavior', 'personnel-selection', 'leadership-development', 'digital-transformation'],
    parent: 'tat-theory-center',
    resources: [
      {
        id: 'resource-16',
        type: 'book',
        url: '/books/tat-applications',
        title: 'TAT理论应用实践指南',
        description: '全面介绍TAT理论在各领域的应用',
        pages: 280,
        language: 'zh',
        quality: 'high',
        accessLevel: 'premium'
      }
    ],
    position: { x: 600, y: 450 },
    color: '#EF4444',
    size: 'medium',
    keywords: ['研究应用', '实践领域', '应用案例', '实证研究'],
    relatedConcepts: ['应用心理学', '管理实践', '人力资源'],
    importance: 9,
    difficulty: 'intermediate',
    lastUpdated: new Date('2024-01-15')
  },

  'digital-transformation': {
    id: 'digital-transformation',
    label: '数字化转型应用',
    level: 2,
    category: 'application',
    description: '数字时代企业合伙人激励的TAT理论应用',
    children: ['digital-leadership', 'partner-motivation', 'performance-enhancement'],
    parent: 'research-applications',
    resources: [
      {
        id: 'resource-17',
        type: 'case',
        url: '/cases/digital-transformation',
        title: '数字化转型中的TAT理论应用',
        description: '科技企业数字化转型的实际应用案例',
        language: 'zh',
        quality: 'high',
        accessLevel: 'premium'
      }
    ],
    position: { x: 650, y: 400 },
    color: '#06B6D4',
    size: 'small',
    keywords: ['数字化转型', '企业合伙人', '数字领导', '绩效提升'],
    relatedConcepts: ['数字化管理', '合伙人制度', '激励机制'],
    importance: 8,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  },

  // 测量工具分支
  'measurement-tools': {
    id: 'measurement-tools',
    label: '测量工具',
    level: 1,
    category: 'method',
    description: 'TAT理论相关的量表和测量方法',
    children: ['personality-scales', 'situational-measures', 'activation-indicators'],
    parent: 'tat-theory-center',
    resources: [
      {
        id: 'resource-18',
        type: 'website',
        url: '/tools/measurement-library',
        title: 'TAT测量工具库',
        description: '完整的TAT理论测量工具集合',
        language: 'zh',
        quality: 'high',
        accessLevel: 'academic'
      }
    ],
    position: { x: 400, y: 100 },
    color: '#06B6D4',
    size: 'medium',
    keywords: ['测量工具', '量表', '评估方法', '测量指标'],
    relatedConcepts: ['心理测量', '量表开发', '信效度'],
    importance: 7,
    difficulty: 'intermediate',
    lastUpdated: new Date('2024-01-15')
  },

  // 未来方向分支
  'future-directions': {
    id: 'future-directions',
    label: '未来方向',
    level: 1,
    category: 'research',
    description: 'TAT理论的发展趋势和研究前沿',
    children: ['digital-contexts', 'cross-cultural-studies', 'neuroscience-integration'],
    parent: 'tat-theory-center',
    resources: [
      {
        id: 'resource-19',
        type: 'article',
        url: '/articles/future-directions',
        title: 'TAT理论的未来发展方向',
        description: '探讨TAT理论的发展趋势和研究机会',
        language: 'zh',
        quality: 'medium',
        accessLevel: 'free'
      }
    ],
    position: { x: 400, y: 500 },
    color: '#8B5CF6',
    size: 'medium',
    keywords: ['未来方向', '发展趋势', '研究前沿', '新兴领域'],
    relatedConcepts: ['前沿研究', '理论发展', '跨学科整合'],
    importance: 6,
    difficulty: 'advanced',
    lastUpdated: new Date('2024-01-15')
  }
}

// 关系定义
const relationships: MindMapRelationship[] = [
  // 中心主题到主要分支的关系
  {
    id: 'rel-1',
    source: 'tat-theory-center',
    target: 'theoretical-foundation',
    type: 'parent-child',
    strength: 1.0,
    description: '理论基础是TAT理论的根基',
    bidirectional: false
  },
  {
    id: 'rel-2',
    source: 'tat-theory-center',
    target: 'core-mechanisms',
    type: 'parent-child',
    strength: 1.0,
    description: '核心机制是TAT理论的运作原理',
    bidirectional: false
  },
  {
    id: 'rel-3',
    source: 'tat-theory-center',
    target: 'key-concepts',
    type: 'parent-child',
    strength: 1.0,
    description: '关键概念构成TAT理论的术语体系',
    bidirectional: false
  },
  {
    id: 'rel-4',
    source: 'tat-theory-center',
    target: 'research-applications',
    type: 'parent-child',
    strength: 1.0,
    description: '研究应用展示TAT理论的实践价值',
    bidirectional: false
  },
  {
    id: 'rel-5',
    source: 'tat-theory-center',
    target: 'measurement-tools',
    type: 'parent-child',
    strength: 1.0,
    description: '测量工具支持TAT理论的实证研究',
    bidirectional: false
  },
  {
    id: 'rel-6',
    source: 'tat-theory-center',
    target: 'future-directions',
    type: 'parent-child',
    strength: 1.0,
    description: '未来方向指引TAT理论的发展',
    bidirectional: false
  },

  // 理论基础内部关系
  {
    id: 'rel-7',
    source: 'theoretical-foundation',
    target: 'personality-psychology',
    type: 'parent-child',
    strength: 0.9,
    description: '人格心理学是理论基础的重要组成',
    bidirectional: false
  },
  {
    id: 'rel-8',
    source: 'theoretical-foundation',
    target: 'situational-psychology',
    type: 'parent-child',
    strength: 0.9,
    description: '情境心理学提供环境视角',
    bidirectional: false
  },
  {
    id: 'rel-9',
    source: 'theoretical-foundation',
    target: 'interactionist-approach',
    type: 'parent-child',
    strength: 1.0,
    description: '交互作用观是TAT理论的核心观点',
    bidirectional: false
  },

  // 跨分支关联关系
  {
    id: 'rel-10',
    source: 'personality-psychology',
    target: 'personality-scales',
    type: 'related',
    strength: 0.8,
    description: '人格心理学理论指导量表开发',
    bidirectional: true
  },
  {
    id: 'rel-11',
    source: 'situational-cues',
    target: 'situational-measures',
    type: 'related',
    strength: 0.8,
    description: '情境线索概念指导情境测量',
    bidirectional: true
  },
  {
    id: 'rel-12',
    source: 'activation-process',
    target: 'activation-indicators',
    type: 'related',
    strength: 0.9,
    description: '激发过程需要相应的测量指标',
    bidirectional: true
  },
  {
    id: 'rel-13',
    source: 'trait-situation-fit',
    target: 'organizational-behavior',
    type: 'application',
    strength: 0.7,
    description: '特质-情境匹配在组织行为中的应用',
    bidirectional: false
  },
  {
    id: 'rel-14',
    source: 'core-mechanisms',
    target: 'digital-transformation',
    type: 'application',
    strength: 0.6,
    description: '核心机制在数字化转型中的应用',
    bidirectional: false
  }
]

// 完整的思维导图结构
export const mindMapStructure: MindMapStructure = {
  id: 'tat-mind-map-v1',
  title: 'TAT理论思维导图',
  description: '基于Mind Map.png构建的特质激发理论完整知识图谱',
  version: '1.0',
  createdAt: new Date('2024-01-15'),
  lastUpdated: new Date('2024-01-15'),
  centralTopic,
  nodes,
  relationships,
  searchIndex: {
    keywords: {},
    concepts: {},
    categories: {},
    fullText: {}
  },
  learningPaths: [],
  originalImage: {
    filename: 'Mind Map.png',
    description: 'TAT理论的完整思维导图',
    extractedElements: ['中心主题', '主要分支', '子概念', '关联关系'],
    processingDate: '2024-01-15'
  }
}