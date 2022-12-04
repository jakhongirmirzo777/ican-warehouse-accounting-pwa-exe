<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('currencies') }}
  </VText>
  <VCard>
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          :actions="{ view: false, edit: true, delete: false }"
          @edit="openDialog(item)"
          @delete="deleteItem(item.id)"
        />
      </template>
      <template #item.counterparty="{ item }">
        <span v-if="item.counterparty">{{
          item.counterparty.company_name
        }}</span>
        <span v-else>-</span>
      </template>
      <template #item.position="{ item }">
        <span v-if="item.position">{{ POSITION[item.position] }}</span>
        <span v-else>-</span>
      </template>
      <template #item.type="{ item }">
        <span v-if="item.type">{{ TYPE[item.type] }}</span>
        <span v-else>-</span>
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
  <ReferenceCurrenciesDialog
    ref="organizationDialogRef"
    @fetchData="fetchData"
  />
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import ReferenceCurrenciesDialog from '@/components/pages/reference-currencies/ReferenceCurrenciesDialog.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchCourses,
  deleteCourses,
} from '@/services/cabinet/ReferenceCurrenciesService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $isPageExists } from '@/utils/pure-functions'
import type {
  ReferencePartyCoursesDataItemType,
  ReferenceCoursesPageOptionsType,
  ReferenceCoursesFormTypes,
} from '@/types/cabinet/ReferenceCurrenciesTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref<ReferencePartyCoursesDataItemType[]>([])
const { t } = useI18n()
const organizationDialogRef = ref()
const queries = getQuery(['page', 'search'])
clearQuery(['page', 'search'])

const breadcrumbs = [
  {
    name: t('reference'),
  },
  {
    name: t('currencies'),
  },
]

const params = ref<ReferenceCoursesPageOptionsType>({
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

const POSITION = {
  buyer: t('buyer'),
  seller: t('seller'),
}
const TYPE = {
  legal: t('legal'),
}

const fetchData = async () => {
  try {
    const { data, links } = await fetchCourses(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map(
      (p: ReferencePartyCoursesDataItemType, i: number) => {
        if (links) p.index = links.from + i
        return p
      }
    )
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
    await deleteCourses(id)
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

const openDialog = (item: ReferenceCoursesFormTypes) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('name'), value: 'name' },
  { text: t('key'), value: 'key' },
  { text: t('url'), value: 'url' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
