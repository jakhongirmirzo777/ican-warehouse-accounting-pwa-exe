export interface ReportSalesTypesConsolidateParamsTypes {
  page: number
  search: string
  status: number | null
  organisation_ids: Array<number>
  client_type: string
  payment_type: string
  date_from: string
  date_to: string
  store_id: number | null
}
