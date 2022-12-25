<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
    {{ t('systemCourse') }}
  </VText>
  <VCard>
    <template v-if="items.length !== currencyTypes.length">
      <VRow>
        <VCol v-if="$can('organisation.courses.create')" md="2">
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
      </VRow>
      <VLine class="mb-20" />
    </template>
    <VTable :headers="headers" :items="items">
      <template #item.actions="{ item }">
        <VTableActions
          update="organisation.courses.create"
          :actions="{ view: false, edit: true, delete: false }"
          @edit="editCurrency(item)"
        />
      </template>
    </VTable>
  </VCard>
  <SettingsCurrenciesDialog
    v-model="dialog"
    :data="editValue"
    :currencyTypes="currencyTypes"
    :is-update="isUpdate"
    @submit="useFetchCurrencies"
  />
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VLine from '@/components/ui/VLine.vue'
import VTable from '@/components/ui/VTable.vue'
import VTableActions from '@/components/ui/VTableActions.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import SettingsCurrenciesDialog from '@/components/pages/settings-currencies/SettingsCurrenciesDialog.vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  fetchCurrencies,
  fetchCurrencyTypes,
} from '@/services/cabinet/SettingsCurrenciesService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()

const breadcrumbs = [
  {
    name: t('setting'),
  },
  {
    name: t('systemCourse'),
  },
]

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('currency'),
    value: 'currency',
  },
  {
    text: t('amount'),
    value: 'amount',
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
const currencyTypes = ref([])
const editValue = ref<{
  currency_id: number | null
  amount: number | null
}>({
  currency_id: null,
  amount: null,
})

const useFetchCurrencyTypes = async () => {
  try {
    const {
      data: { data },
    } = await fetchCurrencyTypes()
    currencyTypes.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchCurrencies = async () => {
  try {
    const {
      data: { data },
    } = await fetchCurrencies()
    items.value = data.map((item: Record<string, any>, i: number) => {
      item.index = i + 1
      return item
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchCurrencyTypes()
    await useFetchCurrencies()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const editCurrency = (item: { currency_id: number; amount: number }) => {
  editValue.value = item
  isUpdate.value = true
  dialog.value = true
}

useFetchData()
</script>
