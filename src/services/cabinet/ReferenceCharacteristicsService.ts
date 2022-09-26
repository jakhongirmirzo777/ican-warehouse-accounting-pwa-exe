import http from '@/plugins/http'

export const fetchCategories = async () => {
  try {
    const data = await http.get('/organisation/category/parents')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchCharacteristics = async (
  page: number,
  search: string | null,
  category_ids: number[]
) => {
  try {
    const data = await http.get('/organisation/feature', {
      params: {
        page,
        search,
        category_ids,
      },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchCharacteristic = async (id: number) => {
  try {
    const data = await http.get(`/organisation/feature/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createCharacteristics = async (formData: FormData) => {
  try {
    const data = await http.post('/organisation/feature', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editCharacteristics = async (id: number, formData: FormData) => {
  try {
    const data = await http.post(`/organisation/feature/${id}`, formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteCharacteristic = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/feature/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
