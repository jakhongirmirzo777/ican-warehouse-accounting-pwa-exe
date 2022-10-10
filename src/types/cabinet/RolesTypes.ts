export interface RolesFormTypes {
  id?: number
  name: string
  description: string
  is_default?: number
  permissions: Array<string>
  _method?: string
}

export interface RolesDataItemType {
  id: number
  index: number
  name: string
  description: string
}

export interface RolesPageOptionsType {
  page?: number
  search?: string
}

export interface PermissionsListTypes {
  name: string
  description: string
}

export interface OneRoleType {
  permissions: Array<{ name: string }>
  name: string
  id: number
  is_default: boolean
  description: string
}
