<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <div class="d-flex align-center justify-between wrap mb-24">
    <div class="d-flex align-center wrap mb-16 mb-md-0">
      <VBackBtn class="mr-16" />
      <VText tag="h2" weight="600" color="#0E1E56">
        {{ t('writeOff') }}
      </VText>
    </div>
    <div class="d-flex align-center wrap w-100 w-md-unset">
      <VBtn
        v-if="INVENTORY_DOCUMENTS_STATUS_VALUE.CANCELED !== document.status"
        class="w-100 w-md-unset mr-md-10 mb-16 mb-md-0"
        outlined
        color="danger"
        @click="
          () => {
            if (document.status === INVENTORY_DOCUMENTS_STATUS_VALUE.HELD) {
              useCancelFromStore()
            } else {
              useCancelWriteOff()
            }
          }
        "
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
            vid="count"
            type="number"
            :rules="{
              required:
                INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
            }"
            :label="t('quantity')"
            v-model="formData.count"
          />
        </VCol>
        <VCol md="2">
          <VInput
            vid="incoming_price"
            type="number"
            disabled
            :rules="{
              required:
                INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
            }"
            :label="t('lastIncomePrice')"
            v-model="formData.incoming_price"
          />
        </VCol>
        <VCol md="2">
          <VInput
            vid="incoming_price_sum"
            type="number"
            :rules="{
              required:
                INVENTORY_DOCUMENTS_STATUS_VALUE.NEW === document.status,
            }"
            :label="t('actualWriteOffPrice')"
            v-model="formData.incoming_price_sum"
          />
        </VCol>
        <VCol md="2">
          <VCheckbox
            class="mt-10"
            vid="is_showcase"
            :label="t('getFromShowcase')"
            v-model="formData.is_showcase"
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
      <template #item.incoming_price="{ item }">
        {{ $moneyFormat(item.incoming_price) }}
      </template>
      <template #item.incoming_price_sum="{ item }">
        {{ $moneyFormat(item.incoming_price_sum) }}
      </template>
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
          {{ item.is_showcase ? t('yes') : t('no') }}
        </VStatus>
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
import VCheckbox from '@/components/ui/VCheckbox.vue'
import VStatus from '@/components/ui/VStatus.vue'

import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchWriteOff,
  fetchProductSearch,
  fetchProduct,
  createProduct,
  editProduct,
  deleteProduct,
  forwardToStore,
  cancelFromStore,
  cancelWriteOff,
} from '@/services/cabinet/InventoryWriteOffService'
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
    name: t('writeOff'),
  },
  {
    name: t('document'),
  },
]

const FORM_DATA = {
  id: null,
  product_id: null,
  incoming_price: null,
  incoming_price_sum: null,
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
    text: t('units'),
    value: 'unit_name',
  },
  {
    text: t('quantity'),
    value: 'count',
  },
  {
    text: t('averageIncomePrice'),
    value: 'incoming_price',
  },
  {
    text: t('actualReturnPrice'),
    value: 'incoming_price_sum',
  },
  {
    text: t('fromShowcase'),
    value: 'is_showcase',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const document = ref<Record<string, any>>({})
const id = computed(() => route.params.id || null)
const formObj = ref<any>(null)
const productRef = ref()
const isUpdate = ref(false)
const products = ref([])
const items = ref([])
const formData = ref<{
  id: null | number
  product_id: null | number
  incoming_price: null | string | number
  incoming_price_sum: null | string | number
  count: null | number
  is_showcase: null | boolean
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
    last_income_price_sum: null,
    articule: null,
    unit_name: null,
  }
})

watch(
  () => productInfo.value,
  (val: {
    id: null
    product_name: null
    barcode: null
    category_name: null
    last_income_price_sum: null
    articule: null
    unit_name: null
  }) => {
    formData.value.incoming_price = val.last_income_price_sum
    formData.value.incoming_price_sum = val.last_income_price_sum
  }
)

const useFetchWriteOff = async () => {
  try {
    if (id.value) {
      const {
        data: { data },
      } = await fetchWriteOff(+id.value)
      document.value = data
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const useForwardToStore = async () => {
  try {
    if (!id.value) return
    await forwardToStore(+id.value)
    await useFetchWriteOff()
    $successMessage(t('notifications.forwardedSuccessfully'))
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useCancelFromStore = async () => {
  try {
    if (!id.value) return
    await cancelFromStore(+id.value)
    await useFetchWriteOff()
    $successMessage(t('notifications.canceledSuccessfully'))
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useCancelWriteOff = async () => {
  try {
    if (!id.value) return
    await cancelWriteOff(+id.value)
    await useFetchWriteOff()
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
    newFormData.incoming_price = Number(newFormData.incoming_price).toFixed(1)
    newFormData.incoming_price_sum = Number(
      newFormData.incoming_price_sum
    ).toFixed(1)
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
    await useFetchWriteOff()
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
  incoming_price: string
  incoming_price_sum: string
  count: number
  is_showcase: boolean
}) => {
  useFetchProductSearch(document.value.store_id, item.product_name)
  formData.value.id = item.id
  formData.value.product_id = item.product_id
  formData.value.incoming_price = item.incoming_price
  formData.value.incoming_price_sum = item.incoming_price_sum
  formData.value.count = item.count
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

useFetchData()
</script>
