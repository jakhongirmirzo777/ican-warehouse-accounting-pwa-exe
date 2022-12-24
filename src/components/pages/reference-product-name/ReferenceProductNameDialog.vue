<template>
  <VModal
    width="800px"
    :title="!isUpdate ? t('addProductName') : t('editProductName')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol md="6">
          <VInput
            vid="name"
            :label="t('name')"
            rules="required|max:255"
            v-model="formData.name"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            vid="category_id"
            autocomplete
            rules="required"
            :label="t('parentCategory')"
            :items="categories"
            v-model="categoryForm.parent_category_id"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            autocomplete
            clearable
            :disabled="!categoryForm.parent_category_id"
            :label="t('category')"
            :items="childCategories"
            v-model="categoryForm.child_category_id"
          />
        </VCol>
        <VCol v-if="!isUpdate" md="6">
          <VSelect
            vid="unit_id"
            autocomplete
            rules="required"
            :label="t('units')"
            :items="units"
            v-model="formData.unit_id"
          />
        </VCol>
        <VCol v-if="!isUpdate" md="6">
          <VInput
            vid="articule"
            :label="t('articule')"
            rules="required|max:255"
            v-model="formData.articule"
          />
        </VCol>
        <VCol v-if="!isUpdate" md="6">
          <div class="d-flex">
            <VInput
              class="mr-5"
              vid="barcode"
              type="number"
              :label="t('barcode')"
              rules="required|max:255"
              v-model="formData.barcode"
            />
            <div class="d-flex">
              <VBtn
                class="mr-4"
                type="button"
                min-width="40px"
                color="primary"
                :loading="barcodeLoading"
                @click="useGenerateBarcode"
              >
                <VIcon size="20" icon="barcode" color="#fff" />
              </VBtn>
              <VBtn
                type="button"
                min-width="40px"
                color="primary"
                @click="handlePrint"
              >
                <VIcon size="20" icon="print" color="#fff" />
              </VBtn>
            </div>
          </div>
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
import VIcon from '@/components/ui/VIcon.vue'

import { computed, reactive, ref, watch } from 'vue'
import {
  createProduct,
  editProduct,
  generateBarcode,
} from '@/services/cabinet/ReferenceProductNameService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import { $printScreen } from '@/utils/pure-functions'
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  name: null,
  category_id: null,
  unit_id: null,
  barcode: null,
  articule: null,
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
  categories: {
    type: Array,
    default: () => [],
  },
  units: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue', 'submit'])

const formObj = ref<any>(null)
const barcodeSvg = ref<string | null>(null)
const loading = ref(false)
const barcodeLoading = ref(false)
const categoryForm = reactive({
  parent_category_id: null,
  child_category_id: null,
})
const formData = ref<Record<string, any>>({ ...FORM_DATA })

const childCategories = computed(() => {
  const list = [...props.categories].find(
    (item: any) => item.id === categoryForm.parent_category_id
  )
  return list
    ? (list as Record<string, Array<Record<string, string | number>>>).children
    : []
})

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      categoryForm.parent_category_id = null
      categoryForm.child_category_id = null
      formData.value = { ...FORM_DATA }
      formObj.value?.resetForm()
    } else if (val && props.isUpdate) {
      formData.value.id = props.data.id || null
      formData.value.name = props.data.name || null
      formData.value.unit_id = props.data.unit_id || null
      formData.value.barcode = props.data.barcode || null
      formData.value.articule = props.data.articule || null
      const activeCategory = (props.categories as any)
        ?.reduce((acc: any, cur: any) => {
          return [...acc, ...cur.children]
        }, [])
        .find((item: any) => item.id === props.data.category_id)
      if (activeCategory) {
        categoryForm.parent_category_id = activeCategory.parent_id
        categoryForm.child_category_id = activeCategory.id
      } else {
        const activeParentCategory: any = props.categories?.find(
          (item: any) => item.id === props.data.category_id
        )
        if (activeParentCategory) {
          categoryForm.parent_category_id = activeParentCategory.id
          categoryForm.child_category_id = null
        }
      }
    }
  }
)

const useGenerateBarcode = async () => {
  try {
    barcodeLoading.value = true
    const {
      data: { data },
    } = await generateBarcode()
    formData.value.barcode = data.barcode
    barcodeSvg.value = data.svg
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    barcodeLoading.value = false
  }
}

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    formData.value.category_id = categoryForm.child_category_id
      ? categoryForm.child_category_id
      : categoryForm.parent_category_id
    if (!props.isUpdate) await createProduct(formData.value)
    else await editProduct(formData.value)
    await emits('submit')
    await emits('update:modelValue', false)
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

const handlePrint = async () => {
  try {
    if (!formData.value.barcode) {
      await useGenerateBarcode()
    }
    if (barcodeSvg.value) {
      await $printScreen('reference-product-name-print', barcodeSvg.value)
    }
  } catch (err) {
    $setResponseErrors(err)
  }
}
</script>
