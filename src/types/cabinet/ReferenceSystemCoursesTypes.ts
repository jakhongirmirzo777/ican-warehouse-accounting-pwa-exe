export interface ReferenceSystemCoursesFormTypes {
  amount: string
  id?: number
  currency_id?: number
  _method?: string
}

export interface ReferencePartySystemCoursesDataItemType {
  id: number
  name: string
  amount?: string
  type: string
  index?: number
}

export interface ReferenceSystemCoursesPageOptionsType {
  page?: number
}
