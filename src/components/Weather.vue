<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/game'
import type { WeatherType } from '@/types'

import SunnyIcon from '@/assets/img/weather-sunny.svg'
import RainyIcon from '@/assets/img/weather-rainy.svg'
import SnowyIcon from '@/assets/img/weather-snowy.svg'

const store = useGameStore()
const { t } = useI18n()

const showTooltip = ref(false)

const weatherIconSrc: Record<WeatherType, string> = {
  sunny: SunnyIcon,
  rainy: RainyIcon,
  snowy: SnowyIcon,
}

const currentWeatherIcon = computed(() => weatherIconSrc[store.effectiveWeather])

const toggleWeather = () => {
  const weathers: WeatherType[] = ['sunny', 'rainy', 'snowy']
  const currentIndex = weathers.indexOf(store.effectiveWeather)
  const nextIndex = (currentIndex + 1) % weathers.length

  if (store.isRealtimeWeather) {
    store.setRealtimeWeather(false)
  }

  store.setWeatherOverride(weathers[nextIndex])
}
</script>

<template>
  <div
    class="weather"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <button
      class="weather__icon"
      :class="{ 'weather__icon--disabled': store.isRealtimeWeather }"
      @click="toggleWeather"
    >
      <img :src="currentWeatherIcon" alt="weather" />
    </button>
    <Transition name="fade">
      <div v-if="showTooltip" class="weather__tooltip">
        {{ t('weather.clickToChangeWeather') }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.weather__icon {
  background: rgb(247, 243, 223);
  border: 2px solid transparent;
  border-radius: 50%;
  width: 62px;
  height: 62px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 5px 0 0 #bdaea0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather__icon img {
  width: 36px;
  height: 36px;
}

.weather__icon:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 0 0 #bdaea0;
}

.weather__icon:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #bdaea0;
}

.weather__icon--disabled {
  opacity: 0.5;
  cursor: pointer;
  box-shadow: 0 3px 0 0 #bdaea0;
}

.weather__icon--disabled:hover {
  opacity: 0.7;
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 #bdaea0;
}

.weather__tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #f8f8f0;
  color: #725d42;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 400;
  white-space: nowrap;
  box-shadow: 0 3px 10px rgba(61, 52, 40, 0.1);
  z-index: 100;
}

.weather__tooltip::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.95);
  transform: rotate(45deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
