import http from '../../plugins/http'
const BASE_URL_ADDITIONAL = 'organisation'

export const fetchUnits = async () => {
  try {
    const { data } = await http.get(
      `${BASE_URL_ADDITIONAL}/resources/units-list`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getCurrencyList = async () => {
  try {
    const { data } = await http.delete(
      `${BASE_URL_ADDITIONAL}/resources/currencies-list`
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
