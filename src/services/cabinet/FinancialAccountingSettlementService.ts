import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  FinanceAccountDataItemType,
  FinanceAccountPageOptionsType,
  FinanceAccountHistoryPageOptionsType,
  FinanceAccountHistoryDataItemType,
} from '@/types/cabinet/FinanceAccountingTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchFinanceAccounting = async (
  params: FinanceAccountPageOptionsType
) => {
  try {
    const { data } = await http.get<FetchDataTypes<FinanceAccountDataItemType>>(
      `${BASE_URL_ADDITIONAL}/finance-accounting`,
      { params: { ...params } }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchFinanceAccountingList = async (
  params: FinanceAccountHistoryPageOptionsType
) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<FinanceAccountHistoryDataItemType>
    >(`${BASE_URL_ADDITIONAL}/finance-accounting/list`, {
      params: { ...params },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
