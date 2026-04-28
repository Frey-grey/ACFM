import { defineStore } from 'pinia'
import type { WeatherType, LocationData } from '@/types'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentHour: new Date().getHours(),
    currentWeather: 'sunny' as WeatherType,
    isPlaying: false,
    volume: 0.7,
    location: null as LocationData | null,
    weatherOverride: null as WeatherType | null,
    isRealtimeWeather: false,
    isLoading: false,
    error: null as string | null,
    isTimeManuallySet: false,
  }),

  getters: {
    effectiveWeather: (state): WeatherType => {
      return state.weatherOverride ?? state.currentWeather
    },

    timePeriod: (state): string => {
      const hour = state.currentHour
      if (hour >= 0 && hour < 6) return 'midnight'
      if (hour >= 6 && hour < 8) return 'dawn'
      if (hour >= 8 && hour < 12) return 'morning'
      if (hour >= 12 && hour < 14) return 'noon'
      if (hour >= 14 && hour < 18) return 'afternoon'
      if (hour >= 18 && hour < 20) return 'evening'
      return 'night'
    },
  },

  actions: {
    setCurrentHour(hour: number) {
      this.currentHour = hour
      this.isTimeManuallySet = true
    },

    setWeather(weather: WeatherType) {
      this.currentWeather = weather
    },

    setPlaying(playing: boolean) {
      this.isPlaying = playing
    },

    setVolume(volume: number) {
      this.volume = Math.max(0, Math.min(1, volume))
    },

    setLocation(location: LocationData) {
      this.location = location
    },

    setWeatherOverride(weather: WeatherType | null) {
      this.weatherOverride = weather
    },

    setRealtimeWeather(enabled: boolean) {
      this.isRealtimeWeather = enabled
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setError(error: string | null) {
      this.error = error
    },
  },
})
