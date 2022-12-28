import { computed, ref } from 'vue'
import http from '@/plugins/http'
import router from '@/router'
import { $localePath } from '@/plugins/i18n'
import { useTokenService } from '@/plugins/token-service'
import { redirectToPages } from '@/middlewares/role-check'
import { useStorageService } from '@/plugins/storage-service'
import type { LoginFormDataInterface } from '@/types/auth/LoginTypes'

export type UserType = 'superAdmin' | 'organisation' | 'employer'

export interface CoursesInterface {
  amount: string
  created_at: string
  currency: string
  currency_id: number
  id: number
  key: string
  last_amount: string
  symbol: string
}

export interface UserDataInterface {
  id: number
  type: UserType
  username: string
  status: number
  status_text: string
  balance: string | null
  organisation_id: number
  organisation_name: string
  organisation_tariff: string
  organisation_tariff_amount: number
  min_margin_percent: string
  permissions: Record<string, boolean>
  courses: CoursesInterface[]
}

const { $removeToken } = useTokenService()
const userData = ref<UserDataInterface | null>(null)
const { $clear } = useStorageService('sessionStorage')

export function useUserService() {
  const user = computed<UserDataInterface | null>(() => userData.value)
  const role = computed<UserType | null>(() => userData.value?.type || null)
  const auth = computed<boolean>(() => !!userData.value)

  const $clearUser = async () => {
    try {
      await $removeToken()
      await $clear()
      userData.value = null
      await router.replace({ path: $localePath('/auth') })
      return Promise.resolve('Successfully cleared user data')
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const $loginUser = async (formData: LoginFormDataInterface) => {
    try {
      const data = await http.post('/admin/auth/login', formData)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const $fetchUser = async () => {
    try {
      const {
        data: { data },
      } = await http.post('/admin/auth/me')
      const permissions =
        data?.permissions?.reduce(
          (acc: Record<string, boolean>, cur: string) => {
            acc[cur.toLowerCase()] = true
            return acc
          },
          {}
        ) || {}
      if (data && data.permissions) data.permissions = permissions
      userData.value = data
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const $logoutUser = async () => {
    try {
      await http.post('/admin/auth/logout')
      await $clearUser()
      return Promise.resolve('Successfully logged out')
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const $refreshToken = async () => {
    try {
      const data = await http.post('/admin/auth/refresh')
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const $redirectToCabinet = async () => {
    try {
      const userPath = redirectToPages[role.value as string].path
      await router.push({ path: userPath })
      return Promise.resolve(userPath)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return {
    $refreshToken,
    $loginUser,
    $fetchUser,
    $logoutUser,
    $clearUser,
    $redirectToCabinet,
    user,
    role,
    auth,
  }
}
