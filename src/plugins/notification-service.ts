import { reactive } from 'vue'
import type { NotificationType } from '@/types/components/NotificationType'
import {
  NOTIFICATION_DEFAULT_DELAY,
  NOTIFICATION_TYPES,
} from '@/utils/constants'

export const NOTIFICATION_LIST = reactive<Array<NotificationType>>([])
let ID = 1

const setNotification = (notify: NotificationType) => {
  notify.status = true
  notify.type = notify.type || NOTIFICATION_TYPES.SUCCESS_TYPE
  notify.id = ID++
  NOTIFICATION_LIST.push(notify)
  setTimeout(() => {
    NOTIFICATION_LIST.shift()
  }, notify.delay || NOTIFICATION_DEFAULT_DELAY)
}

export function useNotificationService() {
  const $closeNotification = (id: number) => {
    NOTIFICATION_LIST.map((p: NotificationType, index: number) => {
      if (p.id === id) {
        NOTIFICATION_LIST.splice(index, 1)
      }
    })
  }

  const $successMessage = (message: string) => {
    setNotification({ message, type: NOTIFICATION_TYPES.SUCCESS_TYPE })
  }

  const $errorMessage = (message: string) => {
    setNotification({ message, type: NOTIFICATION_TYPES.ERROR_TYPE })
  }

  const $warningMessage = (message: string) => {
    setNotification({ message, type: NOTIFICATION_TYPES.WARNING_TYPE })
  }

  return {
    $closeNotification,
    $successMessage,
    $errorMessage,
    $warningMessage,
  }
}
