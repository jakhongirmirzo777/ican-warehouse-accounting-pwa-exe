import http from '@/plugins/http'

export const fetchRemainders = async (params: {
  page: number
  search: string | null
  store_id: number | null
  is_showcase: number | null
  category_id: number | null
  organisation_ids: number[] | null
}) => {
  try {
    const {
      page,
      search,
      store_id,
      is_showcase,
      category_id,
      organisation_ids,
    } = params
    const data = await http.get(
      '/organisation/reports/stock/organisation-products',
      {
        params: {
          page,
          search,
          store_id,
          is_showcase,
          category_id,
          organisation_ids,
        },
      }
    )
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

export const fetchOrganisations = async () => {
  try {
    const data = await http.get('/organisation/organisation/list')
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

export const moveProduct = async (
  formData: Record<string, string | number>
) => {
  try {
    const data = await http.post(
      `/organisation/reports/stock/move-product/${formData.id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
