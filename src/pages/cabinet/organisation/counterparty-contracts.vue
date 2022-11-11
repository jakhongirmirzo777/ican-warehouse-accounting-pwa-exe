<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('agreements') }}
  </VText>
  <VCard>
    <VFilterCollapse>
      <template #top="{ toggle }">
        <VRow>
          <VCol md="1">
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
          <VCol md="3">
            <VInput :label="$t('search')" v-model="params.search" clearable />
          </VCol>
          <VCol md="3">
            <VDatepicker
              :label="$t('startDate')"
              v-model="params.start_date"
              clearable
            />
          </VCol>
          <VCol md="3">
            <VDatepicker
              :label="$t('finishDate')"
              v-model="params.finish_date"
              clearable
            />
          </VCol>
          <VCol md="2">
            <VFilterActions
              collapse
              @collapse="toggle"
              @filter="startFilter"
              @clear="clearFilter"
            />
          </VCol>
        </VRow>
      </template>
      <template #bottom>
        <VRow>
          <VCol md="3">
            <VSelect
              :items="counterpartyList"
              item-text="company_name"
              item-value="id"
              :label="$t('counterparties')"
              v-model="params.counterparty_id"
              clearable
            />
          </VCol>
          <VCol md="3">
            <VSelect
              localize
              :items="POSITIONS_INDEXED"
              item-value="value"
              item-text="text"
              :label="$t('position')"
              v-model="params.position"
              clearable
            />
          </VCol>
          <VCol md="3">
            <VSelect
              :items="typeList"
              item-value="value"
              item-text="text"
              :label="$t('type')"
              v-model="params.type"
              clearable
            />
          </VCol>
        </VRow>
      </template>
    </VFilterCollapse>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions @edit="openDialog(item)" @delete="deleteItem(item.id)" />
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
  <CounterpartyContractsDialog
    ref="organizationDialogRef"
    :counterpartyList="counterpartyList"
    @fetchData="fetchData"
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
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import CounterpartyContractsDialog from '@/components/pages/counterparty-contracts/CounterpartyContractsDialog.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchContract,
  deleteContract,
} from '@/services/cabinet/CounterpartyContractsServices'
import { getCounterpartyList } from '@/services/cabinet/CounterpartyInvoiceService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $isPageExists } from '@/utils/pure-functions'
import { POSITIONS_INDEXED } from '@/utils/constants'
import type {
  CounterpartyContractFormTypes,
  CounterpartyContractDataItemType,
  ContractPageOptionsType,
} from '@/types/cabinet/CounterpertyContractsTypes'
import type { OrganizationListType } from '@/types/cabinet/CounterpartyCounterpartiesTypes'

interface ValueType<T> {
  value: T
}

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref<CounterpartyContractDataItemType[]>([])
const { t } = useI18n()
const organizationDialogRef = ref()
const queries = getQuery([
  'page',
  'search',
  'start_date',
  'finish_date',
  'position',
  'counterparty_id',
])
clearQuery([
  'page',
  'search',
  'start_date',
  'finish_date',
  'position',
  'counterparty_id',
])

const params = ref<ContractPageOptionsType>({
  search: queries.search || '',
  page: +queries.page || 1,
  start_date: queries.start_date || '',
  finish_date: queries.finish_date || '',
  position: queries.position || '',
  counterparty_id: queries.counterparty_id || '',
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

const breadcrumbs = [
  {
    name: t('counterparties'),
  },
  {
    name: t('agreements'),
  },
]

const typeList = ref([{ value: 'legal', text: t('legal') }])

const POSITION = {
  buyer: t('buyer'),
  seller: t('seller'),
}
const TYPE = {
  legal: t('legal'),
}

const counterpartyList: ValueType<Array<OrganizationListType>> = ref([])

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
    params.value.counterparty_id = ''
    params.value.start_date = ''
    params.value.finish_date = ''
    params.value.position = ''
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
    const { data, links } = await fetchContract(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: CounterpartyContractDataItemType, i: number) => {
      if (links) p.index = links.from + i
      return p
    })
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getCounterPartyList = async () => {
  try {
    const { data } = await getCounterpartyList()
    counterpartyList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  await getCounterPartyList()
  $clearLoading()
}

const deleteItem = async (id: number) => {
  $showLoading()
  try {
    await deleteContract(id)
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

const openDialog = (item: CounterpartyContractFormTypes) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('contractNumber'), value: 'number' },
  { text: t('dateConclusion'), value: 'start_date' },
  { text: t('counterpart'), value: 'counterparty_company_name' },
  { text: t('dateCompletion'), value: 'finish_date' },
  { text: t('position'), value: 'position' },
  { text: t('amount'), value: 'amount' },
  { text: t('comment'), value: 'comment' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
