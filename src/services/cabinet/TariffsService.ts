import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  TariffPageOptionsType,
  TariffFormTypes,
  TariffDataItemType,
} from '@/types/cabinet/TariffsTypes'
const BASE_URL_ADDITIONAL = 'admin'

export const fetchTariffs = async (params: TariffPageOptionsType) => {
  try {
    const { data } = await http.get<FetchDataTypes<TariffDataItemType>>(
      `${BASE_URL_ADDITIONAL}/tariffs`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditTariffs = async (form: TariffFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/tariffs/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/tariffs`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
