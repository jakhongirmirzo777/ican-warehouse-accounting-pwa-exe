import http from '@/plugins/http'

export const fetchRevaluations = async (params: {
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
    const data = await http.get('/organisation/revaluations', {
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

export const createRevaluation = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/revaluations/create', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchProduct = async (params: {
  id: number
  search: null | string
  category_id: null | number
}) => {
  try {
    const { search, category_id } = params
    const data = await http.get(
      `/organisation/revaluations/product/list/${params.id}`,
      {
        params: {
          search,
          category_id,
        },
      }
    )
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
      `/organisation/revaluations/product/add/${id}`,
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
      `/organisation/revaluations/product/update/${id}`,
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
      `/organisation/revaluations/product/remove/${id}`
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
    const data = await http.get('/organisation/revaluations/next-number')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const forwardToStore = async (id: number) => {
  try {
    const data = await http.post(
      `/organisation/revaluations/forward-to-store/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const cancelFromStore = async (id: number) => {
  try {
    const data = await http.post(
      `/organisation/revaluations/cancel-forward/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const cancelRevaluation = async (id: number) => {
  try {
    const data = await http.post(`/organisation/revaluations/cancel/${id}`)
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

export const fetchCategories = async () => {
  try {
    const data = await http.get('/organisation/category/parents')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchUnits = async () => {
  try {
    const data = await http.get('/admin/units/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
