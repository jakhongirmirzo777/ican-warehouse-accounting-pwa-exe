export interface FinanceAccountDataItemType {
  id: number
  organisation_id: number
  organisation_name: string
  counterparty_id: number
  counterparty_name: string
  index: number
  rub: CurrencyTypes
  sum: CurrencyTypes
  usd: CurrencyTypes
}

export interface FinanceAccountHistoryDataItemType {
  amount: string
  comment: string
  counterparty_account: string
  currency_name: string
  id: number
  organisation_account: string
  payer: string
  payment_purpose: string
  index: number
}

export interface CurrencyTypes {
  balance: number | string
  credit: number | string
  debit: number | string
  is_profitable: boolean
}

export interface FinanceAccountPageOptionsType {
  page?: number
  organisation_ids?: Array<any>
  counterparty_id: number | string
  from: string
}

export interface FinanceAccountHistoryPageOptionsType {
  page?: number
  organisation_id: number | string
  counterparty_id: number | string
}
