import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserService } from '@/plugins/user-service'
import { SUPPORTED_LOCALES, APP_LOCALE, $changeLocale } from '@/plugins/i18n'
import { redirectToPages } from '@/middlewares/role-check'

const { role, auth } = useUserService()
let IS_FIRST_LOAD = true

const redirectRouteLocale = (
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userRole = role.value
  const isAuthenticated = auth.value
  const userPath = redirectToPages[userRole as string]?.path
  if (!isAuthenticated) return next(redirectToPages.login.path)
  if (isAuthenticated) return next(userPath)
  return next()
}

const i18nCheck = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  try {
    const hasParamsLocale = !!to.params.locale
    const locale = (to.params.locale || APP_LOCALE) as string
    const isSupportedLocale = SUPPORTED_LOCALES.includes(locale)

    if (hasParamsLocale && isSupportedLocale && IS_FIRST_LOAD) {
      $changeLocale(locale)
        .then(() => (IS_FIRST_LOAD = false))
        .catch((err) => console.error('Could not load locale ', err))
    }

    if (hasParamsLocale && !isSupportedLocale) {
      return next({ name: 'error' })
    }

    if (!hasParamsLocale) {
      return redirectRouteLocale(to, next)
    }
    return next()
  } catch (err) {
    console.error('Error from i18n middleware ', err)
  }
}

export default i18nCheck
