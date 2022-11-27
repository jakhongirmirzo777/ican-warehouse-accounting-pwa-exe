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
      <VBtn
        v-if="INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status"
        class="w-100 w-md-unset"
        outlined
        color="primary"
        @click="useForwardToStore"
      >
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
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol md="2">
          <VSelect
            vid="product_id"
            focus
            can-add
            autocomplete
            rules="required"
            :label="t('typeNameOfProduct')"
            :items="products"
            v-model="formData.product_id"
            @filter="useFetchProductSearchDebounce"
            @add="productDialog = true"
          />
        </VCol>
        <VCol md="2">
          <VInput
            vid="count"
            type="number"
            rules="required"
            :label="t('quantity')"
            v-model="formData.count"
          />
        </VCol>
        <VCol md="2">
          <VInput
            vid="incoming_price"
            type="number"
            rules="required"
            :label="t('arrivalPrice')"
            v-model="formData.incoming_price"
            @update:modelValue="handlePriceLogic('INCOMING_PRICE')"
          />
        </VCol>
        <VCol md="2">
          <VInput
            vid="margin"
            type="number"
            rules="required|min_value:0"
            :label="t('priceMargin')"
            v-model="formData.margin"
            @update:modelValue="handlePriceLogic('MARGIN')"
          >
            <template #append> % </template>
          </VInput>
        </VCol>
        <VCol md="2">
          <VInput
            vid="selling_price"
            type="number"
            rules="required"
            :label="t('sellingPrice')"
            v-model="formData.selling_price"
            @update:modelValue="handlePriceLogic('SELLING_PRICE')"
          />
        </VCol>
        <VCol md="2">
          <VCheckbox
            class="my-8"
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
          <VInput
            disabled
            :label="t('barcode')"
            v-model="productInfo.barcode"
          />
        </VCol>
        <VCol md="2">
          <VInput
            disabled
            :label="t('units')"
            v-model="productInfo.unit_name"
          />
        </VCol>
        <VCol v-if="!isUpdate" md="2">
          <VBtn type="submit" class="mb-20" color="primary" width="100%">
            <VIcon class="mr-10" size="20" icon="circle-plus" />
            {{ t('add') }}
          </VBtn>
        </VCol>
        <VCol v-if="isUpdate" md="1">
          <VBtn
            type="button"
            class="mb-20"
            outlined
            color="primary"
            width="100%"
            @click="isUpdate = false"
          >
            {{ t('cancel') }}
          </VBtn>
        </VCol>
        <VCol v-if="isUpdate" md="1">
          <VBtn type="submit" class="mb-20" color="primary" width="100%">
            {{ t('edit') }}
          </VBtn>
        </VCol>
      </VRow>
    </Form>
    <VTable :headers="headers" :items="items">
      <template #item.count="{ item }">
        {{ $moneyFormat(item.count) }}
      </template>
      <template #item.is_showcase="{ item }">
        <VStatus
          min-width="70px"
          :theme="
            item.is_showcase
              ? 'rgba(40, 180, 70, 0.24)'
              : 'rgba(23,189,192,0.24)'
          "
          :color="item.is_showcase ? '#28B446' : '#17BDC0'"
        >
          {{ item.is_showcase ? t('showcase') : t('warehouse') }}
        </VStatus>
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
  <ReferenceProductNameDialog
    v-model="productDialog"
    :categories="categories"
    :units="units"
    @submit="handleAddProduct"
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
import VStatus from '@/components/ui/VStatus.vue'
import InventoryIncomeDialog from '@/components/pages/inventory-income/InventoryIncomeDialog.vue'
import ReferenceProductNameDialog from '@/components/pages/reference-product-name/ReferenceProductNameDialog.vue'
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
  fetchCategories,
  fetchUnits,
  createProduct,
  editProduct,
  deleteProduct,
  forwardToStore,
} from '@/services/cabinet/InventoryIncomeService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $debounce, $isPageExists } from '@/utils/pure-functions'
import { INVENTORY_DOCUMENTS_STATUS_VALUE } from '@/utils/constants'
import { useRoute } from 'vue-router'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'

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
  id: null,
  product_id: null,
  incoming_price: null,
  margin: null,
  selling_price: null,
  count: null,
  is_showcase: false,
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
    text: t('arrivalPrice'),
    value: 'incoming_price',
  },
  {
    text: t('sellingPrice'),
    value: 'selling_price',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const id = computed(() => route.params.id || null)
const formObj = ref<any>(null)
const productDialog = ref(false)
const documentDialog = ref(false)
const isUpdate = ref(false)
const document = ref({})
const organisations = ref([])
const warehouses = ref([])
const categories = ref([])
const units = ref([])
const currencies = ref([])
const products = ref([])
const items = ref([])
const formData = ref<{
  id: null | number
  product_id: null | number
  incoming_price: null | string | number
  margin: null | string | number
  selling_price: null | string | number
  count: null | string | number
  is_showcase: boolean
}>({
  ...FORM_DATA,
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

const useFetchCategories = async () => {
  try {
    const {
      data: { data },
    } = await fetchCategories()
    categories.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchUnits = async () => {
  try {
    const {
      data: { data },
    } = await fetchUnits()
    units.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

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

const useForwardToStore = async () => {
  try {
    if (!id.value) return
    await forwardToStore(+id.value)
    await useFetchIncome()
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchIncome = async () => {
  try {
    if (!id.value) return
    const {
      data: { data },
    } = await fetchIncome(+id.value)
    document.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchProductSearch = async (search = '') => {
  try {
    const {
      data: { data },
    } = await fetchProductSearch(search)
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
    products.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
})

const useFetchProduct = async () => {
  try {
    if (!id.value) return
    const {
      data: { data, links },
    } = await fetchProduct(+id.value, options.value.page)
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

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    const newFormData = { ...formData.value }
    newFormData.incoming_price = Number(newFormData.incoming_price).toFixed(1)
    newFormData.selling_price = Number(newFormData.selling_price).toFixed(1)
    newFormData.margin = Number(newFormData.margin).toFixed(1)
    if (isUpdate.value) {
      await editProduct(newFormData.id as any, newFormData)
      isUpdate.value = false
      await $successMessage(t('notifications.editedSuccessfully'))
    } else {
      await createProduct(id.value as any, newFormData)
      await $successMessage(t('notifications.addedSuccessfully'))
    }
    formData.value = { ...FORM_DATA }
    formObj.value?.resetForm()
    await useFetchProduct()
    await useFetchIncome()
  } catch (err) {
    $setResponseErrors(err)
    $setFormErrors(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await Promise.all([
      useFetchCategories(),
      useFetchUnits(),
      useFetchIncome(),
      useFetchProductSearch(),
      useFetchOrganisations(),
      useFetchWarehouses(),
      useFetchCurrencies(),
      useFetchProduct(),
    ])
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const useEditProduct = (item: {
  id: number
  product_id: number
  product_name: string
  incoming_price: string
  margin: string
  selling_price: string
  count: number
  is_showcase: boolean
}) => {
  useFetchProductSearch(item.product_name)
  formData.value.id = item.id
  formData.value.product_id = item.product_id
  formData.value.incoming_price = +item.incoming_price
  formData.value.margin = +item.margin
  formData.value.selling_price = +item.selling_price
  formData.value.count = +item.count
  formData.value.is_showcase = item.is_showcase
  isUpdate.value = true
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

const handleAddProduct = () => {
  useFetchProductSearch()
  formData.value.product_id = null
  formObj.value?.resetForm()
}

const handlePriceLogic = $debounce((t: any) => {
  const type = (t && t.length && t[0]) || ''
  const incomingPrice = +(formData.value.incoming_price || '0')
  const sellingPrice = +(formData.value.selling_price || '0')
  const margin = +(formData.value.margin || '0')
  if (type === 'INCOMING_PRICE' || type === 'MARGIN') {
    if (formData.value.incoming_price && formData.value.margin) {
      formData.value.selling_price =
        incomingPrice + (incomingPrice * margin) / 100
    }
  } else if (type === 'SELLING_PRICE') {
    if (formData.value.incoming_price && formData.value.selling_price) {
      formData.value.margin =
        ((sellingPrice - incomingPrice) * 100) / incomingPrice
    }
  }
})

useFetchData()
</script>
