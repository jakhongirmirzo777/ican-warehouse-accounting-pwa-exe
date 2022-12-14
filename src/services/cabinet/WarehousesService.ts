import http from '@/plugins/http'

export const fetchWarehouses = async (
  page: number,
  search: string | null,
  organisation_ids: number[] | null
) => {
  try {
    const data = await http.get('/organisation/store', {
      params: { page, search, organisation_ids },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchWarehouseList = async () => {
  try {
    const data = await http.get('/organisation/store/sale-available-list')
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

export const createWarehouse = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/store', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editWarehouse = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(`/organisation/store/${formData.id}`, {
      ...formData,
      _method: 'PUT',
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteWarehouse = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/store/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
