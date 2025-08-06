import { ref, reactive, computed } from 'vue'
import type { DeviceInfo } from '@/composables/useResponsive'

export interface AdaptationConfig {
  enableAnimations: boolean
  enableParticleEffects: boolean
  enableComplexVisualizations: boolean
  imageQuality: 'low' | 'medium' | 'high'
  maxConcurrentRequests: number
  enableLazyLoading: boolean
  enableServiceWorker: boolean
  enableOfflineMode: boolean
  reducedDataMode: boolean
}

export interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
  renderTime: number
  networkSpeed: 'slow' | 'medium' | 'fast'
  batteryLevel?: number
  isCharging?: boolean
}

export class DeviceAdaptationService {
  private static instance: DeviceAdaptationService
  
  private performanceMetrics = reactive<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    networkSpeed: 'medium'
  })
  
  private adaptationConfig = reactive<AdaptationConfig>({
    enableAnimations: true,
    enableParticleEffects: true,
    enableComplexVisualizations: true,
    imageQuality: 'high',
    maxConcurrentRequests: 6,
    enableLazyLoading: true,
    enableServiceWorker: true,
    enableOfflineMode: true,
    reducedDataMode: false
  })
  
  private deviceInfo = ref<DeviceInfo | null>(null)
  private isMonitoring = ref(false)
  private adaptationHistory: Array<{ timestamp: Date; config: AdaptationConfig; reason: string }> = []
  
  static getInstance(): DeviceAdaptationService {
    if (!DeviceAdaptationService.instance) {
      DeviceAdaptationService.instance = new DeviceAdaptationService()
    }
    return DeviceAdaptationService.instance
  }
  
  // 初始化设备适配
  initialize(deviceInfo: DeviceInfo) {
    this.deviceInfo.value = deviceInfo
    this.performInitialAdaptation()
    this.startPerformanceMonitoring()
    this.setupNetworkMonitoring()
    this.setupBatteryMonitoring()
  }
  
  // 执行初始适配
  private performInitialAdaptation() {
    if (!this.deviceInfo.value) return
    
    const device = this.deviceInfo.value
    const reasons: string[] = []
    
    // 基于设备类型的适配
    if (device.type === 'mobile') {
      this.adaptationConfig.enableParticleEffects = false
      this.adaptationConfig.maxConcurrentRequests = 3
      this.adaptationConfig.imageQuality = 'medium'
      reasons.push('移动设备优化')
    }
    
    // 基于性能等级的适配
    if (device.performanceLevel === 'low') {
      this.adaptationConfig.enableAnimations = false
      this.adaptationConfig.enableComplexVisualizations = false
      this.adaptationConfig.imageQuality = 'low'
      this.adaptationConfig.maxConcurrentRequests = 2
      reasons.push('低性能设备优化')
    }
    
    // 基于内存的适配
    if (this.getAvailableMemory() < 2) {
      this.adaptationConfig.enableParticleEffects = false
      this.adaptationConfig.reducedDataMode = true
      reasons.push('内存不足优化')
    }
    
    // 基于网络的适配
    if (this.performanceMetrics.networkSpeed === 'slow') {
      this.adaptationConfig.imageQuality = 'low'
      this.adaptationConfig.reducedDataMode = true
      reasons.push('网络速度优化')
    }
    
    this.recordAdaptation(reasons.join(', '))
  }
  
  // 开始性能监控
  private startPerformanceMonitoring() {
    if (this.isMonitoring.value) return
    
    this.isMonitoring.value = true
    
    // FPS监控
    this.monitorFPS()
    
    // 内存监控
    this.monitorMemoryUsage()
    
    // 渲染时间监控
    this.monitorRenderTime()
    
    // 定期检查并调整配置
    setInterval(() => {
      this.checkAndAdaptPerformance()
    }, 5000)
  }
  
  // FPS监控
  private monitorFPS() {
    let lastTime = performance.now()
    let frameCount = 0
    
    const measureFPS = (currentTime: number) => {
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }
  
  // 内存使用监控
  private monitorMemoryUsage() {
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory
        this.performanceMetrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      }
      
      updateMemory()
      setInterval(updateMemory, 2000)
    }
  }
  
  // 渲染时间监控
  private monitorRenderTime() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const renderEntries = entries.filter(entry => entry.entryType === 'measure')
      
      if (renderEntries.length > 0) {
        const avgRenderTime = renderEntries.reduce((sum, entry) => sum + entry.duration, 0) / renderEntries.length
        this.performanceMetrics.renderTime = avgRenderTime
      }
    })
    
    observer.observe({ entryTypes: ['measure'] })
  }
  
  // 网络监控
  private setupNetworkMonitoring() {
    const connection = (navigator as any).connection
    if (connection) {
      const updateNetworkSpeed = () => {
        const effectiveType = connection.effectiveType
        switch (effectiveType) {
          case 'slow-2g':
          case '2g':
            this.performanceMetrics.networkSpeed = 'slow'
            break
          case '3g':
            this.performanceMetrics.networkSpeed = 'medium'
            break
          case '4g':
          default:
            this.performanceMetrics.networkSpeed = 'fast'
            break
        }
      }
      
      updateNetworkSpeed()
      connection.addEventListener('change', updateNetworkSpeed)
    }
  }
  
  // 电池监控
  private async setupBatteryMonitoring() {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery()
        
        const updateBatteryInfo = () => {
          this.performanceMetrics.batteryLevel = battery.level * 100
          this.performanceMetrics.isCharging = battery.charging
        }
        
        updateBatteryInfo()
        
        battery.addEventListener('levelchange', updateBatteryInfo)
        battery.addEventListener('chargingchange', updateBatteryInfo)
      } catch (error) {
        console.warn('Battery API not supported:', error)
      }
    }
  }
  
  // 检查并调整性能
  private checkAndAdaptPerformance() {
    const reasons: string[] = []
    let needsUpdate = false
    
    // FPS过低时的适配
    if (this.performanceMetrics.fps < 30 && this.adaptationConfig.enableAnimations) {
      this.adaptationConfig.enableAnimations = false
      this.adaptationConfig.enableParticleEffects = false
      reasons.push('FPS过低，禁用动画')
      needsUpdate = true
    }
    
    // 内存使用过高时的适配
    if (this.performanceMetrics.memoryUsage > 0.8) {
      this.adaptationConfig.enableComplexVisualizations = false
      this.adaptationConfig.reducedDataMode = true
      reasons.push('内存使用过高')
      needsUpdate = true
    }
    
    // 渲染时间过长时的适配
    if (this.performanceMetrics.renderTime > 16) {
      this.adaptationConfig.enableParticleEffects = false
      reasons.push('渲染时间过长')
      needsUpdate = true
    }
    
    // 电池电量低时的适配
    if (this.performanceMetrics.batteryLevel && 
        this.performanceMetrics.batteryLevel < 20 && 
        !this.performanceMetrics.isCharging) {
      this.adaptationConfig.enableAnimations = false
      this.adaptationConfig.enableParticleEffects = false
      this.adaptationConfig.reducedDataMode = true
      reasons.push('电池电量低')
      needsUpdate = true
    }
    
    // 网络速度变化时的适配
    if (this.performanceMetrics.networkSpeed === 'slow' && 
        this.adaptationConfig.imageQuality !== 'low') {
      this.adaptationConfig.imageQuality = 'low'
      this.adaptationConfig.reducedDataMode = true
      reasons.push('网络速度慢')
      needsUpdate = true
    }
    
    if (needsUpdate) {
      this.recordAdaptation(reasons.join(', '))
      this.notifyConfigChange()
    }
  }
  
  // 获取可用内存（GB）
  private getAvailableMemory(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return memory.jsHeapSizeLimit / (1024 * 1024 * 1024)
    }
    return 4 // 默认假设4GB
  }
  
  // 记录适配历史
  private recordAdaptation(reason: string) {
    this.adaptationHistory.push({
      timestamp: new Date(),
      config: { ...this.adaptationConfig },
      reason
    })
    
    // 只保留最近50条记录
    if (this.adaptationHistory.length > 50) {
      this.adaptationHistory = this.adaptationHistory.slice(-50)
    }
  }
  
  // 通知配置变化
  private notifyConfigChange() {
    window.dispatchEvent(new CustomEvent('device-adaptation-change', {
      detail: {
        config: this.adaptationConfig,
        metrics: this.performanceMetrics
      }
    }))
  }
  
  // 手动设置配置
  setConfig(config: Partial<AdaptationConfig>) {
    Object.assign(this.adaptationConfig, config)
    this.recordAdaptation('手动设置')
    this.notifyConfigChange()
  }
  
  // 重置为默认配置
  resetToDefaults() {
    this.adaptationConfig.enableAnimations = true
    this.adaptationConfig.enableParticleEffects = true
    this.adaptationConfig.enableComplexVisualizations = true
    this.adaptationConfig.imageQuality = 'high'
    this.adaptationConfig.maxConcurrentRequests = 6
    this.adaptationConfig.reducedDataMode = false
    
    this.recordAdaptation('重置为默认配置')
    this.notifyConfigChange()
  }
  
  // 获取当前配置
  getConfig(): AdaptationConfig {
    return { ...this.adaptationConfig }
  }
  
  // 获取性能指标
  getMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics }
  }
  
  // 获取适配历史
  getAdaptationHistory() {
    return [...this.adaptationHistory]
  }
  
  // 获取设备信息
  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo.value
  }
  
  // 获取推荐配置
  getRecommendedConfig(): AdaptationConfig {
    const recommended = { ...this.adaptationConfig }
    
    if (!this.deviceInfo.value) return recommended
    
    const device = this.deviceInfo.value
    
    // 基于设备类型的推荐
    if (device.type === 'mobile') {
      recommended.enableParticleEffects = false
      recommended.imageQuality = 'medium'
      recommended.maxConcurrentRequests = 3
    }
    
    // 基于性能等级的推荐
    if (device.performanceLevel === 'low') {
      recommended.enableAnimations = false
      recommended.enableComplexVisualizations = false
      recommended.imageQuality = 'low'
    }
    
    return recommended
  }
  
  // 导出性能报告
  exportPerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      deviceInfo: this.deviceInfo.value,
      currentMetrics: this.performanceMetrics,
      currentConfig: this.adaptationConfig,
      adaptationHistory: this.adaptationHistory,
      recommendations: this.getRecommendedConfig()
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `device-performance-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// 创建全局实例
export const deviceAdaptationService = DeviceAdaptationService.getInstance()