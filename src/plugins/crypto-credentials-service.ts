import CryptoJS from 'crypto-js'

export const $encrypt = (data: Record<string, any>) => {
  const secretKey = import.meta.env.VITE_SECRET_KEY
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
}

export const $decrypt = (message: string): Record<string, any> => {
  const secretKey = import.meta.env.VITE_SECRET_KEY

  console.warn(secretKey)
  const bytes = CryptoJS.AES.decrypt(message, secretKey)
  console.warn(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)))
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
