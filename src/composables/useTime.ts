import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'

export function useTime() {
  const store = useGameStore()
  let intervalId: ReturnType<typeof setInterval> | null = null

  const updateHour = () => {
    // 如果时间被手动设置，不自动更新
    if (store.isTimeManuallySet) {
      return
    }

    const now = new Date()
    const currentHour = now.getHours()

    if (store.currentHour !== currentHour) {
      store.setCurrentHour(currentHour)
    }
  }

  const startWatching = () => {
    updateHour()
    intervalId = setInterval(updateHour, 1000)
  }

  const stopWatching = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onMounted(() => {
    startWatching()
  })

  onUnmounted(() => {
    stopWatching()
  })

  return {
    startWatching,
    stopWatching,
  }
}
