import type { ReferencePartySystemCoursesDataItemType } from '@/types/cabinet/ReferenceCoursesTypes'

export interface ReferenceCoursesFormTypes {
  name_uz: string
  name_ru: string
  name_oz: string
  key: string
  url: string
  id?: number
  symbol: string
  _method?: string
}

export interface ReferencePartyCoursesDataItemType {
  id: number
  name_uz: string
  name_ru: string
  name_en: string
  key: string
  url: string
  index: number
  system_courses: Array<ReferencePartySystemCoursesDataItemType>
}

export interface ReferenceCoursesPageOptionsType {
  page?: number
}

export interface CurrencyKeyList {
  name: string
  id: number | string
  key: string | number
}
