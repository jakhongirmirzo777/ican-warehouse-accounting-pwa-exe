import http from '@/plugins/http'

export const fetchWriteOffs = async (params: {
  lastPage: number | null
  perPage: number | null
  total: number | null
  search: string | null
  organisation_id: number | null
  status: number | null
  store_id: number | null
  date: string | null
  page: number | null
}) => {
  const { search, organisation_id, status, store_id, date, page } = params
  try {
    const data = await http.get('/organisation/write-off', {
      params: {
        search,
        organisation_id,
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

export const fetchWriteOff = async (id: number) => {
  try {
    const data = await http.get(`/organisation/write-off/view/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createWriteOff = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/write-off/create', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchProduct = async (id: number, page: number) => {
  try {
    const data = await http.get(`/organisation/write-off/product/list/${id}`, {
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
      `/organisation/write-off/product/add/${id}`,
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
      `/organisation/write-off/product/update/${id}`,
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
      `/organisation/write-off/product/remove/${id}`
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
    const data = await http.get('/organisation/write-off/next-number')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const forwardToStore = async (id: number) => {
  try {
    const data = await http.post(
      `/organisation/write-off/forward-to-store/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const cancelFromStore = async (id: number) => {
  try {
    const data = await http.post(`/organisation/write-off/cancel-forward/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const cancelWriteOff = async (id: number) => {
  try {
    const data = await http.post(`/organisation/write-off/cancel/${id}`)
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
