import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  UnitsPageOptionsType,
  ReferencePartyUnitsDataItemType,
  ReferenceUnitsFormTypes,
} from '@/types/cabinet/ReferenceUnitsTypes'
const BASE_URL_ADDITIONAL = 'admin'

export const fetchReferenceUnits = async (params: UnitsPageOptionsType) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<ReferencePartyUnitsDataItemType>
    >(`${BASE_URL_ADDITIONAL}/units`, {
      params: { ...params },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteReferenceUnits = async (id: number) => {
  try {
    const { data } = await http.delete<ReferenceUnitsFormTypes>(
      `${BASE_URL_ADDITIONAL}/units/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditReferenceUnits = async (
  form: ReferenceUnitsFormTypes
) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/units/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/units`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
