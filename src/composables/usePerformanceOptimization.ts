import { ref, computed, onMounted } from 'vue'
import { useResponsive } from './useResponsive'

export interface PerformanceConfig {
  enableAnimations: boolean
  enableParticles: boolean
  enableComplexVisualizations: boolean
  maxConcurrentRequests: number
  imageQuality: 'low' | 'medium' | 'high'
  enableLazyLoading: boolean
}

export function usePerformanceOptimization() {
  const { deviceInfo, performanceLevel } = useResponsive()
  
  const connectionSpeed = ref<'slow' | 'medium' | 'fast'>('medium')
  const memoryUsage = ref(0)
  const cpuUsage = ref(0)

  // 基于设备性能的配置
  const performanceConfig = computed<PerformanceConfig>(() => {
    const isLowPerformance = performanceLevel.value === 'low'
    const isMobile = deviceInfo.value.type === 'mobile'
    
    return {
      enableAnimations: !isLowPerformance,
      enableParticles: performanceLevel.value === 'high' && !isMobile,
      enableComplexVisualizations: performanceLevel.value !== 'low',
      maxConcurrentRequests: isLowPerformance ? 2 : isMobile ? 4 : 6,
      imageQuality: isLowPerformance ? 'low' : isMobile ? 'medium' : 'high',
      enableLazyLoading: true
    }
  })

  // 检测网络连接速度
  const detectConnectionSpeed = () => {
    const connection = (navigator as any).connection
    if (connection) {
      const effectiveType = connection.effectiveType
      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          connectionSpeed.value = 'slow'
          break
        case '3g':
          connectionSpeed.value = 'medium'
          break
        case '4g':
        default:
          connectionSpeed.value = 'fast'
          break
      }
    }
  }

  // 监控内存使用情况
  const monitorMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      memoryUsage.value = memory.usedJSHeapSize / memory.jsHeapSizeLimit
    }
  }

  // 自适应图片质量
  const getOptimalImageSrc = (baseSrc: string, sizes: string[] = ['small', 'medium', 'large']) => {
    const quality = performanceConfig.value.imageQuality
    const sizeMap = {
      low: sizes[0] || 'small',
      medium: sizes[1] || 'medium', 
      high: sizes[2] || 'large'
    }
    
    const selectedSize = sizeMap[quality]
    return baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, `_${selectedSize}.$1`)
  }

  // 延迟加载管理
  const createLazyLoader = () => {
    if (!performanceConfig.value.enableLazyLoading) return null

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )

    return observer
  }

  // 动画降级
  const shouldUseReducedMotion = computed(() => {
    return !performanceConfig.value.enableAnimations || 
           window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  // 功能降级建议
  const getFeatureDegradation = () => {
    const suggestions: string[] = []
    
    if (performanceLevel.value === 'low') {
      suggestions.push('禁用复杂动画')
      suggestions.push('减少并发请求')
      suggestions.push('使用低质量图片')
    }
    
    if (connectionSpeed.value === 'slow') {
      suggestions.push('启用数据压缩')
      suggestions.push('减少资源加载')
      suggestions.push('优先加载关键内容')
    }
    
    if (deviceInfo.value.type === 'mobile') {
      suggestions.push('简化交互界面')
      suggestions.push('优化触摸体验')
      suggestions.push('减少内存使用')
    }
    
    return suggestions
  }

  // 性能监控
  const startPerformanceMonitoring = () => {
    // 监控FPS
    let lastTime = performance.now()
    let frameCount = 0
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        // 如果FPS过低，建议降级
        if (fps < 30 && performanceConfig.value.enableAnimations) {
          console.warn('Low FPS detected, consider disabling animations')
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }

  onMounted(() => {
    detectConnectionSpeed()
    monitorMemoryUsage()
    startPerformanceMonitoring()
    
    // 监听网络变化
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', detectConnectionSpeed)
    }
    
    // 定期监控内存
    setInterval(monitorMemoryUsage, 5000)
  })

  return {
    performanceConfig,
    connectionSpeed,
    memoryUsage,
    cpuUsage,
    shouldUseReducedMotion,
    getOptimalImageSrc,
    createLazyLoader,
    getFeatureDegradation,
    detectConnectionSpeed,
    monitorMemoryUsage
  }
}