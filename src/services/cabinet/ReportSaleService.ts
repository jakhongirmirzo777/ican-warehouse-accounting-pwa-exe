import http from '@/plugins/http'
import type { ReportSalesTypesConsolidateParamsTypes } from '@/types/cabinet/ReportSaleTypes'
import type { RouteParamValue } from 'vue-router'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchReportSales = async (
  params: ReportSalesTypesConsolidateParamsTypes
) => {
  try {
    const data = await http.get(
      `${BASE_URL_ADDITIONAL}/reports/sale/sale-reports`,
      {
        params,
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getReportProducts = async (id: string | RouteParamValue[]) => {
  try {
    const { data } = await http.get(
      `${BASE_URL_ADDITIONAL}/reports/sale/sale-reports-products/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchCategories = async () => {
  try {
    const data = await http.get('/organisation/category/parents')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchOrganisations = async () => {
  try {
    const data = await http.get('/organisation/organisation/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchWarehouses = async () => {
  try {
    const data = await http.get('/organisation/store/list')
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
