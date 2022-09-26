import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { ROLES } from '@/utils/constants'
import { useUserService } from '@/plugins/user-service'
import { $localePath } from '@/plugins/i18n'

export const redirectToPages = {
  [ROLES.SUPER_ADMIN]: {
    name: 'dashboard-admin',
    path: `${$localePath('/cabinet/dashboard-admin')}`,
  },
  [ROLES.ORGANISATION]: {
    name: 'dashboard-organisation',
    path: `${$localePath('/cabinet/dashboard-organisation')}`,
  },
  [ROLES.EMPLOYER]: {
    name: 'dashboard-employer',
    path: `${$localePath('/cabinet/dashboard-employer')}`,
  },
  login: {
    name: 'login',
    path: `${$localePath('/auth')}`,
  },
  error: {
    name: 'error',
    path: `${$localePath('/404')}`,
  },
}

const userService = useUserService()

const roleCheck = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userRole = userService.role.value
  const isAuthenticated = userService.auth.value
  const canAccess =
    (to.meta.roles as string[])?.includes(userRole as string) || false
  const isLoginPage = to.name === 'login'
  const isPublic = to.meta.public || false
  const userPath = redirectToPages[userRole as string]?.path
  const isNotTheSameRoute =
    redirectToPages[userRole as string]?.name !== to.name
  if (to.name === 'error') return next()
  if (!isLoginPage && !isAuthenticated) return next(redirectToPages.login.path)
  if (isLoginPage && isAuthenticated) return next(userPath)
  if (!canAccess && !isPublic && isNotTheSameRoute) return next(userPath)
  return next()
}

export default roleCheck
