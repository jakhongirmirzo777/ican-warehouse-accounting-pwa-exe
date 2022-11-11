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
            @update:modelValue="useFetchResources"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            autocomplete
            can-add
            :disabled="!formData.organisation_id"
            vid="counterparty_id"
            rules="required"
            item-text="company_name"
            :label="t('counterpart')"
            :items="resources"
            v-model="formData.counterparty_id"
            @update:modelValue="
              () => {
                formData.contract_id = null
                formData.invoice_id = null
              }
            "
            @add="counterpartiesDialog = true"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            autocomplete
            can-add
            :disabled="!formData.counterparty_id"
            vid="contract_id"
            rules="required"
            item-text="number"
            :label="t('agreement')"
            :items="contracts"
            v-model="formData.contract_id"
            @add="contractsDialog = true"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            autocomplete
            can-add
            :disabled="!formData.counterparty_id"
            vid="invoice_id"
            rules="required"
            item-text="number"
            :label="t('invoice')"
            :items="invoices"
            v-model="formData.invoice_id"
            @add="invoicesDialog = true"
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
        <VCol v-if="!isUpdate" md="6">
          <VSelect
            vid="currency_id"
            rules="required"
            :label="t('currencyOfDocument')"
            :items="currencies"
            v-model="formData.currency_id"
          />
        </VCol>
        <VCol v-if="!isUpdate" md="6">
          <VInput
            vid="course"
            type="money"
            :label="t('systemCourse')"
            rules="required|max:255"
            v-model="formData.course"
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
  <CounterpartyCounterpartiesDialog
    v-model="counterpartiesDialog"
    @fetch-data="useReFetchResources('COUNTERPARTY')"
  />
  <CounterpartyContractsDialog
    :counterpart-id="formData.counterparty_id"
    v-model="contractsDialog"
    @fetch-data="useReFetchResources('CONTRACT')"
  />
  <CounterpartyInvoiceDialog
    :counterpart-id="formData.counterparty_id"
    v-model="invoicesDialog"
    @fetch-data="useReFetchResources('INVOICE')"
  />
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
import CounterpartyContractsDialog from '@/components/pages/counterparty-contracts/CounterpartyContractsDialog.vue'
import CounterpartyCounterpartiesDialog from '@/components/pages/counterparty-organisations/CounterpartyCounterpartiesDialog.vue'
import CounterpartyInvoiceDialog from '@/components/pages/counterparty-invoice/CounterpartyInvoiceDialog.vue'
import WarehousesDialog from '@/components/pages/warehouses/WarehousesDialog.vue'

import { computed, ref, watch } from 'vue'
import {
  createIncome,
  editIncome,
  fetchDocumentNumber,
  fetchResources,
} from '@/services/cabinet/InventoryIncomeService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import { $clearNonDigits } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  organisation_id: null,
  contract_id: null,
  store_id: null,
  counterparty_id: null,
  invoice_id: null,
  currency_id: null,
  number: null,
  date: null,
  course: null,
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
  currencies: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue', 'submit', 're-fetch'])
const counterpartiesDialog = ref(false)
const contractsDialog = ref(false)
const invoicesDialog = ref(false)
const warehousesDialog = ref(false)
const formObj = ref<any>(null)
const loading = ref(false)
const formData = ref<Record<string, any>>({ ...FORM_DATA })
const resources = ref([])
const contracts = computed(() => {
  return (
    (resources as any).value.find(
      (item: { id: number }) => item.id === formData.value.counterparty_id
    )?.contracts || []
  )
})
const invoices = computed(() => {
  return (
    (resources as any).value.find(
      (item: { id: number }) => item.id === formData.value.counterparty_id
    )?.invoices || []
  )
})

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      formData.value = { ...FORM_DATA }
      formObj.value?.resetForm()
    } else if (val && props.isUpdate) {
      formData.value.id = props.data.id || null
      formData.value.organisation_id = props.data.organisation_id || null
      formData.value.contract_id = props.data.contract_id || null
      formData.value.store_id = props.data.store_id || null
      formData.value.counterparty_id = props.data.counterparty_id || null
      formData.value.invoice_id = props.data.invoice_id || null
      formData.value.date = props.data.date || null
      useFetchResources(true)
    } else if (val && !props.isUpdate) {
      useFetchDocumentNumber()
    }
  }
)

const useReFetchResources = async (
  type: 'COUNTERPARTY' | 'CONTRACT' | 'INVOICE'
) => {
  try {
    if (type === 'COUNTERPARTY') {
      formData.value.counterparty_id = null
      formData.value.contract_id = null
      formData.value.invoice_id = null
    } else if (type === 'CONTRACT') {
      formData.value.contract_id = null
    } else if (type === 'INVOICE') {
      formData.value.invoice_id = null
    }
    await formObj.value?.resetForm()
    counterpartiesDialog.value = false
    contractsDialog.value = false
    invoicesDialog.value = false
    warehousesDialog.value = false
    if (!formData.value.organisation_id) return
    const {
      data: { data },
    } = await fetchResources(formData.value.organisation_id)
    resources.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchResources = async (dontClear = false) => {
  try {
    if (!dontClear) {
      formData.value.counterparty_id = null
      formData.value.contract_id = null
      formData.value.invoice_id = null
    }
    if (!formData.value.organisation_id) return
    const {
      data: { data },
    } = await fetchResources(formData.value.organisation_id)
    resources.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

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
    newFormData.course = $clearNonDigits(newFormData.course)
    if (!props.isUpdate) await createIncome(newFormData)
    else await editIncome(newFormData)
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
