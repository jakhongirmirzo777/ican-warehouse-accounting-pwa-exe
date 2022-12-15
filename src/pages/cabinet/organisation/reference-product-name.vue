<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('productName') }}
  </VText>
  <VCard>
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
      <VCol md="3">
        <VSelect
          clearable
          autocomplete
          :label="t('parentCategory')"
          :items="categories"
          v-model="options.parent_category_id"
        />
      </VCol>
      <VCol md="3">
        <VSelect
          clearable
          autocomplete
          :disabled="!options.parent_category_id"
          :label="t('category')"
          :items="childCategories"
          v-model="options.child_category_id"
        />
      </VCol>
      <VCol md="2">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.barcode_svg="{ item }">
        <div class="d-flex justify-center">
          <VBtn
            type="button"
            min-width="40px"
            color="primary"
            :loading="barcodeLoading[item.id]"
            @click="useFetchBarcode(item.id)"
          >
            <VIcon size="20" icon="barcode" color="#fff" />
          </VBtn>
        </div>
      </template>
      <template #item.actions="{ item }">
        <VTableActions
          @edit="editProduct(item)"
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
  <ReferenceProductNameDialog
    v-model="dialog"
    :data="editValue"
    :categories="categories"
    :units="units"
    :is-update="isUpdate"
    @submit="useFetchProducts"
  />
  <ReferenceProductNamePrint id="reference-product-name-print" />
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
import ReferenceProductNamePrint from '@/components/pages/reference-product-name/ReferenceProductNamePrint.vue'
import ReferenceProductNameDialog from '@/components/pages/reference-product-name/ReferenceProductNameDialog.vue'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchBarcode,
  fetchCategories,
  fetchProducts,
  fetchUnits,
  deleteProduct,
} from '@/services/cabinet/ReferenceProductNameService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists, $printScreen } from '@/utils/pure-functions'
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { t } = useI18n()
const queries = getQuery([
  'search',
  'parent_category_id',
  'child_category_id',
  'page',
])
clearQuery(['search', 'parent_category_id', 'child_category_id', 'page'])

const breadcrumbs = [
  {
    name: t('reference'),
  },
  {
    name: t('productName'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  parent_category_id: null | number
  child_category_id: null | number
}>({
  page: +queries.page || 1,
  search: queries.search || null,
  lastPage: null,
  perPage: null,
  total: null,
  parent_category_id: +queries.parent_category_id || null,
  child_category_id: +queries.child_category_id || null,
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
    text: t('category'),
    value: 'category_name',
  },
  {
    text: t('units'),
    value: 'unit_name',
  },
  {
    text: t('articule'),
    value: 'articule',
  },
  {
    text: t('barcode'),
    value: 'barcode',
  },
  {
    text: t('barcodeGenerate'),
    value: 'barcode_svg',
    width: '170px',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const dialog = ref(false)
const isUpdate = ref(false)
const barcodeLoading = ref<boolean[]>([])
const barcodeSvg = ref('')
const categories = ref([])
const items = ref([])
const units = ref([])
const editValue = ref<{
  id: number | null
  name: string | null
  category_id: number | null
  unit_id: number | null
  articule: string | null
  barcode: string | null
}>({
  id: null,
  name: null,
  category_id: null,
  unit_id: null,
  articule: null,
  barcode: null,
})

const childCategories = computed(() => {
  const list = categories.value.find(
    (item: Record<string, number>) =>
      item.id === options.value.parent_category_id
  )
  return list
    ? (list as Record<string, Array<Record<string, string | number>>>).children
    : []
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

const handlePrint = async () => {
  try {
    if (barcodeSvg.value) {
      await $printScreen('reference-product-name-print', barcodeSvg.value)
    }
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchBarcode = async (id: number) => {
  try {
    barcodeLoading.value[id] = true
    const {
      data: { data },
    } = await fetchBarcode(id)
    barcodeSvg.value = data.svg
    barcodeLoading.value[id] = false
    await handlePrint()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    barcodeLoading.value[id] = false
  }
}

const useFetchProducts = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchProducts(
      options.value.page,
      options.value.search,
      options.value.child_category_id
        ? options.value.child_category_id
        : options.value.parent_category_id
    )
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
    await useFetchProducts()
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
    await useFetchCategories()
    await useFetchUnits()
    await useFetchProducts()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editProduct = (item: {
  id: number
  name: string
  category_id: number
  unit_id: number
  articule: string
  barcode: string
}) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchProducts()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      parent_category_id: options.value.parent_category_id,
      child_category_id: options.value.child_category_id,
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
    options.value.parent_category_id = null
    options.value.child_category_id = null
    options.value.search = null
    await useFetchProducts()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      parent_category_id: options.value.parent_category_id,
      child_category_id: options.value.child_category_id,
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
    await useFetchProducts()
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
