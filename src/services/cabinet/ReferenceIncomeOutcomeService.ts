import http from '@/plugins/http'

export const fetchIncome = async (page: number) => {
  try {
    const data = await http.get('/organisation/reference/income?type=income', {
      params: { page },
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchOutcome = async (page: number) => {
  try {
    const data = await http.get(
      '/organisation/reference/expenses?type=expense',
      {
        params: { page },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createIncome = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/reference/income', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createOutcome = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post('/organisation/reference/expenses', formData)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editIncome = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/reference/income/${formData.id}`,
      {
        ...formData,
        _method: 'PUT',
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const editOutcome = async (
  formData: Record<string, string | number | null>
) => {
  try {
    const data = await http.post(
      `/organisation/reference/expenses/${formData.id}`,
      {
        ...formData,
        _method: 'PUT',
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteIncome = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/reference/income/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteOutcome = async (id: number) => {
  try {
    const data = await http.delete(`/organisation/reference/expenses/${id}`)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const fetchIncomeOutcomeList = async (
  type = 'income',
  organisation_id: number | null
) => {
  try {
    const params = {} as Record<string, any>
    if (organisation_id) params.organisation_id = organisation_id
    const data = await http.get(
      `/organisation/reference/income/list?type=${type}`,
      {
        params: {
          ...params,
        },
      }
    )
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
