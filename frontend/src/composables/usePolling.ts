import { ref, onUnmounted, readonly } from 'vue'

export interface PollingOptions {
  interval?: number // valor em milissegundos
  immediate?: boolean
  enabled?: boolean
}

export function usePolling(
  callback: () => void | Promise<void>,
  options: PollingOptions = {}
) {
  const {
    interval = 5000, 
    immediate = true,
    enabled = true
  } = options

  const isActive = ref(enabled)
  const isRunning = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const start = () => {
    if (!isActive.value || isRunning.value) return
    
    isRunning.value = true
    
    const poll = async () => {
      if (!isActive.value) {
        isRunning.value = false
        return
      }
      
      try {
        await callback()
      } catch (error) {
        console.error('Polling error:', error)
      }
      
      if (isActive.value) {
        timeoutId = setTimeout(poll, interval)
      } else {
        isRunning.value = false
      }
    }
    
    if (immediate) {
      poll()
    } else {
      timeoutId = setTimeout(poll, interval)
    }
  }

  const stop = () => {
    isActive.value = false
    isRunning.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const pause = () => {
    isActive.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    isRunning.value = false
  }

  const resume = () => {
    isActive.value = true
    start()
  }

  const toggle = () => {
    if (isActive.value) {
      pause()
    } else {
      resume()
    }
  }

  onUnmounted(() => {
    stop()
  })

  if (enabled) {
    start()
  }

  return {
    isActive: readonly(isActive),
    isRunning: readonly(isRunning),
    start,
    stop,
    pause,
    resume,
    toggle
  }
}