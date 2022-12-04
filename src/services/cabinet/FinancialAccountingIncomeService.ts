import http from '@/plugins/http'
import type {
  FinancialIncomeOptionsType,
  FinancialIncomeFormTypes,
  FinancialIncomeDataItemType,
} from '@/types/cabinet/FinancialIncomeTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchIncome = async (params: FinancialIncomeOptionsType) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<FinancialIncomeDataItemType>
    >(`${BASE_URL_ADDITIONAL}/income`, {
      params: { ...params },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteIncome = async (id: number) => {
  try {
    const { data } = await http.delete<FinancialIncomeOptionsType>(
      `${BASE_URL_ADDITIONAL}/income/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditIncome = async (form: FinancialIncomeFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/income/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/income`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
