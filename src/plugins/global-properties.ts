import type { App } from 'vue'
import { $changeLocale, $localePath } from '@/plugins/i18n'
import { $can } from '@/plugins/permission-service'
import {
  $phoneFormat,
  $moneyFormat,
  $moneyFormatWithComma,
} from '@/utils/pure-functions'

// All global properties should be written here :)
// Hamma global properties lar shu yerga yozilsin :)

const globalProperties = {
  $changeLocale,
  $localePath,
  $phoneFormat,
  $moneyFormat,
  $moneyFormatWithComma,
  $can,
}

export default {
  install: (app: App) => {
    Object.entries(globalProperties).forEach(([key, val]) => {
      app.config.globalProperties[key] = val
    })
  },
}
/*eslint-disable */
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $changeLocale(locale: string): Promise<void>

    $localePath(path: string): string

    $phoneFormat(payload: string): string

    $moneyFormat(val: number | string): string | number

    $moneyFormatWithComma(val: number | string): string | number

    $can(permission: string): boolean
  }
}
/*eslint-enable */
