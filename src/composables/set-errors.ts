import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { $translate } from '@/plugins/i18n'
import { useNotificationService } from '@/plugins/notification-service'

const { $errorMessage } = useNotificationService()

export function useFormActions(actions: ActionInterface) {
  const $setFormErrors = (err: any) => {
    const errors = err?.response?.data?.errors || {}
    actions.setErrors(errors)
  }

  const $resetForm = () => {
    actions.resetForm()
  }

  return {
    $setFormErrors,
    $resetForm,
  }
}

export function useErrorActions() {
  const $setResponseErrors = (err: any) => {
    let message = $translate('undefinedError')
    if (err?.response?.data?.message) {
      message = err.response.data.message
    }
    console.error(err)
    $errorMessage(message)
  }

  return {
    $setResponseErrors,
  }
}
