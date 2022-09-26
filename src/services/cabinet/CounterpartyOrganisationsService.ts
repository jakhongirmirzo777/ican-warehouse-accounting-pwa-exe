import http from '../../plugins/http'
import type {
  OrganizationFetchData,
  OrganisationParams,
} from '@/types/cabinet/CounterpartyOrganisationsTypes'
import type { CounterpartyInvoiceFormTypes } from '@/types/cabinet/CounterpartyInvoiceTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchOrganisations = async (params: OrganisationParams) => {
  try {
    const { data } = await http.get<OrganizationFetchData>(
      `${BASE_URL_ADDITIONAL}/counterparty`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteOrganisations = async (id: number) => {
  try {
    const { data } = await http.delete<OrganizationFetchData>(
      `${BASE_URL_ADDITIONAL}/counterparty/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditOrganisations = async (
  form: CounterpartyInvoiceFormTypes
) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(
        `${BASE_URL_ADDITIONAL}/counterparty/${form.id}`,
        form
      )
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/counterparty`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
