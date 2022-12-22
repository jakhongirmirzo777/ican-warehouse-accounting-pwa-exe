export function useStorageService() {
  const get = (key: string): any => {
    const value = localStorage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch (_e) {
        return value
      }
    }
    return null
  }

  const set = (key: string, value: any): void => {
    if (typeof value !== 'string') {
      localStorage.setItem(key, JSON.stringify(value))
    } else localStorage.setItem(key, value)
  }

  const remove = (key: string): void => {
    localStorage.removeItem(key)
  }

  const clear = (): void => {
    localStorage.clear()
  }

  return {
    get,
    set,
    remove,
    clear,
  }
}
