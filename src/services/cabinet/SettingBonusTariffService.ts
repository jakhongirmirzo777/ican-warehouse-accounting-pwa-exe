import http from '../../plugins/http'
import type { FetchDataTypes } from '@/types/globals/FetchDataTypes'
import type {
  SettingBonusFormTypes,
  SettingBonusPageOptionsType,
  SettingBonusDataItemType,
} from '@/types/cabinet/SettingBonusTariffTypes'
const BASE_URL_ADDITIONAL = 'organization'

export const fetchSettingBonuses = async (
  params: SettingBonusPageOptionsType
) => {
  try {
    const { data } = await http.get<FetchDataTypes<SettingBonusDataItemType>>(
      `${BASE_URL_ADDITIONAL}/bonuses`,
      {
        params: { ...params },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteSettingBonuses = async (id: number) => {
  try {
    const { data } = await http.delete<SettingBonusDataItemType>(
      `${BASE_URL_ADDITIONAL}/bonuses/${id}`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createEditSettingBonuses = async (form: SettingBonusFormTypes) => {
  try {
    let data
    if (form.id) {
      form._method = 'PUT'
      data = await http.post(`${BASE_URL_ADDITIONAL}/bonuses/${form.id}`, form)
    } else data = await http.post(`${BASE_URL_ADDITIONAL}/units`, form)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
