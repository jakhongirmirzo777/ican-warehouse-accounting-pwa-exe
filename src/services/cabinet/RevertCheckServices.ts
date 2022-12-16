import http from '@/plugins/http'
import type {
  RevertedCheckOptionsType,
  RevertedCheckDataItemType,
} from '@/types/cabinet/RevertCheckTypes'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchRevertedChecks = async (params: RevertedCheckOptionsType) => {
  try {
    const { data } = await http.get<FetchDataTypes<RevertedCheckDataItemType>>(
      `${BASE_URL_ADDITIONAL}/cash-box/reverted-checks`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
