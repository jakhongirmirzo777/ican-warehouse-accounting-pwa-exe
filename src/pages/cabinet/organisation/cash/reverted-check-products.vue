<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <div class="d-flex align-center mb-10">
    <VBackBtn class="mb-10" />
    <VText class="mb-10 ml-16" tag="h2" weight="600" color="#0E1E56">
      {{ t('products') }}
    </VText>
  </div>
  <VCard>
    <VRow>
      <VCol md="2">
        <VBtn
          width="100%"
          color="primary"
          class="mb-20"
          @click="$router.push($localePath('/cabinet/revert-check'))"
        >
          {{ $t('issueRefund') }}
        </VBtn>
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.is_bonus="{ item }">
        <VCheckbox
          class="disabled"
          v-model="item.is_bonus"
          :true-value="true"
          :false-value="false"
        />
      </template>
      <template #item.all_sold_sum="{ item }">
        {{ $moneyFormatWithComma(item.all_sold_sum) }}
      </template>
    </VTable>
  </VCard>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VCol from '@/components/ui/VCol.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VLine from '@/components/ui/VLine.vue'
import VBackBtn from '@/components/ui/VBackBtn.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCheckProducts } from '@/services/cabinet/RevertCheckServices'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useRoute } from 'vue-router'

import type { RevertedCheckDataItemType } from '@/types/cabinet/RevertCheckTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { params } = useRoute()

const items = ref<RevertedCheckDataItemType[]>([])
const { t } = useI18n()

const breadcrumbs = [
  {
    name: t('cashRegister'),
  },
  {
    name: t('revertProduct'),
  },
  {
    name: t('products'),
  },
]

const fetchData = async () => {
  const { id } = params
  if (id) {
    try {
      const { data } = await getCheckProducts(id)
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
  { text: t('qtySold'), value: 'sell_count' },
  { text: t('qtyReverted'), value: 'returned_count' },
  { text: t('salesBonus'), value: 'is_bonus' },
  { text: t('price'), value: 'sell_count' },
  { text: t('amount'), value: 'all_sold_sum' },
  { text: t('unit'), value: 'unit_name' },
])
</script>

<style scoped></style>
