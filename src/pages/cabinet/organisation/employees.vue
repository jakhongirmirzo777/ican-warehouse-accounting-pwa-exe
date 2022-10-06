<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('employees') }}
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
              isUpdate = false
              dialog = true
            }
          "
        >
          <VIcon class="mr-10" size="20" icon="circle-plus" />
          {{ t('add') }}
        </VBtn>
      </VCol>
      <VCol xl="2" md="3">
        <VInput clearable :label="t('search')" v-model="options.search" />
      </VCol>
      <VCol xl="2" md="3">
        <VSelect
          clearable
          localize
          item-text="text"
          item-value="value"
          :label="t('status')"
          :items="USER_STATUS_INDEXED"
          v-model="options.status"
        />
      </VCol>
      <VCol xl="2" md="3">
        <VSelect
          clearable
          :label="t('departments')"
          :items="departments"
          v-model="options.department_id"
        />
      </VCol>
      <VCol xl="2" md="3">
        <VSelect
          clearable
          :label="t('positions')"
          :items="positions"
          v-model="options.position_id"
        />
      </VCol>
      <VCol xl="2" md="3">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.phone="{ item }">
        {{ $phoneFormat(item.phone) }}
      </template>
      <template #item.status="{ item }">
        <VStatus
          min-width="100px"
          :color="USER_STATUS_COLORED[item.status].color"
          :theme="USER_STATUS_COLORED[item.status].theme"
        >
          {{ t(USER_STATUS[item.status]) }}
        </VStatus>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center">
          <VBtn height="32px" class="mr-10" @click="useToggleStatus(item.id)">
            <VIcon
              v-if="item.status === USER_STATUS_VALUE.ACTIVE"
              icon="lock-red"
              size="14"
            />
            <VIcon v-else icon="unlock" size="14" />
            <span
              class="ml-8"
              :class="[
                item.status === USER_STATUS_VALUE.ACTIVE
                  ? 'color-light-red'
                  : 'color-green',
              ]"
            >
              {{
                item.status === USER_STATUS_VALUE.ACTIVE
                  ? t('block')
                  : t('unblock')
              }}
            </span>
          </VBtn>
          <VTableActions
            @edit="editEmployee(item)"
            @delete="handleDelete(item.id)"
          />
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
  <EmployeesDialog
    v-model="dialog"
    :data="editValue"
    :departments="departments"
    :positions="positions"
    :is-update="isUpdate"
    @submit="useFetchEmployees"
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
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VStatus from '@/components/ui/VStatus.vue'
import EmployeesDialog from '@/components/pages/employees/EmployeesDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchDepartments,
  fetchPositions,
  fetchEmployees,
  deleteEmployee,
  toggleStatus,
} from '@/services/cabinet/EmployeesService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { useNotificationService } from '@/plugins/notification-service'
import { $isPageExists, $parseQueryStatus } from '@/utils/pure-functions'
import {
  USER_STATUS_INDEXED,
  USER_STATUS_COLORED,
  USER_STATUS_VALUE,
  USER_STATUS,
} from '@/utils/constants'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { getQuery, addQuery, clearQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { t } = useI18n()
const queries = getQuery([
  'search',
  'status',
  'department_id',
  'position_id',
  'page',
])
clearQuery(['search', 'status', 'department_id', 'position_id', 'page'])

const breadcrumbs = [
  {
    name: t('workersControlling'),
  },
  {
    name: t('employees'),
  },
]

const options = ref<{
  page: number
  lastPage: null | number
  perPage: null | number
  total: null | number
  search: null | string
  status: null | number
  department_id: null | number
  position_id: null | number
}>({
  page: +queries.page || 1,
  lastPage: null,
  perPage: null,
  total: null,
  search: queries.search || null,
  status: $parseQueryStatus(queries.status),
  department_id: +queries.department_id || null,
  position_id: +queries.position_id || null,
})

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('fio'),
    value: 'full_name',
  },
  {
    text: t('username'),
    value: 'username',
  },
  {
    text: t('department'),
    value: 'department_name',
  },
  {
    text: t('positionAtWork'),
    value: 'position_name',
  },
  {
    text: t('phone'),
    value: 'phone',
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
const isUpdate = ref(false)
const items = ref([])
const departments = ref([])
const positions = ref([])
const editValue = ref<{
  id: number | null
  full_name: string | null
  phone: string | null
  status: number | null
  department_id: number | null
  position_id: number | null
}>({
  id: null,
  full_name: null,
  phone: null,
  status: null,
  department_id: null,
  position_id: null,
})

const useFetchEmployees = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchEmployees(options.value)
    const { from, last_page, total, per_page } = links
    options.value.lastPage = last_page
    options.value.total = total
    options.value.perPage = per_page
    items.value = data.map((item: Record<string, any>, i: number) => {
      item.index = from + i
      return item
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchDepartments = async () => {
  try {
    const {
      data: { data },
    } = await fetchDepartments()
    departments.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchPositions = async () => {
  try {
    const {
      data: { data },
    } = await fetchPositions()
    positions.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const handleDelete = async (id: number) => {
  try {
    $showLoading()
    await deleteEmployee(id)
    if (
      options.value &&
      options.value.total &&
      options.value.perPage &&
      $isPageExists(options.value.total, options.value.perPage)
    ) {
      options.value.page = 1
      addQuery({
        page: 1,
      })
    }
    await useFetchEmployees()
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
    await useFetchDepartments()
    await useFetchPositions()
    await useFetchEmployees()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const useToggleStatus = async (id: number) => {
  try {
    $showLoading()
    await toggleStatus(id)
    await useFetchEmployees()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editEmployee = (item: {
  id: number
  full_name: string
  phone: string
  status: number
  department_id: number
  position_id: number
}) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchEmployees()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      status: options.value.status,
      department_id: options.value.department_id,
      position_id: options.value.position_id,
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
    options.value.department_id = null
    options.value.position_id = null
    await useFetchEmployees()
    await addQuery({
      page: options.value.page,
      search: options.value.search,
      status: options.value.status,
      department_id: options.value.department_id,
      position_id: options.value.position_id,
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
    await useFetchEmployees()
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
