import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import roleCheck from '@/middlewares/role-check'
import i18nCheck from '@/middlewares/i18n-check'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(i18nCheck)
router.beforeEach(roleCheck)

export default router

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    roles?: string[]
    permissions?: string[]
  }
}
