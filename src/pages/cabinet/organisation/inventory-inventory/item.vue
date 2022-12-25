<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <div class="d-flex align-center justify-between wrap mb-24">
    <div class="d-flex align-center wrap mb-16 mb-md-0">
      <VBackBtn class="mr-16" />
      <VText tag="h2" weight="600" color="#0E1E56">
        {{ t('inventory') }}
      </VText>
    </div>
    <div class="d-flex align-center wrap w-100 w-md-unset">
      <VBtn
        v-if="
          INVENTORY_DOCUMENTS_STATUS_VALUE.CANCELED !== document.status &&
          (INVENTORY_DOCUMENTS_STATUS_VALUE.HELD !== document.status
            ? $can('organisation.inventory.cancel.forward')
            : $can('organisation.inventory.cancel'))
        "
        class="w-100 w-md-unset mr-md-10 mb-16 mb-md-0"
        outlined
        color="danger"
        @click="useCancel"
      >
        <VIcon color="#F94E4F" icon="x-mark" size="12" class="mr-8" />
        <span>{{ t('cancel') }}</span>
      </VBtn>
      <VBtn
        v-if="
          INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status &&
          $can('organisation.inventory.forward.store')
        "
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
  <InventoryInventoryProductsAdd
    v-if="addAsList"
    @cancel="addAsList = false"
    @submit="
      () => {
        useFetchProduct()
        addAsList = false
      }
    "
  />
  <VCard class="mb-24">
    <div v-if="!addAsList">
      <Form @submit="onSubmit" ref="formObj">
        <VRow>
          <VCol md="4">
            <VSelect
              ref="productRef"
              vid="product_id"
              :focus="INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status"
              autocomplete
              :rules="{
                required:
                  INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
              }"
              :label="t('typeNameOfProduct')"
              item-text="product_name"
              item-value="product_id"
              :items="products"
              v-model="formData.product_id"
              @filter="useFetchProductSearchDebounce"
            />
          </VCol>
          <VCol md="2">
            <VInput
              disabled
              vid="count_stock_before"
              type="number"
              :label="t('countStockBefore')"
              :model-value="productInfo.count_stock"
            />
          </VCol>
          <VCol md="2">
            <VInput
              disabled
              vid="count_showcase_before"
              type="number"
              :label="t('countShowcaseBefore')"
              :model-value="productInfo.count_showcase"
            />
          </VCol>
          <VCol md="2">
            <VInput
              vid="count_stock_after"
              type="number"
              :rules="{
                required:
                  INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
              }"
              :label="t('countStockAfter')"
              v-model="formData.count_stock_after"
            />
          </VCol>
          <VCol md="2">
            <VInput
              vid="count_showcase_after"
              type="number"
              :rules="{
                required:
                  INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
              }"
              :label="t('countShowcaseAfter')"
              v-model="formData.count_showcase_after"
            />
          </VCol>
          <VCol md="4">
            <VInput
              disabled
              :label="t('name')"
              v-model="productInfo.product_name"
            />
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
        </VRow>
        <VRow>
          <VCol md="8" />
          <VCol
            v-if="
              !isUpdate &&
              INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status
            "
            md="2"
          >
            <VBtn
              type="button"
              class="mb-20"
              color="primary"
              width="100%"
              @click="addAsList = true"
            >
              <VIcon class="mr-10" size="20" icon="file" color="#fff" />
              {{ t('fillList') }}
            </VBtn>
          </VCol>
          <VCol
            v-if="
              !isUpdate &&
              INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status
            "
            md="2"
          >
            <VBtn type="submit" class="mb-20" color="primary" width="100%">
              <VIcon class="mr-10" size="20" icon="circle-plus" />
              {{ t('add') }}
            </VBtn>
          </VCol>
          <VCol v-if="isUpdate" md="2">
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
          <VCol v-if="isUpdate" md="2">
            <VBtn type="submit" class="mb-20" color="primary" width="100%">
              {{ t('edit') }}
            </VBtn>
          </VCol>
        </VRow>
      </Form>
      <VLine class="mb-16" />
    </div>
    <VTable :headers="headers" :items="items">
      <template #item.count_showcase_after="{ item }">
        {{ $moneyFormat(item.count_showcase_after) }}
      </template>
      <template #item.count_showcase_before="{ item }">
        {{ $moneyFormat(item.count_showcase_before) }}
      </template>
      <template #item.count_stock_after="{ item }">
        {{ $moneyFormat(item.count_stock_after) }}
      </template>
      <template #item.count_stock_before="{ item }">
        {{ $moneyFormat(item.count_stock_before) }}
      </template>
      <template #item.actions="{ item }">
        <VTableActions
          v-if="document.status === INVENTORY_DOCUMENTS_STATUS_VALUE.NEW"
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
import InventoryInventoryProductsAdd from '@/components/pages/inventory-inventory/InventoryInventoryProductsAdd.vue'

