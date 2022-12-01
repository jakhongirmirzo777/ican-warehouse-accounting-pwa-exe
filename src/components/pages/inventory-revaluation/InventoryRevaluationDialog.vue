<template>
  <VModal
    width="700px"
    :title="!isUpdate ? t('createDocument') : t('editDocument')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol v-if="!isUpdate" md="6">
          <VInput
            disabled
            vid="number"
            :label="t('numberForDocument')"
            rules="required|max:255"
            v-model="formData.number"
          />
        </VCol>
        <VCol md="6">
          <VDatepicker
            vid="date"
            :label="t('date')"
            rules="required"
            v-model="formData.date"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            vid="organisation_id"
            autocomplete
            rules="required"
            :label="t('organisation')"
            :items="organisations"
            v-model="formData.organisation_id"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            autocomplete
            can-add
            vid="store_id"
            rules="required"
            :label="t('warehouse')"
            :items="warehouses"
            v-model="formData.store_id"
            @add="warehousesDialog = true"
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
  <WarehousesDialog v-model="warehousesDialog" @submit="$emit('re-fetch')" />
</template>

<script lang="ts" setup>
import VModal from '@/components/ui/VModal.vue'
import VInput from '@/components/ui/VInput.vue'
import VLine from '@/components/ui/VLine.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import WarehousesDialog from '@/components/pages/warehouses/WarehousesDialog.vue'

import { ref, watch } from 'vue'
import {
  createRevaluation,
  editRevaluation,
  fetchDocumentNumber,
} from '@/services/cabinet/InventoryRevaluationService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  organisation_id: null,
  store_id: null,
  number: null,
  date: null,
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
  organisations: {
    type: Array,
    default: () => [],
  },
  warehouses: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue', 'submit', 're-fetch'])
const warehousesDialog = ref(false)
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
      formData.value.id = props.data.id || null
      formData.value.organisation_id = props.data.organisation_id || null
      formData.value.store_id = props.data.store_id || null
      formData.value.date = props.data.date || null
    } else if (val && !props.isUpdate) {
      useFetchDocumentNumber()
    }
  }
)

const useFetchDocumentNumber = async () => {
  try {
    const {
      data: { data },
    } = await fetchDocumentNumber()
    formData.value.number = data.number
  } catch (err) {
    return Promise.reject(err)
  }
}

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const newFormData = { ...formData.value }
    if (!props.isUpdate) await createRevaluation(newFormData)
    else await editRevaluation(newFormData)
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
