import http from '@/plugins/http'

export const fetchOrganisations = async () => {
  try {
    const data = await http.get('/admin/organisations/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchPayments = async (params: {
  from: null | string
  to: null | string
  status: null | number
  organisation_id: null | number
  payment_type: null | string
}) => {
  try {
    const data = await http.get('/admin/transactions', {
      params,
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createPayment = async (formData: Record<string, any>) => {
  try {
    const data = await http.post('/admin/transactions/payment', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const revertPayment = async (formData: Record<string, any>) => {
  try {
    const data = await http.post(
      `/admin/transactions/revert/${formData.id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
