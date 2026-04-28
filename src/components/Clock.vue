<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

let intervalId: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="clock">
    <div class="clock__time">{{ currentTime }}</div>
  </div>
</template>

<style scoped>
.clock {
  text-align: center;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  cursor: default;
}

.clock__time {
  font-size: 5.5rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  font-family: var(--animal-font);
}

@media (max-width: 768px) {
  .clock__time {
    font-size: 4rem;
  }
}
</style>
