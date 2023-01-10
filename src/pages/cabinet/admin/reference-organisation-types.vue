<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('organisationType') }}
  </VText>
  <VCard>
    <VRow>
      <VCol v-if="$can('admin.type.create')" xl="2" md="3">
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
      <VCol xl="3" md="3">
        <VInput clearable :label="t('search')" v-model="options.search" />
      </VCol>
      <VCol xl="1" md="3">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="admin.type.update"
          delete="admin.type.destroy"
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
    :is-update="isUpdate"
    @submit="useFetchOrganisationTypes"
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
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import ReferenceProductNameDialog from '@/components/pages/reference-product-name/ReferenceProductNameDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchOrganisationTypes,
  deleteOrganisationType,
} from '@/services/cabinet/ReferenceOrganisationTypesService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists } from '@/utils/pure-functions'
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $getQuery, $addQuery, $clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { t } = useI18n()
const queries = $getQuery(['search', 'page'])
$clearQuery(['search', 'page'])

const breadcrumbs = [
  {
    name: t('reference'),
  },
  {
    name: t('organisationType'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
}>({
  page: +queries.page || 1,
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
    text: t('name_ru'),
    value: 'name_ru',
  },
  {
    text: t('name_uz'),
    value: 'name_uz',
  },
  {
    text: t('name_oz'),
    value: 'name_oz',
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
const editValue = ref<{
  id: number | null
  name_ru: string | null
  name_uz: string | null
  name_oz: string | null
}>({
  id: null,
  name_ru: null,
  name_uz: null,
  name_oz: null,
})

const useFetchOrganisationTypes = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchOrganisationTypes(options.value)
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
    await deleteOrganisationType(id)
    if (
      options.value &&
      options.value.total &&
      options.value.perPage &&
      $isPageExists(options.value.total, options.value.perPage)
    ) {
      options.value.page = 1
      $addQuery({
        page: 1,
      })
    }
    await useFetchOrganisationTypes()
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
    await useFetchOrganisationTypes()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editProduct = (item: {
  id: number
  name_ru: string
  name_uz: string
  name_oz: string
}) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchOrganisationTypes()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
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
    await useFetchOrganisationTypes()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
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
    await useFetchOrganisationTypes()
    await $addQuery({
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
