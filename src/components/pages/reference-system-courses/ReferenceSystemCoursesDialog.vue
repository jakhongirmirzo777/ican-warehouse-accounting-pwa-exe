<template>
  <VModal
    :title="form.id ? t('editCurrencies') : t('addCurrencies')"
    v-model="dialog"
    width="448"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol>
          <VInput
            :label="$t('amount')"
            rules="required|max:255"
            vid="amount"
            type="money"
            v-model="form.amount"
          />
        </VCol>
      </VRow>
      <VLine class="mt-12" />
      <VCardAction class="mt-24">
        <VSpacer />
        <VBtn color="primary" outlined @click="dialog = false"
          >{{ $t('cancel') }}
        </VBtn>
        <VBtn color="primary" type="submit" class="ml-16" :loading="loading"
          >{{ form.id ? $t('edit') : $t('add') }}
        </VBtn>
      </VCardAction>
    </Form>
  </VModal>
</template>

<script setup lang="ts">
import VModal from '@/components/ui/VModal.vue'
import VCardAction from '@/components/ui/VCardAction.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VLine from '@/components/ui/VLine.vue'
import { Form } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { createEditReferenceSystemCourses } from '@/services/cabinet/ReferenceSystemCoursesService'
import type { ReferenceSystemCoursesFormTypes } from '@/types/cabinet/ReferenceSystemCoursesTypes'
import { $clearNonDigits } from '@/utils/pure-functions'

interface ValueType<T> {
  value: T
}

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  amount: '',
}

defineProps({
  positionList: Array,
  counterpartyList: Array,
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form: ValueType<ReferenceSystemCoursesFormTypes> = ref({
  ...FORM_DATA,
})

const loading = ref(false)

const formRef = ref()

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    if (formRef.value) formRef.value.resetForm()
  }
})

const openDialog = (item: ReferenceSystemCoursesFormTypes) => {
  if (item && item.id) {
    form.value.currency_id = item.currency_id
    form.value.amount = item.amount
    form.value.id = item.id
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    form.value.amount = $clearNonDigits(form.value.amount)
    await createEditReferenceSystemCourses(form.value)
    emits('fetch-data')
    $successMessage(t('notifications.addedSuccessfully'))
    dialog.value = false
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

defineExpose({ openDialog })
</script>

<style scoped></style>
