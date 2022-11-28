<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('counterpartyAccounts') }}
  </VText>
  <VCard>
    <VRow>
      <VCol md="3">
        <VSelect
          :label="$t('organisation')"
          clearable
          :items="organisationList"
          item-value="id"
          multiple
          item-text="name"
          v-model="params.organisation_ids"
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
      <VCol md="3">
        <VDatepicker
          :label="$t('datePeriod')"
          v-model="params.from"
          clearable
        />
      </VCol>
      <VCol md="1">
        <VFilterActions @filter="startFilter" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.payment_history="{ item }">
        <VBtn
          color="primary"
          @click="
            $router.push(
              $localePath(
                `/cabinet/finance-accounting-item?counterparty_id=${item.counterparty_id}&organisation_id=${item.organisation_id}`
              )
            )
          "
          >{{ $t('open') }}</VBtn
        >
      </template>
      <template #item.debit="{ item }">
        <TableText :item="item" show="debit" />
      </template>
      <template #item.credit="{ item }">
        <TableText :item="item" show="credit" />
      </template>
      <template #item.finalBalance="{ item }">
        <TableText :item="item" show="balance" />
      </template>
      <template #item.inFavor="{ item }">
        <div v-if="item?.sum?.debit || item?.sum?.credit" class="pb-17 pt-17">
          {{ $t('UZS') }} -
          {{
            item.sum.is_profitable
              ? item.organisation_name
              : item.counterparty_name
          }}
        </div>
        <div
          v-if="item?.usd?.debit || item?.usd?.credit"
          class="finance-debit-amount"
        >
          {{ $t('USD') }} -
          {{
            item.usd.is_profitable
              ? item.organisation_name
              : item.counterparty_name
          }}
        </div>
        <div
          v-if="item?.rub?.debit || item?.rub?.credit"
          class="finance-debit-amount"
        >
          {{ $t('RUB') }} -
          {{
            item.rub.is_profitable
              ? item.organisation_name
              : item.counterparty_name
          }}
        </div>
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
import VDatepicker from '@/components/ui/VDatepicker.vue'
import TableText from '@/components/pages/finance-accounting/TableText.vue'
import VBtn from '@/components/ui/VBtn.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchFinanceAccounting } from '@/services/cabinet/FinanceAccountingService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $parseQueryArray } from '@/utils/pure-functions'
import { fetchOrganisationsList } from '@/services/cabinet/MkoOrganisationsService'
import { fetchCounterpartyList } from '@/services/cabinet/CounterpartyCounterpartiesService'
import type {
  FinanceAccountDataItemType,
  FinanceAccountPageOptionsType,
} from '@/types/cabinet/FinanceAccountingTypes'
import type { MkoOrganisationListType } from '@/types/cabinet/MkoOrganisationsTypes'
import type { OrganizationListType } from '@/types/cabinet/CounterpartyCounterpartiesTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref<FinanceAccountDataItemType[]>([])
const { t } = useI18n()
const queries = getQuery([
  'page',
  'organisation_ids',
  'counterparty_id',
  'from',
])
clearQuery(['page', 'organisation_ids', 'counterparty_id', 'from'])

const breadcrumbs = [
  {
    name: t('financialAccounting'),
  },
  {
    name: t('mutualSettlements'),
  },
]

const organisationList = ref<Array<MkoOrganisationListType>>([])

const counterpartyList = ref<Array<OrganizationListType>>([])

const params = ref<FinanceAccountPageOptionsType>({
  organisation_ids:
    $parseQueryArray(queries.organisation_ids, 'number') || null,
  page: +queries.page || 1,
  counterparty_id: queries.counterparty_id || '',
  from: queries.from || '',
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
    params.value.organisation_ids = []
    params.value.page = 1
    params.value.counterparty_id = ''
    params.value.from = ''
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
    const { data, links } = await fetchFinanceAccounting(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: FinanceAccountDataItemType, i: number) => {
      if (links) p.index = links.from + i
      return p
    })
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
  await getOrganisationList()
  await getCounterPartyList()
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
  { text: t('organisation'), value: 'organisation_name' },
  { text: t('counterpart'), value: 'counterparty_name' },
  { text: t('paymentHistory'), value: 'payment_history' },
  { text: t('debit'), value: 'debit' },
  { text: t('credit'), value: 'credit' },
  { text: t('finalBalance'), value: 'finalBalance' },
  { text: t('inFavor'), value: 'inFavor' },
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
