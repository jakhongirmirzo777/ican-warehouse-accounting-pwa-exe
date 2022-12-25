<template>
  <div>
    <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
      {{ t('placeList') }}
    </VText>
    <VCard>
      <div v-if="$can('admin.locations.create')">
        <VRow>
          <VCol md="2">
            <VBtn
              width="100%"
              color="primary"
              class="mb-20"
              @click="openDialog"
            >
              <VIcon class="mr-10" size="20" icon="circle-plus" />
              {{ $t('add') }}
            </VBtn>
          </VCol>
        </VRow>
        <VLine class="mb-20" />
      </div>
      <VTable :headers="headers" :items="items">
        <template #item.actions="{ item }">
          <VTableActions
            update="admin.locations.update"
            delete="admin.locations.delete"
            @edit="openDialog(item)"
            @delete="deleteItem(item.id)"
          />
        </template>
        <template #item.status="{ item }">
          <div class="d-flex align-center">
            <VBtn :color="LOCATIONS_STATUSES[item.status].color" text>
              {{ $t(LOCATIONS_STATUSES[item.status].title) }}
            </VBtn>
            <ElPopconfirm
              v-if="$can('admin.locations.update')"
              hide-icon
              :title="$t(LOCATIONS_STATUSES[item.status].confirmTitle)"
              cancel-button-type="primary"
              confirm-button-type="danger"
              :confirm-button-text="t('yes')"
              :cancel-button-text="t('no')"
              @confirm="changeStatus(item.id)"
            >
              <template #reference>
                <VBtn class="ml-2" small text>
                  <VIcon size="16" icon="pencil" />
                </VBtn>
              </template>
            </ElPopconfirm>
          </div>
        </template>
      </VTable>
      <VPagination
        v-if="pageOptions.lastPage > 1"
        v-model="params.page"
        :pages="pageOptions.lastPage"
        :total="pageOptions.total"
        @update:modelValue="changePage"
      />
    </VCard>
    <LocationsDialog ref="organizationDialogRef" @fetchData="fetchData" />
  </div>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import LocationsDialog from '@/components/pages/locations/LocationsDialog.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VCol from '@/components/ui/VCol.vue'
import VRow from '@/components/ui/VRow.vue'
import VLine from '@/components/ui/VLine.vue'

import { ElPopconfirm } from 'element-plus'
import { LOCATIONS_STATUSES } from '@/utils/constants'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchLocations,
  deleteLocations,
  changeLocationsStatus,
} from '@/services/cabinet/LocationsService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $isPageExists } from '@/utils/pure-functions'
import type {
  ReferenceLocationsDataItemType,
  ReferenceLocationsFormTypes,
  LocationsPageOptionsType,
} from '@/types/cabinet/LocationsTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { $addQuery, $getQuery, $clearQuery } = useQuery()

const items = ref<ReferenceLocationsDataItemType[]>([])
const { t, locale } = useI18n()
const organizationDialogRef = ref()
const queries = $getQuery(['page'])
$clearQuery(['page'])

const params = ref<LocationsPageOptionsType>({
  page: +queries.page || 1,
})
const pageOptions = ref<{
  lastPage: number
  total: number
  perPage: number
}>({
  lastPage: 0,
  total: 0,
  perPage: 0,
})

const fetchData = async () => {
  try {
    const { data, links } = await fetchLocations(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: ReferenceLocationsDataItemType, i: number) => {
      if (links) p.index = links.from + i
      return p
    })
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  $clearLoading()
}

const deleteItem = async (id: number) => {
  $showLoading()
  try {
    await deleteLocations(id)
    if (
      pageOptions.value &&
      $isPageExists(pageOptions.value.total, pageOptions.value.perPage)
    ) {
      params.value.page = 1
      $addQuery({
        page: 1,
      })
    }
    $successMessage(t('notifications.deletedSuccessfully'))
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const changeStatus = async (id: number) => {
  $showLoading()
  try {
    await changeLocationsStatus(id)
    $successMessage(t('notifications.deletedSuccessfully'))
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const changePage = async () => {
  try {
    $showLoading()
    $addQuery({ page: params.value.page })
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const openDialog = (item: ReferenceLocationsFormTypes) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('name'), value: `name_${locale.value}` },
  { text: t('status'), value: 'status' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
