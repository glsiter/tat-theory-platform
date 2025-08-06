// 学习分析和个性化推荐服务
// 建立用户偏好和学习数据分析
// 实现智能推荐算法和适应性学习系统

import type {
  UserProfile,
  LearningSession,
  NodeProgress,
  LearningAnalytics,
  PersonalizedRecommendation,
  KnowledgeGap,
  AdaptiveContent
} from '@/types/learning-state'

export class LearningAnalyticsService {
  private readonly LEARNING_PATTERNS = {
    VISUAL: 'visual',
    AUDITORY: 'auditory',
    KINESTHETIC: 'kinesthetic',
    READING: 'reading'
  } as const

  private readonly DIFFICULTY_LEVELS = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3
  } as const

  // 学习模式识别
  identifyLearningPattern(sessions: LearningSession[], nodeProgress: Map<string, NodeProgress>): {
    primaryPattern: string
    confidence: number
    characteristics: string[]
    recommendations: string[]
  } {
    const patterns = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0
    }

    // 分析会话数据
    for (const session of sessions) {
      // 基于会话时长分析
      if (session.duration > 1800) { // 30分钟以上
        patterns.reading += 0.3
      } else if (session.duration < 600) { // 10分钟以下
        patterns.visual += 0.2
        patterns.kinesthetic += 0.2
      }

      // 基于访问节点类型分析
      for (const nodeId of session.nodesVisited) {
        const progress = nodeProgress.get(nodeId)
        if (progress) {
          // 如果用户在视觉内容上停留时间长
          if (progress.timeSpent > 300) { // 5分钟以上
            patterns.visual += 0.1
          }
          
          // 如果用户频繁访问同一节点
          if (progress.visitCount > 3) {
            patterns.reading += 0.1
          }
        }
      }

      // 基于活动类型分析
      if (session.questionsAnswered > 5) {
        patterns.kinesthetic += 0.2
      }
      
      if (session.notesCreated > 2) {
        patterns.reading += 0.2
      }
    }

    // 找出主要学习模式
    const maxPattern = Object.entries(patterns).reduce((a, b) => 
      patterns[a[0] as keyof typeof patterns] > patterns[b[0] as keyof typeof patterns] ? a : b
    )

    const primaryPattern = maxPattern[0]
    const confidence = maxPattern[1] / Math.max(1, sessions.length * 0.5)

    // 生成特征描述
    const characteristics = this.generatePatternCharacteristics(primaryPattern)
    const recommendations = this.generatePatternRecommendations(primaryPattern)

    return {
      primaryPattern,
      confidence: Math.min(confidence, 1.0),
      characteristics,
      recommendations
    }
  }

  // 学习效率分析
  analyzeLearningEfficiency(sessions: LearningSession[], nodeProgress: Map<string, NodeProgress>): {
    overallEfficiency: number
    timePerNode: number
    retentionRate: number
    strugglingAreas: string[]
    strengths: string[]
    improvementSuggestions: string[]
  } {
    if (sessions.length === 0) {
      return {
        overallEfficiency: 0,
        timePerNode: 0,
        retentionRate: 0,
        strugglingAreas: [],
        strengths: [],
        improvementSuggestions: []
      }
    }

    // 计算总体效率
    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0)
    const totalNodes = new Set(sessions.flatMap(s => s.nodesVisited)).size
    const timePerNode = totalTime / Math.max(1, totalNodes)

    // 计算完成率
    const completedNodes = Array.from(nodeProgress.values())
      .filter(p => p.completionStatus === 'completed' || p.completionStatus === 'mastered').length
    const completionRate = completedNodes / Math.max(1, nodeProgress.size)

    // 计算保持率
    const retentionRate = this.calculateRetentionRate(nodeProgress)

    // 效率评分 (0-1)
    const efficiencyScore = this.calculateEfficiencyScore(timePerNode, completionRate, retentionRate)

    // 识别困难领域
    const strugglingAreas = this.identifyStrugglingAreas(nodeProgress)

    // 识别优势领域
    const strengths = this.identifyStrengths(nodeProgress)

    // 生成改进建议
    const improvementSuggestions = this.generateImprovementSuggestions(
      efficiencyScore, 
      strugglingAreas, 
      timePerNode
    )

    return {
      overallEfficiency: efficiencyScore,
      timePerNode: Math.round(timePerNode / 60), // 转换为分钟
      retentionRate,
      strugglingAreas,
      strengths,
      improvementSuggestions
    }
  }

  // 个性化推荐生成
  generatePersonalizedRecommendations(
    user: UserProfile,
    nodeProgress: Map<string, NodeProgress>,
    currentNodeId?: string
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = []

    // 基于学习进度的推荐
    const progressRecommendations = this.generateProgressBasedRecommendations(nodeProgress, user.id)
    recommendations.push(...progressRecommendations)

    // 基于兴趣的推荐
    const interestRecommendations = this.generateInterestBasedRecommendations(nodeProgress, user.id)
    recommendations.push(...interestRecommendations)

    // 基于难度适配的推荐
    const difficultyRecommendations = this.generateDifficultyBasedRecommendations(
      nodeProgress, 
      user.academicBackground, 
      user.id
    )
    recommendations.push(...difficultyRecommendations)

    // 基于学习风格的推荐
    const styleRecommendations = this.generateStyleBasedRecommendations(
      user.learningStyle, 
      nodeProgress, 
      user.id
    )
    recommendations.push(...styleRecommendations)

    // 基于知识缺口的推荐
    const gapRecommendations = this.generateGapBasedRecommendations(nodeProgress, user.id)
    recommendations.push(...gapRecommendations)

    // 排序和过滤
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10) // 限制推荐数量
  }

  // 适应性内容生成
  generateAdaptiveContent(
    nodeId: string,
    user: UserProfile,
    progress: NodeProgress
  ): AdaptiveContent {
    const adaptations: AdaptiveContent['adaptations'] = {
      difficultyLevel: this.determineDifficultyLevel(user, progress),
      contentFormat: this.determineContentFormat(user.learningStyle),
      explanationStyle: this.determineExplanationStyle(user.academicBackground),
      pacing: this.determinePacing(user.preferences, progress),
      additionalResources: this.selectAdditionalResources(nodeId, user),
      simplifiedExplanations: this.needsSimplification(user, progress),
      advancedDetails: this.needsAdvancedDetails(user, progress)
    }

    return {
      nodeId,
      userId: user.id,
      adaptations,
      effectiveness: 0.7, // 初始效果评分
      lastUpdated: new Date()
    }
  }

  // 知识缺口检测
  detectKnowledgeGaps(
    nodeProgress: Map<string, NodeProgress>,
    userId: string
  ): KnowledgeGap[] {
    const gaps: KnowledgeGap[] = []

    for (const [nodeId, progress] of nodeProgress) {
      // 检测理解困难
      if (progress.comprehensionLevel < 0.6 && progress.visitCount > 2) {
        gaps.push({
          id: `gap-comprehension-${nodeId}-${Date.now()}`,
          userId,
          nodeId,
          gapType: 'conceptual',
          severity: progress.comprehensionLevel < 0.3 ? 'high' : 'medium',
          description: `对节点 ${nodeId} 的理解程度较低`,
          identifiedAt: new Date(),
          suggestedActions: [
            '回顾基础概念',
            '寻找更简单的解释',
            '通过实例加深理解',
            '与他人讨论'
          ],
          status: 'identified'
        })
      }

      // 检测前置知识缺口
      const prerequisites = this.getPrerequisites(nodeId)
      for (const prereqId of prerequisites) {
        const prereqProgress = nodeProgress.get(prereqId)
        if (!prereqProgress || prereqProgress.completionStatus === 'not-started') {
          gaps.push({
            id: `gap-prerequisite-${prereqId}-${Date.now()}`,
            userId,
            nodeId: prereqId,
            gapType: 'prerequisite',
            severity: 'high',
            description: `缺少前置知识: ${prereqId}`,
            identifiedAt: new Date(),
            suggestedActions: [
              `先学习 ${prereqId}`,
              '完成相关练习',
              '确保理解基础概念'
            ],
            status: 'identified'
          })
        }
      }

      // 检测应用能力缺口
      if (progress.completionStatus === 'completed' && progress.masteryScore < 0.7) {
        gaps.push({
          id: `gap-application-${nodeId}-${Date.now()}`,
          userId,
          nodeId,
          gapType: 'application',
          severity: 'medium',
          description: `对节点 ${nodeId} 的应用能力不足`,
          identifiedAt: new Date(),
          suggestedActions: [
            '练习实际应用',
            '查看案例研究',
            '完成相关项目',
            '进行同伴讨论'
          ],
          status: 'identified'
        })
      }
    }

    return gaps
  }

  // 学习路径优化
  optimizeLearningPath(
    originalPath: string[],
    user: UserProfile,
    nodeProgress: Map<string, NodeProgress>
  ): {
    optimizedPath: string[]
    changes: Array<{
      type: 'added' | 'removed' | 'reordered'
      nodeId: string
      reason: string
    }>
    estimatedImprovement: number
  } {
    const changes: Array<{
      type: 'added' | 'removed' | 'reordered'
      nodeId: string
      reason: string
    }> = []

    let optimizedPath = [...originalPath]

    // 添加缺失的前置知识
    const missingPrerequisites = this.findMissingPrerequisites(originalPath, nodeProgress)
    for (const prereq of missingPrerequisites) {
      const insertIndex = this.findOptimalInsertionPoint(optimizedPath, prereq)
      optimizedPath.splice(insertIndex, 0, prereq)
      changes.push({
        type: 'added',
        nodeId: prereq,
        reason: '添加缺失的前置知识'
      })
    }

    // 根据难度重新排序
    const reorderedPath = this.reorderByDifficulty(optimizedPath, user.academicBackground)
    if (JSON.stringify(reorderedPath) !== JSON.stringify(optimizedPath)) {
      optimizedPath = reorderedPath
      changes.push({
        type: 'reordered',
        nodeId: 'multiple',
        reason: '根据难度梯度重新排序'
      })
    }

    // 移除重复或不必要的节点
    const redundantNodes = this.findRedundantNodes(optimizedPath, user)
    for (const nodeId of redundantNodes) {
      const index = optimizedPath.indexOf(nodeId)
      if (index > -1) {
        optimizedPath.splice(index, 1)
        changes.push({
          type: 'removed',
          nodeId,
          reason: '移除冗余内容'
        })
      }
    }

    // 估算改进效果
    const estimatedImprovement = this.estimatePathImprovement(originalPath, optimizedPath, user)

    return {
      optimizedPath,
      changes,
      estimatedImprovement
    }
  }

  // 私有辅助方法
  private generatePatternCharacteristics(pattern: string): string[] {
    const characteristics: Record<string, string[]> = {
      visual: [
        '偏好图表和图像',
        '通过视觉元素理解概念',
        '喜欢颜色编码和空间布局',
        '记忆视觉信息效果好'
      ],
      auditory: [
        '通过听觉学习效果好',
        '喜欢讨论和解释',
        '对音频内容敏感',
        '通过重复加强记忆'
      ],
      kinesthetic: [
        '通过实践学习',
        '喜欢互动和操作',
        '需要频繁的活动变化',
        '通过体验理解概念'
      ],
      reading: [
        '偏好文字内容',
        '喜欢详细的说明',
        '通过阅读深入理解',
        '善于处理文本信息'
      ]
    }

    return characteristics[pattern] || []
  }

  private generatePatternRecommendations(pattern: string): string[] {
    const recommendations: Record<string, string[]> = {
      visual: [
        '多使用图表和示意图',
        '利用颜色区分不同概念',
        '创建思维导图',
        '使用视觉化工具'
      ],
      auditory: [
        '参与讨论和交流',
        '使用音频学习材料',
        '大声朗读重要内容',
        '寻找播客和讲座'
      ],
      kinesthetic: [
        '进行实际操作练习',
        '使用互动学习工具',
        '定期休息和活动',
        '通过项目学习'
      ],
      reading: [
        '深入阅读相关文献',
        '做详细的学习笔记',
        '整理知识要点',
        '使用文字总结'
      ]
    }

    return recommendations[pattern] || []
  }

  private calculateRetentionRate(nodeProgress: Map<string, NodeProgress>): number {
    const completedNodes = Array.from(nodeProgress.values())
      .filter(p => p.completionStatus === 'completed' || p.completionStatus === 'mastered')

    if (completedNodes.length === 0) return 0

    const retainedNodes = completedNodes.filter(p => {
      const daysSinceCompletion = (Date.now() - p.lastVisited.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceCompletion < 30 && p.masteryScore > 0.6
    })

    return retainedNodes.length / completedNodes.length
  }

  private calculateEfficiencyScore(timePerNode: number, completionRate: number, retentionRate: number): number {
    // 时间效率 (越少越好，但有下限)
    const timeEfficiency = Math.max(0, Math.min(1, (1800 - timePerNode) / 1800)) // 30分钟为基准

    // 综合评分
    return (timeEfficiency * 0.3 + completionRate * 0.4 + retentionRate * 0.3)
  }

  private identifyStrugglingAreas(nodeProgress: Map<string, NodeProgress>): string[] {
    return Array.from(nodeProgress.entries())
      .filter(([_, progress]) => 
        progress.comprehensionLevel < 0.5 || 
        progress.difficultyRating > 4 ||
        (progress.visitCount > 3 && progress.completionStatus !== 'completed')
      )
      .map(([nodeId, _]) => nodeId)
      .slice(0, 5)
  }

  private identifyStrengths(nodeProgress: Map<string, NodeProgress>): string[] {
    return Array.from(nodeProgress.entries())
      .filter(([_, progress]) => 
        progress.masteryScore > 0.8 && 
        progress.comprehensionLevel > 0.8 &&
        progress.timeSpent < 600 // 10分钟内完成
      )
      .map(([nodeId, _]) => nodeId)
      .slice(0, 5)
  }

  private generateImprovementSuggestions(
    efficiencyScore: number, 
    strugglingAreas: string[], 
    timePerNode: number
  ): string[] {
    const suggestions: string[] = []

    if (efficiencyScore < 0.5) {
      suggestions.push('建议制定更结构化的学习计划')
    }

    if (strugglingAreas.length > 3) {
      suggestions.push('专注于基础概念的巩固')
      suggestions.push('寻求额外的学习资源和帮助')
    }

    if (timePerNode > 1800) { // 30分钟以上
      suggestions.push('尝试分解复杂概念为小块学习')
      suggestions.push('使用主动学习策略')
    }

    if (timePerNode < 300) { // 5分钟以下
      suggestions.push('增加学习深度，避免浅尝辄止')
      suggestions.push('多做练习和应用')
    }

    return suggestions
  }

  // 其他私有方法的实现...
  private generateProgressBasedRecommendations(nodeProgress: Map<string, NodeProgress>, userId: string): PersonalizedRecommendation[] {
    // 实现基于进度的推荐逻辑
    return []
  }

  private generateInterestBasedRecommendations(nodeProgress: Map<string, NodeProgress>, userId: string): PersonalizedRecommendation[] {
    // 实现基于兴趣的推荐逻辑
    return []
  }

  private generateDifficultyBasedRecommendations(nodeProgress: Map<string, NodeProgress>, background: any, userId: string): PersonalizedRecommendation[] {
    // 实现基于难度的推荐逻辑
    return []
  }

  private generateStyleBasedRecommendations(learningStyle: any, nodeProgress: Map<string, NodeProgress>, userId: string): PersonalizedRecommendation[] {
    // 实现基于学习风格的推荐逻辑
    return []
  }

  private generateGapBasedRecommendations(nodeProgress: Map<string, NodeProgress>, userId: string): PersonalizedRecommendation[] {
    // 实现基于知识缺口的推荐逻辑
    return []
  }

  private determineDifficultyLevel(user: UserProfile, progress: NodeProgress): 'beginner' | 'intermediate' | 'advanced' {
    // 实现难度级别确定逻辑
    return 'intermediate'
  }

  private determineContentFormat(learningStyle: any): 'text' | 'visual' | 'interactive' | 'video' {
    // 实现内容格式确定逻辑
    return 'text'
  }

  private determineExplanationStyle(background: any): 'conceptual' | 'practical' | 'theoretical' | 'example-based' {
    // 实现解释风格确定逻辑
    return 'conceptual'
  }

  private determinePacing(preferences: any, progress: NodeProgress): 'slow' | 'medium' | 'fast' {
    // 实现节奏确定逻辑
    return 'medium'
  }

  private selectAdditionalResources(nodeId: string, user: UserProfile): string[] {
    // 实现额外资源选择逻辑
    return []
  }

  private needsSimplification(user: UserProfile, progress: NodeProgress): boolean {
    // 实现简化需求判断逻辑
    return false
  }

  private needsAdvancedDetails(user: UserProfile, progress: NodeProgress): boolean {
    // 实现高级详情需求判断逻辑
    return false
  }

  private getPrerequisites(nodeId: string): string[] {
    // 实现前置条件获取逻辑
    return []
  }

  private findMissingPrerequisites(path: string[], nodeProgress: Map<string, NodeProgress>): string[] {
    // 实现缺失前置条件查找逻辑
    return []
  }

  private findOptimalInsertionPoint(path: string[], nodeId: string): number {
    // 实现最优插入点查找逻辑
    return 0
  }

  private reorderByDifficulty(path: string[], background: any): string[] {
    // 实现按难度重排序逻辑
    return path
  }

  private findRedundantNodes(path: string[], user: UserProfile): string[] {
    // 实现冗余节点查找逻辑
    return []
  }

  private estimatePathImprovement(originalPath: string[], optimizedPath: string[], user: UserProfile): number {
    // 实现路径改进估算逻辑
    return 0.1
  }
}

// 单例实例
export const learningAnalyticsService = new LearningAnalyticsService()