import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { $translate } from '@/plugins/i18n'

const titleCheck = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const title = to.meta.title || 'icanWarehouseAccounting'
  document.title = $translate(title)
  return next()
}

export default titleCheck
