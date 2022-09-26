<template>
  <div>
    <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
      {{ t('invoices') }}
    </VText>
    <VCard>
      <VRow>
        <VCol md="11" dense>
          <VRow>
            <VCol md="1">
              <VBtn color="primary" class="" @click="openDialog">
                <VIcon class="mr-14" size="20" icon="circle-plus" />
                {{ $t('add') }}
              </VBtn>
            </VCol>
            <VCol md="2">
              <VInput :label="$t('search')" v-model="params.search" clearable />
            </VCol>
            <VCol md="2">
              <VDatepicker
                :label="$t('date')"
                v-model="params.date"
                clearable
              />
            </VCol>
            <VCol md="2">
              <VSelect
                :items="counterpartyList"
                item-text="company_name"
                item-value="id"
                :label="$t('counterparties')"
                v-model="params.counterparty_id"
                clearable
              />
            </VCol>
            <VCol md="2">
              <VSelect
                :items="positionList"
                item-value="value"
                item-text="text"
                :label="$t('position')"
                v-model="params.position"
                clearable
              />
            </VCol>
            <VCol md="2">
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
        </VCol>
        <VCol md="1">
          <VFilterActions @filter="startFilter" @clear="clearFilter" />
        </VCol>
      </VRow>
      <VTable :headers="headers" :items="items">
        <template #item.actions="{ item }">
          <VTableActions
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
    <CounterpartyInvoiceDialog
      ref="organizationDialogRef"
      :positionList="positionList"
      :counterpartyList="counterpartyList"
      @fetchData="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import CounterpartyInvoiceDialog from '@/components/pages/counterparty-invoice/CounterpartyInvoiceDialog.vue'
import VRow from '@/components/ui/VRow.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchInvoice,
  deleteInvoice,
  getCounterpartyList,
} from '@/services/cabinet/CounterpartyInvoiceService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $isPageExists } from '@/utils/pure-functions'
import type {
  CounterPartyDataItemType,
  CounterpartyInvoiceFormTypes,
  InvoicePageOptionsType,
} from '@/types/cabinet/CounterpartyInvoiceTypes'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VSelect from '@/components/ui/VSelect.vue'
import type { OrganizationListType } from '@/types/cabinet/CounterpartyOrganisationsTypes'

interface ValueType<T> {
  value: T
}

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref<CounterPartyDataItemType[]>([])
const { t } = useI18n()
const organizationDialogRef = ref()
const queries = getQuery([
  'page',
  'search',
  'counterparty_id',
  'date',
  'position',
  'type',
])
clearQuery(['page', 'search', 'counterparty_id', 'date', 'position', 'type'])

const params = ref<InvoicePageOptionsType>({
  search: queries.search || '',
  page: +queries.page || 1,
  counterparty_id: queries.counterparty_id || '',
  date: queries.date || '',
  position: queries.position || '',
  type: queries.type || '',
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

const positionList = ref([
  { value: 'buyer', text: t('buyer') },
  { value: 'seller', text: t('seller') },
])

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
    params.value.type = ''
    params.value.date = ''
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
    const { data, links } = await fetchInvoice(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: CounterPartyDataItemType, i: number) => {
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
    await deleteInvoice(id)
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

const openDialog = (item: CounterpartyInvoiceFormTypes) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('numberInvoice'), value: 'number' },
  { text: t('date'), value: 'date' },
  { text: t('amount'), value: 'amount' },
  { text: t('counterpart'), value: 'counterparty' },
  { text: t('position'), value: 'position' },
  { text: t('type'), value: 'type' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
