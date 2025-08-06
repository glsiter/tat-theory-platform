// 用户学习状态管理 Pinia Store
// 使用Pinia实现全局状态管理
// 创建学习进度跟踪和持久化存储
// 实现个性化推荐和适应性内容系统

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type {
  UserProfile,
  LearningSession,
  NodeProgress,
  LearningPath,
  PersonalizedRecommendation,
  AdaptiveContent,
  LearningAnalytics,
  KnowledgeGap,
  StudyGoal,
  LearningNote,
  StudyGroup
} from '@/types/learning-state'

export const useLearningStateStore = defineStore('learningState', () => {
  // 状态定义
  const currentUser = ref<UserProfile | null>(null)
  const currentSession = ref<LearningSession | null>(null)
  const nodeProgressMap = ref<Map<string, NodeProgress>>(new Map())
  const learningPaths = ref<LearningPath[]>([])
  const recommendations = ref<PersonalizedRecommendation[]>([])
  const adaptiveContentMap = ref<Map<string, AdaptiveContent>>(new Map())
  const knowledgeGaps = ref<KnowledgeGap[]>([])
  const studyGoals = ref<StudyGoal[]>([])
  const learningNotes = ref<LearningNote[]>([])
  const studyGroups = ref<StudyGroup[]>([])
  const analytics = ref<LearningAnalytics | null>(null)
  
  // 会话状态
  const isSessionActive = ref(false)
  const sessionStartTime = ref<Date | null>(null)
  const currentNodeId = ref<string | null>(null)
  const visitedNodesInSession = ref<Set<string>>(new Set())
  
  // 计算属性
  const totalStudyTime = computed(() => {
    return Array.from(nodeProgressMap.value.values())
      .reduce((total, progress) => total + progress.timeSpent, 0)
  })

  const completedNodesCount = computed(() => {
    return Array.from(nodeProgressMap.value.values())
      .filter(progress => progress.completionStatus === 'completed' || progress.completionStatus === 'mastered')
      .length
  })

  const overallProgress = computed(() => {
    const totalNodes = nodeProgressMap.value.size
    if (totalNodes === 0) return 0
    return completedNodesCount.value / totalNodes
  })

  const currentLearningPath = computed(() => {
    return learningPaths.value.find(path => path.status === 'in-progress')
  })

  const highPriorityRecommendations = computed(() => {
    return recommendations.value
      .filter(rec => rec.priority === 'high' && !rec.viewed)
      .sort((a, b) => b.confidence - a.confidence)
  })

  const activeStudyGoals = computed(() => {
    return studyGoals.value.filter(goal => goal.status === 'active')
  })

  const criticalKnowledgeGaps = computed(() => {
    return knowledgeGaps.value.filter(gap => gap.severity === 'high' && gap.status !== 'resolved')
  })

  // 用户管理
  const setCurrentUser = (user: UserProfile) => {
    currentUser.value = user
    loadUserData(user.id)
  }

  const updateUserPreferences = (preferences: Partial<UserProfile['preferences']>) => {
    if (currentUser.value) {
      currentUser.value.preferences = { ...currentUser.value.preferences, ...preferences }
      saveUserData()
    }
  }

  // 会话管理
  const startLearningSession = (sessionType: LearningSession['sessionType'] = 'exploration') => {
    if (isSessionActive.value) {
      endLearningSession()
    }

    const session: LearningSession = {
      id: `session-${Date.now()}`,
      userId: currentUser.value?.id || 'anonymous',
      startTime: new Date(),
      duration: 0,
      nodesVisited: [],
      activitiesCompleted: [],
      questionsAnswered: 0,
      correctAnswers: 0,
      bookmarksAdded: [],
      notesCreated: 0,
      pathsExplored: [],
      focusAreas: [],
      difficultyLevel: 'intermediate',
      sessionType,
      completionRate: 0,
      engagementScore: 0
    }

    currentSession.value = session
    isSessionActive.value = true
    sessionStartTime.value = new Date()
    visitedNodesInSession.value.clear()
  }

  const endLearningSession = () => {
    if (!currentSession.value || !isSessionActive.value) return

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - sessionStartTime.value!.getTime()) / 1000)

    currentSession.value.endTime = endTime
    currentSession.value.duration = duration
    currentSession.value.nodesVisited = Array.from(visitedNodesInSession.value)
    currentSession.value.completionRate = calculateSessionCompletionRate()
    currentSession.value.engagementScore = calculateEngagementScore()

    // 保存会话数据
    saveSessionData(currentSession.value)

    // 重置会话状态
    currentSession.value = null
    isSessionActive.value = false
    sessionStartTime.value = null
    visitedNodesInSession.value.clear()

    // 更新分析数据
    updateAnalytics()
  }

  // 节点进度管理
  const visitNode = (nodeId: string) => {
    currentNodeId.value = nodeId
    visitedNodesInSession.value.add(nodeId)

    let progress = nodeProgressMap.value.get(nodeId)
    if (!progress) {
      progress = {
        nodeId,
        userId: currentUser.value?.id || 'anonymous',
        firstVisited: new Date(),
        lastVisited: new Date(),
        visitCount: 1,
        timeSpent: 0,
        completionStatus: 'in-progress',
        comprehensionLevel: 0,
        difficultyRating: 3,
        interestLevel: 3,
        notesCount: 0,
        bookmarked: false,
        reviewNeeded: false,
        masteryScore: 0
      }
    } else {
      progress.lastVisited = new Date()
      progress.visitCount++
    }

    nodeProgressMap.value.set(nodeId, progress)
    saveNodeProgress(nodeId)

    // 触发适应性内容更新
    updateAdaptiveContent(nodeId)
  }

  const updateNodeProgress = (nodeId: string, updates: Partial<NodeProgress>) => {
    const progress = nodeProgressMap.value.get(nodeId)
    if (progress) {
      Object.assign(progress, updates)
      nodeProgressMap.value.set(nodeId, progress)
      saveNodeProgress(nodeId)

      // 检查是否需要生成新的推荐
      if (updates.completionStatus === 'completed') {
        generateRecommendations(nodeId)
      }
    }
  }

  const markNodeCompleted = (nodeId: string, comprehensionLevel: number = 0.8) => {
    updateNodeProgress(nodeId, {
      completionStatus: 'completed',
      comprehensionLevel,
      masteryScore: comprehensionLevel
    })

    // 更新当前学习路径进度
    updateLearningPathProgress(nodeId)
  }

  // 学习路径管理
  const createLearningPath = (path: Omit<LearningPath, 'id' | 'userId' | 'startDate' | 'status' | 'progress'>) => {
    const newPath: LearningPath = {
      ...path,
      id: `path-${Date.now()}`,
      userId: currentUser.value?.id || 'anonymous',
      startDate: new Date(),
      status: 'not-started',
      progress: 0,
      adaptations: []
    }

    learningPaths.value.push(newPath)
    saveLearningPaths()
    return newPath
  }

  const startLearningPath = (pathId: string) => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (path) {
      // 暂停其他进行中的路径
      learningPaths.value.forEach(p => {
        if (p.status === 'in-progress') {
          p.status = 'paused'
        }
      })

      path.status = 'in-progress'
      path.currentPosition = 0
      saveLearningPaths()
    }
  }

  const updateLearningPathProgress = (completedNodeId: string) => {
    const activePath = currentLearningPath.value
    if (!activePath) return

    const nodeIndex = activePath.nodeSequence.indexOf(completedNodeId)
    if (nodeIndex !== -1 && nodeIndex >= activePath.currentPosition) {
      activePath.currentPosition = nodeIndex + 1
      activePath.progress = activePath.currentPosition / activePath.nodeSequence.length

      if (activePath.progress >= 1.0) {
        activePath.status = 'completed'
        activePath.actualCompletionDate = new Date()
      }

      saveLearningPaths()
    }
  }

  // 个性化推荐
  const generateRecommendations = (completedNodeId: string) => {
    // 基于完成的节点生成推荐
    const newRecommendations: PersonalizedRecommendation[] = []

    // 推荐相关概念
    const relatedNodes = getRelatedNodes(completedNodeId)
    for (const nodeId of relatedNodes.slice(0, 2)) {
      newRecommendations.push({
        id: `rec-${Date.now()}-${nodeId}`,
        userId: currentUser.value?.id || 'anonymous',
        type: 'related-concept',
        nodeId,
        title: `探索相关概念`,
        description: `基于您刚完成的内容，推荐学习相关概念`,
        reason: '内容关联性高',
        confidence: 0.8,
        priority: 'medium',
        createdAt: new Date(),
        viewed: false,
        accepted: false
      })
    }

    // 推荐下一步学习内容
    const nextNodes = getNextLearningNodes(completedNodeId)
    for (const nodeId of nextNodes.slice(0, 1)) {
      newRecommendations.push({
        id: `rec-${Date.now()}-next-${nodeId}`,
        userId: currentUser.value?.id || 'anonymous',
        type: 'next-topic',
        nodeId,
        title: `继续深入学习`,
        description: `基于学习路径推荐的下一个主题`,
        reason: '符合学习进度',
        confidence: 0.9,
        priority: 'high',
        createdAt: new Date(),
        viewed: false,
        accepted: false
      })
    }

    recommendations.value.push(...newRecommendations)
    saveRecommendations()
  }

  const acceptRecommendation = (recommendationId: string) => {
    const recommendation = recommendations.value.find(r => r.id === recommendationId)
    if (recommendation) {
      recommendation.accepted = true
      recommendation.viewed = true
      visitNode(recommendation.nodeId)
      saveRecommendations()
    }
  }

  const dismissRecommendation = (recommendationId: string, feedback?: string) => {
    const recommendation = recommendations.value.find(r => r.id === recommendationId)
    if (recommendation) {
      recommendation.viewed = true
      if (feedback) {
        recommendation.feedback = feedback as any
      }
      saveRecommendations()
    }
  }

  // 适应性内容
  const updateAdaptiveContent = (nodeId: string) => {
    const progress = nodeProgressMap.value.get(nodeId)
    if (!progress) return

    let adaptiveContent = adaptiveContentMap.value.get(nodeId)
    if (!adaptiveContent) {
      adaptiveContent = {
        nodeId,
        userId: currentUser.value?.id || 'anonymous',
        adaptations: {
          difficultyLevel: 'intermediate',
          contentFormat: 'text',
          explanationStyle: 'conceptual',
          pacing: 'medium',
          additionalResources: [],
          simplifiedExplanations: false,
          advancedDetails: false
        },
        effectiveness: 0.5,
        lastUpdated: new Date()
      }
    }

    // 基于用户表现调整内容
    if (progress.difficultyRating > 4) {
      adaptiveContent.adaptations.difficultyLevel = 'advanced'
      adaptiveContent.adaptations.advancedDetails = true
    } else if (progress.difficultyRating < 2) {
      adaptiveContent.adaptations.difficultyLevel = 'beginner'
      adaptiveContent.adaptations.simplifiedExplanations = true
    }

    // 基于学习风格调整格式
    if (currentUser.value?.learningStyle?.visualLearner && currentUser.value.learningStyle.visualLearner > 0.7) {
      adaptiveContent.adaptations.contentFormat = 'visual'
    } else if (currentUser.value?.learningStyle?.kinestheticLearner && currentUser.value.learningStyle.kinestheticLearner > 0.7) {
      adaptiveContent.adaptations.contentFormat = 'interactive'
    }

    adaptiveContent.lastUpdated = new Date()
    adaptiveContentMap.value.set(nodeId, adaptiveContent)
    saveAdaptiveContent()
  }

  // 知识缺口检测
  const detectKnowledgeGaps = () => {
    const gaps: KnowledgeGap[] = []

    // 检测前置知识缺口
    for (const [nodeId, progress] of nodeProgressMap.value) {
      if (progress.comprehensionLevel < 0.6) {
        const prerequisites = getPrerequisiteNodes(nodeId)
        for (const prereqId of prerequisites) {
          const prereqProgress = nodeProgressMap.value.get(prereqId)
          if (!prereqProgress || prereqProgress.completionStatus === 'not-started') {
            gaps.push({
              id: `gap-${Date.now()}-${prereqId}`,
              userId: currentUser.value?.id || 'anonymous',
              nodeId: prereqId,
              gapType: 'prerequisite',
              severity: 'high',
              description: `需要先掌握前置知识: ${prereqId}`,
              identifiedAt: new Date(),
              suggestedActions: [`学习节点: ${prereqId}`, '完成相关练习'],
              status: 'identified'
            })
          }
        }
      }
    }

    knowledgeGaps.value = gaps
    saveKnowledgeGaps()
  }

  // 学习目标管理
  const createStudyGoal = (goal: Omit<StudyGoal, 'id' | 'userId' | 'createdAt' | 'currentValue' | 'status'>) => {
    const newGoal: StudyGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      userId: currentUser.value?.id || 'anonymous',
      createdAt: new Date(),
      currentValue: 0,
      status: 'active'
    }

    studyGoals.value.push(newGoal)
    saveStudyGoals()
    return newGoal
  }

  const updateGoalProgress = (goalId: string, progress: number) => {
    const goal = studyGoals.value.find(g => g.id === goalId)
    if (goal) {
      goal.currentValue = Math.min(progress, goal.targetValue)
      
      if (goal.currentValue >= goal.targetValue) {
        goal.status = 'completed'
        goal.completedAt = new Date()
      }

      saveStudyGoals()
    }
  }

  // 笔记管理
  const createNote = (note: Omit<LearningNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newNote: LearningNote = {
      ...note,
      id: `note-${Date.now()}`,
      userId: currentUser.value?.id || 'anonymous',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    learningNotes.value.push(newNote)
    
    // 更新节点进度中的笔记计数
    const progress = nodeProgressMap.value.get(note.nodeId)
    if (progress) {
      progress.notesCount++
      nodeProgressMap.value.set(note.nodeId, progress)
    }

    saveLearningNotes()
    return newNote
  }

  const updateNote = (noteId: string, updates: Partial<LearningNote>) => {
    const note = learningNotes.value.find(n => n.id === noteId)
    if (note) {
      Object.assign(note, updates, { updatedAt: new Date() })
      saveLearningNotes()
    }
  }

  // 数据持久化
  const saveUserData = () => {
    if (currentUser.value) {
      localStorage.setItem('tat-user-profile', JSON.stringify(currentUser.value))
    }
  }

  const loadUserData = (userId: string) => {
    const stored = localStorage.getItem('tat-user-profile')
    if (stored) {
      currentUser.value = JSON.parse(stored)
    }

    // 加载其他用户数据
    loadNodeProgress()
    loadLearningPaths()
    loadRecommendations()
    loadAdaptiveContent()
    loadKnowledgeGaps()
    loadStudyGoals()
    loadLearningNotes()
  }

  const saveNodeProgress = (nodeId: string) => {
    const progress = nodeProgressMap.value.get(nodeId)
    if (progress) {
      const allProgress = Object.fromEntries(nodeProgressMap.value)
      localStorage.setItem('tat-node-progress', JSON.stringify(allProgress))
    }
  }

  const loadNodeProgress = () => {
    const stored = localStorage.getItem('tat-node-progress')
    if (stored) {
      const progressData = JSON.parse(stored)
      nodeProgressMap.value = new Map(Object.entries(progressData))
    }
  }

  const saveLearningPaths = () => {
    localStorage.setItem('tat-learning-paths', JSON.stringify(learningPaths.value))
  }

  const loadLearningPaths = () => {
    const stored = localStorage.getItem('tat-learning-paths')
    if (stored) {
      learningPaths.value = JSON.parse(stored)
    }
  }

  const saveRecommendations = () => {
    localStorage.setItem('tat-recommendations', JSON.stringify(recommendations.value))
  }

  const loadRecommendations = () => {
    const stored = localStorage.getItem('tat-recommendations')
    if (stored) {
      recommendations.value = JSON.parse(stored)
    }
  }

  const saveAdaptiveContent = () => {
    const adaptiveData = Object.fromEntries(adaptiveContentMap.value)
    localStorage.setItem('tat-adaptive-content', JSON.stringify(adaptiveData))
  }

  const loadAdaptiveContent = () => {
    const stored = localStorage.getItem('tat-adaptive-content')
    if (stored) {
      const adaptiveData = JSON.parse(stored)
      adaptiveContentMap.value = new Map(Object.entries(adaptiveData))
    }
  }

  const saveKnowledgeGaps = () => {
    localStorage.setItem('tat-knowledge-gaps', JSON.stringify(knowledgeGaps.value))
  }

  const loadKnowledgeGaps = () => {
    const stored = localStorage.getItem('tat-knowledge-gaps')
    if (stored) {
      knowledgeGaps.value = JSON.parse(stored)
    }
  }

  const saveStudyGoals = () => {
    localStorage.setItem('tat-study-goals', JSON.stringify(studyGoals.value))
  }

  const loadStudyGoals = () => {
    const stored = localStorage.getItem('tat-study-goals')
    if (stored) {
      studyGoals.value = JSON.parse(stored)
    }
  }

  const saveLearningNotes = () => {
    localStorage.setItem('tat-learning-notes', JSON.stringify(learningNotes.value))
  }

  const loadLearningNotes = () => {
    const stored = localStorage.getItem('tat-learning-notes')
    if (stored) {
      learningNotes.value = JSON.parse(stored)
    }
  }

  const saveSessionData = (session: LearningSession) => {
    const sessions = JSON.parse(localStorage.getItem('tat-sessions') || '[]')
    sessions.push(session)
    localStorage.setItem('tat-sessions', JSON.stringify(sessions))
  }

  // 辅助函数
  const calculateSessionCompletionRate = (): number => {
    if (!currentSession.value) return 0
    
    const targetNodes = 5 // 目标访问节点数
    const visitedCount = visitedNodesInSession.value.size
    return Math.min(visitedCount / targetNodes, 1.0)
  }

  const calculateEngagementScore = (): number => {
    if (!currentSession.value) return 0
    
    let score = 0
    
    // 基于访问节点数
    score += Math.min(visitedNodesInSession.value.size / 10, 0.3)
    
    // 基于会话时长
    const duration = currentSession.value.duration / 60 // 转换为分钟
    score += Math.min(duration / 30, 0.3) // 30分钟为满分
    
    // 基于活动完成数
    score += Math.min(currentSession.value.activitiesCompleted.length / 5, 0.2)
    
    // 基于笔记和书签
    score += Math.min((currentSession.value.notesCreated + currentSession.value.bookmarksAdded.length) / 3, 0.2)
    
    return Math.min(score, 1.0)
  }

  const updateAnalytics = () => {
    // 更新学习分析数据
    // 这里可以实现复杂的分析逻辑
  }

  const getRelatedNodes = (nodeId: string): string[] => {
    // 获取相关节点的逻辑
    return []
  }

  const getNextLearningNodes = (nodeId: string): string[] => {
    // 获取下一步学习节点的逻辑
    return []
  }

  const getPrerequisiteNodes = (nodeId: string): string[] => {
    // 获取前置节点的逻辑
    return []
  }

  // 监听器设置
  watch(currentNodeId, (newNodeId) => {
    if (newNodeId && isSessionActive.value) {
      // 记录节点访问时间
      setTimeout(() => {
        const progress = nodeProgressMap.value.get(newNodeId)
        if (progress) {
          progress.timeSpent += 30 // 假设每次访问增加30秒
          nodeProgressMap.value.set(newNodeId, progress)
        }
      }, 30000) // 30秒后更新
    }
  })

  return {
    // 状态
    currentUser,
    currentSession,
    nodeProgressMap,
    learningPaths,
    recommendations,
    adaptiveContentMap,
    knowledgeGaps,
    studyGoals,
    learningNotes,
    studyGroups,
    analytics,
    isSessionActive,
    currentNodeId,
    
    // 计算属性
    totalStudyTime,
    completedNodesCount,
    overallProgress,
    currentLearningPath,
    highPriorityRecommendations,
    activeStudyGoals,
    criticalKnowledgeGaps,
    
    // 方法
    setCurrentUser,
    updateUserPreferences,
    startLearningSession,
    endLearningSession,
    visitNode,
    updateNodeProgress,
    markNodeCompleted,
    createLearningPath,
    startLearningPath,
    generateRecommendations,
    acceptRecommendation,
    dismissRecommendation,
    detectKnowledgeGaps,
    createStudyGoal,
    updateGoalProgress,
    createNote,
    updateNote
  }
})

export type LearningStateStore = ReturnType<typeof useLearningStateStore>