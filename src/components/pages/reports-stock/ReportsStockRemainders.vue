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
            :label="t('parentCategory')"
            :items="categories"
            v-model="options.parent_category_id"
          />
        </VCol>
        <VCol md="3">
          <VSelect
            clearable
            autocomplete
            :disabled="!options.parent_category_id"
            :label="t('category')"
            :items="childCategories"
            v-model="options.child_category_id"
          />
        </VCol>
      </VRow>
    </template>
  </VFilterCollapse>
  <VLine class="mb-20" />
  <VTable :headers="headers" :items="items">
    <template #item.income_avg_price_sum="{ item }">
      {{ $moneyFormat(item.income_avg_price_sum) }}
    </template>
    <template #item.selling_price_sum="{ item }">
      {{ $moneyFormat(item.selling_price_sum) }}
    </template>
    <template #item.count_stock="{ item }">
      <div class="d-flex align-center">
        <span class="mr-10">
          {{ $moneyFormat(item.count_stock) }} {{ item.unit_name }}
        </span>
        <VIcon
          v-if="item.count_stock"
          class="cursor-pointer"
          icon="pencil"
          size="15"
          @click="
            () => {
              data = item
              isShowcase = true
              dialog = true
            }
          "
        />
      </div>
    </template>
    <template #item.count_showcase="{ item }">
      <div class="d-flex align-center">
        <span class="mr-10">
          {{ $moneyFormat(item.count_showcase) }} {{ item.unit_name }}
        </span>
        <VIcon
          v-if="item.count_showcase"
          class="cursor-pointer"
          icon="pencil"
          size="15"
          @click="
            () => {
              data = item
              isShowcase = false
              dialog = true
            }
          "
        />
      </div>
    </template>
  </VTable>
  <VPagination
    v-if="options.lastPage > 1"
    v-model="options.page"
    :pages="options.lastPage"
    :total="options.total"
    @update:modelValue="paginate"
  />
  <ReportsStockMoveProductDialog
    :data="data"
    :is-showcase="isShowcase"
    v-model="dialog"
    @submit="useFetchRemainders"
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
import VIcon from '@/components/ui/VIcon.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'
import ReportsStockMoveProductDialog from '@/components/pages/reports-stock/ReportsStockMoveProductDialog.vue'

import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useQuery } from '@/composables/router-query'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { fetchRemainders } from '@/services/cabinet/ReportsStockService'
import { $parseQueryArray } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()
const { getQuery, addQuery, clearQuery } = useQuery()
const queries = getQuery([
  'page',
  'search',
  'store_id',
  'organisation_ids',
  'parent_category_id',
  'child_category_id',
])
clearQuery([
  'tab',
  'page',
  'search',
  'store_id',
  'organisation_ids',
  'parent_category_id',
  'child_category_id',
])

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  store_id: null | number
  organisation_ids: null | number[]
  parent_category_id: null | number
  child_category_id: null | number
}>({
  page: +queries.page || 1,
  lastPage: null,
  perPage: null,
  total: null,
  search: queries.search || null,
  store_id: +queries.store_id || null,
  organisation_ids: $parseQueryArray(queries.organisation_ids) as number[],
  parent_category_id: +queries.parent_category_id || null,
  child_category_id: +queries.child_category_id || null,
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
    text: t('warehouse'),
    value: 'store_name',
  },
  {
    text: t('category'),
    value: 'category_name',
  },
  {
    text: t('product'),
    value: 'product_name',
  },
  {
    text: t('articule'),
    value: 'articule',
  },
  {
    text: t('barcode'),
    value: 'barcode',
  },
  {
    text: t('productsInShowcase'),
    value: 'count_showcase',
  },
  {
    text: t('productsInStock'),
    value: 'count_stock',
  },
  {
    text: t('incomeAvgPrice'),
    value: 'income_avg_price_sum',
  },
  {
    text: t('sellPrice'),
    value: 'selling_price_sum',
  },
]

const props = defineProps({
  warehouses: {
    type: Array,
    default: () => [],
  },
  organisations: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [],
  },
})

const dialog = ref(false)
const isShowcase = ref(false)
const data = ref({})
const items = ref([])
const childCategories = computed(() => {
  const list = props.categories.find(
    (item: any) => item.id === options.value.parent_category_id
  )
  return list
    ? (list as Record<string, Array<Record<string, string | number>>>).children
    : []
})

const useFetchRemainders = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchRemainders({
      page: options.value.page,
      search: options.value.search,
      store_id: options.value.store_id,
      organisation_ids: options.value.organisation_ids,
      category_id: options.value.child_category_id
        ? options.value.child_category_id
        : options.value.parent_category_id,
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

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchRemainders()
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
    await useFetchRemainders()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      store_id: options.value.store_id,
      organisation_ids: options.value.organisation_ids,
      parent_category_id: options.value.parent_category_id,
      child_category_id: options.value.child_category_id,
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
    options.value.store_id = null
    options.value.organisation_ids = null
    options.value.parent_category_id = null
    options.value.child_category_id = null
    await useFetchRemainders()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      store_id: options.value.store_id,
      organisation_ids: options.value.organisation_ids,
      parent_category_id: options.value.parent_category_id,
      child_category_id: options.value.child_category_id,
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
    await useFetchRemainders()
    await addQuery({
      page: options.value.page,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

addQuery({
  tab: 'remainders',
  page: '1',
})
useFetchData()
</script>
