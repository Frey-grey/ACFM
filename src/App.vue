<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTime } from '@/composables/useTime'

import Scene from '@/components/Scene.vue'
import Clock from '@/components/Clock.vue'
import Weather from '@/components/Weather.vue'
import Player from '@/components/Player.vue'
import Settings from '@/components/Settings.vue'
import Welcome from '@/components/Welcome.vue'
import RealtimeWeather from '@/components/RealtimeWeather.vue'

useTime()

const showWelcome = ref(false)
const showSettings = ref(false)

onMounted(() => {
  const hasVisited = localStorage.getItem('hasVisited')
  if (!hasVisited) {
    showWelcome.value = true
    localStorage.setItem('hasVisited', 'true')
  }
})
</script>

<template>
  <div class="app">
    <Scene />

    <div class="content">
      <header class="header">
        <div class="header__top">
          <div class="header__left">
            <button class="settings-btn" @click.stop="showSettings = true">
              <img src="@/assets/img/settings-icon.svg" alt="设置" />
            </button>
          </div>

          <div class="header__right">
            <RealtimeWeather />
            <Weather />
          </div>
        </div>

        <div class="header__center">
          <Clock />
        </div>
      </header>

      <main class="main">
        <Player />
      </main>
    </div>

    <Welcome v-if="showWelcome" @close="showWelcome = false" />
    <Settings v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<style>
@import './styles/variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--animal-font);
}

html, body {
  height: 100%;
}

#app {
  height: 100%;
}
</style>

<style scoped>
.app {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
}

.header__top {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.header__left {
  display: flex;
  justify-content: flex-start;
}

.header__center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 18vh;
}

.header__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.5rem;
}

.main {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex: 1;
  padding-bottom: 10vh;
}

.settings-btn {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: rgb(247, 243, 223);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 5px 0 0 #bdaea0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn img {
  width: 36px;
  height: 36px;
}

.settings-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 0 0 #bdaea0;
}

.settings-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #bdaea0;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  .header {
    padding-top: 1.5rem;
  }
}
</style>
