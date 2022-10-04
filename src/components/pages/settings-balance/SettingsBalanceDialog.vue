<template>
  <VModal
    width="400px"
    :title="t('makePayment')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol>
          <VInput
            vid="number"
            pattern="####-####-####-####"
            :label="t('cardNumber')"
            rules="required"
            v-model="formData.number"
          />
        </VCol>
        <VCol>
          <VInput
            vid="expiry_date"
            pattern="##/##"
            :label="t('expireDate')"
            rules="required"
            v-model="formData.expiry_date"
          />
        </VCol>
        <VCol>
          <VInput
            vid="amount"
            type="money"
            :label="t('amount')"
            rules="required"
            v-model="formData.amount"
          />
        </VCol>
      </VRow>
      <VLine class="mb-24" />
      <div class="d-flex justify-end align-center">
        <VBtn
          type="button"
          class="mr-16"
          outlined
          width="130px"
          color="primary"
          radius="12px"
          @click="$emit('update:modelValue', false)"
        >
          {{ t('cancel') }}
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          width="130px"
          :loading="loading"
          radius="12px"
        >
          {{ t('makePayment') }}
        </VBtn>
      </div>
    </Form>
  </VModal>
  <VModal width="400px" :title="t('confirm')" v-model="confirmDialog">
    <Form @submit="onConfirm" ref="confirmFormObj">
      <VRow>
        <VCol>
          <VInput
            vid="otp"
            pattern="######"
            :label="t('smsCode')"
            rules="required"
            v-model="formData.otp"
          />
        </VCol>
      </VRow>
      <VLine class="mb-24" />
      <div class="d-flex justify-end align-center">
        <VBtn
          type="button"
          class="mr-16"
          outlined
          width="130px"
          color="primary"
          radius="12px"
          @click="confirmDialog = false"
        >
          {{ t('cancel') }}
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          width="130px"
          :loading="confirmLoading"
          radius="12px"
        >
          {{ t('confirm') }}
        </VBtn>
      </div>
    </Form>
  </VModal>
</template>

<script lang="ts" setup>
import VModal from '@/components/ui/VModal.vue'
import VInput from '@/components/ui/VInput.vue'
import VLine from '@/components/ui/VLine.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'

import { ref, watch } from 'vue'
import {
  confirmPayment,
  createPayment,
} from '@/services/cabinet/SettingsBalanceService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import { $clearNonDigits } from '@/utils/pure-functions'
import { useNotificationService } from '@/plugins/notification-service'

const { $successMessage } = useNotificationService()

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  number: null,
  expiry_date: null,
  amount: null,
  session: null,
  otp: null,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue', 'submit'])

const formObj = ref<any>(null)
const confirmFormObj = ref<any>(null)
const loading = ref(false)
const confirmLoading = ref(false)
const confirmDialog = ref(false)
const formData = ref<Record<string, any>>({ ...FORM_DATA })

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      formData.value = { ...FORM_DATA }
      formObj.value?.resetForm()
    }
  }
)

watch(
  () => confirmDialog.value,
  (val) => {
    if (!val) {
      formData.value.otp = null
      confirmFormObj.value?.resetForm()
    }
  }
)

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const newFormData = { ...formData.value }
    newFormData.number = $clearNonDigits(newFormData.number)
    newFormData.amount = $clearNonDigits(newFormData.amount)
    const {
      data: { data },
    } = await createPayment(newFormData)
    formData.value.session = data.session
    confirmDialog.value = true
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

const onConfirm = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    confirmLoading.value = true
    const newFormData = { ...formData.value }
    newFormData.number = $clearNonDigits(newFormData.number)
    newFormData.amount = $clearNonDigits(newFormData.amount)
    await confirmPayment(newFormData)
    confirmDialog.value = false
    $successMessage(t('notifications.paidSuccessfully'))
    await emits('submit')
    await emits('update:modelValue', false)
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    confirmLoading.value = false
  }
}
</script>
