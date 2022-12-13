<template>
  <div class="direct-sale">
    <VBreadcrumb class="mb-18" :list="breadcrumbs" />
    <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
      {{ t('directSale') }}
    </VText>
    <VCard>
      <Form ref="cashRegisterRef">
        <VRow>
          <VCol md="2" class="direct-sale__search">
            <VSelect
              :label="$t('warehouses')"
              :items="storeList"
              item-text="name"
              item-value="id"
              clearable
              autocomplete
              v-model="params.store_id"
            />
            <v-card v-if="isManyRes" class="direct-sale__search__body">
              <VTable
                :items="responseSearch"
                :headers="headersForSelectableResponse"
              >
                <template #item.actions="{ item }">
                  <VCheckbox
                    @change="($event) => selectSearchedResponse(item, $event)"
                  />
                </template>
              </VTable>
              <VCardAction>
                <VSpacer />
                <VBtn @click="cancelChoseSearchResponse" text class="mr-10">{{
                  $t('cancel')
                }}</VBtn>
                <VBtn
                  @click="doneChooseSearchResponse"
                  color="success"
                  :disabled="choseResponseSearch.length === 0"
                >
                  {{ $t('save') }}
                </VBtn>
              </VCardAction>
            </v-card>
          </VCol>
          <VCol md="3">
            <VInput :label="$t('search')" v-model="params.search" clearable />
          </VCol>
          <VCol md="1">
            <VBtn
              style="display: flex"
              min-width="40px"
              color="primary"
              class="mb-20 mb-md-0 justify-center align-center"
              @click="startFilter"
              :disabled="!params.search || !params.store_id"
            >
              <VIcon size="24" icon="search-solid" />
            </VBtn>
          </VCol>
          <VCol md="2">
            <VInput
              :label="$t('fullNameClient')"
              v-model="form.full_name"
              clearable
            />
          </VCol>
          <VCol md="2">
            <VSelect
              :label="$t('saleCurrency')"
              :items="currencyList"
              item-text="name"
              item-value="key"
              rules="required"
              vid="currency_id"
              clearable
              autocomplete
              v-model="currency"
            />
          </VCol>
          <VCol md="2">
            <VSelect
              v-if="isOrganisation"
              :label="$t('employees')"
              :items="employeeList"
              item-text="full_name"
              item-value="user_id"
              rules="required"
              vid="user_id"
              clearable
              autocomplete
              v-model="form.user_id"
            />
          </VCol>
        </VRow>
      </Form>
      <VLine class="mb-20" />
      <VTable :headers="headers" :items="items">
        <template #item.actions="{ iy }">
          <VBtn class="ml-2" small @click="deleteItem(iy)">
            <VIcon size="12" icon="delete" />
          </VBtn>
        </template>
        <template #item.selling_price_input="{ item }">
          <div class="d-flex align-center">
            <VInput
              v-model="item.selling_price_sum"
              :rules="`min_value:${item.selling_price_min[currency]}`"
              :name="$t('price')"
              @update:modelValue="changeSellPrice"
              type="number"
              style="margin-bottom: -18px"
            />
          </div>
        </template>
        <template #item.bonusOnSale="{ item, iy }">
          <div>
            <VCheckbox
              v-model="item.isBonus"
              :value="item.product_id"
              @change="checkBonusProduct(item, iy)"
              :true-value="item.product_id"
              :false-value="0"
              hide-details
            />
          </div>
        </template>
        <template #item.count="{ item }">
          <VCounter
            :class="{ disabled: item.is_bonus }"
            v-model="item.sell_count"
            @update:modelValue="changeSellPrice"
          />
        </template>
      </VTable>
      <div class="mt-10">
        {{ $t('totalPayable') }}: {{ allPriceWithFormat }}
      </div>
      <VLine class="my-20" />
      <VRow class="mt-5">
        <VCol md="10">
          <span>{{ $t('paymentType') }}</span>
          <VBtn
            :class="[{ 'ml-16': i === 0 }, 'mr-8']"
            radius="12"
            :color="
              paymentTypeErrorMessage && !isMainPaid
                ? 'danger'
                : payment_type === item.type
                ? 'success'
                : ''
            "
            :outlined="paymentTypeErrorMessage && !isMainPaid"
            v-for="(item, i) in paymentTypeList"
            :key="`payment-type-${i}`"
            @click="selectPaymentType(item.type)"
          >
            {{ item.name }}
          </VBtn>
          <VBtn
            :disabled="!items.length"
            class="ml-16mr-8"
            color="warning"
            @click="
              $refs.paymentTypeModalRef.openDialog(
                paymentTypeList,
                allPriceWithFormat
              )
            "
          >
            {{ $t('paymentDifferentWays') }}
          </VBtn>
        </VCol>
        <VCol md="2" class="d-flex justify-end">
          <VBtn
            :disabled="!items.length"
            color="primary"
            radius="12"
            type="submit"
            @click="submit"
          >
            {{ $t('makePayment') }}
          </VBtn>
        </VCol>
        <div
          class="payment-type-error-message ml-10 mt-10"
          v-if="paymentTypeErrorMessage && !payments.length"
        >
          <span class="payment-type-error-message__message">{{
            paymentTypeErrorMessage
          }}</span>
        </div>
      </VRow>
    </VCard>
    <DirectSalePaymentModal
      ref="paymentTypeModalRef"
      @saved-payment-type-dialog="savedPaymentTypeDialog"
    />
    <DirectSaleBonusModal
      ref="directSaleBonusRef"
      :currency="currency"
      :paymentTypeList="paymentTypeList"
      @check-bonus-product="checkBonusProduct"
    />
    <BonusOrNotModal ref="bonusOrNotRef" />
  </div>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'
