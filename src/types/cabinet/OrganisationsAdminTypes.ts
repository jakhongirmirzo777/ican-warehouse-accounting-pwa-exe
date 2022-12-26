export interface Links {
  per_page: number
  current_page: number
  total: number
  from: number
  last_page: number
}

export interface MkoOrganisation {
  index: number
  address: string
  company_name: string
  created_at: string
  director: string
  id: number
  inn: string
  mfo: string
  name: string
  phones: string[]
  status: number
}

export interface MkoOrganisationEditValues {
  address: string | null
  company_name: string | null
  created_at: string | null
  director: string | null
  id: number | null
  inn: string | null
  mfo: string | null
  name: string | null
  phones: string[]
  status: number | null
}

export interface MkoOrganisationData {
  data: MkoOrganisation[]
  links: Links
}
