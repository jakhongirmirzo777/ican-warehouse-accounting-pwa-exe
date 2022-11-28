<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VBackBtn class="mb-10" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('paymentHistory') }}
  </VText>
  <VCard>
    <VRow>
      <VCol md="3">
        <VSelect
          :label="$t('organisation')"
          clearable
          :items="organisationList"
          item-value="id"
          item-text="name"
          v-model="params.organisation_id"
        />
      </VCol>
      <VCol md="3">
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
      <VCol md="1">
        <VFilterActions @filter="startFilter" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.amount="{ item }">
        <span>{{ item.amount }} {{ item.currency_name }}</span>
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
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VLine from '@/components/ui/VLine.vue'
import VSelect from '@/components/ui/VSelect.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchFinanceAccountingList } from '@/services/cabinet/FinanceAccountingService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { fetchCounterpartyList } from '@/services/cabinet/CounterpartyCounterpartiesService'
import type {
  FinanceAccountHistoryDataItemType,
  FinanceAccountHistoryPageOptionsType,
} from '@/types/cabinet/FinanceAccountingTypes'
import type { MkoOrganisationListType } from '@/types/cabinet/MkoOrganisationsTypes'
import type { OrganizationListType } from '@/types/cabinet/CounterpartyCounterpartiesTypes'
import { fetchOrganisationsList } from '@/services/cabinet/MkoOrganisationsService'
import VBackBtn from "@/components/ui/VBackBtn.vue";

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref<FinanceAccountHistoryDataItemType[]>([])
const { t } = useI18n()
const queries = getQuery(['page', 'organisation_id', 'counterparty_id'])
clearQuery(['page', 'organisation_id', 'counterparty_id'])

const breadcrumbs = [
  {
    name: t('financialAccounting'),
  },
  {
    name: t('mutualSettlements'),
  },
]

const counterpartyList = ref<Array<OrganizationListType>>([])

const organisationList = ref<Array<MkoOrganisationListType>>([])

const params = ref<FinanceAccountHistoryPageOptionsType>({
  organisation_id: +queries.organisation_id || '',
  page: +queries.page || 1,
  counterparty_id: +queries.counterparty_id || '',
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

const startFilter = async () => {
  params.value.page = 1
  $showLoading()
  try {
    await fetchData()
    addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const clearFilter = async () => {
  try {
    $showLoading()
    params.value.organisation_id = ''
    params.value.page = 1
    params.value.counterparty_id = ''
    await fetchData()
    addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const fetchData = async () => {
  try {
    const { data, links } = await fetchFinanceAccountingList(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map(
      (p: FinanceAccountHistoryDataItemType, i: number) => {
        if (links) p.index = links.from + i
        return p
      }
    )
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getCounterPartyList = async () => {
  try {
    const { data } = await fetchCounterpartyList()
    counterpartyList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getOrganisationList = async () => {
  try {
    const { data } = await fetchOrganisationsList()
    organisationList.value = data
  } catch (e) {
    $setResponseErrors(e)
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  await getCounterPartyList()
  await getOrganisationList()
  $clearLoading()
}

const changePage = async () => {
  try {
    $showLoading()
    addQuery({ page: params.value.page })
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('payer'), value: 'payer' },
  { text: t('organisationAccount'), value: 'organisation_account' },
  { text: t('counterpartyAccount'), value: 'counterparty_account' },
  { text: t('amount'), value: 'amount' },
  { text: t('purpose'), value: 'payment_purpose' },
  { text: t('comment'), value: 'comment' },
])
</script>

<style lang="scss">
.finance-debit-amount {
  padding: 17px 0;
  position: relative;
  &:after {
    position: absolute;
    content: '';
    height: 1px;
    background: #e3e3f1;
    width: 100%;
    top: 0;
    left: 0;
  }
}
</style>
