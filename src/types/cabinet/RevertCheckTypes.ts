export interface RevertedCheckFormTypes {
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

export interface RevertedCheckDataItemType {
  id: number
  index: number
  check_number: string
  client_type: string
  seller_user_id: number | null
  seller_name: string
  sale_date: string
  reverted_date: string
  reverting_user_id: number | null
  reverting_user_name: string
  organisation_id: number | null
  organisation_name: string
  buyer: string
  comment: string
  returning_amount_sum: number | null
}

export interface RevertedCheckOptionsType {
  search: string
  page?: number
  sale_date: string
  reverted_date: string
  reverting_user_id: number | string
  seller_user_id: number | string
  organisation_ids: Array<any> | []
}
