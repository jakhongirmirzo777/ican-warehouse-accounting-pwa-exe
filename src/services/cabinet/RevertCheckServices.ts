import http from '@/plugins/http'
import type {
  RevertedCheckOptionsType,
  RevertedCheckDataItemType,
  RevertedCheckFormType,
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

export const searchCheckWith = async (params: RevertedCheckFormType) => {
  try {
    const { data } = await http.get(
      `${BASE_URL_ADDITIONAL}/cash-box/get-check`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const revertCheck = async (form: RevertedCheckFormType) => {
  try {
    const { data } = await http.post(
      `${BASE_URL_ADDITIONAL}/cash-box/revert-product`,
      form
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
