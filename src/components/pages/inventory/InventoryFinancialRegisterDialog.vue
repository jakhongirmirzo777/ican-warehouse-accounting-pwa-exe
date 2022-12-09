<template>
  <VModal
    width="400px"
    :title="t('createFinancialEntry')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol>
          <VSelect
            vid="account_id"
            autocomplete
            can-add
            rules="required"
            item-text="account"
            :label="t('accountNumber')"
            :items="accountList"
            v-model="formData.account_id"
            @add="() => accountDialogRef.openDialog()"
          />
        </VCol>
        <VCol>
          <VSelect
            vid="counterparty_account_id"
            rules="required"
            item-text="account"
            autocomplete
            :label="t('accountCounterparty')"
            :items="counterpartyAccountsList"
            v-model="formData.counterparty_account_id"
          />
        </VCol>
        <VCol v-if="type === 'income'">
          <VSelect
            can-add
            vid="type_id"
            rules="required"
            autocomplete
            :label="t('typeIncome')"
            :items="incomeList"
            v-model="formData.type_id"
            @add="incomeDialog = true"
          />
        </VCol>
        <VCol v-if="type === 'expense'">
          <VSelect
            can-add
            vid="type_id"
            rules="required"
            autocomplete
            :label="t('typeExpenses')"
            :items="expensesList"
            v-model="formData.type_id"
            @add="outcomeDialog = true"
          />
        </VCol>
        <VCol>
          <VInput
            vid="payment_purpose"
            :label="t('purposePayment')"
            rules="required|max:255"
            v-model="formData.payment_purpose"
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
          {{ t('confirm') }}
        </VBtn>
      </div>
    </Form>
  </VModal>
  <FinancialAccountingAccountsDialog
    ref="accountDialogRef"
    @fetch-data="useFetchResources('ACCOUNTS')"
    :organisation-list="organisations"
  />
  <ReferenceIncomeDialog
    v-model="incomeDialog"
    @submit="useFetchResources('INCOMES')"
  />
  <ReferenceOutcomeDialog
    v-model="outcomeDialog"
    @submit="useFetchResources('EXPENSES')"
  />
</template>

<script lang="ts" setup>
import VModal from '@/components/ui/VModal.vue'
import VInput from '@/components/ui/VInput.vue'
import VLine from '@/components/ui/VLine.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import ReferenceIncomeDialog from '@/components/pages/reference-income-outcome/ReferenceIncomeDialog.vue'
import ReferenceOutcomeDialog from '@/components/pages/reference-income-outcome/ReferenceOutcomeDialog.vue'
import FinancialAccountingAccountsDialog from '@/components/pages/financial-accounting-accounts/FinancialAccountingAccountsDialog.vue'

import { ref, watch } from 'vue'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import {
  moveToSpending,
  fetchAccountList,
  fetchCounterpartyAccountsList,
  fetchExpensesList,
} from '@/services/cabinet/InventoryIncomeService'
import {
  fetchIncomeList,
  moveToIncome,
} from '@/services/cabinet/InventoryReturnService'

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  account_id: null,
  counterparty_account_id: null,
  type_id: null,
  payment_purpose: null,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  documentId: {
    type: [Number, String],
    default: '',
  },
  counterpartyId: {
    type: [Number, String],
    default: '',
  },
  organisations: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue', 'submit'])

const incomeDialog = ref(false)
const outcomeDialog = ref(false)
const accountDialogRef = ref()
const formObj = ref<any>(null)
const loading = ref(false)
const formData = ref<Record<string, any>>({ ...FORM_DATA })
const accountList = ref([])
const expensesList = ref([])
const incomeList = ref([])
const counterpartyAccountsList = ref([])

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      formData.value = { ...FORM_DATA }
      formObj.value?.resetForm()
    } else if (val && props.counterpartyId && props.documentId) {
      formData.value.id = props.documentId
      useFetchData()
    }
  }
)

const useFetchResources = (type: 'ACCOUNTS' | 'EXPENSES' | 'INCOMES') => {
  if (type === 'ACCOUNTS') {
    useFetchAccountList()
    formData.value.account_id = null
  } else if (type === 'INCOMES') {
    useFetchIncomeList()
    formData.value.type_id = null
  } else if (type === 'EXPENSES') {
    useFetchExpensesList()
    formData.value.type_id = null
  }
  formObj.value?.resetForm()
}

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    if (props.type === 'income') {
      await moveToIncome(formData.value)
    } else if (props.type === 'expense') {
      await moveToSpending(formData.value)
    }
    await emits('submit')
    await emits('update:modelValue', false)
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

const useFetchCounterpartyAccountsList = async () => {
  try {
    const {
      data: { data },
    } = await fetchCounterpartyAccountsList(+props.counterpartyId)
    counterpartyAccountsList.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchAccountList = async () => {
  try {
    const {
      data: { data },
    } = await fetchAccountList()
    accountList.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchIncomeList = async () => {
  try {
    const {
      data: { data },
    } = await fetchIncomeList()
    incomeList.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchExpensesList = async () => {
  try {
    const {
      data: { data },
    } = await fetchExpensesList()
    expensesList.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchData = async () => {
  try {
    await Promise.all([
      useFetchCounterpartyAccountsList(),
      useFetchAccountList(),
    ])
    if (props.type === 'income') {
      await useFetchIncomeList()
    } else if (props.type === 'expense') {
      await useFetchExpensesList()
    }
  } catch (err) {
    $setResponseErrors(err)
  }
}
</script>
