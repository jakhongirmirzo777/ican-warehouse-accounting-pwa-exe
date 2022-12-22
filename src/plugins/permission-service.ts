import { useUserService } from '@/plugins/user-service'

const { user } = useUserService()

export const $can = (permission: string): boolean => {
  return true
  if (!permission) return false
  const permissions = user.value?.permissions || []

  return permissions.some(
    (item) => item.toLowerCase() === permission.toLowerCase()
  )
}
