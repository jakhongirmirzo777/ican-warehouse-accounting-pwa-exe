import { nextTick, unref } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n, Composer } from 'vue-i18n'
import { useStorageService } from '@/plugins/storage-service'
import { APP_LANG_KEY } from '@/utils/constants'

const { $get, $set } = useStorageService()
export const SUPPORTED_LOCALES = ['ru', 'oz', 'uz']
export const APP_LOCALE = getAppLocale()

export function getAppLocale() {
  const FALLBACK_LOCALE = 'ru'
  const DEFAULT_LOCALE = $get(APP_LANG_KEY) || FALLBACK_LOCALE
  return SUPPORTED_LOCALES.includes(DEFAULT_LOCALE)
    ? DEFAULT_LOCALE
    : FALLBACK_LOCALE
}

export function setupI18n(
  options: Record<string, string | boolean> = { locale: APP_LOCALE }
): I18n {
  const i18n = createI18n(options)
  setI18nLanguage(i18n, options.locale as string)
  return i18n
}

export function setI18nLanguage(i18n: I18n, locale: string): void {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    ;(i18n.global as unknown as Composer).locale.value = locale
  }
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale)
}

export const i18n = setupI18n({
  locale: APP_LOCALE,
  fallbackLocale: APP_LOCALE,
  globalInjection: true,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
})

export async function loadLocaleMessages(i18n: I18n, locale: string) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `../locales/${locale}/${locale}.ts`
  )

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}

export function $translate(
  key: string,
  options: Record<string, string | number> = {}
): string {
  if (!key) return ''
  return (i18n.global as any).t(key, options)
}

export async function $changeLocale(locale: string): Promise<void> {
  await $set(APP_LANG_KEY, locale)
  await loadLocaleMessages(i18n, locale)
  await setI18nLanguage(i18n, locale)
}

export function $localePath(path: string): string {
  const locale = unref(i18n.global.locale) || APP_LOCALE
  if (!path) return ''
  return `/${locale}${path}`
}
