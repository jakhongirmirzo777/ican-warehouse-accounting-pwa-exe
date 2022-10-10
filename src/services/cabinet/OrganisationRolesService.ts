import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  RolesDataItemType,
  RolesPageOptionsType,
  RolesFormTypes,
  OneRoleType,
  PermissionsListTypes,
} from '@/types/cabinet/RolesTypes'
const BASE_URL_ADDITIONAL = 'organisations'

export const fetchOrganisationsRoles = async (params: RolesPageOptionsType) => {
  try {
    const { data } = await http.get<FetchDataTypes<RolesDataItemType>>(
      `${BASE_URL_ADDITIONAL}/roles`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getPermissionsList = async () => {
  try {
    const { data } = await http.get<{
      data: Record<string, Array<PermissionsListTypes>>
    }>(`${BASE_URL_ADDITIONAL}/roles/permission-lists`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getOneRole = async (id: number) => {
  try {
    const { data } = await http.get<{
      data: OneRoleType
    }>(`${BASE_URL_ADDITIONAL}/roles/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteOrganisationsRoles = async (id: number) => {
  try {
    const { data } = await http.delete<RolesFormTypes>(
      `${BASE_URL_ADDITIONAL}/roles/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditOrganisationsRoles = async (form: RolesFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/roles/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/roles`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
