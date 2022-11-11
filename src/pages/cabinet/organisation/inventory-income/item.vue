<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <div class="d-flex align-center justify-between wrap mb-24">
    <div class="d-flex align-center wrap mb-16 mb-md-0">
      <VBackBtn class="mr-16 mb-16 mb-md-0" />
      <VText tag="h2" weight="600" color="#0E1E56">
        {{ t('goodsPosting') }}
      </VText>
    </div>
    <div class="d-flex align-center wrap w-100 w-md-unset">
      <VBtn
        class="mr-md-8 mb-8 mb-md-0 w-100 w-md-unset"
        outlined
        color="primary"
      >
        {{ t('createFinancialEntry') }}
      </VBtn>
      <VBtn class="w-100 w-md-unset" outlined color="primary">
        <VIcon color="#17BDC0" icon="reply" size="12" class="mr-8" />
        <span>{{ t('process') }}</span>
      </VBtn>
    </div>
  </div>
  <CounterpartyInvoiceItemDocumentInfo
    class="mb-15"
    :document="document"
    @edit="documentDialog = true"
  />
  <VCard>
    <div class="mb-16 d-flex justify-between align-center wrap">
      <VText
        class="mb-16 mb-md-0"
        weight="600"
        color="#0E1E56"
        size="18"
        tag="h3"
      >
        {{ t('addGoods') }}
      </VText>
      <div class="d-flex wrap w-100 w-md-unset">
        <VBtn class="mb-16 mb-md-0 mr-md-16 w-100 w-md-unset" color="success">
          <VIcon size="18" icon="file" color="#fff" class="mr-2" />
          {{ t('excelImport') }}
        </VBtn>
        <VExcel class="w-100 w-md-unset" url="" :filters="options" />
      </div>
    </div>
    <VLine class="mb-16" />
    <VRow>
      <VCol md="2">
        <VInput clearable :label="t('search')" v-model="options.search" />
      </VCol>
      <VCol md="2">
        <VSelect
          multiple
          clearable
          autocomplete
          :label="t('organisation')"
          :items="organisations"
          v-model="options.organisation_ids"
        />
      </VCol>
      <VCol md="2">
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
    </VRow>
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          @edit="useEditProduct(item)"
          @delete="handleDelete(item.id)"
        />
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
    is-update
    v-model="documentDialog"
    :data="document"
    :organisations="organisations"
    :warehouses="warehouses"
    :currencies="currencies"
    @submit="useFetchIncome"
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
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VBackBtn from '@/components/ui/VBackBtn.vue'
import VExcel from '@/components/ui/VExcel.vue'
import InventoryIncomeDialog from '@/components/pages/inventory-income/InventoryIncomeDialog.vue'
import CounterpartyInvoiceItemDocumentInfo from '@/components/pages/counterparty-invoice-item/CounterpartyInvoiceItemDocumentInfo.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchIncome,
  fetchOrganisations,
  fetchWarehouses,
  fetchCurrencies,
  // fetchProductSearch,
  // fetchFeatures,
  fetchProduct,
  // createProduct,
  // editProduct,
  deleteProduct,
} from '@/services/cabinet/InventoryIncomeService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists } from '@/utils/pure-functions'
import { useRoute } from 'vue-router'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const route = useRoute()
const { t } = useI18n()
const queries = getQuery(['page'])
clearQuery(['page'])

const breadcrumbs = [
  {
    name: t('inventoryControl'),
  },
  {
    name: t('incoming'),
  },
  {
    name: t('document'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
}>({
  page: +queries.page || 1,
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
    text: t('name'),
    value: 'name',
  },
  {
    text: t('organisation'),
    value: 'organisation_name',
  },
  {
    text: t('address'),
    value: 'address',
  },
  {
    text: t('director'),
    value: 'director',
  },
  {
    text: t('phone'),
    value: 'phone',
  },
  {
    text: t('saleAvailable'),
    value: 'sale_available',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const id = route.params.id
const documentDialog = ref(false)
const dialog = ref(false)
const isUpdate = ref(false)
const document = ref({})
const organisations = ref([])
const warehouses = ref([])
const currencies = ref([])
const items = ref([])
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

const useFetchIncome = async () => {
  try {
    if (!id) return
    const {
      data: { data },
    } = await fetchIncome(+id)
    document.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchProduct = async () => {
  try {
    if (!id) return
    const {
      data: { data, links },
    } = await fetchProduct(+id, options.value.page)
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
    await deleteProduct(id)
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
    await useFetchProduct()
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
    await useFetchIncome()
    await useFetchOrganisations()
    await useFetchWarehouses()
    await useFetchCurrencies()
    await useFetchProduct()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const useEditProduct = (item: {
  id: number
  organisation_id: number
  contract_id: number
  store_id: number
  counterparty_id: number
  invoice_id: number
  date: string
}) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const paginate = async () => {
  try {
    $showLoading()
    await useFetchProduct()
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
