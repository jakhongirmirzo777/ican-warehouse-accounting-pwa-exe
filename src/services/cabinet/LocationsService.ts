import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  LocationsPageOptionsType,
  ReferenceLocationsFormTypes,
  ReferenceLocationsDataItemType,
  LocationListType,
} from '@/types/cabinet/LocationsTypes'
const BASE_URL_ADDITIONAL = 'admin'

export const fetchLocations = async (params: LocationsPageOptionsType) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<ReferenceLocationsDataItemType>
    >(`${BASE_URL_ADDITIONAL}/locations`, {
      params: { ...params },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchLocationsList = async () => {
  try {
    const { data } = await http.get<{ data: Array<LocationListType> }>(
      `${BASE_URL_ADDITIONAL}/locations/list`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteLocations = async (id: number) => {
  try {
    const { data } = await http.delete<ReferenceLocationsFormTypes>(
      `${BASE_URL_ADDITIONAL}/locations/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const changeLocationsStatus = async (id: number) => {
  try {
    const { data } = await http.post<ReferenceLocationsFormTypes>(
      `${BASE_URL_ADDITIONAL}/locations/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditLocations = async (
  form: ReferenceLocationsFormTypes
) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(
        `${BASE_URL_ADDITIONAL}/locations/${form.id}`,
        form
      )
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/locations`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
