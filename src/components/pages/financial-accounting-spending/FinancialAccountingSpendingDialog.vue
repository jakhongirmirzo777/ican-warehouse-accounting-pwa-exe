<template>
  <VModal
    :title="form.id ? t('editOutcome') : t('addOutcome')"
    v-model="dialog"
    width="800"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('contractNumber')"
            rules="required"
            vid="document_number"
            v-model="form.document_number"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VDatepicker
            :label="$t('date')"
            rules="required"
            vid="document_date"
            v-model="form.document_date"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VSelect
            :items="organisationList"
            item-value="id"
            item-text="name"
            autocomplete
            clearable
            @change="changeOrganisation"
            :label="$t('organisation')"
            vid="organisation_id"
            v-model="form.organisation_id"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            :label="$t('counterparties')"
            :items="counterpartyList"
            item-text="company_name"
            autocomplete
            item-value="id"
            can-add
            @add="$refs.organizationDialogRef.openDialog()"
            clearable
            vid="counterparty_id"
            @change="changeCounterparty"
            v-model="form.counterparty_id"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            :label="$t('accountNumber')"
            :items="settlementList"
            item-text="account"
            autocomplete
            clearable
            can-add
            @add="$refs.SettlementReferenceUnitsDialogRef.openDialog()"
            item-value="id"
            rules="required"
            vid="account_id"
            v-model="form.account_id"
          />
        </VCol>
        <VCol cols="12" md="6" v-if="form.counterparty_id">
          <VSelect
            :label="$t('counterpartyAccount')"
            :items="counterpartyAccountList.accounts"
            item-text="account"
            autocomplete
            can-add
            @add="$refs.CounterpartyCounterpartiesAccountDialogRef.openDialog()"
            item-value="id"
            clearable
            vid="counterparty_account_id"
            v-model="form.counterparty_account_id"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            :label="$t('typeExpenses')"
            :items="incomeList"
            item-text="name"
            item-value="id"
            can-add
            @add="incomeDialog = true"
            autocomplete
            clearable
            rules="required"
            vid="type_id"
            v-model="form.type_id"
          />
        </VCol>
        <VCol cols="12" md="6" v-if="form.counterparty_id">
          <VSelect
            :label="$t('agreement')"
            :items="counterpartyAccountList.contracts"
            item-text="number"
            item-value="id"
            clearable
            vid="contract_id"
            v-model="form.contract_id"
          />
        </VCol>
        <VCol cols="12" md="6" v-if="form.counterparty_id">
          <VSelect
            :label="$t('invoice')"
            :items="counterpartyAccountList.invoices"
            item-text="number"
            clearabl
            autocomplete
            item-value="id"
            vid="invoice_id"
            v-model="form.invoice_id"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VRow>
            <VCol dense md="8">
              <VInput
                :label="$t('amount')"
                rules="required"
                :name="$t('amount')"
                vid="amount"
                type="money"
                v-model="form.amount"
              />
            </VCol>
            <VCol dense md="4">
              <VSelect
                :label="$t('currency')"
                :items="coursesList"
                item-text="name"
                item-value="id"
                autocomplete
                rules="required"
                vid="currency_id"
                v-model="form.currency_id"
              />
            </VCol>
          </VRow>
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('purposePayment')"
            rules="required"
            vid="payment_purpose"
            v-model="form.payment_purpose"
          />
        </VCol>
        <VCol cols="12">
          <VArea :label="$t('comment')" vid="comment" v-model="form.comment" />
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
    <CounterpartyCounterpartiesDialog
      @fetchData="$emit('get-counter-party-list')"
      ref="organizationDialogRef"
    />
    <SettlementReferenceUnitsDialog
      ref="SettlementReferenceUnitsDialogRef"
      @fetch-data="$emit('get-accounting-settlement-list')"
      :organisationList="organisationList"
    />
    <ReferenceOutcomeDialog
      v-model="incomeDialog"
      :data="editValue"
      :is-update="false"
      @submit="$emit('get-income-list')"
    />
    <CounterpartyCounterpartiesAccountDialog
      ref="CounterpartyCounterpartiesAccountDialogRef"
      @fetch-data="$emit('get-counter-party-list')"
      :counterparty-list="counterpartyList"
    />
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
import VArea from '@/components/ui/VArea.vue'
import SettlementReferenceUnitsDialog from '@/components/pages/financial-accounting-accounts/FinancialAccountingAccountsDialog.vue'
import ReferenceOutcomeDialog from '@/components/pages/reference-income-outcome/ReferenceOutcomeDialog.vue'
import CounterpartyCounterpartiesDialog from '@/components/pages/counterparty-organisations/CounterpartyCounterpartiesDialog.vue'
import CounterpartyCounterpartiesAccountDialog from '@/components/pages/counterparty-organisations/CounterpartyCounterpartiesAccountDialog.vue'

import { Form } from 'vee-validate'
import { ref, watch } from 'vue'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { createEditSpending } from '@/services/cabinet/FinancialAccountingSpendingService'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { $clearNonDigits } from '@/utils/pure-functions'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import type { FinancialSpendingFormTypes } from '@/types/cabinet/FinancialSpendingTypes'
import type { CounterpartyListWitContractType } from '@/types/cabinet/CounterpertyContractsTypes'
import { getCurrencyList } from '@/services/cabinet/ResourcesServices'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  organisation_id: null,
  account_id: null,
  counterparty_id: null,
  counterparty_account_id: null,
  contract_id: null,
  invoice_id: null,
  currency_id: null,
  type_id: null,
  amount: '',
  document_number: null,
  document_date: '',
  comment: '',
  payment_purpose: '',
}

const props = defineProps({
  counterpartyList: {
    type: Array as PropType<Array<CounterpartyListWitContractType>>,
  },
  organisationList: Array,
  settlementList: Array,
  incomeList: Array,
})

const emits = defineEmits([
  'fetch-data',
  'get-counter-party-list',
  'get-accounting-settlement-list',
  'get-income-list',
])

const dialog = ref(false)

const incomeDialog = ref(false)

const form = ref<FinancialSpendingFormTypes>({ ...FORM_DATA })

const loading = ref(false)

const counterpartyAccountList = ref<CounterpartyListWitContractType>({
  id: null,
})

const coursesList = ref([])

const formRef = ref()

const editValue = ref<{ id: number | null; name: string | null }>({
  id: null,
  name: null,
})

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    if (formRef.value) formRef.value.resetForm()
  }
})

const openDialog = (item: FinancialSpendingFormTypes) => {
  if (item && item.id) {
    form.value = { ...item }
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    form.value.amount = $clearNonDigits(form.value.amount.toString())
    await createEditSpending(form.value)
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

const getCoursesList = async () => {
  try {
    const { data } = await getCurrencyList()
    coursesList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const changeCounterparty = (val: number) => {
  counterpartyAccountList.value = props.counterpartyList?.find(
    (p: CounterpartyListWitContractType) => p.id === val
  ) ?? { id: null }
  form.value.account_id = null
  form.value.counterparty_account_id = null
  form.value.contract_id = null
}

const changeOrganisation = (e: number) => {
  emits('get-counter-party-list', e)
  emits('get-accounting-settlement-list', e)
  emits('get-income-list', e)
  form.value.counterparty_id = null
}

getCoursesList()
defineExpose({ openDialog })
</script>

<style scoped></style>
