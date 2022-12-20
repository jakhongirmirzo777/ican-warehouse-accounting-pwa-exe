<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('reportsByStock') }}
  </VText>
  <VTabs v-model="tab">
    <VTab href="incomes">
      {{ t('incomeOfProducts') }}
    </VTab>
    <VTab href="remainders">
      {{ t('remainderOfProducts') }}
    </VTab>
    <!--    <VTab href="consolidations">-->
    <!--      {{ t('consolidatedReport') }}-->
    <!--    </VTab>-->
    <VTab href="registers">
      {{ t('registerOfIncomes') }}
    </VTab>
  </VTabs>
  <VTabsItems v-model="tab">
    <VTabItem value="incomes">
      <ReportsStockIncomes
        :warehouses="warehouses"
        :organisations="organisations"
        :categories="categories"
      />
    </VTabItem>
    <VTabItem value="remainders">
      <ReportsStockRemainders
        :warehouses="warehouses"
        :organisations="organisations"
        :categories="categories"
      />
    </VTabItem>
    <!--    <VTabItem value="consolidations">-->
    <!--      <ReportsStockConsolidations />-->
    <!--    </VTabItem>-->
    <VTabItem value="registers">
      <ReportsStockRegisters :organisations="organisations" />
    </VTabItem>
  </VTabsItems>
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VTabs from '@/components/ui/VTabs.vue'
import VTab from '@/components/ui/VTab.vue'
import VTabsItems from '@/components/ui/VTabsItems.vue'
import VTabItem from '@/components/ui/VTabItem.vue'
import ReportsStockIncomes from '@/components/pages/reports-stock/ReportsStockIncomes.vue'
import ReportsStockRemainders from '@/components/pages/reports-stock/ReportsStockRemainders.vue'
import ReportsStockRegisters from '@/components/pages/reports-stock/ReportsStockRegisters.vue'
// import ReportsStockConsolidations from '@/components/pages/reports-stock/ReportsStockConsolidations.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@/composables/router-query'
import {
  fetchOrganisations,
  fetchCategories,
  fetchWarehouses,
} from '@/services/cabinet/ReportsStockService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
const { getQuery } = useQuery()
const { t } = useI18n()
const queries = getQuery(['tab'])
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()

const breadcrumbs = [
  {
    name: t('reports'),
  },
  {
    name: t('reportsByStock'),
  },
]

const tab = ref(queries.tab || 'incomes')
const warehouses = ref([])
const organisations = ref([])
const categories = ref([])

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

const useFetchWarehouses = async () => {
  try {
    const {
      data: { data },
    } = await fetchWarehouses()
    warehouses.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchCategories = async () => {
  try {
    const {
      data: { data },
    } = await fetchCategories()
    categories.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchCategories()
    await useFetchOrganisations()
    await useFetchWarehouses()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()
</script>
