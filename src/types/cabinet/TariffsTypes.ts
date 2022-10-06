export interface TariffFormTypes {
  id?: number
  name: string
  max_stores: string
  passive_period: string
  amount: string
  _method?: string
}

export interface TariffDataItemType {
  id: number
  index: number
  amount: string
  name: string
  max_stores: string
  passive_period: string
}

export interface TariffPageOptionsType {
  page?: number
}
