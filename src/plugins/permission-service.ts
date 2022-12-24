import { useUserService } from '@/plugins/user-service'

const { user } = useUserService()

export const $can = (permission: string | string[]): boolean => {
  if (!permission || (permission && !permission.length)) return false
  const permissions = user.value?.permissions || {}
  if (typeof permission === 'string') {
    return permissions[(permission as string).toLowerCase()]
  } else {
    return (permission as string[]).some(
      (item: string) => permissions[item.toLowerCase()]
    )
  }
}
