export interface ReferenceLocationsFormTypes {
  id?: number
  name_uz: string
  name_oz: string
  name_ru: string
  status: number | string
  parent_id: number | string
  _method?: string
}

export interface ReferenceLocationsDataItemType {
  id: number
  name_uz: string
  name_oz: string
  name_ru: string
  status: number
  location: number
  index: number
}

export interface LocationsPageOptionsType {
  page?: number
}

export interface LocationListType {
  id: number
  name: string
}
