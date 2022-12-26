<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('revertProduct') }}
  </VText>
  <VCard>
    <VFilterCollapse>
      <template #top="{ toggle }">
        <VRow>
          <VCol v-if="$can('cash-box.revert.sell')" md="2">
            <VBtn
              width="100%"
              color="primary"
              class="mb-20"
              @click="
                $router.push($localePath('/cabinet/cash-revert-product-item'))
              "
            >
              {{ $t('issueRefund') }}
            </VBtn>
          </VCol>
          <VCol md="4">
            <VInput :label="$t('search')" v-model="params.search" clearable />
          </VCol>
          <VCol md="3">
            <VDatepicker
              :label="$t('salesDate')"
              v-model="params.sale_date"
              clearable
            />
          </VCol>
          <VCol md="3">
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
            <VDatepicker
              :label="$t('revertDate')"
              v-model="params.reverted_date"
              clearable
            />
          </VCol>
          <VCol md="3">
            <VSelect
              :label="$t('sold')"
              :items="employeeList"
              item-text="full_name"
              item-value="user_id"
              clearable
              autocomplete
              v-model="params.seller_user_id"
            />
          </VCol>
          <VCol md="3">
            <VSelect
              :label="$t('issuedRevert')"
              :items="employeeList"
              item-text="full_name"
              item-value="user_id"
              clearable
              autocomplete
              v-model="params.reverting_user_id"
            />
          </VCol>
          <VCol md="3">
            <VSelect
              :items="organisationList"
              item-value="id"
              item-text="name"
              clearable
              autocomplete
              multiple
              :label="$t('organisation')"
              vid="organisation_id"
              v-model="params.organisation_ids"
            />
          </VCol>
        </VRow>
      </template>
    </VFilterCollapse>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.products="{ item }">
        <VBtn
          color="primary"
          @click="
            $router.push(
              $localePath(`/cabinet/cash-revert-product-reverted/${item.id}`)
            )
          "
          >{{ $t('open') }}</VBtn
        >
      </template>
      <template #item.returning_amount_sum="{ item }">
        {{ $moneyFormatWithComma(item.returning_amount_sum) }}
      </template>
      <template #item.client_type="{ item }">
        {{ $t(`${item.client_type}`) }}
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
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VRow from '@/components/ui/VRow.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchRevertedChecks } from '@/services/cabinet/CashRevertProductServices'
import { fetchOrganisationsList } from '@/services/cabinet/OrganisationsService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $parseQueryArray } from '@/utils/pure-functions'
import { fetchEmployeeList } from '@/services/cabinet/EmployeesService'

import type {
  RevertedCheckDataItemType,
  RevertedCheckOptionsType,
} from '@/types/cabinet/CashRevertProductTypes'
import type { MkoOrganisationListType } from '@/types/cabinet/OrganisationsTypes'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $addQuery, $getQuery, $clearQuery } = useQuery()

const items = ref<RevertedCheckDataItemType[]>([])
const { t } = useI18n()
const queries = $getQuery([
  'page',
  'search',
  'organisation_ids',
  'sale_date',
  'reverted_date',
  'reverting_user_id',
  'seller_user_id',
])
$clearQuery([
  'page',
  'search',
  'organisation_ids',
  'sale_date',
  'reverted_date',
  'reverting_user_id',
  'seller_user_id',
])

const params = ref<RevertedCheckOptionsType>({
  search: queries.search || '',
  page: +queries.page || 1,
  organisation_ids: $parseQueryArray(queries.organisation_ids, 'number') || [],
  sale_date: queries.sale_date || '',
  reverted_date: queries.reverted_date || '',
  reverting_user_id: +queries.reverting_user_id || '',
  seller_user_id: +queries.seller_user_id || '',
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
    name: t('cashRegister'),
  },
  {
    name: t('revertProduct'),
  },
]

const organisationList = ref<Array<MkoOrganisationListType>>([])
const employeeList = ref<
  Array<{
    id: number
    full_name: string
  }>
>([])

const startFilter = async () => {
  params.value.page = 1
  $showLoading()
  try {
    await fetchData()
    $addQuery(params.value)
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
    params.value.sale_date = ''
    params.value.reverted_date = ''
    params.value.reverting_user_id = ''
    params.value.seller_user_id = ''
    params.value.organisation_ids = []
    await fetchData()
    $addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const fetchData = async () => {
  try {
    const { data, links } = await fetchRevertedChecks(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map((p: RevertedCheckDataItemType, i: number) => {
      if (links) p.index = links.from + i
      return p
    })
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getEmployeeList = async () => {
  try {
    const {
      data: { data },
    } = await fetchEmployeeList()
    employeeList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getOrganisationsList = async () => {
  try {
    const { data } = await fetchOrganisationsList()
    organisationList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  await getOrganisationsList()
  await getEmployeeList()
  $clearLoading()
}

const changePage = async () => {
  try {
    $showLoading()
    $addQuery({ page: params.value.page })
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('checkNumber'), value: 'check_number' },
  { text: t('salesType'), value: 'client_type' },
  { text: t('sold'), value: 'seller_name' },
  { text: t('salesDate'), value: 'sale_date' },
  { text: t('revertDate'), value: 'reverted_date' },
  { text: t('issuedRevert'), value: 'reverting_user_name' },
  { text: t('organisation'), value: 'organisation_name' },
  { text: t('buyer'), value: 'buyer' },
  { text: t('revertReason'), value: 'comment' },
  { text: t('products'), value: 'products' },
  { text: t('revertAmount'), value: 'returning_amount_sum' },
])
</script>
