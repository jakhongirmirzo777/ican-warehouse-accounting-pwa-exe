<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('warehouses') }}
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
          multiple
          clearable
          autocomplete
          :label="t('organisation')"
          :items="organisations"
          v-model="options.organisation_ids"
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
          @edit="editWarehouse(item)"
          @delete="handleDelete(item.id)"
        />
      </template>
      <template #item.phone="{ item }">
        {{ $phoneFormat(item.phone) }}
      </template>
      <template #item.sale_available="{ item }">
        {{ item.sale_available ? t('yes') : t('no') }}
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
  <WarehousesDialog
    v-model="dialog"
    :data="editValue"
    :is-update="isUpdate"
    @submit="useFetchWarehouses"
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
import WarehousesDialog from '@/components/pages/warehouses/WarehousesDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchWarehouses,
  fetchOrganisations,
  deleteWarehouse,
} from '@/services/cabinet/WarehousesService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists, $parseQueryArray } from '@/utils/pure-functions'
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { t } = useI18n()
const queries = getQuery(['search', 'organisation_ids', 'page'])
clearQuery(['search', 'organisation_ids', 'page'])

const breadcrumbs = [
  {
    name: t('organisationsAndWarehouse'),
  },
  {
    name: t('warehouses'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  organisation_ids: null | number[]
}>({
  page: +queries.page || 1,
  organisation_ids: $parseQueryArray(queries.organisation_ids) as number[],
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

const dialog = ref(false)
const isUpdate = ref(false)
const organisations = ref([])
const items = ref([])
const editValue = ref<{
  id: number | null
  name: string | null
  organisation_id: number | null
  address: string | null
  director: string | null
  phone: string | null
}>({
  id: null,
  name: null,
  organisation_id: null,
  address: null,
  director: null,
  phone: null,
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
      data: { data, links },
    } = await fetchWarehouses(
      options.value.page,
      options.value.search,
      options.value.organisation_ids
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
    await deleteWarehouse(id)
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
    await useFetchWarehouses()
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
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editWarehouse = (item: {
  id: number
  name: string
  organisation_id: number
  address: string
  director: string
  phone: string
}) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchWarehouses()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_ids: options.value.organisation_ids,
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
    options.value.organisation_ids = null
    options.value.search = null
    await useFetchWarehouses()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      organisation_ids: options.value.organisation_ids,
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
    await useFetchWarehouses()
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
