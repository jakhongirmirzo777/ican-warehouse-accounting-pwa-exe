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
        <VSelect
          autocomplete
          :label="t('typeNameOfProduct')"
          :items="products"
          v-model="formData.product_id"
          @filter="useFetchProductSearchDebounce"
        />
      </VCol>
      <VCol md="2">
        <VInput
          type="number"
          rules="required"
          :label="t('quantity')"
          v-model="formData.count"
        />
      </VCol>
      <VCol md="2">
        <VInput
          type="money"
          rules="required"
          :label="t('arrivalPrice')"
          v-model="formData.count"
        />
      </VCol>
      <VCol md="2">
        <VInput
          type="number"
          rules="required"
          :label="t('priceMargin')"
          v-model="formData.count"
        >
          <template #append> % </template>
        </VInput>
      </VCol>
      <VCol md="2">
        <VInput
          type="money"
          rules="required"
          :label="t('sellingPrice')"
          v-model="formData.count"
        />
      </VCol>
      <VCol md="2">
        <VBtn class="w-100" outlined color="primary">
          {{ t('characteristics') }}
        </VBtn>
      </VCol>
      <VCol md="2">
        <VCheckbox
          class="mt-6"
          hide-details
          v-model="formData.is_showcase"
          :label="t('placeOnShowcase')"
        />
      </VCol>
      <VCol md="2">
        <VInput disabled :label="t('name')" v-model="productInfo.name" />
      </VCol>
      <VCol md="2">
        <VInput
          disabled
          :label="t('category')"
          v-model="productInfo.category_name"
        />
      </VCol>
      <VCol md="2">
        <VInput
          disabled
          :label="t('articule')"
          v-model="productInfo.articule"
        />
      </VCol>
      <VCol md="2">
        <VInput disabled :label="t('barcode')" v-model="productInfo.barcode" />
      </VCol>
      <VCol md="2">
        <VInput disabled :label="t('units')" v-model="productInfo.unit_name" />
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
      <template #item.is_showcase="{ item }">
        {{ item.is_showcase ? t('showcase') : '' }}
      </template>
      <template #item.features="{ item }">
        {{
          item.features
            .map((feature) => `${feature.feature}: ${feature.value}`)
            .join(', ')
        }}
      </template>
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
import VCheckbox from '@/components/ui/VCheckbox.vue'
import InventoryIncomeDialog from '@/components/pages/inventory-income/InventoryIncomeDialog.vue'
import CounterpartyInvoiceItemDocumentInfo from '@/components/pages/counterparty-invoice-item/CounterpartyInvoiceItemDocumentInfo.vue'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchIncome,
  fetchOrganisations,
  fetchWarehouses,
  fetchCurrencies,
  fetchProductSearch,
  fetchProduct,
  // createProduct,
  // editProduct,
  deleteProduct,
} from '@/services/cabinet/InventoryIncomeService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $debounce, $isPageExists } from '@/utils/pure-functions'
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

const FORM_DATA = {
  product_id: null,
  incoming_price: null,
  margin: null,
  selling_price: null,
  count: null,
  is_showcase: false,
  features: [],
}

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
    text: t('product'),
    value: 'product_name',
  },
  {
    text: t('category'),
    value: 'category_name',
  },
  {
    text: t('articule'),
    value: 'article',
  },
  {
    text: t('barcode'),
    value: 'barcode',
  },
  {
    text: t('quantity'),
    value: 'count',
  },
  {
    text: t('units'),
    value: 'unit_name',
  },
  {
    text: t('putPlace'),
    value: 'is_showcase',
  },
  {
    text: t('characteristics'),
    value: 'features',
  },
  {
    text: t('arrivalPrice'),
    value: 'incoming_price_sum',
  },
  {
    text: t('sellingPrice'),
    value: 'selling_price_sum',
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
const products = ref([])
const items = ref([])
const formData = ref<{
  product_id: null | number
  incoming_price: null | string
  margin: null | string
  selling_price: null | string
  count: null | string
  is_showcase: boolean
  features: Array<Record<string, string | number>>
}>({
  ...FORM_DATA,
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

const productInfo = computed(() => {
  const data = products.value.find(
    (item: { id: number }) => item.id === formData.value.product_id
  )
  if (data) return data
  return {
    id: null,
    unit_id: null,
    category_id: null,
    name: null,
    barcode: null,
    category_name: null,
    articule: null,
    unit_name: null,
  }
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

const useFetchProductSearch = async () => {
  try {
    const {
      data: { data },
    } = await fetchProductSearch('')
    products.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchProductSearchDebounce = $debounce(async (val: any) => {
  try {
    const value = (val && val.length && val[0]) || ''
    const {
      data: { data },
    } = await fetchProductSearch(value)
    products.value.concat(data)
  } catch (err) {
    $setResponseErrors(err)
  }
})

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
    await useFetchProductSearch()
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
