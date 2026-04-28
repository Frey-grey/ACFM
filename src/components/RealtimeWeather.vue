<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/game'
import { useLocation } from '@/composables/useLocation'

const { t } = useI18n()
const store = useGameStore()
const { requestLocation } = useLocation()

const showInfoTooltip = ref(false)

const handleToggle = async () => {
  if (store.isRealtimeWeather) {
    store.setRealtimeWeather(false)
  } else {
    const success = await requestLocation()
    if (success) {
      store.setRealtimeWeather(true)
      store.setWeatherOverride(null)
    }
  }
}

const showTooltip = () => {
  showInfoTooltip.value = true
}

const hideTooltip = () => {
  showInfoTooltip.value = false
}
</script>

<template>
  <div class="realtime-weather">
    <div class="realtime-weather__row">
      <label class="realtime-weather__label">
        <span class="realtime-weather__text">{{ t('weather.realtimeWeather') }}</span>
      </label>
      <div
        class="realtime-weather__info-wrapper"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
      >
        <button class="realtime-weather__info">
          <img src="@/assets/img/info-icon.svg" alt="info" />
        </button>
        <Transition name="fade">
          <div
            v-if="showInfoTooltip"
            class="realtime-weather__tooltip"
          >
            {{ t('weather.realtimeWeatherHint') }}
          </div>
        </Transition>
      </div>
      <input
        type="checkbox"
        class="realtime-weather__toggle"
        :checked="store.isRealtimeWeather"
        @change="handleToggle"
      />
    </div>
  </div>
</template>

<style scoped>
.realtime-weather {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  position: relative;
  background: rgb(247, 243, 223);
  border-radius: 50px;
  padding: 0 1.25rem;
  height: 62px;
  box-shadow: 0 5px 0 0 #bdaea0;
}

.realtime-weather__row {
  display: flex;
  align-items: center;
  height: 100%;
}

.realtime-weather__label {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: #794f27;
  font-size: 1.8rem;
  font-weight: 800;
  text-shadow: none;
}

.realtime-weather__info-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.realtime-weather__toggle {
  width: 52px;
  height: 30px;
  appearance: none;
  background: #d4c9b4;
  border: 2px solid #c4b89e;
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.15);
  outline: none;
}

.realtime-weather__toggle::before {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  width: 19px;
  height: 19px;
  background: #f8f8f0;
  border: 2px solid #c4b89e;
  border-radius: 50%;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 0 0 #bdaea0;
}

.realtime-weather__toggle:checked {
  background: #86d67a;
  border-color: #6fba2c;
  box-shadow: inset 0 2px 4px rgba(90, 158, 30, 0.2);
}

.realtime-weather__toggle:checked::before {
  left: calc(94% - 21px);
  border-color: #6fba2c;
  box-shadow: 0 2px 0 0 #5a9e1e;
}

.realtime-weather__text {
  white-space: nowrap;
}

.realtime-weather__info-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.realtime-weather__info {
  background: #f8f8f0;
  border: 2px solid transparent;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 0 0 #bdaea0;
}

.realtime-weather__info img {
  width: 20px;
  height: 20px;
}

.realtime-weather__info:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 #bdaea0;
}

.realtime-weather__info:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #bdaea0;
}

.realtime-weather__tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  color: #725d42;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 400;
  max-width: 320px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  line-height: 1.5;
}

.realtime-weather__tooltip::before {
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
