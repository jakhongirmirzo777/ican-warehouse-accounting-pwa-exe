<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('organisations') }}
  </VText>
  <VCard>
    <VRow>
      <VCol md="1">
        <VBtn class="mb-20" color="primary" width="100%" @click="openDialog">
          <VIcon class="mr-10" size="20" icon="circle-plus" />
          {{ $t('add') }}
        </VBtn>
      </VCol>
      <VCol md="4" class="d-flex">
        <VInput :label="$t('search')" v-model="params.search" clearable />
      </VCol>
      <VCol md="2">
        <VFilterActions @filter="startFilter" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template v-slot:[`item.phones`]="{ item }">
        <div v-if="item.phones && item.phones.length">
          <div v-for="(phone, i) in item.phones" :key="`phone-${i}`">
            <span>{{ $phoneFormat(phone) }}</span>
          </div>
        </div>
        <div v-else>-</div>
      </template>
      <template v-slot:[`item.counterparty_accounts`]="{ item }">
        <div
          v-if="item.counterparty_accounts && item.counterparty_accounts.length"
        >
          <div
            v-for="(counterparty_account, i) in item.counterparty_accounts"
            :key="`counterparty_accounts-${i}`"
          >
            <span>{{ counterparty_account.account }}</span>
            <span v-if="item.counterparty_accounts.length - 1 !== i">,</span>
          </div>
        </div>
        <template v-else> - </template>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <VTableActions @edit="openDialog(item)" @delete="deleteItem(item.id)" />
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
  <CounterpartyOrganisationsDialog
    @fetchData="fetchData"
    ref="organizationDialogRef"
  />
</template>

<style scoped></style>
<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VInput from '@/components/ui/VInput.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import CounterpartyOrganisationsDialog from '@/components/pages/counterparty-organisations/CounterpartyOrganisationsDialog.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VLine from '@/components/ui/VLine.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchOrganisations,
  deleteOrganisations,
} from '@/services/cabinet/CounterpartyOrganisationsService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import type { OrganizationsCounterpartyTypesFetch } from '@/types/cabinet/CounterpartyOrganisationsTypes'
import { $isPageExists } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref<OrganizationsCounterpartyTypesFetch[]>([])
const { t } = useI18n()
const organizationDialogRef = ref()
const queries = getQuery(['page', 'search'])
clearQuery(['page', 'search'])

const breadcrumbs = [
  {
    name: t('counterparties'),
  },
  {
    name: t('organisations'),
  },
]

const params = ref<{
  search: string
  page: number
}>({ search: queries.search || '', page: +queries.page || 1 })
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
    const { data, links } = await fetchOrganisations(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map(
      (p: OrganizationsCounterpartyTypesFetch, i: number) => {
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
    await deleteOrganisations(id)
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

const openDialog = (item: OrganizationsCounterpartyTypesFetch) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('name'), value: 'company_name' },
  { text: t('tin'), value: 'tin' },
  { text: t('mail'), value: 'address' },
  { text: t('phone'), value: 'phones' },
  { text: t('address'), value: 'address' },
  { text: t('director'), value: 'director' },
  { text: t('counterpartyAccounts'), value: 'counterparty_accounts' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>
