<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('balance') }}
  </VText>
  <VRow class="mb-16">
    <VCol md="3">
      <VCard>
        <VText class="mb-10" tag="p" size="14px">{{ t('tariff') }}:</VText>
        <VText color="#17BDC0" tag="h4" weight="600" size="16px">
          300 000 сум\мес (Hali tayyormas)
        </VText>
      </VCard>
    </VCol>
    <VCol md="3">
      <VCard>
        <VText class="mb-10" tag="p" size="14px">{{ t('paidUntil') }}:</VText>
        <VText color="#18275D" tag="h4" weight="600" size="16px">
          15 июнь 2022 года (Hali tayyormas)
        </VText>
      </VCard>
    </VCol>
  </VRow>
  <VCard>
    <VRow>
      <VCol md="1">
        <VBtn class="mb-20" color="primary" width="100%" @click="dialog = true">
          <VIcon class="mr-10" size="20" icon="wallet" />
          {{ t('makePayment') }}
        </VBtn>
      </VCol>
      <VCol md="3">
        <VDatepicker clearable :label="t('fromDate')" v-model="options.from" />
      </VCol>
      <VCol md="3">
        <VDatepicker clearable :label="t('toDate')" v-model="options.to" />
      </VCol>
      <VCol md="3">
        <VSelect
          clearable
          localize
          item-text="text"
          item-value="value"
          :label="t('status')"
          :items="PAYMENT_STATUSES_INDEXED"
          v-model="options.status"
        />
      </VCol>
      <VCol md="2">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.status="{ item }">
        <VStatus
          :color="PAYMENT_STATUSES_COLORED[item.status]?.color"
          :theme="PAYMENT_STATUSES_COLORED[item.status]?.theme"
        >
          {{ item.status_text }}
        </VStatus>
      </template>
      <template #item.amount="{ item }">
        {{ $moneyFormat(item.amount) }}
      </template>
      <template #item.before_balance="{ item }">
        {{ $moneyFormat(item.before_balance) }}
      </template>
      <template #item.after_balance="{ item }">
        {{ $moneyFormat(item.after_balance) }}
      </template>
    </VTable>
  </VCard>
  <SettingsBalanceDialog v-model="dialog" @submit="useFetchBalance" />
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VStatus from '@/components/ui/VStatus.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import SettingsBalanceDialog from '@/components/pages/settings-balance/SettingsBalanceDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchBalance } from '@/services/cabinet/SettingsBalanceService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import {
  PAYMENT_STATUSES_COLORED,
  PAYMENT_STATUSES_INDEXED,
} from '@/utils/constants'
import { useQuery } from '@/composables/router-query'
const { getQuery, addQuery, clearQuery } = useQuery()
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()
const queries = getQuery(['from', 'to', 'status'])
clearQuery(['from', 'to', 'status'])

const breadcrumbs = [
  {
    name: t('setting'),
  },
  {
    name: t('balance'),
  },
]

const options = ref<{
  from: null | string
  to: null | string
  status: null | number
}>({
  from: queries.from || null,
  to: queries.to || null,
  status: +queries.status || null,
})

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('date'),
    value: 'created_at',
  },
  {
    text: t('transactionType'),
    value: 'type_text',
  },
  {
    text: t('paymentType'),
    value: 'payment_type_text',
  },
  {
    text: t('amount'),
    value: 'amount',
  },
  {
    text: t('beforePayment'),
    value: 'before_balance',
  },
  {
    text: t('afterPayment'),
    value: 'after_balance',
  },
  {
    text: t('status'),
    value: 'status',
  },
]

const dialog = ref(false)
const items = ref([])

const useFetchBalance = async () => {
  try {
    const {
      data: { data },
    } = await fetchBalance(options.value)
    items.value = data.map((item: Record<string, any>, i: number) => {
      item.index = i + 1
      return item
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchBalance()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const filterData = async () => {
  try {
    $showLoading()
    await useFetchBalance()
    await addQuery({
      from: options.value.from,
      to: options.value.to,
      status: options.value.status,
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
    options.value.from = null
    options.value.to = null
    options.value.status = null
    await useFetchBalance()
    await addQuery({
      from: options.value.from,
      to: options.value.to,
      status: options.value.status,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()
</script>
