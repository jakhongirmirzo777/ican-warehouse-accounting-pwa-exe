export interface FinancialSpendingFormTypes {
  id?: number
  organisation_id: number | null
  account_id: number | null
  counterparty_id: number | null
  counterparty_account_id: number | null
  contract_id: number | null
  invoice_id: number | null
  currency_id: number | null
  type_id: number | null
  amount: string
  document_number: number | null
  document_date: string
  comment: string
  payment_purpose: string
  _method?: string
}

export interface FinancialSpendingDataItemType {
  id: number
  document_number: string
  document_date: string
  contract_number: string
  invoice_number: string
  amount: number
  type_id: number
  organisation_name: string
  organisation_account: string
  counterparty_name: string
  counterparty_id: number
  payment_purpose: string
  status: string
  comment: string
  index: number
}

export interface FinancialSpendingOptionsType {
  search: string
  page?: number
  counterparty_id: number | null
  date: string
  contract_id: number | null
  type_id: number | null
  account_id: number | null
  invoice_id: number | null
  organisation_ids: Array<any> | null
}
