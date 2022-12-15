import http from '@/plugins/http'
import type {
  DirectSaleDataItemType,
  DirectSaleOptionsType,
  DirectSaleFormType,
  CheckBonusType,
  EntitySellFormType,
} from '@/types/cabinet/CashTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchDirectSale = async (params: DirectSaleOptionsType) => {
  try {
    const { data } = await http.get<FetchDataTypes<DirectSaleDataItemType>>(
      `${BASE_URL_ADDITIONAL}/product/search`,
      { params: { ...params } }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const submitDirectSale = async (form: DirectSaleFormType) => {
  try {
    const { data } = await http.post(
      `${BASE_URL_ADDITIONAL}/cash-box/sell`,
      form
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const submitEntitySell = async (form: EntitySellFormType) => {
  try {
    const { data } = await http.post(
      `${BASE_URL_ADDITIONAL}/cash-box/entity-sell`,
      form
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getPaymentTypes = async () => {
  try {
    const data = await http.get(`${BASE_URL_ADDITIONAL}/cash-box/payment-types`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const checkBonus = async (form: CheckBonusType) => {
  try {
    const data = await http.get(`${BASE_URL_ADDITIONAL}/cash-box/check-bonus`, {
      params: { ...form },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
