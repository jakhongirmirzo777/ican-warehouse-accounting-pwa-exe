import type { App } from 'vue'
import { clickOutside } from '@/directives/v-click-outside'
import { ripple } from '@/directives/v-ripple'
import { focus } from '@/directives/v-focus'

export default {
  install(app: App) {
    app.directive('click-outside', clickOutside)
    app.directive('ripple', ripple)
    app.directive('focus', focus)
  },
}
