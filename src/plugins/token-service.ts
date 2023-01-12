import http from '@/plugins/http'
import { useStorageService } from '@/plugins/storage-service'
import { useUserService } from '@/plugins/user-service'
import { $encrypt, $decrypt } from '@/plugins/crypto-credentials-service'
import { EXPIRE_KEY, TOKEN_KEY, CREDENTIALS_KEY } from '@/utils/constants'

interface CredentialsInterface {
  access_token: string
  expires_in: number
  token_type: string
}

const { $get, $set, $remove } = useStorageService()
const { $refreshToken } = useUserService()
let timeoutId: any

export function useTokenService() {
  const $getToken = () => $get(TOKEN_KEY)

  const $setToken = (data: CredentialsInterface) => {
    if (data.access_token) {
      $set(TOKEN_KEY, data.access_token)
      http.defaults.headers.common[
        'Authorization'
      ] = `${data.token_type} ${data.access_token}`
    }
    if (data.expires_in) {
      const expireTime = new Date().getTime() + +data.expires_in
      $set(EXPIRE_KEY, expireTime.toString())
    }
  }

  const $setCredentials = (data: Record<string, any>) => {
    if (typeof data !== 'object') return console.error('Only object is allowed')
    const encryptedData = $encrypt(data)
    $set(CREDENTIALS_KEY, encryptedData)
  }

  const $getCredentials = (): Record<string, string> | void => {
    console.warn(CREDENTIALS_KEY, '1111111111111')
    const encryptedData = $get(CREDENTIALS_KEY)
    console.warn(encryptedData, '2222222222222')
    if (!encryptedData) return console.error('Credentials are empty')
    return $decrypt(encryptedData)
  }

  const $removeToken = () => {
    $remove(TOKEN_KEY)
    $remove(EXPIRE_KEY)
    $remove(CREDENTIALS_KEY)
  }

  const $checkExpire = (): void => {
    const expire = $get(EXPIRE_KEY)
    const currentTime = new Date().getTime()
    const expireTime = (expire && new Date(+expire).getTime()) || 0
    if (expireTime <= currentTime) $removeToken()
  }

  const $setTimeOutRefreshToken = () => {
    const expire = $get(EXPIRE_KEY)
    if (!expire || typeof parseInt(expire) !== 'number') return $removeToken()
    const currentTime = new Date().getTime()
    const expireTime = new Date(+expire).getTime()
    const offsetTime = 1000 * 60
    const differenceTime = expireTime - offsetTime - currentTime
    const timeOut = differenceTime > 0 ? differenceTime : 0
    $clearTimeOutRefreshToken()
    timeoutId = setTimeout(() => {
      refreshToken().then(() => {
        $setTimeOutRefreshToken()
      })
    }, timeOut)
  }

  const $clearTimeOutRefreshToken = () => {
    clearTimeout(timeoutId)
  }

  const refreshToken = async () => {
    try {
      const {
        data: { data },
      } = await $refreshToken()
      await $setToken(data)
    } catch (err) {
      console.error('Could not refresh token ', err)
    }
  }

  return {
    $getToken,
    $setToken,
    $removeToken,
    $checkExpire,
    $setTimeOutRefreshToken,
    $clearTimeOutRefreshToken,
    $setCredentials,
    $getCredentials,
  }
}
