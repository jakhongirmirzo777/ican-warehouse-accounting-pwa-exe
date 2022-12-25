<template>
  <VCard class="mb-24">
    <VRow>
      <VCol md="2">
        <VBtn
          type="button"
          class="mb-20"
          :outlined="type !== 'all'"
          color="primary"
          width="100%"
          @click="
            () => {
              type = 'all'
              useFetchProductSearchAll()
            }
          "
        >
          {{ t('all') }}
        </VBtn>
      </VCol>
      <VCol md="2">
        <VBtn
          type="button"
          class="mb-20"
          :outlined="type !== 'stock'"
          color="primary"
          width="100%"
          @click="
            () => {
              type = 'stock'
              useFetchProductSearchAll()
            }
          "
        >
          {{ t('stock') }}
        </VBtn>
      </VCol>
      <VCol md="2">
        <VBtn
          type="button"
          class="mb-20"
          :outlined="type !== 'showcase'"
          color="primary"
          width="100%"
          @click="
            () => {
              type = 'showcase'
              useFetchProductSearchAll()
            }
          "
        >
          {{ t('showcase') }}
        </VBtn>
      </VCol>
    </VRow>
    <Form @submit="onSubmit" ref="formObj">
      <VTable :loading="loading" :headers="headers" :items="computedItems">
        <template #item.index="{ item }">
          {{ item.index + 1 }}
        </template>
        <!--        <template #item.count_stock_before="{ item }">-->
        <!--          <VInput-->
        <!--            :vid="`count_stock_before-${item.index}`"-->
        <!--            type="number"-->
        <!--            :rules="{-->
        <!--              required: formData[item.index].is_checked,-->
        <!--            }"-->
        <!--            :label="t('countStockBefore')"-->
        <!--            v-model="formData[item.index].count_stock_before"-->
        <!--          />-->
        <!--        </template>-->
        <template #item.count_stock_after="{ item }">
          <VInput
            :vid="`count_stock_after-${item.index}`"
            type="number"
            :rules="{
              required: formData[item.index].is_checked,
            }"
            :label="t('countStockAfter')"
            v-model="formData[item.index].count_stock_after"
          />
        </template>
        <!--        <template #item.count_showcase_before="{ item }">-->
        <!--          <VInput-->
        <!--            :vid="`count_showcase_before-${item.index}`"-->
        <!--            type="number"-->
        <!--            :rules="{-->
        <!--              required: formData[item.index].is_checked,-->
        <!--            }"-->
        <!--            :label="t('countShowcaseBefore')"-->
        <!--            v-model="formData[item.index].count_showcase_before"-->
        <!--          />-->
        <!--        </template>-->
        <template #item.count_showcase_after="{ item }">
          <VInput
            :vid="`count_showcase_after-${item.index}`"
            type="number"
            :rules="{
              required: formData[item.index].is_checked,
            }"
            :label="t('countShowcaseAfter')"
            v-model="formData[item.index].count_showcase_after"
          />
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <VCheckbox v-model="formData[item.index].is_checked" />
          </div>
        </template>
      </VTable>
      <div v-if="!loading" class="my-30">
        <VPagination
          v-if="options.lastPage > 1"
          v-model="options.page"
          :pages="options.lastPage"
          :total="options.total"
          @update:modelValue="btnIsClicked = false"
        />
      </div>
      <VRow v-if="!loading">
        <VCol md="8" />
        <VCol md="2">
          <VBtn
            type="button"
            class="mb-20"
            outlined
            color="primary"
            width="100%"
            @click="$emit('cancel')"
          >
            {{ t('cancel') }}
          </VBtn>
        </VCol>
        <VCol md="2">
          <VBtn
            type="submit"
            :loading="btnLoading"
            class="mb-20"
            color="primary"
            width="100%"
            @click="btnIsClicked = true"
          >
            <VIcon class="mr-10" size="20" icon="circle-plus" />
            {{ t('addAll') }}
          </VBtn>
        </VCol>
      </VRow>
    </Form>
  </VCard>
</template>

<script lang="ts" setup>
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VInput from '@/components/ui/VInput.vue'
import VTable from '@/components/ui/VTable.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'
import VPagination from '@/components/ui/VPagination.vue'