import VCounter from '@/components/ui/VCounter.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VCardAction from '@/components/ui/VCardAction.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import DirectSalePaymentModal from '@/components/pages/direct-sale/DirectSalePaymentModal.vue'
import DirectSaleBonusModal from '@/components/pages/direct-sale/DirectSaleBonusModal.vue'
import BonusOrNotModal from '@/components/pages/direct-sale/BonusOrNotModal.vue'

import { computed, ref, onBeforeUnmount } from 'vue'
import {
  CLIENT_TYPES,
  PAYMENT_TYPE_ADDITIONAL_OR_MAIN,
  ROLES,
} from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import {
  checkBonus,
  fetchDirectSale,
  getPaymentTypes,
  submitDirectSale,
} from '@/services/cabinet/DirectSaleService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import type {
  DirectSaleDataItemType,
  DirectSaleFormType,
  DirectSaleOptionsType,
  CheckBonusType,
  PaymentsType,
} from '@/types/cabinet/DirectSaleTypes'
import type { CurrencyKeyList } from '@/types/cabinet/ReferenceCurrenciesTypes'
import { fetchWarehouseList } from '@/services/cabinet/WarehousesService'
import { fetchEmployeeList } from '@/services/cabinet/EmployeesService'
import { useUserService } from '@/plugins/user-service'
import {
  $clearNonDigits,
  $debounce,
  $moneyFormatWithComma,
} from '@/utils/pure-functions'
import { getCurrencyList } from '@/services/cabinet/ReferenceCurrenciesServise'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage, $errorMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()

const { user } = useUserService()

const FORM = {
  currency_id: null,
  full_name: '',
  total_amount: '',
  payments: [],
  products: [
    {
      product_id: null,
      count: null,
      sold: '',
      is_bonus: false,
      id: null,
    },
  ],
}

const queries = getQuery([
  'page',
  'search',
  'store_id',
  'additional_amount_sum',
])
clearQuery(['page', 'search', 'store_id', 'additional_amount_sum'])
const { t } = useI18n()

const params = ref<DirectSaleOptionsType>({
  search: queries.search || '',
  page: +queries.page || 1,
  store_id: +queries.store_id || '',
  additional_amount_sum: queries.additional_amount_sum || '',
})

