import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import type { WeatherType } from '@/types'

const WMO_TO_WEATHER: Record<number, WeatherType> = {
  0: 'sunny',
  1: 'sunny',
  2: 'sunny',
  3: 'sunny',
  45: 'sunny',
  48: 'sunny',
  51: 'rainy',
  53: 'rainy',
  55: 'rainy',
  56: 'rainy',
  57: 'rainy',
  61: 'rainy',
  63: 'rainy',
  65: 'rainy',
  66: 'rainy',
  67: 'rainy',
  71: 'snowy',
  73: 'snowy',
  75: 'snowy',
  77: 'snowy',
  80: 'rainy',
  81: 'rainy',
  82: 'rainy',
  85: 'snowy',
  86: 'snowy',
  95: 'rainy',
  96: 'rainy',
  99: 'rainy',
}

export function useWeather() {
  const store = useGameStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherType> => {
    isLoading.value = true
    error.value = null
    store.setLoading(true)

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()
      const weatherCode = data.current_weather?.weathercode ?? 0
      const weather = WMO_TO_WEATHER[weatherCode] ?? 'sunny'

      store.setWeather(weather)
      return weather
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      store.setError(error.value)
      return 'sunny'
    } finally {
      isLoading.value = false
      store.setLoading(false)
    }
  }

  return {
    isLoading,
    error,
    fetchWeather,
  }
}
