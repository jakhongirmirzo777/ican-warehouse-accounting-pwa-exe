<template>
  <VModal
    width="400px"
    :title="!isUpdate ? t('addWarehouse') : t('editWarehouse')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol>
          <VInput
            vid="name"
            :label="t('name')"
            rules="required|max:255"
            v-model="formData.name"
          />
        </VCol>
        <VCol>
          <VSelect
            vid="organisation_id"
            autocomplete
            rules="required"
            :label="t('organisation')"
            :items="organisations"
            v-model="formData.organisation_id"
          />
        </VCol>
        <VCol>
          <VInput
            vid="address"
            :label="t('address')"
            rules="required|max:255"
            v-model="formData.address"
          />
        </VCol>
        <VCol>
          <VInput
            vid="director"
            :label="t('director')"
            rules="required|max:255"
            v-model="formData.director"
          />
        </VCol>
        <VCol>
          <VInput
            vid="phone"
            type="phone"
            :label="t('phone')"
            rules="required"
            v-model="formData.phone"
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
import {
  createWarehouse,
  editWarehouse,
} from '@/services/cabinet/WarehousesService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import { $clearNonDigits } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  name: null,
  organisation_id: null,
  address: null,
  director: null,
  phone: null,
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
      formData.value.id = props.data.id || null
      formData.value.name = props.data.name || null
      formData.value.organisation_id = props.data.organisation_id || null
      formData.value.address = props.data.address || null
      formData.value.director = props.data.director || null
      formData.value.phone = props.data.phone || null
    }
  }
)

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const formDataNew = { ...formData.value }
    formDataNew.phone = $clearNonDigits(formDataNew.phone)
    if (!props.isUpdate) await createWarehouse(formDataNew)
    else await editWarehouse(formDataNew)
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
