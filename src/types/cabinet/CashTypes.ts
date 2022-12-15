export interface DirectSaleDataItemType {
  id: number
  product_id: number
  product_name: string
  barcode: string
  articule: string
  selling_price_sum: string | number
  selling_price_min: number
  income_avg_price_sum: string
  count: number
  sell_count: number
  index: number
  price: string | number
  isBonus: number
  bonus_id: number
  is_bonus: boolean
  store_id: number
}

export interface DirectSaleFormType {
  currency_id: number | null
  full_name?: string
  user_id?: number
  additional_amount_sum?: number | string
  total_amount: number | string
  payments: Array<PaymentsType>
  products: Array<DirectSaleFormProductType>
}

export interface EntitySellFormType {
  currency_id: number | string
  counterparty_id: number | string
  contract_id: number | string
  invoice_id: number | string
  additional_amount_sum?: number | string
  total_amount?: number | string
  user_id?: number | null
  products: Array<DirectSaleFormProductType>
}

export interface DirectSaleFormProductType {
  product_id: number | null
  count: number | null
  sold: number | string
  is_bonus: boolean
  bonus_id?: number | null
  id: number | null
}

export interface DirectSaleOptionsType {
  search: string
  store_id: number | string
  contract_id: number | string
  counterparty_id: number | string
  invoice_id: number | string
  additional_amount_sum: string | number
  currency_id: string | number
  user_id: string | number
}

export interface CheckBonusType {
  all_amount: number
  selling_price_sum: number | string
  additional_amount_sum?: number | string
  client_type: string
  currency_id?: number | string
}

export interface PaymentsType {
  payment_type: string
  type: string
  name?: string
  amount: string | number
}
