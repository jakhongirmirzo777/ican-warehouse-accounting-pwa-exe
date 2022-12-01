<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('rePricing') }}
  </VText>
  <VCard>
    <VFilterCollapse>
      <template #top="{ toggle }">
        <VRow>
          <VCol md="1">
            <VBtn
              class="mb-20"
              color="primary"
              width="100%"
              @click="
                () => {
                  isUpdate = false
                  dialog = true
                }
              "
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
      <template #item.course="{ item }">
        {{ $moneyFormat(item.course) }}
      </template>
      <template #item.products_count_sum="{ item }">
        {{ $moneyFormat(item.products_count_sum) }}
      </template>
      <template #item.count="{ item }">
        {{ $moneyFormat(item.count) }}
      </template>
      <template #item.incoming_price_sum="{ item }">
        {{ $moneyFormat(item.incoming_price_sum) }}
      </template>
      <template #item.selling_price_sum="{ item }">
        {{ $moneyFormat(item.selling_price_sum) }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex">
          <VTableActions
            :actions="{
              view: true,
              edit: item.status === INVENTORY_DOCUMENTS_STATUS_VALUE.NEW,
              delete: item.status === INVENTORY_DOCUMENTS_STATUS_VALUE.NEW,
            }"
            @view="
              $router.push(
                $localePath(`/cabinet/inventory-revaluation-item/${item.id}`)
              )
            "
            @edit="editRevaluation(item.id)"
            @delete="handleDelete(item.id)"
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
    :data="editValue"
    :organisations="organisations"
    :warehouses="warehouses"
    :is-update="isUpdate"
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
  fetchRevaluation,
  deleteRevaluation,
  fetchOrganisations,
  fetchWarehouses,
} from '@/services/cabinet/InventoryRevaluationService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists } from '@/utils/pure-functions'
import {
  INVENTORY_DOCUMENTS_COLORED,
  INVENTORY_DOCUMENTS_STATUS_VALUE,
  INVENTORY_DOCUMENTS_STATUS_INDEXED,
} from '@/utils/constants'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { t } = useI18n()
const queries = getQuery([
  'search',
  'organisation_id',
  'status',
  'store_id',
  'date',
  'page',
])
clearQuery(['search', 'organisation_id', 'status', 'store_id', 'date', 'page'])

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
    text: t('document'),
    value: 'number',
  },
  {
    text: t('date'),
    value: 'date',
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
    text: t('agreement'),
    value: 'contract_number',
  },
  {
    text: t('invoice'),
    value: 'invoice_number',
  },
  {
    text: t('warehouse'),
    value: 'store_name',
  },
  {
    text: t('currencyOfDocument'),
    value: 'currency',
  },
  {
    text: t('systemCourse'),
    value: 'course',
  },
  {
    text: t('countOfProducts'),
    value: 'products_count_sum',
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
const isUpdate = ref(false)
const items = ref([])
const organisations = ref([])
const warehouses = ref([])
const editValue = ref<{
  id: number | null
  organisation_id: number | null
  store_id: number | null
  date: string | null
}>({
  id: null,
  organisation_id: null,
  store_id: null,
  date: null,
})

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

const handleDelete = async (id: number) => {
  try {
    $showLoading()
    await deleteRevaluation(id)
    if (
      options.value &&
      options.value.total &&
      options.value.perPage &&
      $isPageExists(options.value.total, options.value.perPage)
    ) {
      options.value.page = 1
      addQuery({
        page: 1,
      })
    }
    await useFetchRevaluaitons()
    $successMessage(t('notifications.deletedSuccessfully'))
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
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

const editRevaluation = async (id: number) => {
  try {
    const {
      data: { data },
    } = await fetchRevaluation(id)
    editValue.value = data
    isUpdate.value = true
    dialog.value = true
  } catch (err) {
    $setResponseErrors(err)
  }
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchRevaluaitons()
    await addQuery({
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
    await addQuery({
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
