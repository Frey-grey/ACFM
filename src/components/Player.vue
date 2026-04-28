<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useAudio } from '@/composables/useAudio'

import VolumeHighIcon from '@/assets/img/volume-high.svg'
import VolumeLowIcon from '@/assets/img/volume-low.svg'
import VolumeMuteIcon from '@/assets/img/volume-mute.svg'

const store = useGameStore()
const { playAudio, stopAudio, setVolume: setAudioVolume } = useAudio()

const isMuted = ref(false)
const previousVolume = ref(store.volume)

const volumeIcon = computed(() => {
  if (isMuted.value || store.volume === 0) return VolumeMuteIcon
  if (store.volume < 0.5) return VolumeLowIcon
  return VolumeHighIcon
})

const togglePlay = () => {
  if (store.isPlaying) {
    stopAudio()
    store.setPlaying(false)
  } else {
    store.setPlaying(true)
  }
}

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const volume = parseFloat(target.value)
  store.setVolume(volume)
  setAudioVolume(volume)
  isMuted.value = volume === 0
}

const toggleMute = () => {
  if (isMuted.value) {
    const newVolume = previousVolume.value || 0.7
    store.setVolume(newVolume)
    setAudioVolume(newVolume)
    isMuted.value = false
  } else {
    previousVolume.value = store.volume
    store.setVolume(0)
    setAudioVolume(0)
    isMuted.value = true
  }
}

// 只在这里统一处理播放状态变化
watch(
  () => store.isPlaying,
  (playing) => {
    if (playing) {
      playAudio(store.currentHour, store.effectiveWeather)
    } else {
      stopAudio()
    }
  }
)

// 监听天气变化，重新播放
watch(
  () => store.effectiveWeather,
  () => {
    if (store.isPlaying) {
      playAudio(store.currentHour, store.effectiveWeather)
    }
  }
)
</script>

<template>
  <div class="player">
    <button class="player__play" @click.stop="togglePlay">
      <span v-if="store.isPlaying">❚❚</span>
      <span v-else>▶</span>
    </button>

    <div class="player__volume">
      <button class="player__mute" @click.stop="toggleMute">
        <img :src="volumeIcon" alt="volume" />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="store.volume"
        @input="handleVolumeChange"
        class="player__slider"
      />
    </div>
  </div>
</template>

<style scoped>
.player {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 3rem;
  background: rgb(247, 243, 223);
  border-radius: 50px;
  box-shadow: 0 3px 10px rgba(61, 52, 40, 0.1);
}

.player__play {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: #f8f8f0;
  color: #794f27;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 0 0 #bdaea0;
}

.player__play:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 0 0 #bdaea0;
}

.player__play:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #bdaea0;
}

.player__volume {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.player__mute {
  background: #f8f8f0;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 0 0 #bdaea0;
}

.player__mute img {
  width: 28px;
  height: 28px;
}

.player__mute:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 #bdaea0;
}

.player__mute:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #bdaea0;
}

.player__slider {
  width: 140px;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #d4c9b4;
  border-radius: 4px;
  cursor: pointer;
}

.player__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f8f8f0;
  border: 2px solid #c4b89e;
  cursor: pointer;
  box-shadow: 0 2px 0 0 #bdaea0;
}

@media (max-width: 768px) {
  .player {
    padding: 1rem 2rem;
  }

  .player__play {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .player__slider {
    width: 100px;
  }
}
</style>
