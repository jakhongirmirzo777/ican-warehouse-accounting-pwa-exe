<template>
  <VModal
    width="425px"
    :title="t('editPutPlace')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol md="4">
          <VText class="mt-md-10 mt-0" color="#18275D" size="14" tag="div"
            >{{ t('moveTo') }}:</VText
          >
        </VCol>
        <VCol md="8">
          <VSelect
            disabled
            localize
            label=""
            :name="t('putPlace')"
            vid="move_to"
            rules="required"
            item-text="text"
            item-value="value"
            :items="PUT_PLACE_INDEXED"
            v-model="formData.move_to"
          />
        </VCol>
        <VCol md="4">
          <VText class="mt-md-10 mt-0" color="#18275D" size="14" tag="div"
            >{{ t('quantity') }}:</VText
          >
        </VCol>
        <VCol md="8">
          <VInput
            label=""
            :name="t('quantity')"
            vid="count"
            :rules="{
              required: true,
              max_value: isShowcase ? data.count_stock : data.count_showcase,
            }"
            v-model="formData.count"
          >
            <template #append>
              {{ data.unit_name }}
            </template>
          </VInput>
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
import VSelect from '@/components/ui/VSelect.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VText from '@/components/ui/VText.vue'

import { PUT_PLACE_INDEXED } from '@/utils/constants'
import { ref, watch } from 'vue'
import { moveProduct } from '@/services/cabinet/ReportsStockService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
const { $setResponseErrors } = useErrorActions()
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  move_to: null,
  count: null,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isShowcase: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
    default: () => ({}),
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
    } else if (val) {
      formData.value.id = props.data.id
      formData.value.move_to = props.isShowcase ? 1 : 0
    }
  }
)

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const formDataCopy = { ...formData.value }
    formDataCopy.count = +formDataCopy.count
    formDataCopy.move_to = formDataCopy.move_to ? 'showcase' : 'stock'
    await moveProduct(formDataCopy)
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
