export interface CounterpartyInvoiceFormTypes {
  id?: number | string
  amount: string
  position: string
  date: string
  counterparty_id: number | string
  number: string
  _method?: string
}

export interface CounterPartyDataItemType {
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

export interface InvoiceParams {
  page?: number
  search?: string
}

export interface InvoicePageOptionsType {
  counterparty_id: string
  date: string
  type: string
  position: string
  search: string
  page: number
}

export interface InvoiceListType {
  id: number
  organisation_id: number
  counterparty_id: number
  number: string
  type: string
  position: string
  amount: string
}


