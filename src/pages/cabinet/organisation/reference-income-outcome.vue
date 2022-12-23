<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('incomeAndOutcome') }}
  </VText>
  <VTabs v-model="tab" @update:modelValue="handleChangeTab">
    <VTab v-if="$can('reference.income.index')" href="income">
      {{ t('income') }}
    </VTab>
    <VTab v-if="$can('reference.expenses.index')" href="outcome">
      {{ t('outcome') }}
    </VTab>
  </VTabs>
  <VTabsItems v-model="tab">
    <div
      v-if="
        tab === 'income'
          ? $can('reference.income.create')
          : tab === 'outcome'
          ? $can('reference.expenses.create')
          : false
      "
    >
      <VRow class="mb-24">
        <VCol md="1">
          <VBtn
            color="primary"
            width="100%"
            @click="
              () => {
                isUpdate = false
                openDialog()
              }
            "
          >
            <VIcon class="mr-10" size="20" icon="circle-plus" />
            {{ t('add') }}
          </VBtn>
        </VCol>
      </VRow>
      <VLine class="mb-20" />
    </div>
    <VTabItem value="income">
      <VTable :headers="headers" :items="incomesList">
        <template #item.actions="{ item }">
          <VTableActions
            update="reference.income.update"
            delete="reference.income.destroy"
            @edit="editData(item)"
            @delete="handleDelete(item.id)"
          />
        </template>
      </VTable>
      <VPagination
        v-if="optionsIncome.lastPage > 1"
        v-model="optionsIncome.page"
        :pages="optionsIncome.lastPage"
        :total="optionsIncome.total"
        @update:modelValue="paginate"
      />
    </VTabItem>
    <VTabItem value="outcome">
      <VTable :headers="headers" :items="outcomesList">
        <template #item.actions="{ item }">
          <VTableActions
            update="reference.expenses.update"
            delete="reference.expenses.destroy"
            @edit="editData(item)"
            @delete="handleDelete(item.id)"
          />
        </template>
      </VTable>
      <VPagination
        v-if="optionsOutcome.lastPage > 1"
        v-model="optionsOutcome.page"
        :pages="optionsOutcome.lastPage"
        :total="optionsOutcome.total"
        @update:modelValue="paginate"
      />
    </VTabItem>
  </VTabsItems>
  <ReferenceIncomeDialog
    v-model="incomeDialog"
    :data="editValue"
    :is-update="isUpdate"
    @submit="useFetchIncome"
  />
  <ReferenceOutcomeDialog
    v-model="outcomeDialog"
    :data="editValue"
    :is-update="isUpdate"
    @submit="useFetchOutcome"
  />
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VTabs from '@/components/ui/VTabs.vue'
import VTab from '@/components/ui/VTab.vue'
import VTabsItems from '@/components/ui/VTabsItems.vue'
import VTabItem from '@/components/ui/VTabItem.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VCol from '@/components/ui/VCol.vue'
import VRow from '@/components/ui/VRow.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import ReferenceIncomeDialog from '@/components/pages/reference-income-outcome/ReferenceIncomeDialog.vue'
import ReferenceOutcomeDialog from '@/components/pages/reference-income-outcome/ReferenceOutcomeDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@/composables/router-query'
import { useErrorActions } from '@/composables/set-errors'
import {
  fetchIncome,
  fetchOutcome,
  deleteIncome,
  deleteOutcome,
} from '@/services/cabinet/ReferenceIncomeOutcomeService'
import { useLoadingService } from '@/plugins/loading-service'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists } from '@/utils/pure-functions'
const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { getQuery, addQuery, clearQuery } = useQuery()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()

clearQuery(['tab', 'page'])
const queries = getQuery(['tab', 'page'])
const tab = ref(queries.tab || 'income')
const incomeDialog = ref(false)
const outcomeDialog = ref(false)
const isUpdate = ref(false)
const editValue = ref<{ id: number | null; name: string | null }>({
  id: null,
  name: null,
})

const breadcrumbs = [
  {
    name: t('reference'),
  },
  {
    name: t('incomeAndOutcome'),
  },
]

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

const incomesList = ref([])
const outcomesList = ref([])
const optionsIncome = ref<{
  page: number
  lastPage: null | number
  total: null | number
  perPage: null | number
}>({
  page: +queries.page || 1,
  lastPage: null,
  total: null,
  perPage: null,
})
const optionsOutcome = ref<{
  page: number
  lastPage: null | number
  total: null | number
  perPage: null | number
}>({
  page: +queries.page || 1,
  lastPage: null,
  total: null,
  perPage: null,
})

const openDialog = () => {
  if (tab.value === 'income') incomeDialog.value = true
  else outcomeDialog.value = true
}

const editData = (item: { id: number; name: string }) => {
  editValue.value = item
  isUpdate.value = true
  openDialog()
}

const useFetchIncome = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchIncome(optionsIncome.value.page)
    const { from, last_page, total, per_page } = links
    optionsIncome.value.lastPage = last_page
    optionsIncome.value.total = total
    optionsIncome.value.perPage = per_page
    incomesList.value = data.map((item: Record<string, any>, i: number) => {
      item.index = from + i
      return item
    })
    return Promise.resolve(true)
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchOutcome = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchOutcome(optionsOutcome.value.page)
    const { from, last_page, total, per_page } = links
    optionsOutcome.value.lastPage = last_page
    optionsOutcome.value.total = total
    optionsOutcome.value.perPage = per_page
    outcomesList.value = data.map((item: Record<string, any>, i: number) => {
      item.index = from + i
      return item
    })
    return Promise.resolve(true)
  } catch (err) {
    return Promise.reject(err)
  }
}

const paginate = async () => {
  try {
    $showLoading()
    if (tab.value === 'income') {
      await useFetchIncome()
      await addQuery({ page: optionsIncome.value.page })
    } else {
      await useFetchOutcome()
      await addQuery({ page: optionsOutcome.value.page })
    }
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const handleChangeTab = (val: string) => {
  addQuery({ tab: val, page: 1 })
  if (tab.value === 'income') optionsIncome.value.page = 1
  else optionsOutcome.value.page = 1
  paginate()
}

const handleDelete = async (id: number) => {
  try {
    $showLoading()
    if (tab.value === 'income') {
      await deleteIncome(id)
      if (
        optionsIncome.value &&
        optionsIncome.value.total &&
        optionsIncome.value.perPage &&
        $isPageExists(optionsIncome.value.total, optionsIncome.value.perPage)
      ) {
        optionsIncome.value.page = 1
        addQuery({
          page: 1,
        })
      }
      await useFetchIncome()
      addQuery({ page: optionsIncome.value.page })
    } else {
      await deleteOutcome(id)
      if (
        optionsOutcome.value &&
        optionsOutcome.value.total &&
        optionsOutcome.value.perPage &&
        $isPageExists(optionsOutcome.value.total, optionsOutcome.value.perPage)
      ) {
        optionsOutcome.value.page = 1
        addQuery({
          page: 1,
        })
      }
      await useFetchOutcome()
    }
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
    if (tab.value === 'income') await useFetchIncome()
    else await useFetchOutcome()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()
</script>
