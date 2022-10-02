import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  ReferencePartySystemCoursesDataItemType,
  ReferenceSystemCoursesFormTypes,
  ReferenceSystemCoursesPageOptionsType,
} from '@/types/cabinet/ReferenceCoursesTypes'
import type { CurrencyKeyList } from '@/types/cabinet/ReferenceCurrenciesTypes'
const BASE_URL_ADDITIONAL = 'admin'

export const fetchReferenceSystemCourses = async (
  params: ReferenceSystemCoursesPageOptionsType
) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<ReferencePartySystemCoursesDataItemType>
    >(`${BASE_URL_ADDITIONAL}/system-courses`, {
      params,
    })
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

export const createEditReferenceSystemCourses = async (
  form: ReferenceSystemCoursesFormTypes
) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(
        `${BASE_URL_ADDITIONAL}/system-courses/${form.id}`,
        form
      )
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/system-courses`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
