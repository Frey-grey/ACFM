<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

const gradientClasses = computed(() => {
  const period = store.timePeriod
  return {
    [`scene--${period}`]: true,
  }
})

const weatherEffects = computed(() => {
  const weather = store.effectiveWeather
  return {
    'weather--rain': weather === 'rainy',
    'weather--snow': weather === 'snowy',
  }
})
</script>

<template>
  <div class="scene" :class="[gradientClasses, weatherEffects]">
    <!-- 天空层 -->
    <div class="scene__sky">
      <!-- 星星 (仅夜晚) -->
      <div class="stars" v-if="['midnight', 'night', 'evening'].includes(store.timePeriod)">
        <span v-for="n in 30" :key="n" class="star"
          :style="{
            '--delay': `${Math.random() * 5}s`,
            'top': `${Math.random() * 50}%`,
            'left': `${Math.random() * 100}%`
          }"></span>
      </div>
    </div>

    <!-- 地面层 (动森标志性的大弧线) -->
    <div class="scene__ground">
      <div class="grass-texture">
        <span v-for="n in 80" :key="n" class="grass-triangle"
          :style="{
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--size': `${8 + Math.random() * 16}px`,
            '--rotate': `${Math.random() * 360}deg`,
            '--color': Math.random() > 0.5 ? '#6ab03a' : '#82c44a'
          }"></span>
      </div>
    </div>

    <!-- 天气层 -->
    <div class="weather-layer">
      <div class="rain-container" v-if="store.effectiveWeather === 'rainy'">
        <span v-for="n in 60" :key="n" class="raindrop" :style="{ '--delay': `${Math.random() * 2}s`, '--x': `${Math.random() * 100}%` }"></span>
      </div>
      <div class="snow-container" v-if="store.effectiveWeather === 'snowy'">
        <span v-for="n in 50" :key="n" class="snowflake" :style="{ '--delay': `${Math.random() * 12}s`, '--x': `${Math.random() * 100}%`, '--drift': `${Math.random() * 40 - 20}px` }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 核心场景控制 */
.scene {
  position: fixed;
  inset: 0;
  overflow: hidden;
  transition: all 3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

/* --- 动森色系表 --- */
.scene--midnight { background: linear-gradient(180deg, #1e2a4a 0%, #3d4a7a 100%); }
.scene--dawn { background: linear-gradient(180deg, #ff9d76 0%, #ffedbc 100%); }
.scene--morning { background: linear-gradient(180deg, #88d1f1 0%, #b4e9ff 100%); }
.scene--noon { background: linear-gradient(180deg, #4fbcf0 0%, #8be4ff 100%); }
.scene--afternoon { background: linear-gradient(180deg, #78c2f3 0%, #fbd1b7 100%); }
.scene--evening { background: linear-gradient(180deg, #fb8c6f 0%, #5a5d91 100%); }
.scene--night { background: linear-gradient(180deg, #2c3e50 0%, #4b6cb7 100%); }

/* 雨天天空变暗 */
.weather--rain { filter: brightness(0.8) saturate(0.8); }

/* --- 天空元素 --- */
.scene__sky {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* --- 地面设计 --- */
.scene__ground {
  position: absolute;
  bottom: -30vh;
  left: 0;
  width: 100%;
  height: 50vh;
  background: #76c043; /* 动森草地绿 */
  border-radius: 50% 50% 0 0 / 30% 30% 0 0; /* 圆弧地平线 */
  z-index: 3;
  transition: background 3s ease;
  overflow: hidden;
}

/* 晚上的草地变深 */
.scene--midnight .scene__ground, .scene--night .scene__ground { background: #3d6a3d; }
.scene--evening .scene__ground { background: #5a8c3d; }

/* 动森风格三角纹理 */
.grass-texture {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.grass-triangle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: 0;
  height: 0;
  border-left: calc(var(--size) * 0.5) solid transparent;
  border-right: calc(var(--size) * 0.5) solid transparent;
  border-bottom: var(--size) solid var(--color);
  transform: rotate(var(--rotate));
  opacity: 0.4;
}

/* --- 星星 --- */
.star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: twinkle 4s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* --- 雨雪效果 (更柔和) --- */
.rain-container,
.snow-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.raindrop {
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.5));
  animation: rain 1.2s linear infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: -30px;
  z-index: 4;
}

.snowflake {
  position: absolute;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 100%);
  border-radius: 50%;
  animation: snow 12s ease-in-out infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: -30px;
  opacity: 0.85;
  z-index: 4;
  filter: blur(0.5px);
}

@keyframes rain {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 30px));
    opacity: 0;
  }
}

@keyframes snow {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 0.85;
  }
  25% {
    transform: translateY(25vh) translateX(var(--drift)) rotate(90deg);
  }
  50% {
    transform: translateY(50vh) translateX(calc(var(--drift) * -1)) rotate(180deg);
  }
  75% {
    transform: translateY(75vh) translateX(var(--drift)) rotate(270deg);
  }
  95% {
    opacity: 0.85;
  }
  100% {
    transform: translateY(calc(100vh + 30px)) translateX(0) rotate(360deg);
    opacity: 0;
  }
}
</style>