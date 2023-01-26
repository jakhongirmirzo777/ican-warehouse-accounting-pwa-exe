import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '@/router/routes'
import roleCheck from '@/middlewares/role-check'
import i18nCheck from '@/middlewares/i18n-check'
import titleCheck from '@/middlewares/title-check'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(i18nCheck)
router.beforeEach(roleCheck)
router.beforeResolve(titleCheck)

export default router

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    roles?: string[]
    title?: string
    permissions?: string[]
  }
}
