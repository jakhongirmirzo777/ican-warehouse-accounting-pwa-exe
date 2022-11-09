<template>
  <VModal
    :title="form.id ? t('editInvoice') : t('addInvoice')"
    v-model="dialog"
    width="718"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('contractNumber')"
            rules="required"
            vid="number"
            v-model="form.number"
          />
        </VCol>
        <VCol v-if="!counterpartId" cols="12" md="6">
          <VSelect
            :label="$t('counterparties')"
            :items="counterpartyList"
            item-text="company_name"
            item-value="id"
            rules="required|max:255"
            vid="counterparty_id"
            v-model="form.counterparty_id"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VDatepicker
            :label="$t('dateConclusion')"
            rules="required"
            vid="start_date"
            v-model="form.start_date"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VDatepicker
            :label="$t('dateCompletion')"
            rules="required"
            vid="finish_date"
            v-model="form.finish_date"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            :items="positionList"
            item-value="value"
            item-text="text"
            :label="$t('position')"
            rules="required"
            vid="position"
            v-model="form.position"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('amount')"
            rules="required"
            :name="$t('amount')"
            vid="amount"
            type="money"
            v-model="form.amount"
          />
        </VCol>
        <VCol cols="12">
          <VArea
            :label="$t('comment')"
            rules="required"
            vid="comment"
            v-model="form.comment"
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
import VSelect from '@/components/ui/VSelect.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import { Form } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createEditContract } from '@/services/cabinet/CounterpartyContractsServices'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import type { CounterpartyContractFormTypes } from '@/types/cabinet/CounterpertyContractsTypes'
import { $clearNonDigits } from '@/utils/pure-functions'
import VArea from '@/components/ui/VArea.vue'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  counterparty_id: '',
  number: '',
  amount: '',
  start_date: '',
  finish_date: '',
  position: '',
  comment: '',
}

const props = defineProps({
  positionList: Array,
  counterpartyList: Array,
  counterpartId: {
    type: [Number, String],
    default: '',
  },
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form = ref<CounterpartyContractFormTypes>({ ...FORM_DATA })

const loading = ref(false)

const formRef = ref()

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    if (formRef.value) formRef.value.resetForm()
  }
})

const openDialog = (item: CounterpartyContractFormTypes) => {
  if (item && item.id) {
    form.value = { ...item }
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const newForm = { ...form.value }
    newForm.amount = $clearNonDigits(newForm.amount.toString())
    if (props.counterpartId) newForm.counterparty_id = props.counterpartId
    await createEditContract(newForm)
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
