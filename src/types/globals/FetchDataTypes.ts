export interface FetchDataTypes<T> {
  data: Array<T>
  links?: Links
}

export interface Links {
  per_page: number
  current_page: number
  total: number
  from: number
  last_page: number
}

export interface ItemsValue<T> {
  value: Array<T>
}
