<template>
  <VFilterCollapse>
    <template #top="{ toggle }">
      <VRow>
        <VCol md="3">
          <VInput clearable :label="t('search')" v-model="options.search" />
        </VCol>
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
            :label="t('warehouse')"
            :items="warehouses"
            v-model="options.store_id"
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
            <VExcel
              url="/organisation/reports/sale/sale-reports"
              :filters="options"
            />
          </div>
        </VCol>
      </VRow>
    </template>
    <template #bottom>
      <VRow>
        <VCol md="3">
          <VSelect
            :label="$t('clientType')"
            :items="clientTypeList"
            item-text="title"
            item-value="value"
            clearable
            autocomplete
            v-model="options.client_type"
          />
        </VCol>
        <VCol md="3">
          <VSelect
            :label="$t('paymentType')"
            :items="paymentTypeList"
            item-text="name"
            item-value="type"
            clearable
            autocomplete
            v-model="options.payment_type"
          />
        </VCol>
        <VCol md="3">
          <VSelect
            clearable
            autocomplete
            :label="t('status')"
            item-text="text"
            item-value="value"
            :items="statusList"
            v-model="options.status"
          />
        </VCol>
        <VCol md="3">
          <VDatepicker :label="$t('fromDate')" v-model="options.date_from" />
        </VCol>
        <VCol md="3">
          <VDatepicker :label="$t('toDate')" v-model="options.date_to" />
        </VCol>
      </VRow>
    </template>
  </VFilterCollapse>
  <VLine class="mb-20" />
  <VTable :headers="headers" :items="items">
    <template #item.status="{ item }">
      <VBtn text :color="REPORT_SALES_STATUS[item.status].color">
        {{ $t(REPORT_SALES_STATUS[item.status].text) }}
      </VBtn>
    </template>
    <template #item.products="{ item }">
      <VBtn
        color="primary"
        @click="
          $router.push(
            $localePath(
              `/cabinet/reports-sale-item/${item.id}?type=consolidatedReport`
            )
          )
        "
      >
        {{ $t('open') }}
      </VBtn>
    </template>
    <template #item.sold_amount_sum="{ item }">
      <span class="text-no-wrap"
        >{{ $moneyFormat(item.sold_amount_sum) }}
        {{ item.currency_symbol }}</span
      >
    </template>
    <template #item.payment_types="{ item }">
      <ReportsSalePaymentTypeText :item="item" />
    </template>
    <template #item.client_type="{ item }">
      {{ $t(item.client_type) }}
    </template>
  </VTable>
  <VPagination
    v-if="pageOptions.lastPage > 1"
    v-model="options.page"
    :pages="pageOptions.lastPage"
    :total="pageOptions.total"
    @update:modelValue="paginate"
  />
</template>

<script lang="ts" setup>
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VExcel from '@/components/ui/VExcel.vue'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VBtn from '@/components/ui/VBtn.vue'
import ReportsSalePaymentTypeText from '@/components/pages/reports-sale/ReportsSalePaymentTypeText.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'

import type { ReportSalesTypesConsolidateParamsTypes } from '@/types/cabinet/ReportSaleTypes'
import { CLIENT_TYPES, REPORT_SALES_STATUS } from '@/utils/constants'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@/composables/router-query'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { fetchReportSales } from '@/services/cabinet/ReportSaleService'
import { getPaymentTypes } from '@/services/cabinet/CashSaleService'
import { $parseQueryArray } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()
const { $getQuery, $addQuery, $clearQuery } = useQuery()
const queries = $getQuery([
  'tab',
  'page',
  'search',
  'status',
  'organisation_ids',
  'client_type',
  'payment_type',
  'date_from',
  'date_to',
  'store_id',
])
$clearQuery([
  'tab',
  'page',
  'search',
  'status',
  'organisation_ids',
  'client_type',
  'payment_type',
  'date_from',
  'date_to',
  'store_id',
])

const options = ref<ReportSalesTypesConsolidateParamsTypes>({
  page: +queries.page || 1,
  search: queries.search || '',
  status: +queries.status || null,
  organisation_ids: $parseQueryArray(queries.organisation_ids) as number[],
  client_type: queries.client_type || '',
  payment_type: queries.payment_type || '',
  date_from: queries.date_from || '',
  date_to: queries.date_to || '',
  store_id: +queries.date_to || null,
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

const paymentTypeList = ref<Array<Record<string, any>>>([])

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('checkNumber'),
    value: 'check_number',
  },
  {
    text: t('salesType'),
    value: 'client_type',
  },
  {
    text: t('paymentType'),
    value: 'payment_types',
  },
  {
    text: t('salesDate'),
    value: 'created_at',
  },
  {
    text: t('buyer'),
    value: 'buyer',
  },
  {
    text: t('sold'),
    value: 'seller_username',
  },
  {
    text: t('organisation'),
    value: 'organisation_name',
  },
  {
    text: t('products'),
    value: 'products',
  },
  {
    text: t('status'),
    value: 'status',
  },
  {
    text: t('amount'),
    value: 'sold_amount_sum',
  },
]

defineProps({
  warehouses: {
    type: Array,
    default: () => [],
  },
  organisations: {
    type: Array,
    default: () => [],
  },
  statusList: {
    type: Array,
    default: () => [],
  },
})
const items = ref([])
const clientTypeList = computed(() => {
  const result: Array<Record<string, string>> = []
  Object.keys(CLIENT_TYPES).forEach((p: string) => {
    result.push({
      title: t(p),
      value: p,
    })
  })
  return result
})

const useFetchIncomes = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchReportSales(options.value)
    const { from, last_page, total, per_page } = links
    if (links && links.total) pageOptions.value.total = total
    if (links && links.last_page) pageOptions.value.lastPage = last_page
    if (links && links.per_page) pageOptions.value.perPage = per_page
    items.value = data.map((item: Record<string, any>, i: number) => {
      item.index = from + i
      return item
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

const getPaymentTypeList = async () => {
  try {
    const {
      data: { data },
    } = await getPaymentTypes()
    paymentTypeList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchIncomes()
    await getPaymentTypeList()
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
    await useFetchIncomes()
    await $addQuery(options.value)
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
    options.value.search = ''
    options.value.status = null
    options.value.organisation_ids = []
    options.value.client_type = ''
    options.value.payment_type = ''
    options.value.date_from = ''
    options.value.date_to = ''
    options.value.store_id = null
    await useFetchIncomes()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      status: options.value.status,
      organisation_ids: options.value.organisation_ids,
      client_type: options.value.client_type,
      payment_type: options.value.payment_type,
      date_from: options.value.date_from,
      date_to: options.value.date_to,
      store_id: options.value.store_id,
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
    await useFetchIncomes()
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
  tab: 'consolidated',
  page: '1',
})
useFetchData()
</script>
