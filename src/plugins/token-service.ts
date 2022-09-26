import http from '@/plugins/http'
import { useStorageService } from '@/plugins/storage-service'
import { useUserService } from '@/plugins/user-service'
import { EXPIRE_KEY, TOKEN_KEY } from '@/utils/constants'

interface CredentialsInterface {
  access_token: string
  expires_in: number
  token_type: string
}

const storageService = useStorageService()
const userService = useUserService()
let timeoutId: any

export function useTokenService() {
  const getToken = () => storageService.get(TOKEN_KEY)

  const setToken = (data: CredentialsInterface) => {
    if (data.access_token) {
      storageService.set(TOKEN_KEY, data.access_token)
      http.defaults.headers.common[
        'Authorization'
      ] = `${data.token_type} ${data.access_token}`
    }
    if (data.expires_in) {
      const expireTime = new Date().getTime() + +data.expires_in
      storageService.set(EXPIRE_KEY, expireTime.toString())
    }
  }

  const removeToken = () => {
    storageService.remove(TOKEN_KEY)
    storageService.remove(EXPIRE_KEY)
  }

  const checkExpire = (): void => {
    const expire = storageService.get(EXPIRE_KEY)
    const currentTime = new Date().getTime()
    const expireTime = (expire && new Date(+expire).getTime()) || 0
    if (expireTime <= currentTime) removeToken()
  }

  const setTimeOutRefreshToken = () => {
    const expire = storageService.get(EXPIRE_KEY)
    if (!expire || typeof parseInt(expire) !== 'number') return removeToken()
    const currentTime = new Date().getTime()
    const expireTime = new Date(+expire).getTime()
    const offsetTime = 1000 * 60
    const differenceTime = expireTime - offsetTime - currentTime
    const timeOut = differenceTime > 0 ? differenceTime : 0
    clearTimeOutRefreshToken()
    timeoutId = setTimeout(() => {
      refreshToken().then(() => {
        setTimeOutRefreshToken()
      })
    }, timeOut)
  }

  const clearTimeOutRefreshToken = () => {
    clearTimeout(timeoutId)
  }

  const refreshToken = async () => {
    try {
      const {
        data: { data },
      } = await userService.refreshToken()
      await setToken(data)
    } catch (err) {
      console.error('Could not refresh token ', err)
    }
  }

  return {
    getToken,
    setToken,
    removeToken,
    checkExpire,
    setTimeOutRefreshToken,
    clearTimeOutRefreshToken,
  }
}
