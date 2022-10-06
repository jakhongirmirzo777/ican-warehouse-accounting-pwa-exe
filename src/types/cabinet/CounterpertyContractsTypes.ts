export interface CounterpartyContractFormTypes {
  id?: number
  counterparty_id: number | string
  number: number | string
  amount: number | string
  start_date: string
  finish_date: string
  position: string
  comment: string
  _method?: string
}

export interface CounterpartyContractDataItemType {
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

export interface ContractPageOptionsType {
  counterparty_id: string
  start_date: string
  finish_date: string
  position: string
  search: string
  page?: number
}
