<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('categoryProducts') }}
  </VText>
  <VCard>
    <VRow>
      <VCol v-if="$can('organisation.categories.create')" md="1">
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
          :items="parents"
          v-model="options.parent_id"
        />
      </VCol>
      <VCol md="2">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="organisation.categories.update"
          delete="organisation.categories.delete"
          @edit="editCategory(item)"
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
  <ReferenceCategoryProductsDialog
    v-model="dialog"
    :data="editValue"
    :parents="parents"
    :is-update="isUpdate"
    @submit="getData"
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
import ReferenceCategoryProductsDialog from '@/components/pages/reference-category-products/ReferenceCategoryProductsDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchCategories,
  fetchParents,
  deleteCategory,
} from '@/services/cabinet/ReferenceCategoryProductsService'
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
const queries = getQuery(['search', 'parent_id', 'page'])
clearQuery(['search', 'parent_id', 'page'])

const breadcrumbs = [
  {
    name: t('reference'),
  },
  {
    name: t('categoryProducts'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  parent_id: null | number
}>({
  page: +queries.page || 1,
  parent_id: +queries.parent_id || null,
  search: queries.search || null,
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
    text: t('parentCategory'),
    value: 'parents_name',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const dialog = ref(false)
const isUpdate = ref(false)
const parents = ref([])
const items = ref([])
const editValue = ref<{
  id: number | null
  name: string | null
  parent_id: number | null
}>({
  id: null,
  name: null,
  parent_id: null,
})

const getData = () => {
  useFetchCategories()
  useFetchParents()
}

const useFetchParents = async () => {
  try {
    const {
      data: { data },
    } = await fetchParents()
    parents.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchCategories = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchCategories(
      options.value.page,
      options.value.search,
      options.value.parent_id
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
    await deleteCategory(id)
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
    await useFetchCategories()
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
    await useFetchParents()
    await useFetchCategories()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editCategory = (item: {
  id: number
  name: string
  parent_id: number
}) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchCategories()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      parent_id: options.value.parent_id,
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
    options.value.parent_id = null
    options.value.search = null
    await useFetchCategories()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      parent_id: options.value.parent_id,
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
    await useFetchCategories()
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
