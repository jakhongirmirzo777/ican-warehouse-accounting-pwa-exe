<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('returnToSupplier') }}
  </VText>
  <VCard>
    <VFilterCollapse>
      <template #top="{ toggle }">
        <VRow>
          <VCol v-if="$can('organisation.returns.create')" md="1">
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
              item-text="company_name"
              :label="t('counterpart')"
              :items="counterparties"
              v-model="options.counterparty_id"
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
      <template #item.products_count_total="{ item }">
        {{ $moneyFormat(item.products_count_total) }}
      </template>
      <template #item.incoming_price="{ item }">
        {{ $moneyFormat(item.incoming_price) }}
      </template>
      <template #item.incoming_price_sum="{ item }">
        {{ $moneyFormat(item.incoming_price_sum) }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex">
          <VTableActions
            view="organisation.returns.view"
            :actions="{
              view: true,
              edit: false,
              delete: false,
            }"
            @view="
              $router.push(
                $localePath(`/cabinet/inventory-return-item/${item.id}`)
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
  <InventoryReturnDialog
    v-model="dialog"
    :organisations="organisations"
    :warehouses="warehouses"
    :counterparties="counterparties"
    @submit="useFetchReturns"
    @re-fetch-warehouse="useFetchWarehouses"
    @re-fetch-counterparty="useFetchCounterparties"
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
import InventoryReturnDialog from '@/components/pages/inventory-return/InventoryReturnDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchReturns,
  fetchOrganisations,
  fetchWarehouses,
  fetchCounterparties,
} from '@/services/cabinet/InventoryReturnService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import {
  INVENTORY_DOCUMENTS_COLORED,
  INVENTORY_DOCUMENTS_STATUS_INDEXED,
} from '@/utils/constants'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { t } = useI18n()
const queries = getQuery([
  'search',
  'organisation_id',
  'status',
  'store_id',
  'counterparty_id',
  'date',
  'page',
])
clearQuery([
  'search',
  'organisation_id',
  'status',
  'store_id',
  'counterparty_id',
  'date',
  'page',
])

const breadcrumbs = [
  {
    name: t('inventoryControl'),
  },
  {
    name: t('returnToSupplier'),
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
  counterparty_id: null | number
  date: null | string
}>({
  page: +queries.page || 1,
  search: queries.search || null,
  organisation_id: +queries.organisation_id || null,
  status: +queries.status || null,
  store_id: +queries.store_id || null,
  counterparty_id: +queries.counterparty_id || null,
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
    text: t('counterpart'),
    value: 'counterparties_company_name',
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
    value: 'products_count_total',
  },
  {
    text: t('arrivalPrice'),
    value: 'incoming_price',
  },
  {
    text: t('incomePrice'),
    value: 'incoming_price_sum',
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
const counterparties = ref([])

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

const useFetchReturns = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchReturns(options.value)
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
    await useFetchCounterparties()
    await useFetchReturns()
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
    await useFetchReturns()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_id: options.value.organisation_id,
      counterparty_id: options.value.counterparty_id,
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
    options.value.counterparty_id = null
    options.value.status = null
    options.value.store_id = null
    options.value.date = null
    await useFetchReturns()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_id: options.value.organisation_id,
      counterparty_id: options.value.counterparty_id,
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
    await useFetchReturns()
    await addQuery({
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
