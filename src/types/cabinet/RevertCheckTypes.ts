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

export interface RevertedCheckFormType {
  check_number: string
  client_type: string
  user_id: number | null
  comment: number | null
  _method?: string
  payments?: Array<FormPaymentTypes>
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

export interface FormPaymentTypes {
  amount: number | string
  payment_type: string
}
