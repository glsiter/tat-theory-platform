import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  pixelRatio: number
  touchSupport: boolean
  performanceLevel: 'low' | 'medium' | 'high'
}

export interface ResponsiveBreakpoints {
  mobile: number
  tablet: number
  desktop: number
  wide: number
}

const defaultBreakpoints: ResponsiveBreakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280
}

export function useResponsive(breakpoints: ResponsiveBreakpoints = defaultBreakpoints) {
  const windowWidth = ref(0)
  const windowHeight = ref(0)
  const pixelRatio = ref(1)
  const touchSupport = ref(false)

  // 设备类型检测
  const deviceType = computed<DeviceInfo['type']>(() => {
    if (windowWidth.value < breakpoints.tablet) return 'mobile'
    if (windowWidth.value < breakpoints.desktop) return 'tablet'
    return 'desktop'
  })

  // 屏幕方向检测
  const orientation = computed<DeviceInfo['orientation']>(() => {
    return windowWidth.value > windowHeight.value ? 'landscape' : 'portrait'
  })

  // 性能等级评估
  const performanceLevel = computed<DeviceInfo['performanceLevel']>(() => {
    const cores = navigator.hardwareConcurrency || 4
    const memory = (navigator as any).deviceMemory || 4
    
    if (cores >= 8 && memory >= 8) return 'high'
    if (cores >= 4 && memory >= 4) return 'medium'
    return 'low'
  })

  // 设备信息
  const deviceInfo = computed<DeviceInfo>(() => ({
    type: deviceType.value,
    width: windowWidth.value,
    height: windowHeight.value,
    orientation: orientation.value,
    pixelRatio: pixelRatio.value,
    touchSupport: touchSupport.value,
    performanceLevel: performanceLevel.value
  }))

  // 响应式断点检测
  const isMobile = computed(() => windowWidth.value < breakpoints.tablet)
  const isTablet = computed(() => 
    windowWidth.value >= breakpoints.tablet && windowWidth.value < breakpoints.desktop
  )
  const isDesktop = computed(() => windowWidth.value >= breakpoints.desktop)
  const isWide = computed(() => windowWidth.value >= breakpoints.wide)

  // 更新窗口尺寸
  const updateWindowSize = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    pixelRatio.value = window.devicePixelRatio || 1
    touchSupport.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  // 防抖处理
  let resizeTimer: number | null = null
  const handleResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(updateWindowSize, 100)
  }

  onMounted(() => {
    updateWindowSize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', updateWindowSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', updateWindowSize)
    if (resizeTimer) clearTimeout(resizeTimer)
  })

  return {
    windowWidth,
    windowHeight,
    deviceType,
    orientation,
    deviceInfo,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    performanceLevel
  }
}