const breadcrumbs = [
  {
    name: t('cashRegister'),
  },
  {
    name: t('directSale'),
  },
]

const currencyList = ref<Array<CurrencyKeyList>>([])
const paymentTypeList = ref<Array<Record<string, any>>>([])
const storeList = ref<Array<Record<string, any>>>([])
const form = ref<DirectSaleFormType>({ ...FORM })
const payment_type = ref('')
const items = ref<DirectSaleDataItemType[]>([])
const responseSearch = ref<DirectSaleDataItemType[]>([])
const choseResponseSearch = ref<DirectSaleDataItemType[]>([])
const payments = ref<Array<PaymentsType>>([])
const allCellingPrice = ref(0)
const currency = ref('UZS')
const employeeList = ref<
  Array<{
    id: number
    full_name: string
  }>
>([])

const isManyRes = ref(false)

const paymentTypeErrorMessage = ref(null) as any

//refs
const cashRegisterRef = ref()
const directSaleBonusRef = ref()
const bonusOrNotRef = ref()

const isOrganisation = computed(() => user.value?.type === ROLES.ORGANISATION)
const allPriceWithFormat = computed(() =>
  $moneyFormatWithComma(allCellingPrice.value)
)
const isMainPaid = computed(() => {
  let count = 0
  payments.value.forEach((p) => {
    if (p.type === PAYMENT_TYPE_ADDITIONAL_OR_MAIN.main) count++
  })
  return count > 0
})

const submit = async () => {
  const { $setFormErrors } = useFormActions(cashRegisterRef.value)
  const validate = {} as Record<string, string>
  const currencyItem = currencyList.value.find((p) => p.key === currency.value)
  if (currencyItem) form.value.currency_id = currencyItem.id
  if (!form.value?.currency_id)
    validate.currency_id = t('validation.required', {
      field: t('saleCurrency'),
    })
  if (!form.value?.user_id) {
    validate.user_id = t('validation.required', {
      field: t('employees'),
    })
  }
  const validateValues = Object.keys(validate)
  if (validateValues.length) {
    cashRegisterRef.value.setErrors(validate)
  }
  if (!payments.value.length) {
    paymentTypeErrorMessage.value = t('validation.required', {
      field: t('paymentType'),
    })
    return
  }
  items.value.forEach((p, i) => {
    if (!form.value?.products[i]) {
      form.value.products[i] = {
        product_id: null,
        count: null,
        sold: '',
        is_bonus: false,
        id: null,
      }
    }
    if (p.id) form.value.products[i].id = p.id
    if (p.product_id) form.value.products[i].product_id = p.product_id
    if (p.price) form.value.products[i].sold = p.price
    if (p.sell_count) form.value.products[i].count = p.sell_count
    if (p.is_bonus) {
      form.value.products[i].is_bonus = true
      form.value.products[i].bonus_id = p.bonus_id
      form.value.products[i].sold = 0
    }
  })
  if (params.value.additional_amount_sum)
    form.value.additional_amount_sum = $clearNonDigits(
      params.value.additional_amount_sum
    )
  if (allCellingPrice.value) form.value.total_amount = allCellingPrice.value
  if (payments.value) form.value.payments = payments.value
  if (!Object.keys(validate).length) {
    try {
      await submitDirectSale(form.value)
      form.value = { ...FORM }
      items.value = []
      params.value.additional_amount_sum = ''
      payments.value = []
      payment_type.value = ''
      cancelChoseSearchResponse()
      changeSellPrice()
      cashRegisterRef.value.resetForm()
    } catch (err) {
      $setResponseErrors(err)
      $setFormErrors(err)
    }
  }
}

const savedPaymentTypeDialog = (val: Array<PaymentsType>) => {
  payments.value.push(...val)
}

