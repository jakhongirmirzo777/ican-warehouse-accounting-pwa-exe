export function useStorageService() {
  const get = (key: string): string | null => {
    const value = localStorage.getItem(key)
    if (value) return JSON.parse(value)
    return null
  }

  const set = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value))
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
