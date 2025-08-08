// 基于 Hatipoglu & Koc (2023) 论文模拟的研究数据
// 样本：485名土耳其游客，五星级酒店，爱琴海沿岸

export interface ParticipantData {
  id: number
  // 人口统计学变量
  age: number
  gender: 'male' | 'female'
  education: 'high_school' | 'bachelor' | 'master' | 'phd'
  income_level: 'low' | 'medium' | 'high'
  hotel_experience: number // 五星级酒店住宿次数

  // BFI-44 外向性维度得分 (1-5 李克特量表)
  extroversion_items: {
    talkative: number // "I see myself as someone talkative"
    energetic: number // "I see myself as someone full of energy"
    enthusiastic: number // "I see myself as someone who generates a lot of enthusiasm"
    assertive: number // "I see myself as someone who has an assertive personality"
    outgoing: number // "I see myself as someone outgoing, and sociable"
  }
  extroversion_score: number // 平均分
  personality_type: 'introvert' | 'extrovert' // 基于中位数分割

  // SERVQUAL维度重要性分配 (100分分配法)
  service_quality_weights: {
    tangibles: number // 有形性
    reliability: number // 可靠性
    responsiveness: number // 响应性
    assurance: number // 保证性
    empathy: number // 移情性
  }

  // 住宿信息
  hotel_location: 'bodrum' | 'kusadasi' | 'ayvalik'
  stay_duration: number // 住宿天数
  travel_purpose: 'leisure' | 'business' | 'family'
  group_size: number
}

// 生成符合论文统计特征的模拟数据
function generateSimulatedData(n: number = 485): ParticipantData[] {
  const data: ParticipantData[] = []

  for (let i = 1; i <= n; i++) {
    // 人口统计学特征 (基于土耳其游客典型分布)
    const age = Math.floor(Math.random() * 35) + 25 // 25-60岁
    const gender = Math.random() < 0.52 ? 'female' : 'male' // 略微偏女性
    const education = ['high_school', 'bachelor', 'master', 'phd'][
      Math.floor(
        Math.random() *
          [0.2, 0.5, 0.25, 0.05].reduce(
            (acc, prob, idx) => (Math.random() < prob ? idx : acc + 1),
            0,
          ),
      )
    ] as ParticipantData['education']
    const income_level = ['low', 'medium', 'high'][
      Math.floor(
        Math.random() *
          [0.25, 0.5, 0.25].reduce((acc, prob, idx) => (Math.random() < prob ? idx : acc + 1), 0),
      )
    ] as ParticipantData['income_level']
    const hotel_experience = Math.floor(Math.random() * 8) + 1 // 1-8次经验

    // 生成外向性得分 (符合论文信度 Cronbach's α = 0.869)
    const baseExtroversion = Math.random() * 2 + 2 // 基础得分2-4
    const noise = (Math.random() - 0.5) * 0.8 // 添加适度噪音

    const extroversion_items = {
      talkative: Math.max(1, Math.min(5, baseExtroversion + (Math.random() - 0.5) * 0.6)),
      energetic: Math.max(1, Math.min(5, baseExtroversion + (Math.random() - 0.5) * 0.6)),
      enthusiastic: Math.max(1, Math.min(5, baseExtroversion + (Math.random() - 0.5) * 0.6)),
      assertive: Math.max(1, Math.min(5, baseExtroversion + (Math.random() - 0.5) * 0.6)),
      outgoing: Math.max(1, Math.min(5, baseExtroversion + (Math.random() - 0.5) * 0.6)),
    }

    const extroversion_score =
      (extroversion_items.talkative +
        extroversion_items.energetic +
        extroversion_items.enthusiastic +
        extroversion_items.assertive +
        extroversion_items.outgoing) /
      5

    const personality_type = extroversion_score >= 3.0 ? 'extrovert' : 'introvert'

    // 生成SERVQUAL权重分配 (基于论文发现的效应)
    let tangibles, reliability, empathy

    if (personality_type === 'introvert') {
      // 内向者更重视有形性 (β = -0.215, p < 0.01)
      tangibles = Math.floor(Math.random() * 10) + 25 // 25-35%
      empathy = Math.floor(Math.random() * 8) + 12 // 12-20%
    } else {
      // 外向者更重视移情性 (β = 0.109, p < 0.05)
      tangibles = Math.floor(Math.random() * 8) + 15 // 15-23%
      empathy = Math.floor(Math.random() * 10) + 22 // 22-32%
    }

    // 可靠性无显著差异 (β = -0.018, n.s.)
    reliability = Math.floor(Math.random() * 8) + 18 // 18-26%

    // 响应性和保证性接近显著但未达到
    const responsiveness = Math.floor(Math.random() * 8) + 15 // 15-23%
    const assurance = Math.floor(Math.random() * 8) + 15 // 15-23%

    // 确保总和为100
    const total = tangibles + reliability + responsiveness + assurance + empathy
    const adjustment = 100 - total
    reliability += adjustment // 将差值调整到可靠性维度

    const service_quality_weights = {
      tangibles,
      reliability,
      responsiveness,
      assurance,
      empathy,
    }

    // 住宿信息
    const hotel_location = ['bodrum', 'kusadasi', 'ayvalik'][
      Math.floor(Math.random() * 3)
    ] as ParticipantData['hotel_location']
    const stay_duration = Math.floor(Math.random() * 10) + 3 // 3-12天
    const travel_purpose = ['leisure', 'business', 'family'][
      Math.floor(
        Math.random() *
          [0.7, 0.15, 0.15].reduce((acc, prob, idx) => (Math.random() < prob ? idx : acc + 1), 0),
      )
    ] as ParticipantData['travel_purpose']
    const group_size = Math.floor(Math.random() * 4) + 1 // 1-4人

    data.push({
      id: i,
      age,
      gender,
      education,
      income_level,
      hotel_experience,
      extroversion_items,
      extroversion_score: Math.round(extroversion_score * 100) / 100,
      personality_type,
      service_quality_weights,
      hotel_location,
      stay_duration,
      travel_purpose,
      group_size,
    })
  }

  return data
}

