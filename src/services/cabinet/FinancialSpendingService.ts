import http from '@/plugins/http'
import type {
  FinancialSpendingOptionsType,
  FinancialSpendingFormTypes,
  FinancialSpendingDataItemType,
} from '@/types/cabinet/FinancialSpendingTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchSpending = async (params: FinancialSpendingOptionsType) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<FinancialSpendingDataItemType>
    >(`${BASE_URL_ADDITIONAL}/spending`, {
      params: { ...params },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteSpending = async (id: number) => {
  try {
    const { data } = await http.delete<
      FetchDataTypes<FinancialSpendingDataItemType>
    >(`${BASE_URL_ADDITIONAL}/spending/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditSpending = async (form: FinancialSpendingFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/spending/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/spending`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
