import http from '@/plugins/http'
import type { MkoOrganisationData } from '@/types/cabinet/MkoOrganisationsAdminTypes'

export const fetchOrganisationsParents = async () => {
  try {
    const data = await http.get('/admin/organisations/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchTariffs = async () => {
  try {
    const data = await http.get('/admin/tariffs/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchOrganisations = async (
  page: number,
  search: string | null,
  status: number | null,
  name: string | null,
  inn: number | null,
  company_name: string | null
) => {
  try {
    const data = await http.get<MkoOrganisationData>('/admin/organisations', {
      params: { page, search, status, name, inn, company_name },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createOrganisation = async (formData: FormData) => {
  try {
    const data = await http.post('/admin/organisations', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editOrganisation = async (id: number, formData: FormData) => {
  try {
    const data = await http.post(`/admin/organisations/${id}`, formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteOrganisation = async (id: number) => {
  try {
    const data = await http.delete(`/admin/organisations/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const changeStatus = async (id: number) => {
  try {
    const data = await http.post(`/admin/organisations/change-status/${id}`)
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
      `/admin/organisations/change-password/${id}`,
      formData
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
