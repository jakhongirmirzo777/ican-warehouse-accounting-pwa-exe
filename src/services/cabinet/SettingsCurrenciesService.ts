import http from '@/plugins/http'

export const fetchCurrencies = async () => {
  try {
    const data = await http.get('/organisation/settings/courses')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchCurrencyTypes = async () => {
  try {
    const data = await http.get('/organisation/settings/courses/currencies')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createCurrency = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/settings/courses', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editCurrency = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(`/organisation/product/${formData.id}`, {
      ...formData,
      _method: 'PUT',
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
