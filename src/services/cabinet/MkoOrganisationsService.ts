import http from '@/plugins/http'
import type { MkoOrganisationData } from '@/types/cabinet/MkoOrganisationsTypes'

export const fetchOrganisations = async (
  page: number,
  search: string | null,
  status: number | null
) => {
  try {
    const data = await http.get<MkoOrganisationData>(
      '/organisation/organisation',
      {
        params: { page, search, status },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editOrganisation = async (id: number, formData: FormData) => {
  try {
    const data = await http.post(`/organisation/organisation/${id}`, formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const changePassword = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/organisation/change-password/${formData.id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchOrganisationsList = async () => {
  try {
    const data = await http.get('/organisation/organisation/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
