import http from '@/plugins/http'

export const fetchDepartments = async (
  page: number,
  name: string | null,
  organisation_ids: number[] | null
) => {
  try {
    const data = await http.get('/organisation/reference/department', {
      params: { type: 'department', page, name, organisation_ids },
    })
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

export const createDepartment = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/reference/department', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editDepartment = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/reference/department/${formData.id}`,
      {
        ...formData,
        _method: 'PUT',
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteDepartment = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/reference/department/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
