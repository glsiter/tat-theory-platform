// 用户学习状态管理类型定义
// 支持学习进度跟踪、个性化推荐和适应性内容系统

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  lastLoginAt: Date
  preferences: UserPreferences
  learningStyle: LearningStyle
  academicBackground: AcademicBackground
}

export interface UserPreferences {
  language: 'zh' | 'en'
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large'
  animationEnabled: boolean
  soundEnabled: boolean
  autoSave: boolean
  notificationsEnabled: boolean
  emailNotifications: boolean
  studyReminders: boolean
  preferredLearningTime: 'morning' | 'afternoon' | 'evening' | 'night'
  sessionDuration: number // 分钟
}

export interface LearningStyle {
  visualLearner: number // 0-1
  auditoryLearner: number // 0-1
  kinestheticLearner: number // 0-1
  readingLearner: number // 0-1
  preferredPace: 'slow' | 'medium' | 'fast'
  preferredDepth: 'overview' | 'detailed' | 'comprehensive'
  interactionPreference: 'passive' | 'interactive' | 'collaborative'
}

export interface AcademicBackground {
  education: 'undergraduate' | 'graduate' | 'phd' | 'professional'
  major: string
  researchExperience: boolean
  psychologyBackground: boolean
  statisticsKnowledge: 'none' | 'basic' | 'intermediate' | 'advanced'
  priorTATKnowledge: 'none' | 'basic' | 'intermediate' | 'advanced'
}

export interface LearningSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  duration: number // 秒
  nodesVisited: string[]
  activitiesCompleted: string[]
  questionsAnswered: number
  correctAnswers: number
  bookmarksAdded: string[]
  notesCreated: number
  pathsExplored: string[]
  focusAreas: string[]
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  sessionType: 'exploration' | 'structured' | 'review' | 'assessment'
  completionRate: number // 0-1
  engagementScore: number // 0-1
}

export interface NodeProgress {
  nodeId: string
  userId: string
  firstVisited: Date
  lastVisited: Date
  visitCount: number
  timeSpent: number // 秒
  completionStatus: 'not-started' | 'in-progress' | 'completed' | 'mastered'
  comprehensionLevel: number // 0-1
  difficultyRating: number // 1-5 用户主观评价
  interestLevel: number // 1-5 用户兴趣评价
  notesCount: number
  bookmarked: boolean
  reviewNeeded: boolean
  lastReviewDate?: Date
  masteryScore: number // 0-1 综合掌握程度
}

export interface LearningPath {
  id: string
  userId: string
  title: string
  description: string
  nodeSequence: string[]
  currentPosition: number
  startDate: Date
  targetCompletionDate?: Date
  actualCompletionDate?: Date
  status: 'not-started' | 'in-progress' | 'completed' | 'paused' | 'abandoned'
  progress: number // 0-1
  estimatedTimeRemaining: number // 分钟
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  pathType: 'system-generated' | 'user-created' | 'instructor-assigned'
  adaptations: PathAdaptation[]
}

export interface PathAdaptation {
  id: string
  timestamp: Date
  type: 'difficulty-adjustment' | 'content-addition' | 'content-removal' | 'sequence-change'
  reason: string
  changes: {
    before: any
    after: any
  }
  effectiveness?: number // 0-1 适应效果评价
}

export interface PersonalizedRecommendation {
  id: string
  userId: string
  type: 'next-topic' | 'review-content' | 'related-concept' | 'skill-gap' | 'interest-based'
  nodeId: string
  title: string
  description: string
  reason: string
  confidence: number // 0-1 推荐置信度
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  expiresAt?: Date
  viewed: boolean
  accepted: boolean
  feedback?: 'helpful' | 'not-helpful' | 'irrelevant'
}

export interface AdaptiveContent {
  nodeId: string
  userId: string
  adaptations: {
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
    contentFormat: 'text' | 'visual' | 'interactive' | 'video'
    explanationStyle: 'conceptual' | 'practical' | 'theoretical' | 'example-based'
    pacing: 'slow' | 'medium' | 'fast'
    additionalResources: string[]
    simplifiedExplanations: boolean
    advancedDetails: boolean
  }
  effectiveness: number // 0-1
  lastUpdated: Date
}

export interface LearningAnalytics {
  userId: string
  period: 'daily' | 'weekly' | 'monthly' | 'all-time'
  startDate: Date
  endDate: Date
  metrics: {
    totalStudyTime: number // 分钟
    sessionsCount: number
    averageSessionDuration: number // 分钟
    nodesCompleted: number
    pathsCompleted: number
    questionsAnswered: number
    accuracyRate: number // 0-1
    engagementScore: number // 0-1
    consistencyScore: number // 0-1 学习一致性
    progressVelocity: number // 节点/天
    retentionRate: number // 0-1 知识保持率
  }
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  trends: {
    studyTimePattern: number[] // 按时间段的学习时间分布
    difficultyProgression: number[] // 难度进展曲线
    interestAreas: Record<string, number> // 兴趣领域分布
    learningEfficiency: number[] // 学习效率变化
  }
}

export interface KnowledgeGap {
  id: string
  userId: string
  nodeId: string
  gapType: 'prerequisite' | 'conceptual' | 'application' | 'connection'
  severity: 'low' | 'medium' | 'high'
  description: string
  identifiedAt: Date
  suggestedActions: string[]
  status: 'identified' | 'addressing' | 'resolved'
  resolutionDate?: Date
}

export interface StudyGoal {
  id: string
  userId: string
  title: string
  description: string
  type: 'completion' | 'mastery' | 'time-based' | 'skill-based'
  targetValue: number
  currentValue: number
  unit: string
  deadline?: Date
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  createdAt: Date
  completedAt?: Date
  relatedNodes: string[]
  milestones: GoalMilestone[]
}

export interface GoalMilestone {
  id: string
  title: string
  description: string
  targetValue: number
  completed: boolean
  completedAt?: Date
  reward?: string
}

export interface LearningNote {
  id: string
  userId: string
  nodeId: string
  title: string
  content: string
  type: 'text' | 'highlight' | 'question' | 'insight' | 'connection'
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPrivate: boolean
  sharedWith: string[]
  attachments: string[]
  linkedNotes: string[]
}

export interface StudyGroup {
  id: string
  name: string
  description: string
  creatorId: string
  members: string[]
  isPublic: boolean
  createdAt: Date
  lastActivity: Date
  focusAreas: string[]
  currentPath?: string
  sharedResources: string[]
  discussions: Discussion[]
}

export interface Discussion {
  id: string
  groupId: string
  authorId: string
  title: string
  content: string
  nodeId?: string
  createdAt: Date
  updatedAt: Date
  replies: Reply[]
  tags: string[]
  upvotes: number
  downvotes: number
}

export interface Reply {
  id: string
  authorId: string
  content: string
  createdAt: Date
  upvotes: number
  downvotes: number
}