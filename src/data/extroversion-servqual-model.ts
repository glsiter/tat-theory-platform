// 基于论文 "The Influence of Introversion–Extroversion on Service Quality Dimensions: A Trait Activation Theory Study" 
// Hatipoglu, S.; Koc, E. (2023) 的结构方程模型数据

import type { StructuralEquationModel, StructuralEquationNode, StructuralEquationRelationship } from '@/types/structural-equation'

// 基于论文的节点数据定义
const nodes: Record<string, StructuralEquationNode> = {
  'extroversion': {
    id: 'extroversion',
    label: 'Extroversion 外向性',
    type: 'independent-variable',
    description: '基于BFI-44量表测量的外向性人格特质',
    examples: ['健谈的', '充满活力的', '善于交际的', '外向开朗的'],
    position: { x: 100, y: 200 },
    color: '#3B82F6',
    researchEvidence: [
      {
        id: 'evidence-ext-1',
        citation: 'John, O.P., Donahue, E.M., Kentle, R.L. (1991)',
        year: 1991,
        journal: 'University of California, Berkeley',
        sampleSize: 1539,
        methodology: 'BFI-44 Scale Development',
        keyFindings: 'BFI-44外向性维度具有良好的信效度',
        reliability: 0.88,
        validity: 'high',
        cronbachAlpha: 0.88
      },
      {
        id: 'evidence-ext-2',
        citation: 'Hatipoglu, S.; Koc, E. (2023)',
        year: 2023,
        journal: 'Sustainability',
        sampleSize: 485,
        methodology: 'PLS-SEM Analysis',
        keyFindings: '外向性显著影响服务质量维度的重要性评价',
        reliability: 0.87,
        validity: 'high',
        cronbachAlpha: 0.869
      }
    ],
    caseStudies: [],
    relatedConcepts: ['Big Five Personality Model', 'Trait Activation Theory', 'Personality-Service Interaction'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15'),
    measurementItems: [
      'I see myself as someone talkative',
      'I see myself as someone full of energy', 
      'I see myself as someone who generates a lot of enthusiasm',
      'I see myself as someone who has an assertive personality',
      'I see myself as someone outgoing, and sociable'
    ]
  },

  'tangibles': {
    id: 'tangibles',
    label: 'Tangibles 有形性',
    type: 'dependent-variable', 
    description: '酒店物理设施、设备、人员和沟通材料的外观',
    examples: ['现代化设备', '视觉吸引力', '整洁外观', '专业形象'],
    position: { x: 350, y: 80 },
    color: '#10B981',
    researchEvidence: [
      {
        id: 'evidence-tan-1',
        citation: 'Parasuraman, A., Zeithaml, V.A., Berry, L.L. (1988)',
        year: 1988,
        journal: 'Journal of Retailing',
        sampleSize: 0,
        methodology: 'SERVQUAL Development',
        keyFindings: '有形性是服务质量的重要维度',
        reliability: 0.72,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['Service Quality', 'Physical Evidence', 'Service Environment'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'reliability': {
    id: 'reliability', 
    label: 'Reliability 可靠性',
    type: 'dependent-variable',
    description: '酒店可靠准确地履行承诺服务的能力',
    examples: ['服务一致性', '准时履约', '准确无误', '值得信赖'],
    position: { x: 350, y: 140 },
    color: '#10B981',
    researchEvidence: [
      {
        id: 'evidence-rel-1',
        citation: 'Parasuraman, A., Berry, L.L., Zeithaml, V.A. (1991)', 
        year: 1991,
        journal: 'Journal of Retailing',
        sampleSize: 0,
        methodology: 'SERVQUAL Refinement',
        keyFindings: '可靠性是最重要的服务质量维度',
        reliability: 0.83,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['Service Reliability', 'Promise Keeping', 'Service Consistency'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'responsiveness': {
    id: 'responsiveness',
    label: 'Responsiveness 响应性', 
    type: 'dependent-variable',
    description: '酒店愿意帮助顾客并提供及时服务的意愿',
    examples: ['快速响应', '主动服务', '及时解决', '服务意愿'],
    position: { x: 350, y: 200 },
    color: '#10B981',
    researchEvidence: [
      {
        id: 'evidence-res-1',
        citation: 'Zeithaml, V., Parasuraman, A., Berry, L. (1990)',
        year: 1990,
        journal: 'Journal of Marketing',
        sampleSize: 0,
        methodology: 'Conceptual Development',
        keyFindings: '响应性直接影响顾客满意度',
        reliability: 0.78,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['Service Responsiveness', 'Customer Orientation', 'Service Speed'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'assurance': {
    id: 'assurance',
    label: 'Assurance 保证性',
    type: 'dependent-variable',
    description: '酒店员工的知识、礼貌及其传达信任和信心的能力',
    examples: ['专业知识', '礼貌服务', '信任建立', '安全保障'], 
    position: { x: 350, y: 260 },
    color: '#10B981',
    researchEvidence: [
      {
        id: 'evidence-ass-1',
        citation: 'Berry, L.L., Parasuraman, A. (1991)',
        year: 1991,
        journal: 'Marketing Services',
        sampleSize: 0,
        methodology: 'Service Marketing Framework',
        keyFindings: '保证性建立顾客信任和信心',
        reliability: 0.81,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['Service Assurance', 'Trust Building', 'Professional Competence'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  'empathy': {
    id: 'empathy',
    label: 'Empathy 移情性',
    type: 'dependent-variable', 
    description: '酒店给予顾客的关怀和个性化关注',
    examples: ['个性化关注', '理解需求', '贴心服务', '情感关怀'],
    position: { x: 350, y: 320 },
    color: '#10B981',
    researchEvidence: [
      {
        id: 'evidence-emp-1',
        citation: 'Zeithaml, V.A., Berry, L.L., Parasuraman, A. (1996)',
        year: 1996,
        journal: 'Journal of Marketing',
        sampleSize: 0,
        methodology: 'Service Quality Framework',
        keyFindings: '移情性增强顾客忠诚度和满意度',
        reliability: 0.79,
        validity: 'high'
      }
    ],
    caseStudies: [],
    relatedConcepts: ['Service Empathy', 'Customer Care', 'Personalized Service'],
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  }
}

// 基于论文研究结果的关系数据定义
const relationships: StructuralEquationRelationship[] = [
  {
    id: 'ext-tangibles',
    source: 'extroversion', 
    target: 'tangibles',
    label: 'β = -0.215**',
    description: '外向性对有形性维度的负向显著影响（内向者更重视）',
    strength: 0.215,
    type: 'negative-effect',
    researchEvidence: [
      {
        id: 'rel-evidence-1',
        citation: 'Hatipoglu, S.; Koc, E. (2023)',
        year: 2023,
        journal: 'Sustainability',
        sampleSize: 485,
        methodology: 'PLS-SEM',
        keyFindings: '内向型顾客更重视有形性维度',
        effectSize: 0.215,
        reliability: 0.92,
        validity: 'high'
      }
    ],
    pathCoefficient: -0.215,
    significance: 'p<0.01',
    tStatistic: 3.615,
    standardError: 0.060,
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },
  
  {
    id: 'ext-reliability',
    source: 'extroversion',
    target: 'reliability', 
    label: 'β = -0.018 (n.s.)',
    description: '外向性对可靠性维度无显著影响',
    strength: 0.018,
    type: 'non-significant',
    researchEvidence: [
      {
        id: 'rel-evidence-2',
        citation: 'Hatipoglu, S.; Koc, E. (2023)',
        year: 2023,
        journal: 'Sustainability',
        sampleSize: 485,
        methodology: 'PLS-SEM',
        keyFindings: '外向性对可靠性维度无显著影响',
        effectSize: 0.018,
        reliability: 0.92,
        validity: 'high'
      }
    ],
    pathCoefficient: -0.018,
    significance: 'n.s. (p=0.743)',
    tStatistic: 0.328,
    standardError: 0.055,
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  {
    id: 'ext-responsiveness',
    source: 'extroversion',
    target: 'responsiveness',
    label: 'β = 0.086 (n.s.)', 
    description: '外向性对响应性维度的影响接近显著',
    strength: 0.086,
    type: 'marginal-effect',
    researchEvidence: [
      {
        id: 'rel-evidence-3',
        citation: 'Hatipoglu, S.; Koc, E. (2023)',
        year: 2023,
        journal: 'Sustainability', 
        sampleSize: 485,
        methodology: 'PLS-SEM',
        keyFindings: '外向性对响应性维度影响接近显著水平',
        effectSize: 0.086,
        reliability: 0.92,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.086,
    significance: 'n.s. (p=0.076)',
    tStatistic: 1.777,
    standardError: 0.048,
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  {
    id: 'ext-assurance',
    source: 'extroversion',
    target: 'assurance',
    label: 'β = 0.099 (n.s.)',
    description: '外向性对保证性维度的影响接近显著',
    strength: 0.099,
    type: 'marginal-effect', 
    researchEvidence: [
      {
        id: 'rel-evidence-4',
        citation: 'Hatipoglu, S.; Koc, E. (2023)',
        year: 2023,
        journal: 'Sustainability',
        sampleSize: 485,
        methodology: 'PLS-SEM',
        keyFindings: '外向性对保证性维度影响接近显著水平',
        effectSize: 0.099,
        reliability: 0.92,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.099,
    significance: 'n.s. (p=0.052)',
    tStatistic: 1.944,
    standardError: 0.051,
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  },

  {
    id: 'ext-empathy',
    source: 'extroversion',
    target: 'empathy',
    label: 'β = 0.109*',
    description: '外向性对移情性维度的正向显著影响（外向者更重视）',
    strength: 0.109,
    type: 'positive-effect',
    researchEvidence: [
      {
        id: 'rel-evidence-5',
        citation: 'Hatipoglu, S.; Koc, E. (2023)',
        year: 2023,
        journal: 'Sustainability',
        sampleSize: 485,
        methodology: 'PLS-SEM', 
        keyFindings: '外向型顾客更重视移情性维度',
        effectSize: 0.109,
        reliability: 0.92,
        validity: 'high'
      }
    ],
    pathCoefficient: 0.109,
    significance: 'p<0.05',
    tStatistic: 2.147,
    standardError: 0.051,
    version: '1.0',
    lastUpdated: new Date('2024-01-15')
  }
]

// 完整的外向性-服务质量结构方程模型
export const extroversionServqualModel: StructuralEquationModel = {
  id: 'extroversion-servqual-model-v1',
  title: 'Extroversion-SERVQUAL Structural Equation Model',
  description: '基于TAT理论的外向性人格特质对服务质量维度影响的结构方程模型，来源于Hatipoglu & Koc (2023)的实证研究',
  version: '1.0',
  createdAt: new Date('2024-01-15'),
  lastUpdated: new Date('2024-01-15'),
  nodes,
  relationships,
  originalStudy: {
    title: 'The Influence of Introversion–Extroversion on Service Quality Dimensions: A Trait Activation Theory Study',
    authors: 'Sercan Hatipoglu, Erdogan Koc',
    year: 2023,
    journal: 'Sustainability',
    doi: '10.3390/su15010798',
    sampleSize: 485,
    methodology: 'PLS-SEM',
    participants: '508 Turkish tourists (485 valid responses)',
    setting: 'Five-star hotels on Aegean coast of Turkey'
  },
  researchHypotheses: [
    {
      id: 'H1',
      hypothesis: 'Extroversion has a significant influence on the amount of value customers attach to the tangibles dimension of service quality.',
      result: 'Supported (β = -0.215, p < 0.01)',
      interpretation: 'Introverts attach more value to tangibles dimension'
    },
    {
      id: 'H2', 
      hypothesis: 'Extroversion has a significant influence on the amount of value customers attach to the reliability dimension of service quality.',
      result: 'Not supported (β = -0.018, p = 0.743)',
      interpretation: 'No significant difference between introverts and extroverts'
    },
    {
      id: 'H3',
      hypothesis: 'Extroversion has a significant influence on the amount of value customers attach to the responsiveness dimension of service quality.',
      result: 'Not supported (β = 0.086, p = 0.076)', 
      interpretation: 'Marginal effect, not statistically significant'
    },
    {
      id: 'H4',
      hypothesis: 'Extroversion has a significant influence on the amount of value customers attach to the assurance dimension of service quality.',
      result: 'Not supported (β = 0.099, p = 0.052)',
      interpretation: 'Marginal effect, not statistically significant'
    },
    {
      id: 'H5',
      hypothesis: 'Extroversion has a significant influence on the amount of value customers attach to the empathy dimension of service quality.',
      result: 'Supported (β = 0.109, p < 0.05)',
      interpretation: 'Extroverts attach more value to empathy dimension'
    }
  ],
  modelFitStatistics: {
    cronbachAlpha: {
      extroversion: 0.869,
      overall: 0.869
    },
    compositeReliability: {
      extroversion: 0.870
    },
    averageVarianceExtracted: {
      extroversion: 0.578
    },
    rSquared: {
      tangibles: 0.046,
      reliability: 0.000, 
      responsiveness: 0.007,
      assurance: 0.010,
      empathy: 0.012
    },
    fSquared: {
      tangibles: 0.049,
      reliability: 0.000,
      responsiveness: 0.007, 
      assurance: 0.010,
      empathy: 0.012
    },
    qSquared: {
      tangibles: 0.036,
      reliability: -0.003,
      responsiveness: 0.004,
      assurance: 0.003,
      empathy: 0.006
    }
  },
  theoreticalFoundation: {
    mainTheory: 'Trait Activation Theory (TAT)',
    supportingTheories: ['Big Five Personality Model', 'SERVQUAL Model', 'Service Quality Theory'],
    keyPrinciples: [
      'Personality traits are activated in relevant situational contexts',
      'Introverts and extroverts differ in their sensitivity to environmental stimuli',
      'Service quality perceptions are influenced by individual personality characteristics',
      'TAT explains the interaction between personality traits and situational factors'
    ]
  },
  validationResults: [
    {
      id: 'validation-1',
      validationType: 'measurement-model',
      status: 'valid',
      message: 'All reliability and validity criteria met',
      timestamp: new Date('2024-01-15'),
      validator: 'PLS-SEM'
    },
    {
      id: 'validation-2',
      validationType: 'structural-model',
      status: 'valid', 
      message: '2 out of 5 hypotheses supported with significant effects',
      timestamp: new Date('2024-01-15'),
      validator: 'PLS-SEM'
    },
    {
      id: 'validation-3',
      validationType: 'discriminant-validity',
      status: 'valid',
      message: 'Fornell-Larcker criterion and HTMT values meet thresholds',
      timestamp: new Date('2024-01-15'),
      validator: 'PLS-SEM'
    }
  ],
  changeHistory: [
    {
      id: 'change-1',
      timestamp: new Date('2024-01-15'),
      changeType: 'model-creation',
      elementId: 'initial-creation',
      changes: {},
      author: 'researcher',
      reason: '基于Hatipoglu & Koc (2023)论文创建结构方程模型'
    }
  ]
}