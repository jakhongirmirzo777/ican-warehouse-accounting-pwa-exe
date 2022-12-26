<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <div class="d-flex align-center mb-10">
    <VBackBtn class="mb-10" />
    <VText class="mb-10 ml-16" tag="h2" weight="600" color="#0E1E56">
      {{ t(title) }}
    </VText>
  </div>
  <VCard>
    <VTable :headers="headers" :items="items">
      <template #item.is_bonus="{ item }">
        <VCheckbox
          class="disabled"
          v-model="item.is_bonus"
          :true-value="true"
          :false-value="false"
        />
      </template>
      <template #item.amount="{ item }">
        {{ $moneyFormat(item.sold_sum * item.count) }}
      </template>
      <template #item.sold_sum="{ item }">
        {{ $moneyFormat(item.sold_sum) }}
      </template>
    </VTable>
  </VCard>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VBackBtn from '@/components/ui/VBackBtn.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getReportProducts } from '@/services/cabinet/ReportSaleServices'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useRoute } from 'vue-router'

import type { RevertedCheckDataItemType } from '@/types/cabinet/RevertCheckTypes'
import { useQuery } from '@/composables/router-query'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { params } = useRoute()
const { $getQuery } = useQuery()

const query = $getQuery(['type', 'title'])

const items = ref<RevertedCheckDataItemType[]>([])
const { t } = useI18n()

const title = ref(query.title || 'products')

const breadcrumbs = [
  {
    name: t('reports'),
  },
  {
    name: t('salesReport'),
  },
  {
    name: t(query.type),
  },
  {
    name: t('products'),
  },
]

const fetchData = async () => {
  const { id } = params
  if (id) {
    try {
      const { data } = await getReportProducts(id)
      items.value = data.map((p: RevertedCheckDataItemType, i: number) => {
        p.index = i + 1
        return p
      })
    } catch (err) {
      $setResponseErrors(err)
    }
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  $clearLoading()
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('product'), value: 'product_name' },
  { text: t('category'), value: 'category_name' },
  { text: t('articule'), value: 'articule' },
  { text: t('barcode'), value: 'barcode' },
  { text: t('count'), value: 'count' },
  { text: t('salesBonus'), value: 'is_bonus' },
  { text: t('price'), value: 'sold_sum' },
  { text: t('amount'), value: 'amount' },
  { text: t('unit'), value: 'unit' },
])
</script>

<style scoped></style>
