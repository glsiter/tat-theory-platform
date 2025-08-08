import { ref, computed } from 'vue'

export interface LearningProgress {
  userId: string
  moduleId: string
  progress: number // 0-100
  completedSections: string[]
  timeSpent: number // 分钟
  lastAccessed: Date
  bookmarks: string[]
  notes: { [sectionId: string]: string }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    fontSize: 'small' | 'medium' | 'large'
    animationsEnabled: boolean
    autoSave: boolean
  }
}

export interface SyncStatus {
  isOnline: boolean
  lastSyncTime: Date | null
  pendingChanges: number
  syncInProgress: boolean
}

export function useLearningProgress(userId: string) {
  const progressData = ref<{ [moduleId: string]: LearningProgress }>({})
  const syncStatus = ref<SyncStatus>({
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingChanges: 0,
    syncInProgress: false,
  })

  const STORAGE_KEY = `tat_learning_progress_${userId}`
  const SYNC_ENDPOINT = '/api/learning-progress'

  // 加载本地存储的进度数据
  const loadLocalProgress = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // 转换日期字符串回Date对象
        Object.values(parsed).forEach((progress: any) => {
          progress.lastAccessed = new Date(progress.lastAccessed)
        })
        progressData.value = parsed
      }
    } catch (error) {
      console.error('Failed to load local progress:', error)
    }
  }

  // 保存到本地存储
  const saveLocalProgress = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData.value))
    } catch (error) {
      console.error('Failed to save local progress:', error)
    }
  }

  // 获取模块进度
  const getModuleProgress = (moduleId: string): LearningProgress => {
    if (!progressData.value[moduleId]) {
      progressData.value[moduleId] = {
        userId,
        moduleId,
        progress: 0,
        completedSections: [],
        timeSpent: 0,
        lastAccessed: new Date(),
        bookmarks: [],
        notes: {},
        preferences: {
          theme: 'auto',
          fontSize: 'medium',
          animationsEnabled: true,
          autoSave: true,
        },
      }
    }
    return progressData.value[moduleId]
  }

  // 更新模块进度
  const updateModuleProgress = (moduleId: string, updates: Partial<LearningProgress>) => {
    const current = getModuleProgress(moduleId)
    progressData.value[moduleId] = {
      ...current,
      ...updates,
      lastAccessed: new Date(),
    }

    syncStatus.value.pendingChanges++
    saveLocalProgress()

    // 自动同步（如果在线且启用自动保存）
    if (current.preferences.autoSave && syncStatus.value.isOnline) {
      syncToServer(moduleId)
    }
  }

  // 标记章节完成
  const markSectionCompleted = (moduleId: string, sectionId: string) => {
    const progress = getModuleProgress(moduleId)
    if (!progress.completedSections.includes(sectionId)) {
      progress.completedSections.push(sectionId)
      updateModuleProgress(moduleId, progress)
    }
  }

  // 添加书签
  const addBookmark = (moduleId: string, sectionId: string) => {
    const progress = getModuleProgress(moduleId)
    if (!progress.bookmarks.includes(sectionId)) {
      progress.bookmarks.push(sectionId)
      updateModuleProgress(moduleId, progress)
    }
  }

  // 移除书签
  const removeBookmark = (moduleId: string, sectionId: string) => {
    const progress = getModuleProgress(moduleId)
    const index = progress.bookmarks.indexOf(sectionId)
    if (index > -1) {
      progress.bookmarks.splice(index, 1)
      updateModuleProgress(moduleId, progress)
    }
  }

  // 添加笔记
  const addNote = (moduleId: string, sectionId: string, note: string) => {
    const progress = getModuleProgress(moduleId)
    progress.notes[sectionId] = note
    updateModuleProgress(moduleId, progress)
  }

  // 更新学习时间
  const updateTimeSpent = (moduleId: string, minutes: number) => {
    const progress = getModuleProgress(moduleId)
    progress.timeSpent += minutes
    updateModuleProgress(moduleId, progress)
  }

  // 计算总体进度
  const calculateOverallProgress = computed(() => {
    const modules = Object.values(progressData.value)
    if (modules.length === 0) return 0

    const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0)
    return Math.round(totalProgress / modules.length)
  })

  // 获取学习统计
  const getLearningStats = computed(() => {
    const modules = Object.values(progressData.value)

    return {
      totalModules: modules.length,
      completedModules: modules.filter((m) => m.progress === 100).length,
      totalTimeSpent: modules.reduce((sum, m) => sum + m.timeSpent, 0),
      totalBookmarks: modules.reduce((sum, m) => sum + m.bookmarks.length, 0),
      totalNotes: modules.reduce((sum, m) => sum + Object.keys(m.notes).length, 0),
      averageProgress: calculateOverallProgress.value,
    }
  })

  // 同步到服务器
  const syncToServer = async (moduleId?: string) => {
    if (!syncStatus.value.isOnline || syncStatus.value.syncInProgress) {
      return
    }

    syncStatus.value.syncInProgress = true

    try {
      const dataToSync = moduleId
        ? { [moduleId]: progressData.value[moduleId] }
        : progressData.value

      const response = await fetch(SYNC_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          data: dataToSync,
        }),
      })

      if (response.ok) {
        syncStatus.value.lastSyncTime = new Date()
        syncStatus.value.pendingChanges = 0
      } else {
        throw new Error('Sync failed')
      }
    } catch (error) {
      console.error('Failed to sync to server:', error)
      // 保持本地数据，稍后重试
    } finally {
      syncStatus.value.syncInProgress = false
    }
  }

  // 从服务器加载
  const loadFromServer = async () => {
    if (!syncStatus.value.isOnline) return

    try {
      const response = await fetch(`${SYNC_ENDPOINT}/${userId}`)
      if (response.ok) {
        const serverData = await response.json()

        // 合并服务器数据和本地数据（以最新时间为准）
        Object.keys(serverData).forEach((moduleId) => {
          const serverProgress = serverData[moduleId]
          const localProgress = progressData.value[moduleId]

          if (
            !localProgress ||
            new Date(serverProgress.lastAccessed) > localProgress.lastAccessed
          ) {
            progressData.value[moduleId] = {
              ...serverProgress,
              lastAccessed: new Date(serverProgress.lastAccessed),
            }
          }
        })

        saveLocalProgress()
        syncStatus.value.lastSyncTime = new Date()
      }
    } catch (error) {
      console.error('Failed to load from server:', error)
    }
  }

  // 监听在线状态
  const handleOnlineStatus = () => {
    syncStatus.value.isOnline = navigator.onLine

    if (syncStatus.value.isOnline && syncStatus.value.pendingChanges > 0) {
      // 重新上线时同步待处理的更改
      syncToServer()
    }
  }

  // 导出学习数据
  const exportLearningData = () => {
    const dataToExport = {
      userId,
      exportDate: new Date().toISOString(),
      progressData: progressData.value,
      stats: getLearningStats.value,
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tat_learning_progress_${userId}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 初始化
  loadLocalProgress()

  // 监听在线状态变化
  window.addEventListener('online', handleOnlineStatus)
  window.addEventListener('offline', handleOnlineStatus)

  // 定期自动同步
  setInterval(() => {
    if (syncStatus.value.isOnline && syncStatus.value.pendingChanges > 0) {
      syncToServer()
    }
  }, 30000) // 每30秒检查一次

  // 页面卸载时保存
  window.addEventListener('beforeunload', saveLocalProgress)

  return {
    progressData,
    syncStatus,
    getModuleProgress,
    updateModuleProgress,
    markSectionCompleted,
    addBookmark,
    removeBookmark,
    addNote,
    updateTimeSpent,
    calculateOverallProgress,
    getLearningStats,
    syncToServer,
    loadFromServer,
    exportLearningData,
  }
}
