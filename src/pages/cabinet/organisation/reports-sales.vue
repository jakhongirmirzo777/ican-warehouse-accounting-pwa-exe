<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('sales') }}
  </VText>
  <div v-if="$can(['reports.sale.sale.reports', 'reports.sale.individuals'])">
    <VTabs v-model="tab">
      <VTab href="consolidated">
        {{ t('consolidatedReport') }}
      </VTab>
      <VTab href="credit">
        {{ t('saleCredit') }}
      </VTab>
      <VTab href="direct">
        {{ t('directSales') }}
      </VTab>
      <VTab href="entity">
        {{ t('salesLegalEntities') }}
      </VTab>
    </VTabs>
    <VTabsItems v-model="tab">
      <VTabItem value="consolidated">
        <ConsolidatedReport
          :warehouses="warehouses"
          :organisations="organisations"
          :statusList="statusList"
        />
      </VTabItem>
      <VTabItem value="credit">
        <CreditSaleReport
          :warehouses="warehouses"
          :organisations="organisations"
          :statusList="statusList"
        />
      </VTabItem>
      <VTabItem value="direct">
        <DirectSaleReport
          :warehouses="warehouses"
          :organisations="organisations"
          :statusList="statusList"
        />
      </VTabItem>
      <VTabItem value="entity">
        <SalesLegalEntitiesReport
          :warehouses="warehouses"
          :organisations="organisations"
          :statusList="statusList"
        />
      </VTabItem>
    </VTabsItems>
  </div>
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VTabs from '@/components/ui/VTabs.vue'
import VTab from '@/components/ui/VTab.vue'
import VTabsItems from '@/components/ui/VTabsItems.vue'
import VTabItem from '@/components/ui/VTabItem.vue'
import ConsolidatedReport from '@/components/pages/report-sale/ConsolidatedReport.vue'
import CreditSaleReport from '@/components/pages/report-sale/CreditSaleReport.vue'
import DirectSaleReport from '@/components/pages/report-sale/DirectSaleReport.vue'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@/composables/router-query'
import {
  fetchOrganisations,
  fetchCategories,
  fetchWarehouses,
} from '@/services/cabinet/ReportsStockService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
const { $getQuery } = useQuery()
const { t } = useI18n()
const queries = $getQuery(['tab'])
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
import { REPORT_SALES_STATUS } from '@/utils/constants'
import SalesLegalEntitiesReport from '@/components/pages/report-sale/SalesLegalEntitiesReport.vue'

const breadcrumbs = [
  {
    name: t('reports'),
  },
  {
    name: t('sales'),
  },
]

const tab = ref(queries.tab || 'consolidated')
const warehouses = ref([])
const organisations = ref([])
const categories = ref([])

const statusList = computed(() => {
  const result = [] as Array<{
    value: string
    text: string
  }>
  Object.entries(REPORT_SALES_STATUS).forEach(([key, value]) => {
    result.push({
      value: key,
      text: t(value.text),
    })
  })
  return result
})

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
