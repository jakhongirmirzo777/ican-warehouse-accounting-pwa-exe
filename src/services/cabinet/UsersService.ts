import http from '@/plugins/http'

export const fetchUsers = async (
  page: number,
  search: string | null,
  status: number | null
) => {
  try {
    const data = await http.get('/admin/employee', {
      params: { page, search, status },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchRoles = async () => {
  try {
    const data = await http.get('/admin/roles/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createUser = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/admin/employee', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editUser = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(`/admin/employee/${formData.id}`, {
      ...formData,
      _method: 'PUT',
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteUser = async (id: number) => {
  try {
    const data = await http.delete(`/admin/employee/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const toggleStatus = async (id: number) => {
  try {
    const data = await http.post(`/admin/employee/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
