import http from '@/plugins/http'

export const fetchOrganisationTypes = async (params: {
  page: number
  search: string | null
}) => {
  const { page, search } = params
  try {
    const data = await http.get('/admin/types', {
      params: {
        page,
        search,
      },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createOrganisationType = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/admin/types', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editOrganisationType = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(`/admin/types/${formData.id}`, {
      ...formData,
      _method: 'PUT',
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteOrganisationType = async (id: number) => {
  try {
    const data = await http.delete(`/admin/types/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
