import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  SettlementPageOptionsType,
  SettlementFormTypes,
  SettlementDataItemType,
} from '@/types/cabinet/FinancialAccountingSettlementTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchSettlement = async (params: SettlementPageOptionsType) => {
  try {
    const { data } = await http.get<FetchDataTypes<SettlementDataItemType>>(
      `${BASE_URL_ADDITIONAL}/accounts`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteSettlement = async (id: number) => {
  try {
    const { data } = await http.delete<SettlementDataItemType>(
      `${BASE_URL_ADDITIONAL}/accounts/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditSettlement = async (form: SettlementFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/accounts/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/accounts`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchAccountingSettlementList = async (id: number | null) => {
  try {
    const { data } = await http.get<{ data: Array<Record<string, any>> }>(
      `${BASE_URL_ADDITIONAL}/accounts/list`,
      {
        params: {
          organisation_id: id ?? '',
        },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
