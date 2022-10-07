export const $removeLocaleFromPath = (path: string): string => {
  if (!path) return ''
  return path.replace(/(\/ru\/|\/uz\/|\/oz\/)/gi, '')
}

export const $phoneFormat = (payload: string) => {
  if (payload) {
    const phone = payload.toString()?.replace(/\D/gi, '')
    const match = phone.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/)
    if (match) {
      return `+${match[1]}${match[2]} ${match[3]} ${match[4]} ${match[5]}`
    }
    return phone
  } else {
    return '-'
  }
}

export const $moneyFormat = (val: string | number) => {
  if (!val) return ''
  const num = val ? Math.round(+val * 100) / 100 : null
  return num ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') : 0
}

export const $moneyFormatWithComma = (val: string | number) => {
  if (!val) return ''
  return val
    .toString()
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const $clearNonDigits = (val: string) => {
  if (!val) return ''
  return val.replace(/\D/g, '')
}

export const $clearExtension = (val: string, ext = 'px') => {
  if (isNaN(+val)) return val
  else return `${val}${ext}`
}

export const $downloadFile = (url: string, fileName = 'file') => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  a.href = url
  a.download = fileName
  a.click()
  a.remove()
}

export const $downloadBlobFile = (blob: Blob, fileName = 'file') => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
  a.remove()
}

export const $debounce = (fn: (_: unknown) => unknown, delay = 300) => {
  let timeout: NodeJS.Timeout
  return function (...args: unknown[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(args)
    }, delay)
  }
}

export const $getValuesByKey = (
  modelObj: Record<string, any>,
  obj: Record<string, string>
) => {
  return Object.entries(modelObj).reduce(
    (acc: Record<string, string>, [key, value]) => {
      if (key in obj) acc[key] = obj[key]
      else acc[key] = value
      return acc
    },
    {}
  )
}

export const $deepEquals = (valueOne: any, valueTwo: any) => {
  if (typeof valueOne !== 'object' && typeof valueTwo !== 'object') {
    const isValueOneNaN = isNaN(valueOne) && typeof valueOne === 'number'
    const isValueTwoNaN = isNaN(valueTwo) && typeof valueTwo === 'number'

    if (isValueOneNaN && isValueTwoNaN) return true

    return valueOne === valueTwo
  }

  if (typeof valueOne !== typeof valueTwo) return false

  if (valueOne === null && valueTwo === null) return true
  if (valueOne === null || valueTwo === null) return false
  if (valueOne === valueTwo) return true

  if (Array.isArray(valueOne) && Array.isArray(valueTwo)) {
    if (valueOne.length !== valueTwo.length) return false
    for (let i = 0; i < valueOne.length; i++) {
      if (!$deepEquals(valueOne[i], valueTwo[i])) return false
    }
    return true
  }

  const valueOneKeys = Object.keys(valueOne)
  const valueTwoKeys = Object.keys(valueTwo)

  if (valueOneKeys.length !== valueTwoKeys.length) return false
  if (!$deepEquals(valueOneKeys, valueTwoKeys)) return false

  for (let i = 0; i < valueOneKeys.length; i++) {
    const key = valueOneKeys[i]
    const valueOneValue = valueOne[key]
    const valueTwoValue = valueTwo[key]
    if (!$deepEquals(valueOneValue, valueTwoValue)) return false
  }

  return true
}

export const $calcTableIndex = (
  currentPage: number,
  perPage: number,
  index: number
) => {
  return (currentPage - 1) * perPage + index + 1
}

export const $isPageExists = (total: number, perPage: number) => {
  if (!total || !perPage) return true
  return total % perPage === 1
}

export const $parseQueryArray = (
  value: string[] | string,
  type: 'number' | 'string' = 'number'
) => {
  if (Array.isArray(value) && type === 'number') {
    return value.map((item: string) => +item)
  } else if (Array.isArray(value) && type === 'string') {
    return value.map((item: string) => item.toString())
  } else if (!Array.isArray(value) && value && type === 'number') {
    return [+value]
  } else if (!Array.isArray(value) && value && type === 'string') {
    return [value.toString()]
  } else {
    return []
  }
}

export const $parseQueryStatus = (status: string | undefined | null) => {
  if (!status) return null
  if (+status === 0) return 0
  return +status
}
