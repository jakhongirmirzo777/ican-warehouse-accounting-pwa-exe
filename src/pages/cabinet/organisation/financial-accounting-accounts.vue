<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('counterpartyAccounts') }}
  </VText>
  <VCard>
    <VRow>
      <VCol v-if="$can('account.create')" md="1">
        <VBtn width="100%" color="primary" class="mb-20" @click="openDialog">
          <VIcon class="mr-10" size="20" icon="circle-plus" />
          {{ $t('add') }}
        </VBtn>
      </VCol>
      <VCol md="3">
        <VSelect
          :label="$t('organisation')"
          clearable
          autocomplete
          :items="organisationList"
          item-value="id"
          multiple
          item-text="name"
          v-model="params.organisation_ids"
        />
      </VCol>
      <VCol md="1">
        <VFilterActions @filter="startFilter" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="account.update"
          delete="account.delete"
          @edit="openDialog(item)"
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
  <FinancialAccountingAccountsDialog
    ref="organizationDialogRef"
    @fetch-data="fetchData"
    :organisation-list="organisationList"
  />
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
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VLine from '@/components/ui/VLine.vue'
import FinancialAccountingAccountsDialog from '@/components/pages/financial-accounting-accounts/FinancialAccountingAccountsDialog.vue'
import VSelect from '@/components/ui/VSelect.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchSettlement,
  deleteSettlement,
} from '@/services/cabinet/FinancialAccountingAccountsService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $isPageExists, $parseQueryArray } from '@/utils/pure-functions'
import type {
  SettlementDataItemType,
  SettlementFormTypes,
  SettlementPageOptionsType,
} from '@/types/cabinet/FinancialAccountingSettlementTypes'
import { fetchOrganisationsList } from '@/services/cabinet/OrganisationsService'
import type { MkoOrganisationListType } from '@/types/cabinet/MkoOrganisationsTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { $addQuery, $getQuery, $clearQuery } = useQuery()

const items = ref<SettlementDataItemType[]>([])
const { t } = useI18n()
const organizationDialogRef = ref()
const queries = $getQuery(['page', 'organisation_ids'])
$clearQuery(['page', 'organisation_ids'])

const breadcrumbs = [
  {
    name: t('financialAccounting'),
  },
  {
    name: t('counterpartyAccounts'),
  },
]

const organisationList = ref<Array<MkoOrganisationListType>>([])

const params = ref<SettlementPageOptionsType>({
  organisation_ids:
    $parseQueryArray(queries.organisation_ids, 'number') || null,
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
    $addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const clearFilter = async () => {
  try {
    $showLoading()
    params.value.organisation_ids = []
    params.value.page = 1
    await fetchData()
    $addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const fetchData = async () => {
  try {
    const { data, links } = await fetchSettlement(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: SettlementDataItemType, i: number) => {
      if (links) p.index = links.from + i
      return p
    })
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getOrganisationList = async () => {
  try {
    const { data } = await fetchOrganisationsList()
    organisationList.value = data
  } catch (e) {
    $setResponseErrors(e)
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  await getOrganisationList()
  $clearLoading()
}

const deleteItem = async (id: number) => {
  $showLoading()
  try {
    await deleteSettlement(id)
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

const openDialog = (item: SettlementFormTypes) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('accountNumber'), value: 'account' },
  { text: t('organisation'), value: 'organisation_name' },
  { text: t('comment'), value: 'comment' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
