import { computed, ref } from 'vue'
import http from '@/plugins/http'
import router from '@/router'
import { $localePath } from '@/plugins/i18n'
import { useTokenService } from '@/plugins/token-service'
import { redirectToPages } from '@/middlewares/role-check'
import type { LoginFormDataInterface } from '@/types/auth/LoginTypes'

interface UserDataInterface {
  id: number
  type: 'superAdmin' | 'organisation' | 'employer'
  username: string
  blocked_by: string | null
  status: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

const tokenService = useTokenService()
const userData = ref<UserDataInterface | null>(null)

export function useUserService() {
  const user = computed(() => userData.value)
  const role = computed(() => userData.value?.type || null)
  const auth = computed(() => !!userData.value)

  const clearUser = async () => {
    try {
      await tokenService.removeToken()
      userData.value = null
      await router.replace({ path: $localePath('/auth') })
      return Promise.resolve('Successfully cleared user data')
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const loginUser = async (formData: LoginFormDataInterface) => {
    try {
      const data = await http.post('/admin/auth/login', formData)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const fetchUser = async () => {
    try {
      const {
        data: { data },
      } = await http.post('/admin/auth/me')
      userData.value = data
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const logoutUser = async () => {
    try {
      await http.post('/admin/auth/logout')
      await clearUser()
      return Promise.resolve('Successfully logged out')
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const refreshToken = async () => {
    try {
      const data = await http.post('/admin/auth/refresh')
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const redirectToCabinet = async () => {
    try {
      const userPath = redirectToPages[role.value as string].path
      await router.push({ path: userPath })
      return Promise.resolve(userPath)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  return {
    refreshToken,
    loginUser,
    fetchUser,
    logoutUser,
    clearUser,
    redirectToCabinet,
    user,
    role,
    auth,
  }
}
