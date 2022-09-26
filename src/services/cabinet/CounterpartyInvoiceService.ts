import http from '../../plugins/http'
import type {
  CounterpartyInvoiceFormTypes,
  CounterPartyDataItemType,
  InvoicePageOptionsType,
} from '@/types/cabinet/CounterpartyInvoiceTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type { OrganizationListType } from '@/types/cabinet/CounterpartyOrganisationsTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchInvoice = async (params: InvoicePageOptionsType) => {
  try {
    const { data } = await http.get<FetchDataTypes<CounterPartyDataItemType>>(
      `${BASE_URL_ADDITIONAL}/invoice`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getCounterpartyList = async () => {
  try {
    const { data } = await http.get<{ data: Array<OrganizationListType> }>(
      `${BASE_URL_ADDITIONAL}/counterparty/list`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteInvoice = async (id: number) => {
  try {
    const { data } = await http.delete<CounterpartyInvoiceFormTypes>(
      `${BASE_URL_ADDITIONAL}/invoice/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditInvoice = async (form: CounterpartyInvoiceFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/invoice/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/invoice`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
