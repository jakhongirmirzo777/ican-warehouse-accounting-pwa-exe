<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('incoming') }}
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
              @update:modelValue="useFetchResources"
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
              <VExcel url="test" :filters="options" />
            </div>
          </VCol>
        </VRow>
      </template>
      <template #bottom>
        <VRow>
          <VCol md="3">
            <VSelect
              :disabled="!options.organisation_id"
              clearable
              autocomplete
              item-text="company_name"
              :label="t('counterpart')"
              :items="resources"
              v-model="options.counterparty_id"
              @update:modelValue="
                () => {
                  options.contract_id = null
                  options.invoice_id = null
                }
              "
            />
          </VCol>
          <VCol md="3">
            <VSelect
              :disabled="!options.counterparty_id"
              clearable
              autocomplete
              item-text="number"
              :label="t('agreement')"
              :items="contracts"
              v-model="options.contract_id"
            />
          </VCol>
          <VCol md="3">
            <VSelect
              :disabled="!options.counterparty_id"
              clearable
              autocomplete
              item-text="number"
              :label="t('invoice')"
              :items="invoices"
              v-model="options.invoice_id"
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
        </VRow>
      </template>
    </VFilterCollapse>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.status="{ item }">
        {{ item.status_text }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex">
          <VBtn class="mr-8" height="32px" outlined color="primary">
            <VIcon color="#17BDC0" icon="reply" size="12" class="mr-8" />
            <span>{{ t('process') }}</span>
          </VBtn>
          <VTableActions
            @edit="editIncome(item.id)"
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
  <InventoryIncomeDialog
    v-model="dialog"
    :data="editValue"
    :organisations="organisations"
    :warehouses="warehouses"
    :currencies="currencies"
    :is-update="isUpdate"
    @submit="useFetchIncomes"
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
import InventoryIncomeDialog from '@/components/pages/inventory-income/InventoryIncomeDialog.vue'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchIncomes,
  fetchIncome,
  fetchOrganisations,
  fetchWarehouses,
  fetchResources,
  deleteIncome,
  fetchCurrencies,
} from '@/services/cabinet/InventoryIncomeService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { t } = useI18n()
const queries = getQuery([
  'search',
  'organisation_id',
  'counterparty_id',
  'contract_id',
  'invoice_id',
  'store_id',
  'date',
  'page',
])
clearQuery([
  'search',
  'organisation_id',
  'counterparty_id',
  'contract_id',
  'invoice_id',
  'store_id',
  'date',
  'page',
])

const breadcrumbs = [
  {
    name: t('inventoryControl'),
  },
  {
    name: t('incoming'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  organisation_id: null | number
  counterparty_id: null | number
  contract_id: null | number
  invoice_id: null | number
  store_id: null | number
  date: null | string
}>({
  page: +queries.page || 1,
  search: queries.search || null,
  organisation_id: +queries.organisation_id || null,
  counterparty_id: +queries.counterparty_id || null,
  contract_id: +queries.contract_id || null,
  invoice_id: +queries.invoice_id || null,
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
    text: t('countOfNames'),
    value: 'count',
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
const currencies = ref([])
const resources = ref([])
const contracts = computed(() => {
  return (
    (resources as any).value.find(
      (item: { id: number }) => item.id === options.value.counterparty_id
    )?.contracts || []
  )
})
const invoices = computed(() => {
  return (
    (resources as any).value.find(
      (item: { id: number }) => item.id === options.value.counterparty_id
    )?.invoices || []
  )
})
const editValue = ref<{
  id: number | null
  organisation_id: number | null
  contract_id: number | null
  store_id: number | null
  counterparty_id: number | null
  invoice_id: number | null
  date: string | null
}>({
  id: null,
  organisation_id: null,
  contract_id: null,
  store_id: null,
  counterparty_id: null,
  invoice_id: null,
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

const useFetchCurrencies = async () => {
  try {
    const {
      data: { data },
    } = await fetchCurrencies()
    currencies.value = data
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

const useFetchResources = async () => {
  try {
    options.value.counterparty_id = null
    options.value.contract_id = null
    options.value.invoice_id = null
    if (!options.value.organisation_id) return
    const {
      data: { data },
    } = await fetchResources(options.value.organisation_id)
    resources.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchIncomes = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchIncomes(options.value.page)
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
    await deleteIncome(id)
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
    await useFetchIncomes()
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
    await useFetchResources()
    await useFetchCurrencies()
    await useFetchWarehouses()
    await useFetchIncomes()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editIncome = async (id: number) => {
  try {
    const {
      data: { data },
    } = await fetchIncome(id)
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
    await useFetchIncomes()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_id: options.value.organisation_id,
      counterparty_id: options.value.counterparty_id,
      contract_id: options.value.contract_id,
      invoice_id: options.value.invoice_id,
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
    options.value.contract_id = null
    options.value.invoice_id = null
    options.value.store_id = null
    options.value.date = null
    await useFetchIncomes()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_id: options.value.organisation_id,
      counterparty_id: options.value.counterparty_id,
      contract_id: options.value.contract_id,
      invoice_id: options.value.invoice_id,
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
    await useFetchIncomes()
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
