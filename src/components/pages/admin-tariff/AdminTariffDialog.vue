<template>
  <VModal
    :title="form.id ? $t('editTariff') : $t('addTariff')"
    v-model="dialog"
    width="718"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol md="6">
          <VInput
            :label="$t('name')"
            rules="required|max:255"
            vid="name"
            v-model="form.name"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('maxStores')"
            rules="required"
            type="number"
            vid="max_stores"
            v-model="form.max_stores"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('passivePeriod')"
            rules="required"
            vid="passive_period"
            type="money"
            v-model="form.passive_period"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('amount')"
            rules="required"
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
import { createEditTariffs } from '@/services/cabinet/AdminTariffsService'
import type { TariffFormTypes } from '@/types/cabinet/AdminTariffTypes'
import { $clearNonDigits } from '@/utils/pure-functions'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  name: '',
  max_stores: '',
  passive_period: '',
  amount: '',
}

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form = ref<TariffFormTypes>({
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

const openDialog = (item: TariffFormTypes) => {
  if (item && item.id) {
    form.value = { ...item }
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    if (!Number.isInteger(form.value.amount))
      form.value.amount = $clearNonDigits(form.value.amount)
    if (!Number.isInteger(form.value.passive_period))
      form.value.passive_period = $clearNonDigits(form.value.passive_period)
    loading.value = true
    await createEditTariffs(form.value)
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
