export interface SettlementFormTypes {
  id?: number
  organisation_id: number | null
  account: string
  comment: string
  _method?: string
}

export interface SettlementDataItemType {
  id: number
  organisation_id: number
  index: number
  account: string
  comment: string
  created_at: string
}

export interface SettlementPageOptionsType {
  page?: number
  organisation_ids?: Array<any>
}
