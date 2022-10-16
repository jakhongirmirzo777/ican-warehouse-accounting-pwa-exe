import http from '@/plugins/http'

export const fetchDepartments = async () => {
  try {
    const data = await http.get(
      '/organisation/reference/department/list?type=department'
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchRoles = async () => {
  try {
    const data = await http.get('/organisation/roles/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchPositions = async () => {
  try {
    const data = await http.get(
      '/organisation/reference/position/list?type=position'
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchEmployees = async (params: {
  page: number
  search: string | null
  status: number | null
  department_id: number | null
  position_id: number | null
}) => {
  const { page, search, status, department_id, position_id } = params
  try {
    const data = await http.get('/organisation/employee', {
      params: {
        page,
        search,
        status,
        department_id,
        position_id,
      },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEmployee = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/employee', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const changePassword = async (
  id: number,
  formData: Record<string, string>
) => {
  try {
    const data = await http.post(
      `/organisation/employee/change-password/${id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editEmployee = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(`/organisation/employee/${formData.id}`, {
      ...formData,
      _method: 'PUT',
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteEmployee = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/employee/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const toggleStatus = async (id: number) => {
  try {
    const data = await http.post(`/organisation/employee/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
