<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('users') }}
  </VText>
  <VCard>
    <VRow>
      <VCol v-if="$can('admin.employee.create')" md="1">
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
      <VCol md="3">
        <VInput clearable :label="t('search')" v-model="options.search" />
      </VCol>
      <VCol md="3">
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
      <VCol md="2">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.role="{ item }">
        {{ item.role.name }}
      </template>
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
          <VBtn
            v-if="$can('admin.employee.change.status')"
            min-width="150px"
            height="32px"
            class="mr-10"
            @click="useToggleStatus(item.id)"
          >
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
            update="admin.employee.update"
            delete="admin.employee.delete"
            @edit="editUser(item)"
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
  <UsersDialog
    v-model="dialog"
    :data="editValue"
    :roles="roles"
    :is-update="isUpdate"
    @submit="useFetchUsers"
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
import UsersDialog from '@/components/pages/users/UsersDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchUsers,
  deleteUser,
  toggleStatus,
  fetchRoles,
} from '@/services/cabinet/UsersService'
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
const queries = getQuery(['search', 'status', 'page'])
clearQuery(['search', 'status', 'page'])

const breadcrumbs = [
  {
    name: t('employees'),
  },
  {
    name: t('users'),
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
  lastPage: null,
  perPage: null,
  total: null,
  status: $parseQueryStatus(queries.status),
  search: queries.search || null,
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
    text: t('role'),
    value: 'role',
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
const roles = ref([])
const editValue = ref<{
  id: number | null
  full_name: string | null
  phone: string | null
  status: number | null
}>({
  id: null,
  full_name: null,
  phone: null,
  status: null,
})

const useFetchUsers = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchUsers(
      options.value.page,
      options.value.search,
      options.value.status
    )
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

const useFetchRoles = async () => {
  try {
    const {
      data: { data },
    } = await fetchRoles()
    roles.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const handleDelete = async (id: number) => {
  try {
    $showLoading()
    await deleteUser(id)
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
    await useFetchUsers()
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
    await useFetchRoles()
    await useFetchUsers()
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
    await useFetchUsers()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editUser = (item: {
  id: number
  full_name: string
  phone: string
  status: number
}) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchUsers()
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
    await useFetchUsers()
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
    await useFetchUsers()
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
