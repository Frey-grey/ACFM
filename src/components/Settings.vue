<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, getLocale } from '@/i18n'

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const currentLocale = ref(getLocale())

const changeLanguage = (locale: 'zh-CN' | 'en-US') => {
  setLocale(locale)
  currentLocale.value = locale
}
</script>

<template>
  <div class="settings-overlay" @click.self="emit('close')">
    <div class="settings">
      <button class="settings__close" @click="emit('close')">×</button>
      <h2 class="settings__title">{{ t('settings.title') }}</h2>

      <div class="settings__section">
        <label class="settings__label">{{ t('settings.language') }}</label>
        <div class="settings__buttons">
          <button
            :class="{ active: currentLocale === 'zh-CN' }"
            @click="changeLanguage('zh-CN')"
          >
            中文
          </button>
          <button
            :class="{ active: currentLocale === 'en-US' }"
            @click="changeLanguage('en-US')"
          >
            English
          </button>
        </div>
      </div>

      <div class="settings__section">
        <h3 class="settings__label">{{ t('about.title') }}</h3>
        <p class="settings__description" v-html="t('about.description').replace('\n', '<br>')"></p>
        <p class="settings__credit">{{ t('about.credit') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: animal-fade-in 0.25s ease;
}

@keyframes animal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.settings {
  background: rgb(247, 243, 223);
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 450px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  color: #725d42;
  box-shadow: 0 8px 24px rgba(61, 52, 40, 0.14);
  animation: animal-zoom-in 0.3s ease;
}

@keyframes animal-zoom-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.settings__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: rgba(114, 93, 66, 0.6);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.settings__close:hover {
  background: rgba(114, 93, 66, 0.1);
  color: rgba(114, 93, 66, 1);
}

.settings__title {
  font-size: 1.75rem;
  margin-bottom: 1.75rem;
  color: #794f27;
  font-weight: 700;
  cursor: default;
}

.settings__section {
  margin-bottom: 1.75rem;
}

.settings__label {
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: block;
  font-size: 1.1rem;
  color: #794f27;
  cursor: default;
}

.settings__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.settings__buttons button {
  padding: 0.625rem 1.25rem;
  border: 2px solid #c4b89e;
  border-radius: 50px;
  background: #f8f8f0;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: #794f27;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 3px 0 0 #bdaea0;
}

.settings__buttons button:hover:not(.active) {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 #bdaea0;
  border-color: #a89878;
}

.settings__buttons button:active:not(.active) {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #bdaea0;
}

.settings__buttons button.active {
  background: #ffcc00;
  border-color: #ffcc00;
  color: #794f27;
  box-shadow: 0 3px 0 0 #e0b800;
}

.settings__buttons button.active:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 #e0b800;
}

.settings__description {
  font-size: 1rem;
  color: #725d42;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.settings__credit {
  font-size: 0.95rem;
  color: #8a7b66;
  line-height: 1.6;
}
</style>