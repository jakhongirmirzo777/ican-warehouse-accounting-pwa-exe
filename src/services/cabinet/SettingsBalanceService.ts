import http from '@/plugins/http'

export const fetchBalance = async (
  params: Record<string, string | number | null>
) => {
  try {
    const data = await http.get('/organisation/settings/transactions', {
      params,
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createPayment = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      '/organisation/settings/transactions/payment',
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const confirmPayment = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      '/organisation/settings/transactions/confirm',
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
