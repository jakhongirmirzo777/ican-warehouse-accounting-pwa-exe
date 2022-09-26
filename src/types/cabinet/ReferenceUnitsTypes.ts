export interface ReferenceUnitsFormTypes {
  id?: number
  name_uz: string
  name_oz: string
  name_ru: string
  _method?: string
}

export interface ReferencePartyUnitsDataItemType {
  id: number
  amount: string
  position: string
  date: string
  counterparty_id: number
  number: string
  index: number
  counterparty: string
  type: string
}

export interface UnitsPageOptionsType {
  page?: number
  search?: string
}
