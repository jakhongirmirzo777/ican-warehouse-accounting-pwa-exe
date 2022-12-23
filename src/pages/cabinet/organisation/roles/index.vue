<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('roles') }}
  </VText>
  <VCard>
    <VRow>
      <VCol v-if="$can('organisation.roles.create')" md="1">
        <VBtn
          width="100%"
          color="primary"
          class="mb-20"
          to="/cabinet/roles-item"
        >
          <VIcon class="mr-10" size="20" icon="circle-plus" />
          {{ $t('add') }}
        </VBtn>
      </VCol>
      <VCol md="4">
        <VInput :label="$t('search')" v-model="params.search" clearable />
      </VCol>
      <VCol md="1">
        <VFilterActions @filter="startFilter" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="organisation.roles.update"
          delete="organisation.roles.delete"
          @edit="$router.push($localePath(`/cabinet/roles-item/${item.id}`))"
          @delete="deleteItem(item.id)"
        />
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
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VRow from '@/components/ui/VRow.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VLine from '@/components/ui/VLine.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchOrganisationsRoles,
  deleteOrganisationsRoles,
} from '@/services/cabinet/RolesService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $isPageExists } from '@/utils/pure-functions'
import type {
  RolesDataItemType,
  RolesPageOptionsType,
} from '@/types/cabinet/RolesTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref<RolesDataItemType[]>([])
const { t } = useI18n()
const queries = getQuery(['page', 'search'])
clearQuery(['page', 'search'])

const breadcrumbs = [
  {
    name: t('workersControlling'),
  },
  {
    name: t('roles'),
  },
]

const params = ref<RolesPageOptionsType>({
  search: queries.search || '',
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

const startFilter = async () => {
  params.value.page = 1
  $showLoading()
  try {
    await fetchData()
    addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const clearFilter = async () => {
  try {
    $showLoading()
    params.value.search = ''
    params.value.page = 1
    await fetchData()
    addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const fetchData = async () => {
  try {
    const { data, links } = await fetchOrganisationsRoles(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: RolesDataItemType, i: number) => {
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
    await deleteOrganisationsRoles(id)
    if (
      pageOptions.value &&
      $isPageExists(pageOptions.value.total, pageOptions.value.perPage)
    ) {
      params.value.page = 1
      addQuery({
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

const changePage = async () => {
  try {
    $showLoading()
    addQuery({ page: params.value.page })
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('name'), value: 'name' },
  { text: t('description'), value: 'description' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
