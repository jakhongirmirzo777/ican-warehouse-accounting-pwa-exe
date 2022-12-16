import http from '@/plugins/http'
import type {
  FinancialSpendingOptionsType,
  FinancialSpendingDataItemType,
} from '@/types/cabinet/FinancialSpendingTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchRevertedChecks = async (
  params: FinancialSpendingOptionsType
) => {
  try {
    const { data } = await http.get<
      FetchDataTypes<FinancialSpendingDataItemType>
    >(`${BASE_URL_ADDITIONAL}/cash-box/reverted-checks`, {
      params: { ...params },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
