<template>
  <VFilterCollapse>
    <template #top="{ toggle }">
      <VRow>
        <VCol md="3">
          <VInput clearable :label="t('search')" v-model="options.search" />
        </VCol>
        <VCol md="3">
          <VDatepicker
            clearable
            :label="t('fromDate')"
            v-model="options.date_from"
          />
        </VCol>
        <VCol md="3">
          <VDatepicker
            clearable
            :label="t('toDate')"
            v-model="options.date_to"
          />
        </VCol>
        <VCol md="3">
          <div class="d-flex flex-column flex-md-row">
            <VFilterActions
              class="mr-md-8 mb-8 mb-md-0"
              collapse
              @filter="filterData"
              @clear="clearFilter"
              @collapse="toggle"
            />
            <VExcel url="" :filters="options" />
          </div>
        </VCol>
      </VRow>
    </template>
    <template #bottom>
      <VRow>
        <VCol md="3">
          <VSelect
            clearable
            autocomplete
            multiple
            :label="t('organisation')"
            :items="organisations"
            v-model="options.organisation_ids"
          />
        </VCol>
        <VCol md="3">
          <VSelect
            clearable
            autocomplete
            item-text="company_name"
            :label="t('counterpart')"
            :items="counterparties"
            v-model="options.counterparty_id"
          />
        </VCol>
      </VRow>
    </template>
  </VFilterCollapse>

  <VLine class="mb-20" />
  <VTable :headers="headers" :items="items">
    <template #item.number="{ item }">
      {{ (item.number && `№ ${item.number}`) || '' }}
      {{
        (item.contract_start_date &&
          `${t('from')} ${item.contract_start_date}`) ||
        ''
      }}
    </template>
    <template #item.invoice_number="{ item }">
      {{ (item.invoice_number && `№ ${item.invoice_number}`) || '' }}
      {{ (item.invoice_date && `${t('from')} ${item.invoice_date}`) || '' }}
    </template>
    <template #item.course="{ item }">
      {{ $moneyFormat(item.course) }}
    </template>
    <template #item.products_count_sum="{ item }">
      {{ $moneyFormat(item.products_count_sum) }}
    </template>
    <template #item.incoming_price_sum="{ item }">
      {{ $moneyFormat(item.incoming_price_sum) }}
    </template>
    <template #item.selling_price_sum="{ item }">
      {{ $moneyFormat(item.selling_price_sum) }}
    </template>
    <template #item.incoming_price="{ item }">
      {{ $moneyFormat(item.incoming_price) }}
      {{ item.currency_key || item.currency }}
    </template>
    <template #item.selling_price="{ item }">
      {{ $moneyFormat(item.selling_price) }}
      {{ item.currency_key || item.currency }}
    </template>
  </VTable>
  <VPagination
    v-if="options.lastPage > 1"
    v-model="options.page"
    :pages="options.lastPage"
    :total="options.total"
    @update:modelValue="paginate"
  />
</template>

<script lang="ts" setup>
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VExcel from '@/components/ui/VExcel.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'

import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useQuery } from '@/composables/router-query'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import {
  fetchCounterparties,
  fetchRegisters,
} from '@/services/cabinet/ReportsStockService'
import { $parseQueryArray } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()
const { $getQuery, $addQuery, $clearQuery } = useQuery()
const queries = $getQuery([
  'page',
  'search',
  'counterparty_id',
  'date_from',
  'date_to',
  'organisation_ids',
])
$clearQuery([
  'tab',
  'page',
  'search',
  'counterparty_id',
  'date_from',
  'date_to',
  'organisation_ids',
])
const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  counterparty_id: null | number
  date_from: null | string
  date_to: null | string
  organisation_ids: null | number[]
}>({
  page: +queries.page || 1,
  lastPage: null,
  perPage: null,
  total: null,
  search: queries.search || null,
  counterparty_id: +queries.counterparty_id || null,
  date_from: queries.date_from || null,
  date_to: queries.date_to || null,
  organisation_ids: $parseQueryArray(queries.organisation_ids) as number[],
})

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('organisation'),
    value: 'organisation_name',
  },
  {
    text: t('counterpart'),
    value: 'counterparties_company_name',
  },
  {
    text: t('document'),
    value: 'number',
  },
  {
    text: t('invoice'),
    value: 'invoice_number',
  },
  {
    text: t('quantity'),
    value: 'products_count_sum',
  },
  {
    text: t('systemCourse'),
    value: 'course',
  },
  {
    text: t('incomePrice'),
    value: 'incoming_price_sum',
  },
  {
    text: t('sellPrice'),
    value: 'selling_price_sum',
  },
  {
    text: t('arrivalPriceInCurrency'),
    value: 'incoming_price',
  },
  {
    text: t('sellingPriceInCurrency'),
    value: 'selling_price',
  },
]

defineProps({
  organisations: {
    type: Array,
    default: () => [],
  },
})

const counterparties = ref([])
const items = ref([])

const useFetchRegisters = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchRegisters({
      page: options.value.page,
      search: options.value.search,
      counterparty_id: options.value.counterparty_id,
      date_from: options.value.date_from,
      date_to: options.value.date_to,
      organisation_ids: options.value.organisation_ids,
    })
    const { from, last_page, total, per_page } = links
    options.value.lastPage = last_page
    options.value.total = total
    options.value.perPage = per_page
    items.value = data.map((item: Record<string, any>, i: number) => {
      item.index = from + i
      return item
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchCounterparties = async () => {
  try {
    const {
      data: { data },
    } = await fetchCounterparties()
    counterparties.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchCounterparties()
    await useFetchRegisters()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchRegisters()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      counterparty_id: options.value.counterparty_id,
      date_from: options.value.date_from,
      date_to: options.value.date_to,
      organisation_ids: options.value.organisation_ids,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const clearFilter = async () => {
  try {
    $showLoading()
    options.value.page = 1
    options.value.search = null
    options.value.counterparty_id = null
    options.value.date_from = null
    options.value.date_to = null
    options.value.organisation_ids = null
    await useFetchRegisters()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      counterparty_id: options.value.counterparty_id,
      date_from: options.value.date_from,
      date_to: options.value.date_to,
      organisation_ids: options.value.organisation_ids,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const paginate = async () => {
  try {
    $showLoading()
    await useFetchRegisters()
    await $addQuery({
      page: options.value.page,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

$addQuery({
  tab: 'registers',
  page: '1',
})
useFetchData()
</script>
