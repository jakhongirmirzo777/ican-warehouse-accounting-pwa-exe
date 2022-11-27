import http from '@/plugins/http'

export const fetchIncomes = async (params: {
  lastPage: number | null
  perPage: number | null
  total: number | null
  search: string | null
  organisation_id: number | null
  counterparty_id: number | null
  contract_id: number | null
  invoice_id: number | null
  store_id: number | null
  date: string | null
  page: number | null
}) => {
  const {
    search,
    organisation_id,
    counterparty_id,
    contract_id,
    invoice_id,
    store_id,
    date,
    page,
  } = params
  try {
    const data = await http.get('/organisation/entering-products', {
      params: {
        search,
        organisation_id,
        counterparty_id,
        contract_id,
        invoice_id,
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

export const fetchIncome = async (id: number) => {
  try {
    const data = await http.get(`/organisation/entering-products/view/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createIncome = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      '/organisation/entering-products/create',
      formData
    )
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
      `/organisation/entering-products/update/${formData.id}`,
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
    const data = await http.delete(
      `/organisation/entering-products/delete/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchProduct = async (id: number, page: number) => {
  try {
    const data = await http.get(`/organisation/documents/product/list/${id}`, {
      params: { page },
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
      `/organisation/documents/product/add/${id}`,
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
      `/organisation/documents/product/update/${id}`,
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
    const data = await http.get('/organisation/entering-products/next-number')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const forwardToStore = async (id: number) => {
  try {
    const data = await http.post(
      `/organisation/entering-products/forward-to-store/${id}`
    )
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

export const fetchProductSearch = async (search: string) => {
  try {
    const data = await http.get('/organisation/product', {
      params: { search },
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
