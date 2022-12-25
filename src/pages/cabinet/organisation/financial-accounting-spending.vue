<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('outcome') }}
  </VText>
  <VCard>
    <VFilterCollapse>
      <template #top="{ toggle }">
        <VRow>
          <VCol v-if="$can('organisation.spending.create')" md="1">
            <VBtn
              width="100%"
              color="primary"
              class="mb-20"
              @click="openDialog"
            >
              <VIcon class="mr-10" size="20" icon="circle-plus" />
              {{ $t('add') }}
            </VBtn>
          </VCol>
          <VCol md="3">
            <VInput :label="$t('search')" v-model="params.search" clearable />
          </VCol>
          <VCol md="2">
            <VDatepicker
              :label="$t('date')"
              v-model="params.start_date"
              clearable
            />
          </VCol>
          <VCol md="2">
            <VSelect
              :label="$t('agreement')"
              :items="contractList"
              item-text="number"
              item-value="id"
              clearable
              autocomplete
              v-model="params.contract_id"
            />
          </VCol>
          <VCol md="2">
            <VSelect
              :label="$t('invoice')"
              :items="invoiceList"
              item-text="number"
              clearable
              item-value="id"
              autocomplete
              vid="invoice_id"
              v-model="params.invoice_id"
            />
          </VCol>
          <VCol md="2">
            <VFilterActions
              collapse
              @collapse="toggle"
              @filter="startFilter"
              @clear="clearFilter"
            />
          </VCol>
        </VRow>
      </template>
      <template #bottom>
        <VRow>
          <VCol md="2">
            <VSelect
              :label="$t('typeIncome')"
              :items="incomeList"
              item-text="name"
              item-value="id"
              clearable
              autocomplete
              v-model="params.type_id"
            />
          </VCol>
          <VCol md="2">
            <VSelect
              :items="organisationList"
              item-value="id"
              item-text="name"
              clearable
              autocomplete
              multiple
              :label="$t('organisation')"
              vid="organisation_id"
              v-model="params.organisation_ids"
            />
          </VCol>
          <VCol md="2">
            <VSelect
              :items="counterpartyList"
              item-text="company_name"
              item-value="id"
              autocomplete
              :label="$t('counterparties')"
              v-model="params.counterparty_id"
              clearable
            />
          </VCol>
          <VCol md="2">
            <VSelect
              :label="$t('organisationAccount')"
              :items="settlementList"
              item-text="account"
              item-value="id"
              clearable
              vid="counterparty_account_id"
              v-model="params.account_id"
            />
          </VCol>
        </VRow>
      </template>
    </VFilterCollapse>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="organisation.spending.update"
          delete="organisation.spending.delete"
          @edit="openDialog(item)"
          @delete="deleteItem(item.id)"
        />
      </template>
    </VTable>
    <VPagination
      v-if="pageOptions.lastPage > 1"
      v-model="params.page"
      :pages="pageOptions.lastPage"
      :total="pageOptions.total"
      @update:modelValue="changePage"
    />
  </VCard>
  <FinancialAccountingSpendingDialog
    ref="organizationDialogRef"
    :counterpartyList="counterpartyList"
    :organisationList="organisationList"
    :settlementList="settlementList"
    :incomeList="incomeList"
    @fetch-data="fetchData"
    @get-counter-party-list="getCounterPartyList"
    @get-accounting-settlement-list="getAccountingSettlementList"
    @get-income-list="getIncomeList"
    @get-organisations-list="getOrganisationsList"
  />
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VRow from '@/components/ui/VRow.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'
import FinancialAccountingSpendingDialog from '@/components/pages/financial-accounting-spending/FinancialAccountingSpendingDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchSpending,
  deleteSpending,
} from '@/services/cabinet/FinancialAccountingSpendingService'
import {
  fetchCounterpartyContractList,
  fetchCounterpartyWithContract,
} from '@/services/cabinet/CounterpartyContractsServices'
import { fetchOrganisationsList } from '@/services/cabinet/OrganisationsService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { fetchAccountingSettlementList } from '@/services/cabinet/FinancialAccountingAccountsService'
import { fetchIncomeOutcomeList } from '@/services/cabinet/ReferenceIncomeOutcomeService'
import { fetchInvoiceList } from '@/services/cabinet/CounterpartyInvoicesService'
import { $isPageExists, $parseQueryArray } from '@/utils/pure-functions'
import type {
  FinancialSpendingFormTypes,
  FinancialSpendingDataItemType,
  FinancialSpendingOptionsType,
} from '@/types/cabinet/FinancialSpendingTypes'
import type { MkoOrganisationListType } from '@/types/cabinet/MkoOrganisationsTypes'
import type {
  CounterpartyContractListType,
  CounterpartyListWitContractType,
} from '@/types/cabinet/CounterpertyContractsTypes'
import type { InvoiceListType } from '@/types/cabinet/CounterpartyInvoiceTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { $addQuery, $getQuery, $clearQuery } = useQuery()

