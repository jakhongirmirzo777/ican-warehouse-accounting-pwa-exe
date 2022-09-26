export interface CategoryInterface {
  id: number
  parent_id: number
  name: string
  organisation_id: string
  created_at: string | null
  deleted_at: string | null
  updated_at: string | null
}

export interface CategoryParentsInterface {
  children: CategoryInterface[]
  id: number
  name: string
  organisation_id: number
  parent_id: null | number
}
