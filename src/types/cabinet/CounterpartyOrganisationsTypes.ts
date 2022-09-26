export interface OrganizationsCounterpartyTypesFetch {
  id?: number
  index?: number
  organisation_id?: number
  brand_name: string
  company_name: string
  tin: string
  address: string
  director: string
  phones: string[]
  counterparty_accounts: Array<{ account: string }>
  _method?: string
}

export interface OrganizationFetchData {
  data: Array<OrganizationsCounterpartyTypesFetch>
  links?: Links
}

export interface Links {
  per_page: number
  current_page: number
  total: number
  from: number
  last_page: number
}

export interface OrganisationParams {
  page?: number
  search?: string
}

export interface OrganizationListType {
  brand_name: string
  company_name: string
  id: number
  organisation_id: number
}
