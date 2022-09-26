<template>
  <div>
    <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
      {{ t('currencies') }}
    </VText>
    <VCard>
      <!--      <VRow>-->
      <!--        <VCol md="1">-->
      <!--          <VBtn color="primary" class="" @click="openDialog">-->
      <!--            <VIcon class="mr-14" size="20" icon="circle-plus" />-->
      <!--            {{ $t('add') }}-->
      <!--          </VBtn>-->
      <!--        </VCol>-->
      <!--        <VCol md="3">-->
      <!--          <VInput :label="$t('search')" v-model="params.search" clearable />-->
      <!--        </VCol>-->
      <!--        <VCol md="1">-->
      <!--          <VFilterActions @filter="startFilter" @clear="clearFilter" />-->
      <!--        </VCol>-->
      <!--      </VRow>-->
      <VTable :headers="headers" :items="items">
        <template #item.actions="{ item }">
          <VTableActions
            @edit="openDialog(item)"
            :actions="{ view: false, edit: true, delete: false }"
          />
        </template>
        <template #item.name="{ item }">
          <span v-if="item.currency && item.currency[`name_${$i18n.locale}`]">{{
            item.currency[`name_${$i18n.locale}`]
          }}</span>
          <span v-else>-</span>
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
    <ReferenceSystemCoursesDialog
      ref="organizationDialogRef"
      @fetchData="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VPagination from '@/components/ui/VPagination.vue'
import ReferenceSystemCoursesDialog from '@/components/pages/reference-system-courses/ReferenceSystemCoursesDialog.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchReferenceSystemCourses } from '@/services/cabinet/ReferenceSystemCoursesService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import type {
  ReferenceSystemCoursesFormTypes,
  ReferencePartySystemCoursesDataItemType,
  ReferenceSystemCoursesPageOptionsType,
} from '@/types/cabinet/ReferenceSystemCoursesTypes'
import type { ItemsValue } from '@/types/globals/FetchDataTypes'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { addQuery, getQuery, clearQuery } = useQuery()

const items = ref([]) as ItemsValue<ReferencePartySystemCoursesDataItemType>
const { t } = useI18n()
const organizationDialogRef = ref()
const queries = getQuery(['page'])
clearQuery(['page'])

const params = ref<ReferenceSystemCoursesPageOptionsType>({
  page: +queries.page || 1,
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

// const startFilter = async () => {
//   params.value.page = 1
//   $showLoading()
//   try {
//     await fetchData()
//     addQuery(params.value)
//   } catch (err) {
//     $setResponseErrors(err)
//   } finally {
//     $clearLoading()
//   }
// }

// const clearFilter = async () => {
//   try {
//     $showLoading()
//     params.value.page = 1
//     await fetchData()
//     addQuery(params.value)
//   } catch (err) {
//     $setResponseErrors(err)
//   } finally {
//     $clearLoading()
//   }
// }

const fetchData = async () => {
  try {
    const { data, links } = await fetchReferenceSystemCourses(params.value)
    if (links && links.total) pageOptions.value.total = links.total
    if (links && links.last_page) pageOptions.value.lastPage = links.last_page
    if (links && links.per_page) pageOptions.value.perPage = links.per_page
    items.value = data.map(
      (p: ReferencePartySystemCoursesDataItemType, i: number) => {
        if (links) p.index = links.from + i
        return p
      }
    )
  } catch (err) {
    $setResponseErrors(err)
  }
}

const useFetchData = async () => {
  $showLoading()
  await fetchData()
  $clearLoading()
}

const changePage = async () => {
  try {
    $showLoading()
    addQuery({ page: params.value.page })
    await fetchData()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const openDialog = (item: ReferenceSystemCoursesFormTypes) => {
  organizationDialogRef.value.openDialog(item)
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('name'), value: 'name' },
  { text: t('amount'), value: 'amount' },
  {
    text: t('actions'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped></style>
