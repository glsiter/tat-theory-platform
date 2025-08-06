import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface TouchGestureOptions {
  threshold?: number
  velocity?: number
  preventScroll?: boolean
}

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down'
  distance: number
  velocity: number
  duration: number
}

export interface PinchGesture {
  scale: number
  center: { x: number; y: number }
  velocity: number
}

export function useTouchGestures(
  target: Ref<HTMLElement | null>,
  options: TouchGestureOptions = {}
) {
  const {
    threshold = 50,
    velocity = 0.3,
    preventScroll = false
  } = options

  const isTouch = ref(false)
  const touchStart = ref<{ x: number; y: number; time: number } | null>(null)
  const touchCurrent = ref<{ x: number; y: number } | null>(null)

  // 滑动事件
  const onSwipe = ref<((gesture: SwipeDirection) => void) | null>(null)
  
  // 捏合事件
  const onPinch = ref<((gesture: PinchGesture) => void) | null>(null)
  
  // 长按事件
  const onLongPress = ref<((event: TouchEvent) => void) | null>(null)

  let longPressTimer: number | null = null
  let initialDistance = 0
  let initialScale = 1

  const handleTouchStart = (event: TouchEvent) => {
    if (preventScroll) {
      event.preventDefault()
    }

    isTouch.value = true
    const touch = event.touches[0]
    
    touchStart.value = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    touchCurrent.value = {
      x: touch.clientX,
      y: touch.clientY
    }

    // 多点触控检测
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      initialDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
    }

    // 长按检测
    longPressTimer = window.setTimeout(() => {
      if (onLongPress.value && isTouch.value) {
        onLongPress.value(event)
      }
    }, 500)
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!isTouch.value || !touchStart.value) return

    if (preventScroll) {
      event.preventDefault()
    }

    const touch = event.touches[0]
    touchCurrent.value = {
      x: touch.clientX,
      y: touch.clientY
    }

    // 捏合手势检测
    if (event.touches.length === 2 && onPinch.value) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )

      const scale = currentDistance / initialDistance
      const center = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      }

      onPinch.value({
        scale: scale * initialScale,
        center,
        velocity: Math.abs(scale - 1)
      })
    }

    // 清除长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (!isTouch.value || !touchStart.value || !touchCurrent.value) return

    const deltaX = touchCurrent.value.x - touchStart.value.x
    const deltaY = touchCurrent.value.y - touchStart.value.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const duration = Date.now() - touchStart.value.time
    const gestureVelocity = distance / duration

    // 清除长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }

    // 滑动手势检测
    if (distance > threshold && gestureVelocity > velocity && onSwipe.value) {
      let direction: SwipeDirection['direction']
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left'
      } else {
        direction = deltaY > 0 ? 'down' : 'up'
      }

      onSwipe.value({
        direction,
        distance,
        velocity: gestureVelocity,
        duration
      })
    }

    // 重置状态
    isTouch.value = false
    touchStart.value = null
    touchCurrent.value = null
    initialScale = 1
  }

  onMounted(() => {
    const element = target.value
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll })
    element.addEventListener('touchend', handleTouchEnd)
  })

  onUnmounted(() => {
    const element = target.value
    if (!element) return

    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)

    if (longPressTimer) {
      clearTimeout(longPressTimer)
    }
  })

  return {
    isTouch,
    onSwipe,
    onPinch,
    onLongPress
  }
}