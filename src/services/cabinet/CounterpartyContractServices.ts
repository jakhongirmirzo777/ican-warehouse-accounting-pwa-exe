import http from '@/plugins/http'
import type {
  CounterpartyContractDataItemType,
  CounterpartyContractFormTypes,
  ContractPageOptionsType,
} from '@/types/cabinet/CounterpertyContractTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchContract = async (params: ContractPageOptionsType) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<CounterpartyContractDataItemType>
    >(`${BASE_URL_ADDITIONAL}/contract`, {
      params: { ...params },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteContract = async (id: number) => {
  try {
    const { data } = await http.delete<CounterpartyContractDataItemType>(
      `${BASE_URL_ADDITIONAL}/contract/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditContract = async (
  form: CounterpartyContractFormTypes
) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/contract/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/contract`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