import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchProductSearch,
  fetchProduct,
  createProduct,
  editProduct,
  deleteProduct,
  forwardToStore,
  cancelFromStore,
  cancelInventory,
} from '@/services/cabinet/InventoryInventoryService'
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
const queries = getQuery(['page', 'store_id', 'status'])
clearQuery(['page', 'store_id', 'status', 'organisation_id'])

const breadcrumbs = [
  {
    name: t('inventoryControl'),
  },
  {
    name: t('inventory'),
  },
  {
    name: t('document'),
  },
]

const FORM_DATA = {
  id: null,
  product_id: null,
  count_stock_before: null,
  count_stock_after: null,
  count_showcase_before: null,
  count_showcase_after: null,
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
    text: t('units'),
    value: 'unit_name',
  },
  {
    text: t('countStockBefore'),
    value: 'count_stock_before',
  },
  {
    text: t('countStockAfter'),
    value: 'count_stock_after',
  },
  {
    text: t('countShowcaseBefore'),
    value: 'count_showcase_before',
  },
  {
    text: t('countShowcaseAfter'),
    value: 'count_showcase_after',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const document = ref({
  store_id: +queries.store_id,
  status: +queries.status,
})
const addAsList = ref(false)
const id = computed(() => route.params.id || null)
const formObj = ref<any>(null)
const productRef = ref()
const isUpdate = ref(false)
const products = ref([])
const items = ref([])
const formData = ref<{
  id: null | number
  product_id: null | number
  count_stock_before: null | number
  count_showcase_before: null | number
  count_stock_after: null | number
  count_showcase_after: null | number
}>({
  ...FORM_DATA,
})

const productInfo = computed(() => {
  const data = products.value.find(
    (item: { product_id: number }) =>
      item.product_id === formData.value.product_id
  )
  if (data) return data
  return {
    id: null,
    product_name: null,
    barcode: null,
    category_name: null,
    articule: null,
    unit_name: null,
    count_stock: null,
    count_showcase: null,
  }
})

watch(
  () => productInfo.value.count_stock,
  () => (formData.value.count_stock_before = productInfo.value.count_stock)
)

watch(
  () => productInfo.value.count_showcase,
  () =>
    (formData.value.count_showcase_before = productInfo.value.count_showcase)
)

const useForwardToStore = async () => {
  try {
    if (!id.value) return
    await forwardToStore(+id.value)
    document.value.status = INVENTORY_DOCUMENTS_STATUS_VALUE.HELD
    await addQuery({
      status: document.value.status,
    })
    $successMessage(t('notifications.forwardedSuccessfully'))
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useCancel = async () => {
  try {
    if (!id.value) return
    if (document.value.status === INVENTORY_DOCUMENTS_STATUS_VALUE.HELD)
      await cancelFromStore(+id.value)
    else await cancelInventory(+id.value)
    document.value.status = INVENTORY_DOCUMENTS_STATUS_VALUE.CANCELED
    await addQuery({
      status: document.value.status,
    })
    $successMessage(t('notifications.canceledSuccessfully'))
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchProductSearch = async (store_id: number, search = '') => {
  try {
    const {
      data: { data },
    } = await fetchProductSearch(store_id, search)
    products.value = data.map((item: Record<string, string | number>) => {
      item.product_name = `${item.product_name} (${item.articule})`
      return item
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchProductSearchDebounce = $debounce(async (val: any) => {
  try {
    const value = (val && val.length && val[0]) || ''
    if (!value) return
    const {
      data: { data },
    } = await fetchProductSearch(document.value.store_id, value)
    products.value = data.map((item: Record<string, string | number>) => {
      item.product_name = `${item.product_name} (${item.articule})`
      return item
    })
    if (products.value.length === 1) {
      formData.value.product_id = (products.value[0] as any).product_id
      await productRef.value.blur()
    }
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
    const newFormData: Record<string, any> = { ...formData.value }
    if (
      typeof newFormData.count_stock_after === 'object' ||
      typeof newFormData.count_showcase_after === 'object'
    ) {
      return
    }
    newFormData.count_stock_before = Math.round(+newFormData.count_stock_before)
    newFormData.count_showcase_before = Math.round(
      +newFormData.count_showcase_before
    )
    newFormData.count_stock_after = Math.round(+newFormData.count_stock_after)
    newFormData.count_showcase_after = Math.round(
      +newFormData.count_showcase_after
    )
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
    await productRef.value.focus()
    await useFetchProduct()
  } catch (err) {
    $setResponseErrors(err)
    $setFormErrors(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchProduct()
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
  count_stock_before: number
  count_stock_after: number
  count_showcase_before: number
  count_showcase_after: number
}) => {
  useFetchProductSearch(document.value.store_id, item.product_name)
  formData.value.id = item.id
  formData.value.product_id = item.product_id
  formData.value.count_stock_before = item.count_stock_before
  formData.value.count_stock_after = item.count_stock_after
  formData.value.count_showcase_before = item.count_showcase_before
  formData.value.count_showcase_after = item.count_showcase_after
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

useFetchData()
</script>
