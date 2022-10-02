<template>
  <VModal
    width="400px"
    :title="!id ? t('addPayment') : t('revertPayment')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol v-if="!id">
          <VSelect
            vid="organisation_id"
            autocomplete
            rules="required"
            :label="t('organisations')"
            :items="organisations"
            v-model="formData.organisation_id"
          />
        </VCol>
        <VCol v-if="!id">
          <VSelect
            localize
            vid="type"
            rules="required"
            item-text="text"
            item-value="value"
            :label="t('paymentType')"
            :items="PAYMENT_TYPES_INDEXED"
            v-model="formData.type"
          />
        </VCol>
        <VCol v-if="!id">
          <VInput
            vid="amount"
            type="money"
            :label="t('amount')"
            rules="required"
            v-model="formData.amount"
          />
        </VCol>
        <VCol>
          <VArea
            vid="comment"
            :label="t('comment')"
            v-model="formData.comment"
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
          :width="id ? '150px' : '130px'"
          :loading="loading"
          radius="12px"
        >
          {{ !id ? t('add') : t('revertPayment') }}
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
import VSelect from '@/components/ui/VSelect.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VArea from '@/components/ui/VArea.vue'

import { ref, watch } from 'vue'
import {
  createPayment,
  revertPayment,
} from '@/services/cabinet/PaymentsService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import { PAYMENT_TYPES_INDEXED } from '@/utils/constants'
import { $clearNonDigits } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  organisation_id: null,
  type: null,
  amount: null,
  comment: null,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: [Number, String],
    default: '',
  },
  organisations: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue', 'submit'])

const formObj = ref<any>(null)
const loading = ref(false)
const formData = ref<Record<string, any>>({ ...FORM_DATA })

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      formData.value = { ...FORM_DATA }
      formObj.value?.resetForm()
    } else if (val && props.id) {
      formData.value.id = props.id || null
    }
  }
)

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    formData.value.amount = +$clearNonDigits(formData.value.amount)
    if (!props.id) await createPayment(formData.value)
    else await revertPayment(formData.value)
    await emits('submit')
    await emits('update:modelValue', false)
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}
</script>
