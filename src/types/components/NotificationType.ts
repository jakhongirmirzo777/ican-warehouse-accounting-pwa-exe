type stateTypes = 'success' | 'error' | 'warning'

export interface NotificationType {
  delay?: number
  message: string
  type?: stateTypes
  status?: boolean
  id?: number
}
