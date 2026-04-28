<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocation } from '@/composables/useLocation'

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { isLoading, requestLocation } = useLocation()

const handleAllowLocation = async () => {
  await requestLocation()
  emit('close')
}

const handleSkip = () => {
  emit('close')
}
</script>

<template>
  <div class="welcome-overlay">
    <div class="welcome">
      <h1 class="welcome__title">{{ t('welcome.title') }}</h1>
      <p class="welcome__description">{{ t('welcome.description') }}</p>

      <div class="welcome__actions">
        <p class="welcome__hint">{{ t('welcome.locationHint') }}</p>
        <button
          class="welcome__button welcome__button--primary"
          @click="handleAllowLocation"
          :disabled="isLoading"
        >
          {{ isLoading ? t('common.loading') : t('welcome.allowLocation') }}
        </button>
        <button
          class="welcome__button welcome__button--secondary"
          @click="handleSkip"
        >
          {{ t('welcome.skipLocation') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: animal-fade-in 0.25s ease;
}

@keyframes animal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.welcome {
  background: rgb(247, 243, 223);
  border-radius: 24px;
  padding: 3rem;
  max-width: 450px;
  width: 90%;
  text-align: center;
  color: #725d42;
  box-shadow: 0 8px 24px rgba(61, 52, 40, 0.14);
  animation: animal-zoom-in 0.3s ease;
}

@keyframes animal-zoom-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.welcome__title {
  font-size: 2.25rem;
  margin-bottom: 1.25rem;
  color: #794f27;
  font-weight: 700;
}

.welcome__description {
  font-size: 1.125rem;
  margin-bottom: 2.25rem;
  color: #8a7b66;
  line-height: 1.6;
}

.welcome__actions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.welcome__hint {
  font-size: 1rem;
  color: #9f927d;
}

.welcome__button {
  padding: 1.125rem 2.25rem;
  border-radius: 50px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.welcome__button--primary {
  background: #f8f8f0;
  color: #794f27;
  box-shadow: 0 5px 0 0 #bdaea0;
}

.welcome__button--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 0 0 #bdaea0;
}

.welcome__button--primary:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #bdaea0;
}

.welcome__button--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.welcome__button--secondary {
  background: transparent;
  color: #9f927d;
  border-color: transparent;
  box-shadow: none;
}

.welcome__button--secondary:hover {
  color: #794f27;
  background: rgba(114, 93, 66, 0.08);
}
</style>
