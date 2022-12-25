<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('rePricing') }}
  </VText>
  <VCard>
    <VFilterCollapse>
      <template #top="{ toggle }">
        <VRow>
          <VCol v-if="$can('organisation.revaluation.create')" md="1">
            <VBtn
              class="mb-20"
              color="primary"
              width="100%"
              @click="dialog = true"
            >
              <VIcon class="mr-10" size="20" icon="circle-plus" />
              {{ t('add') }}
            </VBtn>
          </VCol>
          <VCol md="3">
            <VInput clearable :label="t('search')" v-model="options.search" />
          </VCol>
          <VCol md="2">
            <VDatepicker clearable :label="t('date')" v-model="options.date" />
          </VCol>
          <VCol md="3">
            <VSelect
              clearable
              autocomplete
              :label="t('organisation')"
              :items="organisations"
              v-model="options.organisation_id"
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
              :label="t('warehouse')"
              :items="warehouses"
              v-model="options.store_id"
            />
          </VCol>
          <VCol md="3">
            <VSelect
              clearable
              localize
              :label="t('status')"
              item-text="text"
              item-value="value"
              :items="INVENTORY_DOCUMENTS_STATUS_INDEXED"
              v-model="options.status"
            />
          </VCol>
        </VRow>
      </template>
    </VFilterCollapse>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.status="{ item }">
        <VStatus
          min-width="80px"
          :theme="INVENTORY_DOCUMENTS_COLORED[item.status].theme"
          :color="INVENTORY_DOCUMENTS_COLORED[item.status].color"
        >
          {{ item.status_text }}
        </VStatus>
      </template>
      <template #item.product_count_total="{ item }">
        {{ $moneyFormat(item.product_count_total) }}
      </template>
      <template #item.sell_amount_before="{ item }">
        {{ $moneyFormat(item.sell_amount_before) }}
      </template>
      <template #item.sell_amount_after="{ item }">
        {{ $moneyFormat(item.sell_amount_after) }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex">
          <VTableActions
            view="organisation.revaluation.view"
            :actions="{
              view: true,
              edit: false,
              delete: false,
            }"
            @view="
              $router.push(
                $localePath(
                  `/cabinet/inventory-revaluation-item/${item.id}?store_id=${item.store_id}&status=${item.status}`
                )
              )
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
  </VCard>
  <InventoryRevaluationDialog
    v-model="dialog"
    :organisations="organisations"
    :warehouses="warehouses"
    @submit="useFetchRevaluaitons"
    @re-fetch="useFetchWarehouses"
  />
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VExcel from '@/components/ui/VExcel.vue'
import VStatus from '@/components/ui/VStatus.vue'
import InventoryRevaluationDialog from '@/components/pages/inventory-revaluation/InventoryRevaluationDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchRevaluations,
  fetchOrganisations,
  fetchWarehouses,
} from '@/services/cabinet/InventoryRevaluationService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import {
  INVENTORY_DOCUMENTS_COLORED,
  INVENTORY_DOCUMENTS_STATUS_INDEXED,
} from '@/utils/constants'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $getQuery, $addQuery, $clearQuery } = useQuery()
const { t } = useI18n()
const queries = $getQuery([
  'search',
  'organisation_id',
  'status',
  'store_id',
  'date',
  'page',
])
$clearQuery(['search', 'organisation_id', 'status', 'store_id', 'date', 'page'])

const breadcrumbs = [
  {
    name: t('inventoryControl'),
  },
  {
    name: t('rePricing'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  status: null | number
  organisation_id: null | number
  store_id: null | number
  date: null | string
}>({
  page: +queries.page || 1,
  search: queries.search || null,
  organisation_id: +queries.organisation_id || null,
  status: +queries.status || null,
  store_id: +queries.store_id || null,
  date: queries.date || null,
  lastPage: null,
  perPage: null,
  total: null,
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
    text: t('document'),
    value: 'number',
  },
  {
    text: t('date'),
    value: 'date',
  },
  {
    text: t('countOfProducts'),
    value: 'product_count_total',
  },
  {
    text: t('sellPriceOld'),
    value: 'sell_amount_before',
  },
  {
    text: t('sellPrice'),
    value: 'sell_amount_after',
  },
  {
    text: t('status'),
    value: 'status',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const dialog = ref(false)
const items = ref([])
const organisations = ref([])
const warehouses = ref([])

const useFetchOrganisations = async () => {
  try {
    const {
      data: { data },
    } = await fetchOrganisations()
    organisations.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchWarehouses = async () => {
  try {
    const {
      data: { data },
    } = await fetchWarehouses()
    warehouses.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchRevaluaitons = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchRevaluations(options.value)
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
    await useFetchOrganisations()
    await useFetchWarehouses()
    await useFetchRevaluaitons()
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
    await useFetchRevaluaitons()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_id: options.value.organisation_id,
      status: options.value.status,
      store_id: options.value.store_id,
      date: options.value.date,
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
    options.value.organisation_id = null
    options.value.status = null
    options.value.store_id = null
    options.value.date = null
    await useFetchRevaluaitons()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_id: options.value.organisation_id,
      status: options.value.status,
      store_id: options.value.store_id,
      date: options.value.date,
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
    await useFetchRevaluaitons()
    await $addQuery({
      page: options.value.page,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()
</script>
