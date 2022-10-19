<template>
  <VModal
    width="400px"
    :title="!isUpdate ? t('addSystemCourse') : t('editSystemCourse')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol v-if="!isUpdate">
          <VSelect
            vid="currency_id"
            :label="t('currencyType')"
            rules="required"
            :items="currencyTypes"
            v-model="formData.currency_id"
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
          {{ !isUpdate ? t('add') : t('edit') }}
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

import { ref, watch } from 'vue'
import { createOrUpdateCurrency } from '@/services/cabinet/SettingsCurrenciesService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import { $clearNonDigits } from '@/utils/pure-functions'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  currency_id: null,
  amount: null,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  currencyTypes: {
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
    } else if (val && props.isUpdate) {
      formData.value.currency_id = props.data.currency_id || null
      formData.value.amount = props.data.amount || null
    }
  }
)

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const formDataCopy = { ...formData.value }
    formDataCopy.amount = +$clearNonDigits(formDataCopy.amount)
    await createOrUpdateCurrency(formDataCopy)
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
