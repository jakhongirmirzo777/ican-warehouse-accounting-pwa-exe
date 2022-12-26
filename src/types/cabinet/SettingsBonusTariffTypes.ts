export interface SettingBonusFormTypes {
  id?: number
  name: string
  amount_from: string
  amount_to: string
  percent_sell: string
  percent_sell_leg: string
  percent_credit: string
  _method?: string
}

export interface SettingBonusDataItemType {
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

export interface SettingBonusPageOptionsType {
  page?: number
  search?: string
}
