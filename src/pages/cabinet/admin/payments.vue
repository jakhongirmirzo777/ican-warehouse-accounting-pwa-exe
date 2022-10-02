<template>
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('payments') }}
  </VText>
  <VCard>
    <VRow>
      <VCol xl="1" md="3">
        <VBtn
          class="mb-20"
          color="primary"
          width="100%"
          @click="
            () => {
              id = null
              dialog = true
            }
          "
        >
          <VIcon class="mr-10" size="20" icon="circle-plus" />
          {{ t('add') }}
        </VBtn>
      </VCol>
      <VCol xl="2" md="3">
        <VDatepicker clearable :label="t('fromDate')" v-model="options.from" />
      </VCol>
      <VCol xl="2" md="3">
        <VDatepicker clearable :label="t('toDate')" v-model="options.to" />
      </VCol>
      <VCol xl="2" md="3">
        <VSelect
          localize
          clearable
          :label="t('status')"
          item-text="text"
          item-value="value"
          :items="PAYMENT_STATUSES_INDEXED"
          v-model="options.status"
        />
      </VCol>
      <VCol xl="2" md="3">
        <VSelect
          autocomplete
          clearable
          :label="t('organisation')"
          :items="organisations"
          v-model="options.organisation_id"
        />
      </VCol>
      <VCol xl="2" md="3">
        <VSelect
          localize
          clearable
          :label="t('paymentType')"
          item-text="text"
          item-value="value"
          :items="PAYMENT_TYPES_INDEXED"
          v-model="options.payment_type"
        />
      </VCol>
      <VCol xl="1" md="3">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.amount="{ item }">
        {{ $moneyFormat(item.amount) }}
      </template>
      <template #item.status="{ item }">
        <VStatus
          :color="PAYMENT_STATUSES_COLORED[item.status].color"
          :theme="PAYMENT_STATUSES_COLORED[item.status].theme"
        >
          {{ item.status_text }}
        </VStatus>
      </template>
      <template #item.actions="{ item }">
        <VBtn
          v-if="PAYMENT_STATUSES_VALUE.CANCELED !== item.status"
          @click="handleCancel(item.id)"
        >
          <div class="d-flex align-center">
            <VIcon class="mr-7" size="14" icon="minus-solid" />
            <span class="color-yellow">{{ t('cancel') }}</span>
          </div>
        </VBtn>
      </template>
    </VTable>
  </VCard>
  <PaymentsDialog
    v-model="dialog"
    :organisations="organisations"
    :id="id"
    @submit="useFetchPayments"
  />
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VStatus from '@/components/ui/VStatus.vue'
import PaymentsDialog from '@/components/pages/payments/PaymentsDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchPayments,
  fetchOrganisations,
} from '@/services/cabinet/PaymentsService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import {
  PAYMENT_STATUSES_INDEXED,
  PAYMENT_TYPES_INDEXED,
  PAYMENT_STATUSES_COLORED,
  PAYMENT_STATUSES_VALUE,
} from '@/utils/constants'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { t } = useI18n()
const queries = getQuery([
  'from',
  'to',
  'status',
  'organisation_id',
  'payment_type',
])
clearQuery(['from', 'to', 'status', 'organisation_id', 'payment_type'])

const options = ref<{
  from: null | string
  to: null | string
  status: null | number
  organisation_id: null | number
  payment_type: null | string
}>({
  from: queries.from || null,
  to: queries.to || null,
  status: +queries.status || null,
  organisation_id: +queries.organisation_id || null,
  payment_type: queries.payment_type || null,
})

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('organisation'),
    value: 'organisation',
  },
  {
    text: t('date'),
    value: 'created_at',
  },
  {
    text: t('amount'),
    value: 'amount',
  },
  {
    text: t('paymentType'),
    value: 'payment_type_text',
  },
  {
    text: t('transactionType'),
    value: 'type_text',
  },
  {
    text: t('comment'),
    value: 'comment',
  },
  {
    text: t('status'),
    value: 'status',
  },
  {
    text: t('reason'),
    value: 'reason',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const dialog = ref(false)
const id = ref<number | null>(null)
const organisations = ref([])
const items = ref([])

const handleCancel = (itemId: number) => {
  id.value = itemId
  dialog.value = true
}

const useFetchOrganisations = async () => {
  try {
    const {
      data: { data },
    } = await fetchOrganisations()
    organisations.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchPayments = async () => {
  try {
    const {
      data: { data },
    } = await fetchPayments(options.value)
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
    await useFetchOrganisations()
    await useFetchPayments()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const filterData = async () => {
  try {
    $showLoading()
    await useFetchPayments()
    await addQuery(options.value)
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
    options.value.organisation_id = null
    options.value.payment_type = null
    await useFetchPayments()
    await addQuery(options.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}
useFetchData()
</script>
