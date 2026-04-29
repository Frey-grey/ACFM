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
let isTransitioning = false
let pendingHourChange: number | null = null

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
const isPreloaded = ref(false)
const preloadedHowls: Map<string, Howl> = new Map()

// 预加载音频（当前时段 + 下一时段）
const preloadAudio = async (hour: number, weather: string): Promise<void> => {
  await loadLoopConfig()

  const hoursToPreload = [hour, (hour + 1) % 24]
  const toLoad: Array<{ hour: number; isLoop: boolean }> = []

  // 收集需要预加载的音频
  for (const h of hoursToPreload) {
    const mode = getLoopMode(h, weather)
    toLoad.push({ hour: h, isLoop: false })
    if (mode === 'multi') {
      toLoad.push({ hour: h, isLoop: true })
    }
  }

  // 预加载所有音频
  for (const { hour: h, isLoop } of toLoad) {
    const path = getAudioPath(h, weather, isLoop)
    const key = `${h}-${weather}-${isLoop ? 'loop' : 'main'}`

    if (!preloadedHowls.has(key)) {
      const howl = new Howl({
        src: [path],
        preload: true,
        html5: true,
        volume: 0,
      })
      preloadedHowls.set(key, howl)
    }
  }

  isPreloaded.value = true
}

// 获取预加载的 Howl 实例
const getPreloadedHowl = (hour: number, weather: string, isLoop: boolean): Howl | null => {
  const key = `${hour}-${weather}-${isLoop ? 'loop' : 'main'}`
  return preloadedHowls.get(key) || null
}

// 清理过期的预加载音频（保留当前和下一时段）
const cleanupPreloadedAudio = (currentHour: number, weather: string) => {
  const keepKeys = new Set<string>()
  const hoursToKeep = [currentHour, (currentHour + 1) % 24]

  for (const h of hoursToKeep) {
    const mode = getLoopMode(h, weather)
    keepKeys.add(`${h}-${weather}-main`)
    if (mode === 'multi') {
      keepKeys.add(`${h}-${weather}-loop`)
    }
  }

  for (const [key, howl] of preloadedHowls) {
    if (!keepKeys.has(key)) {
      howl.unload()
      preloadedHowls.delete(key)
    }
  }
}

// 停止音频
const stopAudio = () => {
  if (currentHowl) {
    currentHowl.stop()
    currentHowl.unload()
    currentHowl = null
  }
  isFirstPlay = true
  isLooping = false
  isTransitioning = false
  pendingHourChange = null
}

// 淡出音频（4秒）
const fadeOutAudio = (duration: number = 4000): Promise<void> => {
  return new Promise((resolve) => {
    if (!currentHowl) {
      resolve()
      return
    }

    const currentVolume = currentHowl.volume()
    currentHowl.fade(currentVolume, 0, duration)

    setTimeout(() => {
      if (currentHowl) {
        currentHowl.stop()
        currentHowl.unload()
        currentHowl = null
      }
      resolve()
    }, duration)
  })
}

// 处理时段变化过渡
const handleHourTransition = async (newHour: number, weather: string) => {
  const store = useGameStore()

  if (!store.isPlaying || isTransitioning) {
    return
  }

  isTransitioning = true
  pendingHourChange = newHour

  // 淡出当前音频（4秒）
  await fadeOutAudio(4000)

  // 等待1秒
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 播放新时段音频
  isTransitioning = false
  pendingHourChange = null
  currentHour = newHour
  currentWeather = weather

  await playAudio(newHour, weather, store.volume)
}

// 播放循环音频（多音频模式的B片段）
const playLoopAudio = (hour: number, weather: string, volume: number) => {
  if (currentHowl) {
    currentHowl.stop()
    currentHowl.unload()
  }

  isLooping = true

  // 尝试使用预加载的音频
  const preloaded = getPreloadedHowl(hour, weather, true)
  if (preloaded) {
    preloaded.volume(volume)
    preloaded.loop(true)
    currentHowl = preloaded
    currentHowl.play()
    return
  }

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

  // 尝试使用预加载的音频
  const preloaded = getPreloadedHowl(hour, weather, false)
  if (preloaded) {
    preloaded.volume(volume)
    preloaded.loop(mode === 'single')
    currentHowl = preloaded
    isLoaded.value = true

    currentHowl.on('end', () => {
      if (mode === 'multi' && isFirstPlay && !isLooping) {
        const store = useGameStore()
        if (store.isPlaying) {
          isFirstPlay = false
          playLoopAudio(currentHour, currentWeather, volume)
        }
      }
    })

    currentHowl.play()

    // 预加载下一时段并清理过期音频
    preloadAudio(hour, weather)
    cleanupPreloadedAudio(hour, weather)
    return
  }

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

  // 预加载下一时段并清理过期音频
  preloadAudio(hour, weather)
  cleanupPreloadedAudio(hour, weather)
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
    isPreloaded,
    playAudio: _playAudio,
    stopAudio,
    setVolume: _setVolume,
    getCurrentMode,
    preloadAudio,
    handleHourTransition,
  }
}
