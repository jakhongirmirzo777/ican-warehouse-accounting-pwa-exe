export interface Links {
  per_page: number
  current_page: number
  total: number
  from: number
  last_page: number
}

export interface MkoOrganisation {
  id: number
  index: number
  name: string
  company_name: string
  system_course: boolean
  change_price_type: number | null
  inn: string | null
  mfo: string | null
  director: string
  address: string
  bank: string
  created_at: string
  account: string
  phones: string[]
  status: 10 | 1 | 0
  status_text: string
  logo_url: string | null
}

export interface MkoOrganisationData {
  data: MkoOrganisation[]
  links: Links
}

export interface MkoOrganisationEditValues {
  id: number | null
  name: string | null
  company_name: string | null
  system_course: number | null
  change_price_type: number | null
  inn: number | null
  mfo: number | null
  director: string | null
  address: string | null
  bank: string | null
  account: number | null
  phones: string[]
  logo_url: string | null
}
