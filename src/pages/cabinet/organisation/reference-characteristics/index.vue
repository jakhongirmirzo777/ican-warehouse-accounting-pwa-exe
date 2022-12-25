<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('characteristics') }}
  </VText>
  <VCard>
    <VRow>
      <VCol md="1">
        <VBtn
          width="100%"
          class="mb-20"
          color="primary"
          to="/cabinet/reference-characteristics-item"
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
          autocomplete
          multiple
          :label="t('category')"
          :items="categoryList"
          v-model="options.category_ids"
        />
      </VCol>
      <VCol md="2">
        <VFilterActions @filter="filterData" @clear="clearFilter" />
      </VCol>
    </VRow>
    <VLine class="mb-20" />
    <VTable :headers="headers" :items="items">
      <template #item.value="{ item }">
        {{ item.values.map((value) => value.value).join(', ') }}
      </template>
      <template #item.category="{ item }">
        {{ item.categories.map((category) => category.name).join(', ') }}
      </template>
      <template #item.actions="{ item }">
        <VTableActions
          @edit="
            $router.push(
              $localePath(`/cabinet/reference-characteristics-item/${item.id}`)
            )
          "
          @delete="handleDelete(item.id)"
        />
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
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VRow from '@/components/ui/VRow.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VFilterActions from '@/components/ui/VFilterActions.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VPagination from '@/components/ui/VPagination.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'

import type {
  CategoryParentsInterface,
  CategoryInterface,
} from '@/types/cabinet/ReferenceCharacteristicsTypes'
import { useErrorActions } from '@/composables/set-errors'
import {
  fetchCategories,
  fetchCharacteristics,
  deleteCharacteristic,
} from '@/services/cabinet/ReferenceCharacteristicsService'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $isPageExists, $parseQueryArray } from '@/utils/pure-functions'
import { useNotificationService } from '@/plugins/notification-service'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $getQuery, $addQuery, $clearQuery } = useQuery()
const { t } = useI18n()
const queries = $getQuery(['search', 'category_ids', 'page'])
$clearQuery(['search', 'category_ids', 'page'])

const breadcrumbs = [
  {
    name: t('reference'),
  },
  {
    name: t('characteristics'),
  },
]

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('name'),
    value: 'name',
  },
  {
    text: t('value'),
    value: 'value',
  },
  {
    text: t('category'),
    value: 'category',
  },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
]

const options = ref<{
  search: string | null
  category_ids: number[]
  page: number
  lastPage: number | null
  total: number | null
  perPage: number | null
}>({
  search: queries.search || null,
  category_ids: $parseQueryArray(queries.category_ids) as number[],
  page: +queries.page || 1,
  lastPage: null,
  total: null,
  perPage: null,
})
const categoryList = ref([])
const items = ref([])

const useFetchCategories = async () => {
  try {
    const {
      data: { data },
    } = await fetchCategories()
    categoryList.value = data.reduce(
      (acc: CategoryInterface[], cur: CategoryParentsInterface) => {
        return [...acc, ...cur.children]
      },
      []
    )
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchCharacteristics = async () => {
  try {
    const {
      data: { data, links },
    } = await fetchCharacteristics(
      options.value.page,
      options.value.search,
      options.value.category_ids
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

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchCategories()
    await useFetchCharacteristics()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const handleDelete = async (id: number) => {
  try {
    $showLoading()
    await deleteCharacteristic(id)
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
    await useFetchCharacteristics()
    $successMessage(t('notifications.deletedSuccessfully'))
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const filterData = async () => {
  try {
    $showLoading()
    options.value.page = 1
    await useFetchCharacteristics()

    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      category_ids: options.value.category_ids,
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
    options.value.category_ids = []
    options.value.search = null
    await useFetchCharacteristics()
    await $addQuery({
      page: options.value.page,
      search: options.value.search,
      category_ids: options.value.category_ids,
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
    await useFetchCharacteristics()
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
