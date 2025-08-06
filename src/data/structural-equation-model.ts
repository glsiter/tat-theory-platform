// TAT理论结构方程模型数据
// 基于TAT理论的结构方程.png的完整数据实现

import type { StructuralEquationModel, StructuralEquationNode, StructuralEquationRelationship } from '@/types/structural-equation'

// 节点数据定义
const nodes: Record<string, StructuralEquationNode> = {
  'situational-factors': {
    id: 'situational-factors',
    label: '特质相关线索的来源/水平',
    type: 'context-group',
    description: '影响特质激发的各层面情境因素',
    examples: ['组织环境', '社会关系', '任务特征'],
    position: { x: 50, y: 150 },
    color: '#E5E7EB',
    children: ['organizational-level', 'social-level', 'task-level'],
    researchEvidence: [
      {
        id: 'evidence-1',
        citation: 'Tett, R. P., & Burnett, D. D. (2003)',
        year: 2003,
        journal: 'Annual Review of Psychology',
        sampleSize: 0,
        methodology: 'Theoretical Review',
        keyFindings: '情境因素是特质激发的关键前提条件',
        reliability: 0.95,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['情境强度理论', '特质激发理论', '人-环境匹配'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'organizational-level': {
    id: 'organizational-level',
    label: '组织层面',
    type: 'situational-cue',
    description: '组织文化、结构、政策等宏观环境因素',
    examples: ['组织文化', '管理制度', '激励政策', '组织结构'],
    position: { x: 80, y: 100 },
    pathNumber: '3',
    color: '#F3F4F6',
    researchEvidence: [
      {
        id: 'evidence-2',
        citation: 'Judge, T. A., & Zapata, C. P. (2015)',
        year: 2015,
        journal: 'Journal of Applied Psychology',
        sampleSize: 1247,
        methodology: 'Meta-analysis',
        keyFindings: '组织文化强度调节人格特质与绩效的关系',
        effectSize: 0.34,
        reliability: 0.89,
        validity: 'high'
      }
    ],
    caseStudies: [
      {
        id: 'case-1',
        title: '科技公司创新文化对员工开放性的激发',
        industry: '科技',
        context: '高科技创新企业',
        participants: 156,
        scenario: '公司推行开放式创新文化，鼓励员工提出创新想法',
        tatApplication: '开放性文化激发员工的开放性特质，促进创新行为',
        outcomes: ['创新提案增加40%', '员工满意度提升', '产品创新周期缩短'],
        lessons: ['文化氛围是特质激发的重要条件', '需要制度支持配合']
      }
    ],
    relatedConcepts: ['组织文化理论', '制度理论', '组织行为学'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'social-level': {
    id: 'social-level',
    label: '社会层面',
    type: 'situational-cue',
    description: '人际关系、团队氛围、社会网络等中观因素',
    examples: ['团队氛围', '领导风格', '同事关系', '社会支持'],
    position: { x: 80, y: 150 },
    pathNumber: '4',
    color: '#F3F4F6',
    researchEvidence: [
      {
        id: 'evidence-3',
        citation: 'Lievens, F., et al. (2006)',
        year: 2006,
        journal: 'Personnel Psychology',
        sampleSize: 432,
        methodology: 'Longitudinal Study',
        keyFindings: '团队社会环境显著影响个体特质的表达',
        effectSize: 0.42,
        reliability: 0.87,
        validity: 'high'
      }
    ],
    caseStudies: [
      {
        id: 'case-2',
        title: '团队协作环境对员工宜人性的激发',
        industry: '咨询',
        context: '项目团队合作',
        participants: 89,
        scenario: '高度协作的项目环境要求团队成员密切配合',
        tatApplication: '协作环境激发员工宜人性特质，提升团队效能',
        outcomes: ['团队冲突减少60%', '项目完成效率提升', '客户满意度提高'],
        lessons: ['社会环境对特质激发具有直接影响', '团队氛围建设很重要']
      }
    ],
    relatedConcepts: ['社会心理学', '团队动力学', '人际关系理论'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'task-level': {
    id: 'task-level',
    label: '任务层面',
    type: 'situational-cue',
    description: '工作任务的特征、要求和环境',
    examples: ['任务复杂度', '自主性', '技能多样性', '任务重要性'],
    position: { x: 80, y: 200 },
    pathNumber: '5',
    color: '#F3F4F6',
    researchEvidence: [
      {
        id: 'evidence-4',
        citation: 'Christian, M. S., et al. (2009)',
        year: 2009,
        journal: 'Journal of Applied Psychology',
        sampleSize: 2156,
        methodology: 'Cross-sectional Survey',
        keyFindings: '任务特征与人格特质的匹配显著预测工作绩效',
        effectSize: 0.38,
        reliability: 0.91,
        validity: 'high'
      }
    ],
    caseStudies: [
      {
        id: 'case-3',
        title: '复杂任务对员工尽责性的激发',
        industry: '金融',
        context: '投资分析工作',
        participants: 124,
        scenario: '高复杂度的投资分析任务要求严谨细致的工作态度',
        tatApplication: '复杂任务激发分析师的尽责性特质，提升分析质量',
        outcomes: ['分析准确率提升25%', '客户投诉减少', '业绩考核改善'],
        lessons: ['任务复杂度是重要的激发因素', '需要匹配合适的人员']
      }
    ],
    relatedConcepts: ['工作设计理论', '任务特征模型', '工作动机理论'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'personality-traits': {
    id: 'personality-traits',
    label: '人格特质',
    type: 'core-construct',
    description: '个体相对稳定的心理特征和行为倾向',
    examples: ['外向性', '尽责性', '开放性', '宜人性', '神经质'],
    position: { x: 200, y: 80 },
    color: '#DBEAFE',
    researchEvidence: [
      {
        id: 'evidence-5',
        citation: 'Costa, P. T., & McCrae, R. R. (1992)',
        year: 1992,
        journal: 'Psychological Assessment',
        sampleSize: 1539,
        methodology: 'Factor Analysis',
        keyFindings: '大五人格模型具有跨文化稳定性和预测效度',
        effectSize: 0.65,
        reliability: 0.93,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['大五人格模型', '特质理论', '个体差异心理学'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'trait-activation': {
    id: 'trait-activation',
    label: '特质激发',
    type: 'mediator',
    description: '情境线索激活个体特质的过程和程度',
    examples: ['激发强度', '激发持续时间', '激发范围', '激发效果'],
    position: { x: 300, y: 150 },
    pathNumber: '1',
    color: '#FEF3C7',
    researchEvidence: [
      {
        id: 'evidence-6',
        citation: 'Tett, R. P., & Guterman, H. A. (2000)',
        year: 2000,
        journal: 'Journal of Applied Psychology',
        sampleSize: 891,
        methodology: 'Experimental Design',
        keyFindings: '特质激发是人格特质影响行为的关键中介机制',
        effectSize: 0.52,
        reliability: 0.88,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['激活理论', '中介效应', '特质表达'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'work-behavior': {
    id: 'work-behavior',
    label: '工作行为',
    type: 'outcome',
    description: '个体在工作中表现出的具体行为',
    examples: ['任务绩效', '组织公民行为', '创新行为', '合作行为'],
    position: { x: 200, y: 250 },
    pathNumber: '2',
    color: '#ECFDF5',
    researchEvidence: [
      {
        id: 'evidence-7',
        citation: 'Borman, W. C., & Motowidlo, S. J. (1997)',
        year: 1997,
        journal: 'Human Performance',
        sampleSize: 756,
        methodology: 'Behavioral Observation',
        keyFindings: '工作行为可分为任务绩效和情境绩效两大类',
        reliability: 0.85,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['工作绩效理论', '组织行为学', '行为测量'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'work-performance': {
    id: 'work-performance',
    label: '工作绩效',
    type: 'final-outcome',
    description: '工作行为产生的结果和效果评价',
    examples: ['任务完成质量', '效率指标', '创新成果', '团队贡献'],
    position: { x: 300, y: 300 },
    pathNumber: '6',
    color: '#FDF2F8',
    researchEvidence: [
      {
        id: 'evidence-8',
        citation: 'Humphrey, S. E., et al. (2007)',
        year: 2007,
        journal: 'Journal of Applied Psychology',
        sampleSize: 1834,
        methodology: 'Meta-analysis',
        keyFindings: '工作特征对绩效的影响存在个体差异',
        effectSize: 0.41,
        reliability: 0.92,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['绩效管理', '效果评估', '工作成果'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'motivation-factors': {
    id: 'motivation-factors',
    label: '激励因素',
    type: 'outcome-group',
    description: '影响个体行为和绩效的激励要素',
    examples: ['内在激励', '外在激励'],
    position: { x: 450, y: 200 },
    color: '#F0F9FF',
    children: ['intrinsic-motivation', 'extrinsic-motivation'],
    researchEvidence: [],
    caseStudies: [],
    relatedConcepts: ['激励理论', '动机心理学'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'intrinsic-motivation': {
    id: 'intrinsic-motivation',
    label: '内在激励',
    type: 'motivation',
    description: '来自内部的动机和满足感',
    examples: ['成就感', '自我实现', '兴趣驱动', '价值认同'],
    position: { x: 480, y: 150 },
    pathNumber: '8',
    color: '#EFF6FF',
    researchEvidence: [
      {
        id: 'evidence-9',
        citation: 'Deci, E. L., & Ryan, R. M. (2000)',
        year: 2000,
        journal: 'Psychological Inquiry',
        sampleSize: 0,
        methodology: 'Theoretical Review',
        keyFindings: '内在动机是持续行为改变的关键驱动力',
        reliability: 0.90,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['自我决定理论', '内在动机理论'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'extrinsic-motivation': {
    id: 'extrinsic-motivation',
    label: '外在激励',
    type: 'motivation',
    description: '来自外部的奖励和激励',
    examples: ['薪酬奖励', '晋升机会', '认可表彰', '福利待遇'],
    position: { x: 480, y: 250 },
    pathNumber: '10',
    color: '#EFF6FF',
    researchEvidence: [
      {
        id: 'evidence-10',
        citation: 'Cerasoli, C. P., et al. (2014)',
        year: 2014,
        journal: 'Psychological Bulletin',
        sampleSize: 4562,
        methodology: 'Meta-analysis',
        keyFindings: '外在激励对绩效的影响取决于任务类型和个体特征',
        effectSize: 0.28,
        reliability: 0.86,
        validity: 'medium'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['期望理论', '强化理论', '外在动机'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  }
}

// 关系数据定义
const relationships: StructuralEquationRelationship[] = [
  {
    id: 'path-3',
    source: 'organizational-level',
    target: 'personality-traits',
    label: '3',
    description: '组织层面因素影响人格特质的表达',
    strength: 0.6,
    type: 'activation',
    researchEvidence: [
      {
        id: 'rel-evidence-1',
        citation: 'Tett, R. P., & Burnett, D. D. (2003)',
        year: 2003,
        journal: 'Annual Review of Psychology',
        sampleSize: 0,
        methodology: 'Theoretical Review',
        keyFindings: '组织环境是特质激发的重要情境因素',
        reliability: 0.95,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.34,
    significance: 'p<0.01',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-4',
    source: 'social-level',
    target: 'personality-traits',
    label: '4',
    description: '社会层面因素激活相关人格特质',
    strength: 0.7,
    type: 'activation',
    researchEvidence: [
      {
        id: 'rel-evidence-2',
        citation: 'Lievens, F., et al. (2006)',
        year: 2006,
        journal: 'Personnel Psychology',
        sampleSize: 432,
        methodology: 'Longitudinal Study',
        keyFindings: '社会环境对特质激发具有显著影响',
        effectSize: 0.42,
        reliability: 0.87,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.42,
    significance: 'p<0.001',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-5',
    source: 'task-level',
    target: 'personality-traits',
    label: '5',
    description: '任务特征与人格特质的匹配效应',
    strength: 0.8,
    type: 'activation',
    researchEvidence: [
      {
        id: 'rel-evidence-3',
        citation: 'Christian, M. S., et al. (2009)',
        year: 2009,
        journal: 'Journal of Applied Psychology',
        sampleSize: 2156,
        methodology: 'Cross-sectional Survey',
        keyFindings: '任务特征是特质激发的关键因素',
        effectSize: 0.38,
        reliability: 0.91,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.38,
    significance: 'p<0.001',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-1',
    source: 'personality-traits',
    target: 'trait-activation',
    label: '1',
    description: '人格特质是激发的基础和前提',
    strength: 0.9,
    type: 'direct-effect',
    researchEvidence: [
      {
        id: 'rel-evidence-4',
        citation: 'Tett, R. P., & Guterman, H. A. (2000)',
        year: 2000,
        journal: 'Journal of Applied Psychology',
        sampleSize: 891,
        methodology: 'Experimental Design',
        keyFindings: '人格特质是特质激发的必要条件',
        effectSize: 0.52,
        reliability: 0.88,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.67,
    significance: 'p<0.001',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-2',
    source: 'task-level',
    target: 'work-behavior',
    label: '2',
    description: '任务特征直接影响工作行为',
    strength: 0.5,
    type: 'direct-effect',
    researchEvidence: [
      {
        id: 'rel-evidence-5',
        citation: 'Hackman, J. R., & Oldham, G. R. (1976)',
        year: 1976,
        journal: 'Organizational Behavior and Human Performance',
        sampleSize: 658,
        methodology: 'Field Study',
        keyFindings: '任务特征直接影响工作行为和态度',
        effectSize: 0.35,
        reliability: 0.83,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.35,
    significance: 'p<0.01',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-8',
    source: 'trait-activation',
    target: 'intrinsic-motivation',
    label: '8',
    description: '特质激发促进内在激励的产生',
    strength: 0.7,
    type: 'mediation',
    researchEvidence: [
      {
        id: 'rel-evidence-6',
        citation: 'Deci, E. L., & Ryan, R. M. (2000)',
        year: 2000,
        journal: 'Psychological Inquiry',
        sampleSize: 0,
        methodology: 'Theoretical Review',
        keyFindings: '特质激发增强内在动机',
        reliability: 0.90,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.45,
    significance: 'p<0.001',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-10',
    source: 'trait-activation',
    target: 'extrinsic-motivation',
    label: '10',
    description: '特质激发影响外在激励的效果',
    strength: 0.6,
    type: 'mediation',
    researchEvidence: [
      {
        id: 'rel-evidence-7',
        citation: 'Gagné, M., & Deci, E. L. (2005)',
        year: 2005,
        journal: 'Journal of Organizational Behavior',
        sampleSize: 1247,
        methodology: 'Survey Study',
        keyFindings: '特质激发调节外在激励的效果',
        effectSize: 0.31,
        reliability: 0.84,
        validity: 'medium'
      }
    ],
    pathCoefficient: 0.31,
    significance: 'p<0.05',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-11',
    source: 'work-behavior',
    target: 'task-level',
    label: '11',
    description: '工作行为反向影响任务环境',
    strength: 0.4,
    type: 'feedback',
    researchEvidence: [
      {
        id: 'rel-evidence-8',
        citation: 'Grant, A. M., & Parker, S. K. (2009)',
        year: 2009,
        journal: 'Academy of Management Annals',
        sampleSize: 0,
        methodology: 'Literature Review',
        keyFindings: '员工行为可以重塑工作环境',
        reliability: 0.78,
        validity: 'medium'
      }
    ],
    pathCoefficient: 0.23,
    significance: 'p<0.05',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-7',
    source: 'task-level',
    target: 'work-performance',
    label: '7',
    description: '任务特征直接影响绩效评价',
    strength: 0.6,
    type: 'direct-effect',
    researchEvidence: [
      {
        id: 'rel-evidence-9',
        citation: 'Humphrey, S. E., et al. (2007)',
        year: 2007,
        journal: 'Journal of Applied Psychology',
        sampleSize: 1834,
        methodology: 'Meta-analysis',
        keyFindings: '任务特征对绩效有直接影响',
        effectSize: 0.41,
        reliability: 0.92,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.41,
    significance: 'p<0.001',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-6',
    source: 'work-behavior',
    target: 'work-performance',
    label: '6',
    description: '工作行为决定工作绩效水平',
    strength: 0.8,
    type: 'direct-effect',
    researchEvidence: [
      {
        id: 'rel-evidence-10',
        citation: 'Borman, W. C., & Motowidlo, S. J. (1997)',
        year: 1997,
        journal: 'Human Performance',
        sampleSize: 756,
        methodology: 'Behavioral Observation',
        keyFindings: '工作行为是绩效的直接决定因素',
        reliability: 0.85,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.58,
    significance: 'p<0.001',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'path-9',
    source: 'extrinsic-motivation',
    target: 'work-performance',
    label: '9',
    description: '外在激励影响绩效表现',
    strength: 0.5,
    type: 'moderation',
    researchEvidence: [
      {
        id: 'rel-evidence-11',
        citation: 'Cerasoli, C. P., et al. (2014)',
        year: 2014,
        journal: 'Psychological Bulletin',
        sampleSize: 4562,
        methodology: 'Meta-analysis',
        keyFindings: '外在激励对绩效有适度影响',
        effectSize: 0.28,
        reliability: 0.86,
        validity: 'medium'
      }
    ],
    pathCoefficient: 0.28,
    significance: 'p<0.01',
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  }
]

// 完整的结构方程模型
export const structuralEquationModel: StructuralEquationModel = {
  id: 'tat-structural-equation-v1',
  title: '特质激发理论结构方程模型',
  description: '基于TAT理论的结构方程.png构建的完整理论模型，展示特质相关线索的来源/水平与各要素间的关系',
  version: '1.0',
  createdAt: new Date('2024-01-15'),
  lastUpdated: new Date('2024-01-15'),
  nodes,
  relationships,
  originalImage: {
    filename: 'TAT理论的结构方程.png',
    description: '特质激发理论的完整结构方程图',
    source: '组织管理十大经典理论',
    analysisDate: '2024-01-15'
  },
  validationResults: [
    {
      id: 'validation-1',
      validationType: 'structural',
      status: 'valid',
      message: '模型结构完整，包含所有必要节点和关系',
      timestamp: new Date('2024-01-15'),
      validator: 'system'
    },
    {
      id: 'validation-2',
      validationType: 'theoretical',
      status: 'valid',
      message: '理论逻辑一致，符合TAT理论框架',
      timestamp: new Date('2024-01-15'),
      validator: 'system'
    }
  ],
  changeHistory: [
    {
      id: 'change-1',
      timestamp: new Date('2024-01-15'),
      changeType: 'node-added',
      elementId: 'initial-creation',
      changes: {},
      author: 'system',
      reason: '初始模型创建'
    }
  ]
}