import {
  fetchProductSearchAll,
  createProduct,
} from '@/services/cabinet/InventoryInventoryService'
import { useErrorActions } from '@/composables/set-errors'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@/composables/router-query'
import { computed, ref } from 'vue'
import { useNotificationService } from '@/plugins/notification-service'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const { getQuery } = useQuery()
const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const queries = getQuery(['organisation_id', 'store_id'])
const options = ref({
  page: 1,
  lastPage: 1,
  perPage: 15,
  total: 1,
})

const headers = [
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  {
    text: t('product'),
    value: 'product_name',
  },
  {
    text: t('category'),
    value: 'category',
  },
  {
    text: t('articule'),
    value: 'product_articule',
  },
  {
    text: t('barcode'),
    value: 'product_barcode',
  },
  {
    text: t('units'),
    value: 'unit',
  },
  {
    text: t('countStockBefore'),
    value: 'count_stock',
    width: '250px',
  },
  {
    text: t('countShowcaseBefore'),
    value: 'count_showcase',
    width: '250px',
  },
  {
    text: t('countStockAfter'),
    value: 'count_stock_after',
    width: '250px',
  },
  {
    text: t('countShowcaseAfter'),
    value: 'count_showcase_after',
    width: '250px',
  },
  {
    text: t('shouldAdd'),
    value: 'actions',
  },
]

interface IFormData {
  count_stock: number | string
  count_showcase: number | string
  count_stock_before: number | string
  count_showcase_before: number | string
  count_stock_after: null | string
  count_showcase_after: null | string
  product_id: null | number
  is_checked: boolean
  index: null | number
  page: null | number
}

const formObj = ref<any>(null)
const type = ref<'all' | 'stock' | 'showcase'>('all')
const id = computed(() => route.params.id || null)
const loading = ref(false)
const btnLoading = ref(false)
const btnIsClicked = ref(false)
const items = ref([])
const computedItems = computed(() =>
  items.value.slice(
    (+options.value.page - 1) * options.value.perPage,
    options.value.page * options.value.perPage
  )
)
const formData = ref<IFormData[]>([])
const emit = defineEmits(['submit'])

const useFetchProductSearchAll = async () => {
  try {
    loading.value = true
    const {
      data: { data },
    } = await fetchProductSearchAll(
      +queries.organisation_id,
      +queries.store_id,
      type.value
    )
    formData.value = data.map((item: IFormData, i: number) => ({
      count_stock_before: +item.count_stock,
      count_showcase_before: +item.count_showcase,
      count_stock_after: null,
      count_showcase_after: null,
      product_id: item.product_id,
      is_checked: false,
      index: i,
      page: Math.ceil((i + 1) / options.value.perPage),
    }))
    options.value.lastPage = Math.ceil(data.length / options.value.perPage)
    options.value.total = data.length
    items.value = data.map((item: IFormData, i: number) => {
      item.index = i
      item.page = Math.ceil((i + 1) / options.value.perPage)
      return item
    })
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  try {
    btnLoading.value = true
    const data = JSON.parse(JSON.stringify(formData.value))
    const filteredData = data.filter((item: IFormData) => item.is_checked)
    const isInValid = filteredData.find((item: IFormData) => {
      return (
        item.is_checked &&
        typeof item.count_stock_after === 'object' &&
        typeof item.count_showcase_after === 'object'
      )
    })
    if (isInValid && btnIsClicked.value) {
      options.value.page = isInValid.page
    }
    if (filteredData.length && !isInValid && btnIsClicked.value) {
      const apiCalls = filteredData.map((item: IFormData) => {
        if (
          id.value &&
          typeof item.count_stock_after !== 'object' &&
          typeof item.count_showcase_after !== 'object'
        )
          return createProduct(+id.value, {
            count_stock_before: Math.round(+item.count_stock_before),
            count_stock_after: Math.round(+item.count_stock_after),
            count_showcase_before: Math.round(+item.count_showcase_before),
            count_showcase_after: Math.round(+item.count_showcase_after),
            product_id: item.product_id,
          })
        return Promise.resolve(true)
      })
      await Promise.all(apiCalls)
      await emit('submit')
      await $successMessage(t('notifications.addedSuccessfully'))
    }
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    btnLoading.value = false
  }
}

useFetchProductSearchAll()
</script>
