export interface ListTypes {
  name: string
  path?: string
  icon?: string
  isOpen?: boolean
  children?: Array<ListTypes>
}
