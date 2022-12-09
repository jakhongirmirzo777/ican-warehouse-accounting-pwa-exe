import http from '@/plugins/http'

export const fetchReturns = async (params: {
  lastPage: number | null
  perPage: number | null
  total: number | null
  search: string | null
  organisation_id: number | null
  counterparty_id: number | null
  status: number | null
  store_id: number | null
  date: string | null
  page: number | null
}) => {
  const {
    search,
    organisation_id,
    counterparty_id,
    status,
    store_id,
    date,
    page,
  } = params
  try {
    const data = await http.get('/organisation/returns', {
      params: {
        search,
        organisation_id,
        counterparty_id,
        status,
        store_id,
        date,
        page,
      },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchReturn = async (id: number) => {
  try {
    const data = await http.get(`/organisation/returns/view/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createReturn = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/returns/create', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchProduct = async (id: number, page: number) => {
  try {
    const data = await http.get(`/organisation/returns/product/list/${id}`, {
      params: {
        page,
      },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createProduct = async (
  id: string | number,
  formData: Record<string, any>
) => {
  try {
    const data = await http.post(
      `/organisation/returns/product/add/${id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editProduct = async (
  id: string | number,
  formData: Record<string, any>
) => {
  try {
    const data = await http.post(
      `/organisation/returns/product/update/${id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteProduct = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/returns/product/remove/${id}`)
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
    const data = await http.get('/organisation/returns/next-number')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const forwardToStore = async (id: number) => {
  try {
    const data = await http.post(`/organisation/returns/forward-to-store/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const cancelFromStore = async (id: number) => {
  try {
    const data = await http.post(`/organisation/returns/cancel-forward/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const cancelRevaluation = async (id: number) => {
  try {
    const data = await http.post(`/organisation/returns/cancel/${id}`)
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

export const fetchCounterparties = async () => {
  try {
    const data = await http.get('/organisation/counterparty/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchProductSearch = async (store_id: number, search: string) => {
  try {
    const data = await http.get('/organisation/product/search', {
      params: { search, store_id },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
