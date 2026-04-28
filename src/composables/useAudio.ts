import { ref } from 'vue'
import { Howl } from 'howler'
import { useGameStore } from '@/stores/game'

// 播放模式类型
type LoopMode = 'single' | 'multi'

// 配置类型
interface LoopConfig {
  sunny: Record<string, LoopMode>
  rainy: Record<string, LoopMode>
  snowy: Record<string, LoopMode>
}

// 全局状态（单例）
let currentHowl: Howl | null = null
let loopConfig: LoopConfig | null = null
let isFirstPlay = true
let isLooping = false
let currentHour: number = 0
let currentWeather: string = ''

// 加载循环配置
const loadLoopConfig = async (): Promise<LoopConfig> => {
  if (loopConfig) return loopConfig

  try {
    const response = await fetch('/audio/audio-loop-config.json')
    loopConfig = await response.json()
    return loopConfig!
  } catch {
    const defaultConfig: LoopConfig = {
      sunny: {},
      rainy: {},
      snowy: {},
    }
    for (let h = 0; h < 24; h++) {
      const hourStr = h.toString().padStart(2, '0')
      defaultConfig.sunny[hourStr] = 'single'
      defaultConfig.rainy[hourStr] = 'single'
      defaultConfig.snowy[hourStr] = 'single'
    }
    loopConfig = defaultConfig
    return defaultConfig
  }
}

// 获取当前时段的播放模式
const getLoopMode = (hour: number, weather: string): LoopMode => {
  if (!loopConfig) return 'single'
  const hourStr = hour.toString().padStart(2, '0')
  const weatherConfig = loopConfig[weather as keyof LoopConfig]
  return weatherConfig?.[hourStr] || 'single'
}

// 获取音频路径
const getAudioPath = (hour: number, weather: string, isLoop: boolean = false): string => {
  const hourStr = hour.toString().padStart(2, '0')
  const suffix = isLoop ? '_loop' : ''
  return `/audio/${weather}/${hourStr}${suffix}.mp3`
}

// 全局播放状态
const isLoaded = ref(false)

// 停止音频
const stopAudio = () => {
  if (currentHowl) {
    currentHowl.stop()
    currentHowl.unload()
    currentHowl = null
  }
  isFirstPlay = true
  isLooping = false
}

// 播放循环音频（多音频模式的B片段）
const playLoopAudio = (hour: number, weather: string, volume: number) => {
  if (currentHowl) {
    currentHowl.stop()
    currentHowl.unload()
  }

  isLooping = true
  const path = getAudioPath(hour, weather, true)

  currentHowl = new Howl({
    src: [path],
    loop: true,
    volume: volume,
    html5: true,
    onloaderror: () => {
      fallbackToSingleLoop(hour, weather, volume)
    },
    onplayerror: () => {
      fallbackToSingleLoop(hour, weather, volume)
    },
  })

  currentHowl.play()
}

// 回退到单音频循环（B文件不存在时）
const fallbackToSingleLoop = (hour: number, weather: string, volume: number) => {
  if (currentHowl) {
    currentHowl.stop()
    currentHowl.unload()
  }

  const path = getAudioPath(hour, weather, false)

  currentHowl = new Howl({
    src: [path],
    loop: true,
    volume: volume,
    html5: true,
  })

  currentHowl.play()
}

// 播放音频
const playAudio = async (hour: number, weather: string, volume: number) => {
  stopAudio()

  await loadLoopConfig()
  const mode = getLoopMode(hour, weather)

  isFirstPlay = true
  currentHour = hour
  currentWeather = weather

  const path = getAudioPath(hour, weather, false)

  currentHowl = new Howl({
    src: [path],
    loop: mode === 'single',
    volume: volume,
    html5: true,
    onload: () => {
      isLoaded.value = true
    },
    onplayerror: () => {
      const store = useGameStore()
      store.setPlaying(false)
    },
    onend: () => {
      if (mode === 'multi' && isFirstPlay && !isLooping) {
        const store = useGameStore()
        if (store.isPlaying) {
          isFirstPlay = false
          playLoopAudio(currentHour, currentWeather, volume)
        }
      }
    },
  })

  currentHowl.play()
}

// 设置音量
const setVolume = (volume: number) => {
  if (currentHowl) {
    currentHowl.volume(volume)
  }
}

// 获取当前播放模式
const getCurrentMode = (hour: number, weather: string): LoopMode => {
  return getLoopMode(hour, weather)
}

// 导出单例接口
export function useAudio() {
  const store = useGameStore()

  const _playAudio = async (hour: number, weather: string) => {
    await playAudio(hour, weather, store.volume)
  }

  const _setVolume = (volume: number) => {
    store.setVolume(volume)
    setVolume(volume)
  }

  return {
    isLoaded,
    playAudio: _playAudio,
    stopAudio,
    setVolume: _setVolume,
    getCurrentMode,
  }
}
