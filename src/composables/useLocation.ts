import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useWeather } from './useWeather'

export function useLocation() {
  const store = useGameStore()
  const { fetchWeather } = useWeather()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const requestLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported'
      return false
    }

    isLoading.value = true
    error.value = null

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          store.setLocation({ latitude, longitude })
          await fetchWeather(latitude, longitude)
          isLoading.value = false
          resolve(true)
        },
        (err) => {
          error.value = err.message
          isLoading.value = false
          resolve(false)
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      )
    })
  }

  return {
    isLoading,
    error,
    requestLocation,
  }
}