const items = ref<FinancialSpendingDataItemType[]>([])
const { t } = useI18n()
const organizationDialogRef = ref()
const queries = $getQuery([
  'page',
  'search',
  'counterparty_id',
  'date',
  'contract_id',
  'type_id',
  'account_id',
  'invoice_id',
  'organisation_ids',
])
$clearQuery([
  'page',
  'search',
  'counterparty_id',
  'date',
  'contract_id',
  'type_id',
  'account_id',
  'invoice_id',
  'organisation_ids',
])

const params = ref<FinancialSpendingOptionsType>({
  search: queries.search || '',
  page: +queries.page || 1,
  counterparty_id: +queries.counterparty_id || null,
  date: queries.date || '',
  contract_id: +queries.contract_id || null,
  type_id: +queries.type_id || null,
  account_id: +queries.account_id || null,
  invoice_id: +queries.invoice_id || null,
  organisation_ids: $parseQueryArray(queries.organisation_ids, 'number') || [],
})
const pageOptions = ref<{
  lastPage: number
  total: number
  perPage: number
}>({
  lastPage: 0,
  total: 0,
  perPage: 0,
})

const breadcrumbs = [
  {
    name: t('financialAccounting'),
  },
  {
    name: t('outcome'),
  },
]

const counterpartyList = ref<Array<CounterpartyListWitContractType>>([])
const settlementList = ref<Array<Record<string, any>>>([])
const organisationList = ref<Array<MkoOrganisationListType>>([])
const contractList = ref<Array<CounterpartyContractListType>>([])
const invoiceList = ref<Array<InvoiceListType>>([])
const incomeList = ref<
  Array<{
    name: string
    id: number
    organisation_id: number
  }>
>([])

const startFilter = async () => {
  params.value.page = 1
  $showLoading()
  try {
    await fetchData()
    $addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const clearFilter = async () => {
  try {
    $showLoading()
    params.value.search = ''
    params.value.page = 1
    params.value.counterparty_id = null
    params.value.date = ''
    params.value.contract_id = null
    params.value.type_id = null
    params.value.account_id = null
    params.value.invoice_id = null
    params.value.organisation_ids = []
    await fetchData()
    $addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const fetchData = async () => {
  try {
    const { data, links } = await fetchSpending(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: FinancialSpendingDataItemType, i: number) => {
      if (links) p.index = links.from + i
      return p
    })
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getCounterPartyList = async (id: number | null) => {
  try {
    const { data } = await fetchCounterpartyWithContract(id)
    counterpartyList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getCounterpartyContractList = async () => {
  try {
    const { data } = await fetchCounterpartyContractList()
    contractList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getOrganisationsList = async () => {
  try {
    const { data } = await fetchOrganisationsList()
    organisationList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getAccountingSettlementList = async (id: number | null) => {
  try {
    const { data } = await fetchAccountingSettlementList(id)
    settlementList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getInvoiceList = async () => {
  try {
    const { data } = await fetchInvoiceList()
    invoiceList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getIncomeList = async (organisation_id: number | null) => {
  try {
    const {
      data: { data },
    } = await fetchIncomeOutcomeList('expense', organisation_id)
    incomeList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  await getCounterPartyList(null)
  await getOrganisationsList()
  await getIncomeList(null)
  await getAccountingSettlementList(null)
  await getCounterpartyContractList()
  await getInvoiceList()
  $clearLoading()
}

const deleteItem = async (id: number) => {
  $showLoading()
  try {
    await deleteSpending(id)
    if (
      pageOptions.value &&
      $isPageExists(pageOptions.value.total, pageOptions.value.perPage)
    ) {
      params.value.page = 1
      $addQuery({
        page: 1,
      })
    }
    $successMessage(t('notifications.deletedSuccessfully'))
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const changePage = async () => {
  try {
    $showLoading()
    $addQuery({ page: params.value.page })
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const openDialog = (item: FinancialSpendingFormTypes) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('numberDocument'), value: 'document_number' },
  { text: t('date'), value: 'document_date' },
  { text: t('agreement'), value: 'contract_number' },
  { text: t('invoice'), value: 'invoice_number' },
  { text: t('amount'), value: 'amount' },
  { text: t('typeIncome'), value: 'type_id' },
  { text: t('organisation'), value: 'organisation_name' },
  { text: t('organisationAccount'), value: 'organisation_account' },
  { text: t('counterpart'), value: 'counterparty_name' },
  { text: t('counterpartyAccount'), value: 'counterparty_account' },
  { text: t('purpose'), value: 'payment_purpose' },
  { text: t('status'), value: 'status' },
  { text: t('comment'), value: 'comment' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
