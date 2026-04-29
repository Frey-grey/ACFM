import { onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useAudio } from '@/composables/useAudio'

export function useTime() {
  const store = useGameStore()
  const { handleHourTransition } = useAudio()
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

  // 监听时间变化，触发音乐过渡
  watch(
    () => store.currentHour,
    (newHour, oldHour) => {
      if (oldHour !== undefined && newHour !== oldHour && store.isPlaying) {
        handleHourTransition(newHour, store.effectiveWeather)
      }
    }
  )

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
