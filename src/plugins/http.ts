import axios from 'axios'
import { useUserService } from '@/plugins/user-service'
import { useTokenService } from '@/plugins/token-service'
import { getAppLocale } from '@/plugins/i18n'
import { BASE_URL } from '@/utils/urls'

const tokenService = useTokenService()
const userService = useUserService()

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const APP_LOCALE = getAppLocale()
    const token = tokenService.getToken()
    if (!config.headers) return config
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    config.headers['Language'] = APP_LOCALE
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      userService.clearUser().then()
    }
    return Promise.reject(error)
  }
)

export default http
