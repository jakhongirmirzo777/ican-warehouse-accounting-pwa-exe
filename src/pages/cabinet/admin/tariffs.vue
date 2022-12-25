<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('tariffs') }}
  </VText>
  <VCard>
    <div v-if="$can('admin.tariffs.create')">
      <VRow>
        <VCol md="1">
          <VBtn width="100%" color="primary" class="mb-20" @click="openDialog">
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
          update="admin.tariffs.update"
          delete="admin.tariffs.destroy"
          @edit="openDialog(item)"
          @delete="handleDelete(item.id)"
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
  <TariffsDialog ref="dialogRef" @fetchData="fetchData" />
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
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VLine from '@/components/ui/VLine.vue'
import TariffsDialog from '@/components/pages/tariffs/TariffsDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchTariffs, deleteTariff } from '@/services/cabinet/TariffsService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import type {
  TariffDataItemType,
  TariffPageOptionsType,
  TariffFormTypes,
} from '@/types/cabinet/TariffsTypes'
import { $isPageExists } from '@/utils/pure-functions'
import { useNotificationService } from '@/plugins/notification-service'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $addQuery, $getQuery, $clearQuery } = useQuery()

const items = ref<TariffDataItemType[]>([])
const { t } = useI18n()
const dialogRef = ref()
const queries = $getQuery(['page'])
$clearQuery(['page'])

const breadcrumbs = [
  {
    name: t('setting'),
  },
  {
    name: t('tariffs'),
  },
]

const params = ref<TariffPageOptionsType>({
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
    const { data, links } = await fetchTariffs(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: TariffDataItemType, i: number) => {
      if (links) p.index = links.from + i
      return p
    })
  } catch (err) {
    $setResponseErrors(err)
  }
}

const handleDelete = async (id: number) => {
  try {
    $showLoading()
    await deleteTariff(id)
    if (
      pageOptions.value &&
      pageOptions.value.total &&
      pageOptions.value.perPage &&
      $isPageExists(pageOptions.value.total, pageOptions.value.perPage)
    ) {
      params.value.page = 1
      $addQuery({
        page: 1,
      })
    }
    await fetchData()
    $successMessage(t('notifications.deletedSuccessfully'))
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  $clearLoading()
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

const openDialog = (item: TariffFormTypes) => {
  dialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('name'), value: `name` },
  { text: t('amount'), value: 'amount' },
  { text: t('maxStores'), value: 'max_stores' },
  { text: t('passivePeriod'), value: 'passive_period' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
