import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

export type MessageSchema = typeof zhCN

const savedLocale = (localStorage.getItem('locale') as 'zh-CN' | 'en-US') || 'zh-CN'

export const i18n = createI18n<[MessageSchema], 'zh-CN' | 'en-US'>({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export function setLocale(locale: 'zh-CN' | 'en-US') {
  ;(i18n.global.locale as unknown as { value: string }).value = locale
  localStorage.setItem('locale', locale)
}

export function getLocale(): 'zh-CN' | 'en-US' {
  return (i18n.global.locale as unknown as { value: string }).value as 'zh-CN' | 'en-US'
}
