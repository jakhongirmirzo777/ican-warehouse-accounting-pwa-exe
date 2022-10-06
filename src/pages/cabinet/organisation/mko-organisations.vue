<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('organisations') }}
  </VText>
  <VCard>
    <VRow>
      <VCol md="3">
        <VInput clearable :label="t('search')" v-model="options.search" />
      </VCol>
      <VCol md="2">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          :actions="{ view: false, edit: true, delete: false, title: null }"
          @edit="editOrganisation(item)"
        />
      </template>
      <template #item.phones="{ item }">
        <div>
          <div v-for="(phone, i) in item.phones" :key="i">
            {{ $phoneFormat(phone) }}
          </div>
        </div>
      </template>
      <template #item.system_course="{ item }">
        <VStatus
          color="#FFFFFF"
          :theme="item.system_course ? '#17BDC0' : '#FF2090'"
        >
          {{ item.system_course ? t('available') : t('unavailable') }}
        </VStatus>
      </template>
      <template #item.change_price_type="{ item }">
        {{ t(PRICE_CHANGE[item.change_price_type]) }}
      </template>
    </VTable>
    <VPagination
      v-if="options.lastPage > 1"
      v-model="options.page"
      :pages="options.lastPage"
      :total="options.total"
      @update:modelValue="paginate"
    />
  </VCard>
  <MkoOrganisationsDialog
    v-model="dialog"
    :data="editValue"
    @submit="useFetchOrganisations"
  />
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VStatus from '@/components/ui/VStatus.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import MkoOrganisationsDialog from '@/components/pages/mko-organisations/MkoOrganisationsDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchOrganisations } from '@/services/cabinet/MkoOrganisationsService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { PRICE_CHANGE } from '@/utils/constants'
import type {
  MkoOrganisation,
  MkoOrganisationEditValues,
} from '@/types/cabinet/MkoOrganisationsTypes'
import { $parseQueryStatus } from '@/utils/pure-functions'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { t } = useI18n()
const queries = getQuery(['search', 'status', 'page'])
clearQuery(['search', 'status', 'page'])

const breadcrumbs = [
  {
    name: t('organisationsAndWarehouse'),
  },
  {
    name: t('organisations'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  status: null | number
}>({
  page: +queries.page || 1,
  status: $parseQueryStatus(queries.status),
  search: queries.search || null,
  lastPage: null,
  perPage: null,
  total: null,
})

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('companyName'),
    value: 'company_name',
  },
  {
    text: t('name'),
    value: 'name',
  },
  {
    text: t('tin'),
    value: 'inn',
  },
  {
    text: t('mfo'),
    value: 'mfo',
  },
  {
    text: t('address'),
    value: 'address',
  },
  {
    text: t('director'),
    value: 'director',
  },
  {
    text: t('phone'),
    value: 'phones',
  },
  {
    text: t('changePriceType'),
    value: 'change_price_type',
    width: '250px',
  },
  {
    text: t('systemCourse'),
    value: 'system_course',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const dialog = ref(false)
const items = ref<MkoOrganisation[]>([])
const editValue = ref<MkoOrganisationEditValues>({
  id: null,
  name: null,
  company_name: null,
  system_course: null,
  change_price_type: null,
  inn: null,
  mfo: null,
  director: null,
  address: null,
  bank: null,
  account: null,
  phones: [],
  logo_url: null,
})

const useFetchOrganisations = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchOrganisations(
      options.value.page,
      options.value.search,
      options.value.status
    )
    const { from, last_page, total, per_page } = links
    options.value.lastPage = last_page
    options.value.total = total
    options.value.perPage = per_page
    items.value = data.map((item: MkoOrganisation, i: number) => {
      item.index = from + i
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
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editOrganisation = (item: MkoOrganisationEditValues) => {
  editValue.value = item
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchOrganisations()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
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
    options.value.page = 1
    options.value.status = null
    options.value.search = null
    await useFetchOrganisations()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      status: options.value.status,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const paginate = async () => {
  try {
    $showLoading()
    await useFetchOrganisations()
    await addQuery({
      page: options.value.page,
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

useFetchData()
</script>