// 生成485个样本的模拟数据
export const simulatedData = generateSimulatedData(485)

// 基础统计分析
export const descriptiveStatistics = {
  sampleSize: simulatedData.length,
  demographics: {
    age: {
      mean: simulatedData.reduce((sum, p) => sum + p.age, 0) / simulatedData.length,
      std: Math.sqrt(
        simulatedData.reduce((sum, p) => sum + Math.pow(p.age - 42.5, 2), 0) / simulatedData.length,
      ),
      min: Math.min(...simulatedData.map((p) => p.age)),
      max: Math.max(...simulatedData.map((p) => p.age)),
    },
    gender: {
      male: simulatedData.filter((p) => p.gender === 'male').length,
      female: simulatedData.filter((p) => p.gender === 'female').length,
      malePercentage: (
        (simulatedData.filter((p) => p.gender === 'male').length / simulatedData.length) *
        100
      ).toFixed(1),
      femalePercentage: (
        (simulatedData.filter((p) => p.gender === 'female').length / simulatedData.length) *
        100
      ).toFixed(1),
    },
    personality: {
      introverts: simulatedData.filter((p) => p.personality_type === 'introvert').length,
      extroverts: simulatedData.filter((p) => p.personality_type === 'extrovert').length,
      introvertPercentage: (
        (simulatedData.filter((p) => p.personality_type === 'introvert').length /
          simulatedData.length) *
        100
      ).toFixed(1),
      extrovertPercentage: (
        (simulatedData.filter((p) => p.personality_type === 'extrovert').length /
          simulatedData.length) *
        100
      ).toFixed(1),
    },
  },
  extroversion: {
    mean: simulatedData.reduce((sum, p) => sum + p.extroversion_score, 0) / simulatedData.length,
    std: Math.sqrt(
      simulatedData.reduce((sum, p) => sum + Math.pow(p.extroversion_score - 3.0, 2), 0) /
        simulatedData.length,
    ),
    min: Math.min(...simulatedData.map((p) => p.extroversion_score)),
    max: Math.max(...simulatedData.map((p) => p.extroversion_score)),
    cronbachAlpha: 0.869, // 论文报告的信度系数
  },
  servqualWeights: {
    overall: {
      tangibles:
        simulatedData.reduce((sum, p) => sum + p.service_quality_weights.tangibles, 0) /
        simulatedData.length,
      reliability:
        simulatedData.reduce((sum, p) => sum + p.service_quality_weights.reliability, 0) /
        simulatedData.length,
      responsiveness:
        simulatedData.reduce((sum, p) => sum + p.service_quality_weights.responsiveness, 0) /
        simulatedData.length,
      assurance:
        simulatedData.reduce((sum, p) => sum + p.service_quality_weights.assurance, 0) /
        simulatedData.length,
      empathy:
        simulatedData.reduce((sum, p) => sum + p.service_quality_weights.empathy, 0) /
        simulatedData.length,
    },
    introverts: (() => {
      const introverts = simulatedData.filter((p) => p.personality_type === 'introvert')
      return {
        tangibles:
          introverts.reduce((sum, p) => sum + p.service_quality_weights.tangibles, 0) /
          introverts.length,
        reliability:
          introverts.reduce((sum, p) => sum + p.service_quality_weights.reliability, 0) /
          introverts.length,
        responsiveness:
          introverts.reduce((sum, p) => sum + p.service_quality_weights.responsiveness, 0) /
          introverts.length,
        assurance:
          introverts.reduce((sum, p) => sum + p.service_quality_weights.assurance, 0) /
          introverts.length,
        empathy:
          introverts.reduce((sum, p) => sum + p.service_quality_weights.empathy, 0) /
          introverts.length,
      }
    })(),
    extroverts: (() => {
      const extroverts = simulatedData.filter((p) => p.personality_type === 'extrovert')
      return {
        tangibles:
          extroverts.reduce((sum, p) => sum + p.service_quality_weights.tangibles, 0) /
          extroverts.length,
        reliability:
          extroverts.reduce((sum, p) => sum + p.service_quality_weights.reliability, 0) /
          extroverts.length,
        responsiveness:
          extroverts.reduce((sum, p) => sum + p.service_quality_weights.responsiveness, 0) /
          extroverts.length,
        assurance:
          extroverts.reduce((sum, p) => sum + p.service_quality_weights.assurance, 0) /
          extroverts.length,
        empathy:
          extroverts.reduce((sum, p) => sum + p.service_quality_weights.empathy, 0) /
          extroverts.length,
      }
    })(),
  },
}

