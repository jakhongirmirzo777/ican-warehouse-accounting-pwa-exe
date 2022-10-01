import http from '../../plugins/http'
import type {
  CurrencyKeyList,
  ReferenceCoursesFormTypes,
  ReferenceCoursesPageOptionsType,
  ReferencePartyCoursesDataItemType,
} from '@/types/cabinet/ReferenceCoursesTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
const BASE_URL_ADDITIONAL = 'admin'

export const fetchCourses = async (params: ReferenceCoursesPageOptionsType) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<ReferencePartyCoursesDataItemType>
    >(`${BASE_URL_ADDITIONAL}/currencies`, { params: { ...params } })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getCurrencyList = async () => {
  try {
    const { data } = await http.get<{ data: Array<CurrencyKeyList> }>(
      `${BASE_URL_ADDITIONAL}/currencies/list`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteCourses = async (id: number) => {
  try {
    const { data } = await http.delete<ReferenceCoursesFormTypes>(
      `${BASE_URL_ADDITIONAL}/currencies/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditCourses = async (form: ReferenceCoursesFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(
        `${BASE_URL_ADDITIONAL}/currencies/${form.id}`,
        form
      )
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/currencies`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
