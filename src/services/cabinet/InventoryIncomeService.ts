import http from '@/plugins/http'

export const fetchIncomes = async (page: number) => {
  try {
    const data = await http.get('/organisation/documents', {
      params: { page },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchIncome = async (id: number) => {
  try {
    const data = await http.get(`/organisation/documents/view/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createIncome = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/documents/create', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editIncome = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/documents/update/${formData.id}`,
      {
        ...formData,
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteIncome = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/documents/delete/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchProduct = async (id: number) => {
  try {
    const data = await http.get(`/organisation/documents/product/list/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createProduct = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/documents/product/add/${formData.id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editProduct = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/documents/product/update/${formData.id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteProduct = async (id: number) => {
  try {
    const data = await http.delete(
      `/organisation/documents/product/remove/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchOrganisations = async () => {
  try {
    const data = await http.get('/organisation/organisation/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchDocumentNumber = async () => {
  try {
    const data = await http.get('/organisation/documents/next-number')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchResources = async (organisation_id: number) => {
  try {
    const data = await http.get(
      '/organisation/counterparty/list-with-contract',
      {
        params: { organisation_id },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchWarehouses = async () => {
  try {
    const data = await http.get('/organisation/store/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchCurrencies = async () => {
  try {
    const data = await http.get('organisation/settings/courses/currencies')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchProductSearch = async (
  search: string,
  category_id: number
) => {
  try {
    const data = await http.get('/organisation/product', {
      params: { search, category_id },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchFeatures = async (search: string, category_ids: number[]) => {
  try {
    const data = await http.get('/organisation/feature', {
      params: { search, category_ids },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
