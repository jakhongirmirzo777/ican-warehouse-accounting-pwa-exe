<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <div class="d-flex align-center justify-between wrap mb-24">
    <div class="d-flex align-center wrap mb-16 mb-md-0">
      <VBackBtn class="mr-16" />
      <VText tag="h2" weight="600" color="#0E1E56">
        {{ t('rePricing') }}
      </VText>
    </div>
    <div class="d-flex align-center wrap w-100 w-md-unset">
      <VBtn
        v-if="INVENTORY_DOCUMENTS_STATUS_VALUE.CANCELED !== document.status"
        class="w-100 w-md-unset mr-md-10 mb-16 mb-md-0"
        outlined
        color="danger"
        @click="useCancel"
      >
        <VIcon color="#F94E4F" icon="x-mark" size="12" class="mr-8" />
        <span>{{ t('cancel') }}</span>
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
  <VCard class="mb-24">
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol md="3">
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
            item-value="id"
            :items="products"
            v-model="formData.product_id"
            @filter="useFetchProductSearchDebounce"
          />
        </VCol>
        <VCol md="3">
          <VInput
            vid="selling_price_sum_before"
            type="number"
            :rules="{
              required:
                INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
            }"
            :label="t('oldPrice')"
            v-model="formData.selling_price_sum_before"
            @update:modelValue="handlePriceLogic('SELLING_PRICE_BEFORE')"
          />
        </VCol>
        <VCol md="3">
          <VInput
            vid="margin"
            type="number"
            :rules="{
              required:
                INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
              min_value: 0,
            }"
            :label="t('priceMargin')"
            v-model="formData.margin"
            @update:modelValue="handlePriceLogic('MARGIN')"
          >
            <template #append> % </template>
          </VInput>
        </VCol>
        <VCol md="3">
          <VInput
            vid="selling_price_sum_after"
            type="number"
            :rules="{
              required:
                INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
            }"
            :label="t('newPrice')"
            v-model="formData.selling_price_sum_after"
            @update:modelValue="handlePriceLogic('SELLING_PRICE_AFTER')"
          />
        </VCol>
        <VCol md="2">
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
    <VLine class="mb-16" />
    <VTable :headers="headers" :items="items">
      <template #item.selling_price_sum_before="{ item }">
        {{ $moneyFormat(item.selling_price_sum_before) }}
      </template>
      <template #item.selling_price_sum_after="{ item }">
        {{ $moneyFormat(item.selling_price_sum_after) }}
      </template>
      <template #item.margin="{ item }">
        {{ $moneyFormat(item.margin) }}
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

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchProductSearch,
  fetchProduct,
  createProduct,
  editProduct,
  deleteProduct,
  forwardToStore,
  cancelFromStore,
  cancelRevaluation,
} from '@/services/cabinet/InventoryRevaluationService'
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
clearQuery(['page', 'store_id', 'status'])

const breadcrumbs = [
  {
    name: t('inventoryControl'),
  },
  {
    name: t('rePricing'),
  },
  {
    name: t('document'),
  },
]

const FORM_DATA = {
  id: null,
  product_id: null,
  selling_price_sum_before: null,
  selling_price_sum_after: null,
  margin: null,
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
    text: t('oldPrice'),
    value: 'selling_price_sum_before',
  },
  {
    text: t('priceMargin'),
    value: 'margin',
  },
  {
    text: t('newPrice'),
    value: 'selling_price_sum_after',
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
const id = computed(() => route.params.id || null)
const formObj = ref<any>(null)
const productRef = ref()
const isUpdate = ref(false)
const products = ref([])
const items = ref([])
const formData = ref<{
  id: null | number
  product_id: null | number
  selling_price_sum_before: null | string | number
  margin: null | string | number
  selling_price_sum_after: null | string | number
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
    product_name: null,
    barcode: null,
    category_name: null,
    articule: null,
    unit_name: null,
  }
})

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
    else await cancelRevaluation(+id.value)
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
    products.value = data
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
    newFormData.selling_price_sum_before = Number(
      newFormData.selling_price_sum_before
    ).toFixed(1)
    newFormData.selling_price_sum_after = Number(
      newFormData.selling_price_sum_after
    ).toFixed(1)
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
  selling_price_sum_before: string
  selling_price_sum_after: string
  margin: string
}) => {
  useFetchProductSearch(document.value.store_id, item.product_name)
  formData.value.id = item.id
  formData.value.product_id = item.product_id
  formData.value.selling_price_sum_before = +item.selling_price_sum_before
  formData.value.selling_price_sum_after = +item.selling_price_sum_after
  formData.value.margin = +item.margin
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

const handlePriceLogic = $debounce((t: any) => {
  const type = (t && t.length && t[0]) || ''
  const sellingPriceSumBefore = +(
    formData.value.selling_price_sum_before || '0'
  )
  const sellingPriceSumAfter = +(formData.value.selling_price_sum_after || '0')
  const margin = +(formData.value.margin || '0')
  if (type === 'SELLING_PRICE_BEFORE' || type === 'MARGIN') {
    if (formData.value.selling_price_sum_before && formData.value.margin) {
      formData.value.selling_price_sum_after =
        sellingPriceSumBefore + (sellingPriceSumBefore * margin) / 100
    }
  } else if (type === 'SELLING_PRICE_AFTER') {
    if (
      formData.value.selling_price_sum_before &&
      formData.value.selling_price_sum_after
    ) {
      formData.value.margin =
        ((sellingPriceSumAfter - sellingPriceSumBefore) * 100) /
        sellingPriceSumBefore
    }
  }
})

useFetchData()
</script>
