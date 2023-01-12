export function useStorageService(
  type: 'localStorage' | 'sessionStorage' = 'localStorage'
) {
  const getFromLocalStorage = (key: string, fallback?: any): any => {
    const value = localStorage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch (_e) {
        return value
      }
    }
    return fallback || null
  }

  const setToLocalStorage = (key: string, value: any): void => {
    if (typeof value !== 'string') {
      localStorage.setItem(key, JSON.stringify(value))
    } else localStorage.setItem(key, value)
  }

  const removeFromLocalStorage = (key: string): void => {
    localStorage.removeItem(key)
  }

  const clearLocalStorage = (): void => {
    localStorage.clear()
  }

  const getFromSessionStorage = (key: string, fallback: any): any => {
    const value = sessionStorage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch (_e) {
        return value
      }
    }
    return fallback || null
  }

  const setToSessionStorage = (key: string, value: any): void => {
    if (typeof value !== 'string') {
      sessionStorage.setItem(key, JSON.stringify(value))
    } else sessionStorage.setItem(key, value)
  }

  const removeFromSessionStorage = (key: string): void => {
    sessionStorage.removeItem(key)
  }

  const clearSessionStorage = (): void => {
    sessionStorage.clear()
  }

  if (type === 'localStorage') {
    return {
      $get: getFromLocalStorage,
      $set: setToLocalStorage,
      $remove: removeFromLocalStorage,
      $clear: clearLocalStorage,
    }
  } else {
    return {
      $get: getFromSessionStorage,
      $set: setToSessionStorage,
      $remove: removeFromSessionStorage,
      $clear: clearSessionStorage,
    }
  }
}
