import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import globalProperties from '@/plugins/global-properties'
import globalComponents from '@/plugins/global-components'
import directives from '@/directives/index'
import mask from '@/plugins/mask'
import { i18n } from '@/plugins/i18n'
import { useTokenService } from '@/plugins/token-service'
import { useUserService } from '@/plugins/user-service'
import { useErrorActions } from '@/composables/set-errors'
import '@/plugins/vee-validate'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/styles/index.scss'

const { $setResponseErrors } = useErrorActions()
const { $checkExpire, $getToken, $setTimeOutRefreshToken } = useTokenService()
const { $fetchUser } = useUserService()

;(async () => {
  $checkExpire()
  const token = $getToken()
  if (token) {
    try {
      await $fetchUser()
      await $setTimeOutRefreshToken()
    } catch (err) {
      await $setResponseErrors(err)
    }
  }
  const app = createApp(App)
  app.use(i18n)
  app.use(router)
  app.use(globalComponents)
  app.use(globalProperties)
  app.use(mask)
  app.use(directives)
  app.mount('#app')
})()
