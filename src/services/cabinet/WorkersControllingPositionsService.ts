import http from '@/plugins/http'

export const fetchPositions = async (page: number, name: string | null) => {
  try {
    const data = await http.get('/organisation/reference/position', {
      params: { type: 'position', page, name },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createPosition = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/reference/position', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editPosition = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/reference/position/${formData.id}`,
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

export const deletePosition = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/reference/position/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