const startFilter = async () => {
  params.value.page = 1
  $showLoading()
  try {
    await fetchData()
    addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const selectSearchedResponse = (item: DirectSaleDataItemType, e: boolean) => {
  if (e) choseResponseSearch.value.push(item)
  else {
    const index = choseResponseSearch.value.map((p) => p.id).indexOf(item.id)
    choseResponseSearch.value.splice(index, 1)
  }
}

const cancelChoseSearchResponse = () => {
  isManyRes.value = false
  choseResponseSearch.value = []
  responseSearch.value = []
}

const doneChooseSearchResponse = () => {
  if (items.value.length) {
    for (let i = 0; i < choseResponseSearch.value.length; i++) {
      const item = items.value.find(
        (p) =>
          p.product_id === choseResponseSearch.value[i].product_id &&
          p.store_id === choseResponseSearch.value[i].store_id &&
          !p.is_bonus
      )
      directSaleBonusRef.value.openDialog(null, i, item)
      if (item) {
        item.sell_count++
      } else items.value.push(choseResponseSearch.value[i])
    }
  } else {
    items.value.push(...choseResponseSearch.value)
  }
  $successMessage(t('notifications.addedSuccessfully'))
  params.value.store_id = ''
  params.value.search = ''
  changeSellPrice()
  cancelChoseSearchResponse()
  addQuery(params.value)
}

const fetchData = async () => {
  try {
    const { data } = await fetchDirectSale(params.value)
    const value = data.map((p: DirectSaleDataItemType, i: number) => {
      p.index = i + 1
      p.isBonus = 0
      p.sell_count = 1
      p.is_bonus = false
      p.price = p.selling_price_sum
      return p
    })
    responseSearch.value = value
    if (value.length > 1) isManyRes.value = true
    else if (value.length === 1) {
      let index = -1
      items.value.forEach((p, i) => {
        if (
          p.store_id === value[0].store_id &&
          p.product_id === value[0].product_id
        ) {
          index = i
        }
      })
      if (index > -1) {
        items.value[index].sell_count++
      } else {
        items.value.push(...value)
      }
      $successMessage(t('notifications.addedSuccessfully'))
      changeSellPrice()
      params.value.store_id = ''
      params.value.search = ''
      addQuery(params.value)
    }
    SET_ITEMS()
  } catch (err) {
    $setResponseErrors(err)
  }
}

const fetchCurrencyList = async () => {
  try {
    const { data } = await getCurrencyList()
    currencyList.value = data
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

const getPaymentTypeList = async () => {
  try {
    const {
      data: { data },
    } = await getPaymentTypes()
    paymentTypeList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const fetchStoreList = async () => {
  try {
    const {
      data: { data },
    } = await fetchWarehouseList()
    storeList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const selectPaymentType = (type: string) => {
  paymentTypeErrorMessage.value = null
  payment_type.value = type
  payments.value.push({
    payment_type: type,
    type: 'main',
    amount: allCellingPrice.value,
  })
}

const changeAdditionalBonusSum = $debounce(() => {
  items.value.forEach((p, i) => {
    if (p.is_bonus && p.isBonus) {
      checkBonusProduct(p, i, true)
    }
  })
  addQuery(params.value)
}, 500)

const checkBonusProduct = async (
  item: DirectSaleDataItemType,
  index: number,
  changeAdditional?: boolean,
  additional_amount_sum?: number,
  payment_type?: string
) => {
  let allPrice = 0
  if (items.value.length && items.value.length > 1) {
    items.value.forEach((p) => {
      if (p.product_id !== item.product_id) {
        allPrice += +p.price
      }
    })
  }
  const currencyItem = currencyList.value.find((p) => p.key === currency.value)
  const options: CheckBonusType = {
    all_amount: allPrice,
    selling_price_sum: item.selling_price_sum,
    client_type: CLIENT_TYPES.individual,
  }
  if (currencyItem && currencyItem.id) options.currency_id = currencyItem.id
  if (additional_amount_sum)
    options.additional_amount_sum = additional_amount_sum
  try {
    if (allPrice > 0 && (changeAdditional || !item.is_bonus)) {
      const {
        data: { data },
      } = await checkBonus(options)
      if (!changeAdditional) {
        items.value.forEach((p) => {
          if (p.is_bonus) {
            p.isBonus = 0
            p.bonus_id = 0
            p.is_bonus = false
          }
        })
        item.isBonus = item.product_id
        item.bonus_id = data.id
        item.is_bonus = true
        if (additional_amount_sum) directSaleBonusRef.value.closeDialog()
        if (payment_type && additional_amount_sum) {
          payments.value.push({
            payment_type: payment_type,
            type: PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional,
            amount: additional_amount_sum,
          })
        }
      }
    } else if ((!allPrice || allPrice < 1) && !item.is_bonus) {
      $errorMessage(t('notifications.amountInsufficient'))
      if (!changeAdditional) {
        setTimeout(() => {
          items.value[index].isBonus = 0
        }, 200)
      }
    } else {
      setTimeout(() => {
        item.isBonus = 0
        item.bonus_id = 0
        item.is_bonus = false
        const indexWithType = payments.value
          .map((p) => p.type)
          .indexOf(PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional)

        if (indexWithType > -1) payments.value.splice(indexWithType, 1)
      }, 50)
    }
    SET_ITEMS()
  } catch (err: any) {
    const errors = err?.response?.data?.errors
    if (errors && errors.additional_amount && errors.bonus_amount) {
      directSaleBonusRef.value.openDialog(err.response.data.errors, index, item)
    }
    items.value[index].isBonus = 0
    $setResponseErrors(err)
  }
}

const deleteItem = (index: number) => {
  items.value.forEach((p, i) => {
    if (p.is_bonus && p.bonus_id) {
      checkBonusProduct(p, i)
    }
  })
  items.value.splice(index, 1)
  $successMessage(t('notifications.deletedSuccessfully'))
  changeSellPrice()
}

const changeSellPrice = $debounce(() => {
  allCellingPrice.value = 0
  if (items.value.length) {
    items.value.forEach((p) => {
      allCellingPrice.value += +p.selling_price_sum * p.sell_count
    })
  } else {
    allCellingPrice.value = 0
  }
  SET_ITEMS()
}, 300)

onBeforeUnmount(() => {
  console.log('destroyed')
  items.value = []
  SET_ITEMS()
})

const CASH_REGISTER_KEY = 'CASH_REGISTER'

const SET_ITEMS = () => {
  localStorage.setItem(CASH_REGISTER_KEY, JSON.stringify(items.value))
}

const GET_ITEMS = () => {
  const items = localStorage.getItem(CASH_REGISTER_KEY)
  if (items) return JSON.parse(items)
  return null
}

const useFetchData = async () => {
  $showLoading()
  if (GET_ITEMS()) {
    items.value = GET_ITEMS()
    changeSellPrice()
  }
  await fetchCurrencyList()
  await fetchStoreList()
  await getPaymentTypeList()
  await getEmployeeList()
  if (params.value.additional_amount_sum) {
    changeAdditionalBonusSum()
  }
  $clearLoading()
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('product'), value: 'product_name' },
  { text: t('barcode'), value: 'barcode' },
  { text: t('articule'), value: 'articule' },
  { text: t('price'), value: 'selling_price_input' },
  { text: t('bonusOnSale'), value: 'bonusOnSale' },
  { text: t('quantity'), value: 'count' },
  { text: t('cost'), value: 'selling_price_sum' },
  {
    text: t('delete'),
    value: 'actions',
    width: '150px',
  },
])

const headersForSelectableResponse = ref([
  {
    text: '№',
    value: 'index',
    width: '30px',
  },
  { text: t('product'), value: 'product_name' },
  { text: t('barcode'), value: 'barcode' },
  { text: t('price'), value: 'selling_price_sum' },
  { text: t('quantity'), value: 'count' },
  {
    text: t('choose'),
    value: 'actions',
    width: '150px',
  },
])
</script>

<style scoped lang="scss">
@import '@/assets/styles/pages/direct-sale.scss';
</style>
