import http from '@/plugins/http'

export const fetchProducts = async (
  page: number,
  search: string | null,
  category_id: number | null
) => {
  try {
    const data = await http.get('/organisation/product', {
      params: { page, search, category_id },
    })
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

export const generateBarcode = async () => {
  try {
    const data = await http.get('/organisation/product/generate/barcode')
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

export const createProduct = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/product', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editProduct = async (
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

export const deleteProduct = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/product/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchBarcode = async (id: number) => {
  try {
    const data = await http.get(`/organisation/product/get-barcode-image/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