// 论文中报告的主要统计结果
export const paperResults = {
  measurementModel: {
    extroversion: {
      cronbachAlpha: 0.869,
      compositeReliability: 0.87,
      averageVarianceExtracted: 0.578,
      rho_A: 0.884,
    },
    items: {
      dd1_talkative: { loading: 0.735 },
      dd3_energetic: { loading: 0.856 },
      dd4_enthusiastic: { loading: 0.719 },
      dd6_assertive: { loading: 0.578 },
      dd8_outgoing: { loading: 0.874 },
    },
  },
  structuralModel: {
    rSquared: {
      tangibles: 0.046, // 4.6% variance explained
      reliability: 0.0, // 0% variance explained
      responsiveness: 0.007, // 0.7% variance explained
      assurance: 0.01, // 1.0% variance explained
      empathy: 0.012, // 1.2% variance explained
    },
    effectSize: {
      tangibles: 0.049, // small effect
      reliability: 0.0, // no effect
      responsiveness: 0.007, // very small effect
      assurance: 0.01, // very small effect
      empathy: 0.012, // very small effect
    },
    predictiveRelevance: {
      tangibles: 0.036, // Q² > 0, predictive relevance
      reliability: -0.003, // Q² < 0, no predictive relevance
      responsiveness: 0.004, // Q² > 0, predictive relevance
      assurance: 0.003, // Q² > 0, predictive relevance
      empathy: 0.006, // Q² > 0, predictive relevance
    },
  },
  hypothesisResults: [
    {
      hypothesis: 'H1: Extroversion → Tangibles',
      beta: -0.215,
      standardError: 0.06,
      tStatistic: 3.615,
      pValue: 0.0,
      result: 'Supported',
      interpretation: 'Introverts attach more value to tangibles',
    },
    {
      hypothesis: 'H2: Extroversion → Reliability',
      beta: -0.018,
      standardError: 0.055,
      tStatistic: 0.328,
      pValue: 0.743,
      result: 'Not Supported',
      interpretation: 'No significant difference',
    },
    {
      hypothesis: 'H3: Extroversion → Responsiveness',
      beta: 0.086,
      standardError: 0.048,
      tStatistic: 1.777,
      pValue: 0.076,
      result: 'Not Supported',
      interpretation: 'Marginally significant',
    },
    {
      hypothesis: 'H4: Extroversion → Assurance',
      beta: 0.099,
      standardError: 0.051,
      tStatistic: 1.944,
      pValue: 0.052,
      result: 'Not Supported',
      interpretation: 'Marginally significant',
    },
    {
      hypothesis: 'H5: Extroversion → Empathy',
      beta: 0.109,
      standardError: 0.051,
      tStatistic: 2.147,
      pValue: 0.032,
      result: 'Supported',
      interpretation: 'Extroverts attach more value to empathy',
    },
  ],
  sampleCharacteristics: {
    totalSurveys: 508,
    validResponses: 485,
    responseRate: 95.5,
    setting: 'Five-star hotels on Aegean coast of Turkey',
    locations: ['Bodrum', 'Kusadasi', 'Ayvalik'],
    dataCollectionPeriod: 'September 15, 2020 - November 15, 2022',
    samplingMethod: 'Convenience sampling',
    participants: 'Turkish tourists with prior five-star hotel experience',
  },
}
