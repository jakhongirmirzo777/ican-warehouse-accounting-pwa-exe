<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('organisations') }}
  </VText>
  <VCard>
    <VFilterCollapse>
      <template #top="{ toggle }">
        <VRow>
          <VCol v-if="$can('admin.organisation.create')" md="2">
            <VBtn
              class="mb-20"
              color="primary"
              width="100%"
              @click="
                () => {
                  editValue.id = null
                  dialog = true
                }
              "
            >
              <VIcon class="mr-10" size="20" icon="circle-plus" />
              {{ t('add') }}
            </VBtn>
          </VCol>
          <VCol md="4">
            <VInput clearable :label="t('search')" v-model="options.search" />
          </VCol>
          <VCol md="3">
            <VSelect
              localize
              clearable
              :label="t('status')"
              :items="MKO_STATUSES_INDEXED"
              v-model="options.status"
              item-text="text"
              item-value="value"
            />
          </VCol>
          <VCol md="3">
            <VFilterActions
              collapse
              @collapse="toggle"
              @filter="filterData"
              @clear="clearFilter"
            />
          </VCol>
        </VRow>
      </template>
      <template #bottom>
        <VRow>
          <VCol md="4">
            <VInput
              only="number"
              clearable
              :label="t('tin')"
              v-model="options.inn"
            />
          </VCol>
          <VCol md="4">
            <VInput clearable :label="t('name')" v-model="options.name" />
          </VCol>
          <VCol md="4">
            <VInput
              clearable
              :label="t('companyName')"
              v-model="options.company_name"
            />
          </VCol>
        </VRow>
      </template>
    </VFilterCollapse>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="admin.organisation.update"
          delete="admin.organisation.delete"
          @edit="editOrganisation(item.id)"
          @delete="handleDelete(item.id)"
        />
      </template>
      <template #item.phones="{ item }">
        <div>
          <div v-for="(phone, i) in item.phones" :key="`phone-${i}`">
            {{ $phoneFormat(phone) }}
          </div>
        </div>
      </template>
      <template #item.status="{ item }">
        <div class="d-flex align-center">
          <VStatus
            min-width="100px"
            :color="MKO_STATUSES_COLORED[item.status].color"
            :theme="MKO_STATUSES_COLORED[item.status].theme"
          >
            {{ t(MKO_STATUSES[item.status]) }}
          </VStatus>
          <ElPopconfirm
            v-if="$can('admin.organisation.change.status')"
            hide-icon
            :title="t('changeStatus')"
            cancel-button-type="primary"
            confirm-button-type="danger"
            :confirm-button-text="t('yes')"
            :cancel-button-text="t('no')"
            @confirm="useChangeStatus(item.id)"
          >
            <template #reference>
              <VBtn class="ml-2" small text>
                <VIcon size="16" icon="pencil" />
              </VBtn>
            </template>
          </ElPopconfirm>
        </div>
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
  <OrganisationsAdminDialog
    v-model="dialog"
    :id="editValue.id"
    @submit="
      () => {
        editValue.id = null
        useFetchOrganisations()
      }
    "
  />
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VInput from '@/components/ui/VInput.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VStatus from '@/components/ui/VStatus.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import OrganisationsAdminDialog from '@/components/pages/organisations/OrganisationsAdminDialog.vue'
import { ElPopconfirm } from 'element-plus'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  changeStatus,
  fetchOrganisations,
  deleteOrganisation,
} from '@/services/cabinet/OrganisationsAdminService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import {
  MKO_STATUSES_INDEXED,
  MKO_STATUSES_COLORED,
  MKO_STATUSES,
} from '@/utils/constants'
import { $isPageExists, $parseQueryStatus } from '@/utils/pure-functions'
import type { MkoOrganisation } from '@/types/cabinet/OrganisationsAdminTypes'
import VFilterCollapse from '@/components/ui/VFilterCollapse.vue'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $getQuery, $addQuery, $clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { t } = useI18n()
const queries = $getQuery(['search', 'status', 'name', 'inn', 'company_name'])
$clearQuery(['search', 'status', 'name', 'inn', 'company_name'])

const breadcrumbs = [
  {
    name: t('clientControlling'),
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
  name: null | string
  inn: null | number
  company_name: null | string
}>({
  page: +queries.page || 1,
  lastPage: null,
  perPage: null,
  total: null,
  search: queries.search || null,
  status: $parseQueryStatus(queries.status),
  name: queries.name || null,
  inn: +queries.inn || null,
  company_name: queries.company_name || null,
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
    text: t('organisationType'),
    value: 'organisation_type_name',
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
    text: t('status'),
    value: 'status',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const dialog = ref(false)
const items = ref<MkoOrganisation[]>([])
const editValue = ref<{ id: number | null }>({
  id: null,
})

const useChangeStatus = async (id: number) => {
  try {
    await changeStatus(id)
    await useFetchOrganisations()
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchOrganisations = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchOrganisations(
      options.value.page,
      options.value.search,
      options.value.status,
      options.value.name,
      options.value.inn,
      options.value.company_name
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

const handleDelete = async (id: number) => {
  try {
    $showLoading()
    await deleteOrganisation(id)
    if (
      options.value &&
      options.value.total &&
      options.value.perPage &&
      $isPageExists(options.value.total, options.value.perPage)
    ) {
      options.value.page = 1
      $addQuery({
        page: 1,
      })
    }
    await useFetchOrganisations()
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
    await useFetchOrganisations()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editOrganisation = (id: number) => {
  editValue.value.id = id
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchOrganisations()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      status: options.value.status,
      name: options.value.name,
      inn: options.value.inn,
      company_name: options.value.company_name,
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
    options.value.search = null
    options.value.status = null
    options.value.name = null
    options.value.inn = null
    options.value.company_name = null
    await useFetchOrganisations()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      status: options.value.status,
      name: options.value.name,
      inn: options.value.inn,
      company_name: options.value.company_name,
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
    await $addQuery({
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
