import http from '@/plugins/http'

export const fetchCategories = async (
  page: number,
  search: string | null,
  parent_id: number | null
) => {
  try {
    const data = await http.get('/organisation/category', {
      params: { page, search, parent_id },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchParents = async () => {
  try {
    const data = await http.get('/organisation/category/parents')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createCategory = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/category', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editCategory = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(`/organisation/category/${formData.id}`, {
      ...formData,
      _method: 'PUT',
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteCategory = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/category/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
