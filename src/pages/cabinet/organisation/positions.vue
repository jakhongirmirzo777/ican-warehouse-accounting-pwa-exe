<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('positions') }}
  </VText>
  <VCard>
    <VRow>
      <VCol v-if="$can('reference.position.create')" md="1">
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
        <VInput clearable :label="t('search')" v-model="options.name" />
      </VCol>
      <VCol md="2">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="reference.position.update"
          delete="reference.position.destroy"
          @edit="editPosition(item)"
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
  <PositionsDialog
    v-model="dialog"
    :data="editValue"
    :is-update="isUpdate"
    @submit="useFetchPositions"
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
import PositionsDialog from '@/components/pages/positions/PositionsDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchPositions,
  deletePosition,
} from '@/services/cabinet/PositionsService'
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
const queries = $getQuery(['name', 'page'])
$clearQuery(['name', 'page'])

const breadcrumbs = [
  {
    name: t('workersControlling'),
  },
  {
    name: t('positions'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  name: null | string
}>({
  page: +queries.page || 1,
  name: queries.name || null,
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
  name: string | null
}>({
  id: null,
  name: null,
})

const useFetchPositions = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchPositions(options.value.page, options.value.name)
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
    await deletePosition(id)
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
    await useFetchPositions()
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
    await useFetchPositions()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editPosition = (item: { id: number; name: string }) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchPositions()
    await $addQuery({
      page: options.value.page,
      name: options.value.name,
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
    options.value.name = null
    await useFetchPositions()
    await $addQuery({
      page: options.value.page,
      name: options.value.name,
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
    await useFetchPositions()
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
