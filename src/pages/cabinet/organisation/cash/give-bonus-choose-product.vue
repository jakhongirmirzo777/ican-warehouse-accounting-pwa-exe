<template>
  <div class="direct-sale">
    <VBreadcrumb class="mb-18" :list="breadcrumbs" />
    <div class="d-flex align-center mb-15">
      <VBtn @click="clearAllAndBack" min-width="32px">
        <VIcon color="#868EAA" size="16" icon="arrow-left" />
      </VBtn>
      <VText class="mb-10 ml-16" tag="h2" weight="600" color="#0E1E56">
        {{ t('chooseProductForBonus') }}
      </VText>
    </div>
    <VCard class="direct-sale__body">
      <Form ref="cashRegisterRef">
        <VRow>
          <VCol md="6">
            <form @submit.prevent="startFilter">
              <VRow>
                <VCol md="4" class="direct-sale__search">
                  <VSelect
                    :label="$t('warehouses')"
                    :items="storeList"
                    item-text="name"
                    item-value="id"
                    :disabled="items?.length >= 1"
                    clearable
                    autocomplete
                    v-model="params.store_id"
                  />
                  <v-card v-if="isManyRes" class="direct-sale__search__body">
                    <VTable
                      :items="responseSearch"
                      :headers="headersForSelectableResponse"
                      clickable
                      @clicked="selectSearchedResponse"
                    />
                    <VCardAction>
                      <VSpacer />
                      <VBtn
                        @click="cancelChoseSearchResponse"
                        text
                        outlined
                        color="danger"
                        class="mr-10"
                        >{{ $t('cancel') }}</VBtn
                      >
                    </VCardAction>
                  </v-card>
                </VCol>
                <VCol md="6">
                  <VInput
                    :label="$t('search')"
                    v-model="params.search"
                    :disabled="items?.length >= 1"
                    clearable
                  />
                </VCol>
                <VCol md="2">
                  <VBtn
                    style="display: flex"
                    min-width="40px"
                    color="primary"
                    class="mb-20 mb-md-0 justify-center align-center"
                    type="submit"
                    :disabled="
                      !params.search || !params.store_id || items?.length >= 1
                    "
                  >
                    <VIcon size="24" icon="search-solid" />
                  </VBtn>
                </VCol>
              </VRow>
            </form>
          </VCol>
          <VCol md="6">
            <VRow>
              <VCol md="4">
                <VInput
                  :label="$t('fullNameClient')"
                  v-model="form.full_name"
                  clearable
                />
              </VCol>
              <VCol md="4">
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
              <VCol md="4">
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
          </VCol>
        </VRow>
      </Form>
      <VLine class="mb-20" />
      <VTable :headers="headers" :items="items">
        <template #item.actions="{ iy }">
          <VBtn :class="['ml-2']" small @click="deleteItem(iy)">
            <VIcon size="12" icon="delete" />
          </VBtn>
        </template>
        <template #item.selling_price_input="{ item }">
          <div class="d-flex align-center">
            <VInput
              v-model="item.selling_price_sum"
              :rules="
                !item.is_bonus
                  ? `min_value:${item.selling_price_min[currency]}`
                  : ''
              "
              :name="$t('price')"
              @update:modelValue="changeSellPrice"
              type="number"
              class="mt-18"
              :disabled="item.is_bonus"
            />
          </div>
        </template>
        <template #item.selling_price_sum="{ item }">
          <div>
            {{
              $moneyFormatWithComma(+item.selling_price_sum * +item.sell_count)
            }}
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
              :class="{ disabled: availableBonus && !item.is_bonus }"
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
      <div
        v-if="payments.length"
        class="mt-10 mb-15 direct-sale__body__payment-text"
      >
        {{ $t('totalPayable') }}:
        <b class="direct-sale__body__payment-text__amount">{{
          allPriceWithFormat
        }}</b>
      </div>
      <VLine v-if="payments.length" class="mb-10" />
      <div
        v-for="(item, i) in payments"
        :key="`payments-${i}`"
        class="mb-10 direct-sale__body__payment-text"
      >
        <span v-if="item.type === PAYMENT_TYPE_ADDITIONAL_OR_MAIN.main">
          {{ item.name }}:
        </span>
        <span v-else>{{ $t('additionalAmount') }}: </span>
        <b class="direct-sale__body__payment-text__amount">{{
          $moneyFormatWithComma(item.amount)
        }}</b>
      </div>
      <VLine class="my-20" />
      <VRow class="mt-5">
        <VSpacer />
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
      is-give-bonus
      @saved-payment-type-dialog="savedPaymentTypeDialog"
      @closed-dialog="closedDialog"
    />
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

import { computed, ref, onBeforeUnmount } from 'vue'
import router from '@/router'
import {
  GIVE_BONUS,
  PAYMENT_TYPE_ADDITIONAL_OR_MAIN,
  ROLES,
} from '@/utils/constants'
import { $localePath } from '@/plugins/i18n'
import { useI18n } from 'vue-i18n'
import {
  checkBonus,
  fetchDirectSale,
  getPaymentTypes,
  submitGiveBonus,
} from '@/services/cabinet/CashService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { fetchWarehouseList } from '@/services/cabinet/WarehousesService'
import { fetchEmployeeList } from '@/services/cabinet/EmployeesService'
import { useUserService } from '@/plugins/user-service'
import {
  $clearNonDigits,
  $debounce,
  $moneyFormatWithComma,
  $fixedNumber,
} from '@/utils/pure-functions'
import { getCurrencyList } from '@/services/cabinet/ReferenceCurrenciesService'
import type {
  CheckBonusType,
  DirectSaleDataItemType,
  DirectSaleOptionsType,
  GiveBonusFormType,
  PaymentsType,
} from '@/types/cabinet/CashTypes'
import type { CurrencyKeyList } from '@/types/cabinet/ReferenceCurrenciesTypes'
import { useStorageService } from '@/plugins/storage-service'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage, $errorMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()
const { set, get, remove } = useStorageService()

const { user } = useUserService()

//static variables

const FORM = {
  currency_id: '',
  full_name: '',
  total_amount: '',
  client_type: '',
  check_numbers: [],
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

const CASH_REGISTER_KEY = 'CASH_REGISTER'
const PAYMENTS = 'PAYMENTS'

const queries = getQuery(['search', 'store_id', 'additional_amount_sum'])
clearQuery(['search', 'store_id', 'additional_amount_sum'])
const { t } = useI18n()

const params = ref<DirectSaleOptionsType>({
  search: queries.search || '',
  store_id: +queries.store_id || '',
  additional_amount_sum: queries.additional_amount_sum || '',
})

const breadcrumbs = [
  {
    name: t('cashRegister'),
  },
  {
    name: t('saleInBonus'),
  },
  {
    name: t('chooseProductForBonus'),
  },
]

const currencyList = ref<Array<CurrencyKeyList>>([])
const paymentTypeList = ref<Array<Record<string, any>>>([])
const storeList = ref<Array<Record<string, any>>>([])
const form = ref<GiveBonusFormType>({ ...FORM })
const payment_type = ref('')
const items = ref<DirectSaleDataItemType[]>([])
const responseSearch = ref<DirectSaleDataItemType[]>([])
const choseResponseSearch = ref<DirectSaleDataItemType[]>([])
const payments = ref<Array<PaymentsType>>([])
const allCellingPrice = ref(0)
const currency = ref('UZS')
const STORAGE_ITEMS = ref<Record<string, any>>({})
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
const paymentTypeModalRef = ref()

const isOrganisation = computed(() => user.value?.type === ROLES.ORGANISATION)
const allPriceWithFormat = computed(() => {
  let price = 0
  payments.value.forEach((p) => {
    const amount =
      typeof p.amount === 'string' ? +$clearNonDigits(p.amount) : p.amount
    price += amount
  })
  return $moneyFormatWithComma(price)
})

const availableBonus = computed(() => {
  let count = false
  items.value.forEach((p) => {
    if (p.is_bonus) count = true
  })
  return count
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
    form.value.products[i].sold = $fixedNumber(p.price)
    if (p.sell_count) form.value.products[i].count = p.sell_count
    if (p.is_bonus) {
      form.value.products[i].is_bonus = true
      form.value.products[i].bonus_id = p.bonus_id
      form.value.products[i].sold = 0
    }
  })
  if (allPriceWithFormat.value) {
    const additional = $clearNonDigits(allPriceWithFormat.value.toString())
    form.value.additional_amount_sum = $fixedNumber(additional)
  }
  if (allCellingPrice.value)
    form.value.total_amount = $fixedNumber(allCellingPrice.value)
  if (payments.value && payments.value.length)
    form.value.payments = payments.value.map((p) => {
      return {
        payment_type: p.payment_type,
        amount: p.amount,
      }
    })
  if (STORAGE_ITEMS.value?.check_numbers?.length)
    form.value.check_numbers = STORAGE_ITEMS.value.check_numbers
  if (STORAGE_ITEMS.value?.client_type)
    form.value.client_type = STORAGE_ITEMS.value.client_type
  if (STORAGE_ITEMS.value?.counterparty_id)
    form.value.counterparty_id = STORAGE_ITEMS.value.counterparty_id
  if (STORAGE_ITEMS.value?.pnfl) form.value.pnfl = STORAGE_ITEMS.value.pnfl
  if (STORAGE_ITEMS.value?.total_amount)
    form.value.total_amount = $fixedNumber(
      $clearNonDigits(STORAGE_ITEMS.value.total_amount)
    )
  if (form.value.payments && !form.value.payments.length) {
    delete form.value.payments
  }
  if (!Object.keys(validate).length) {
    $showLoading()
    try {
      await submitGiveBonus(form.value)
      $successMessage(t('notifications.addedSuccessfully'))
      removeStorageItems()
      await router.push($localePath('/cabinet/give-bonus'))
    } catch (err) {
      $setResponseErrors(err)
      $setFormErrors(err)
    } finally {
      $clearLoading()
    }
  }
}

const clearAllAndBack = () => {
  removeStorageItems()
  router.go(-1)
}

const removeStorageItems = () => {
  remove(PAYMENTS)
  remove(CASH_REGISTER_KEY)
  remove(GIVE_BONUS)
}

const savedPaymentTypeDialog = (val: Array<PaymentsType>) => {
  clearMainPayments()
  payments.value.push(...val)
  payment_type.value = ''
  if (items.value.length) checkBonusProduct(items.value[0])
  SET_PAYMENTS()
}

const closedDialog = () => {
  if (!payments.value.length) items.value = []
}

const startFilter = async () => {
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

const selectSearchedResponse = (item: DirectSaleDataItemType) => {
  addItemForTable(item)
  isManyRes.value = false
  clearFilter()
  clearMainPayments()
  changeSellPrice()
}

const addItemForTable = (item: DirectSaleDataItemType) => {
  checkBonusProduct(item)
  items.value.push(item)
}

const cancelChoseSearchResponse = () => {
  isManyRes.value = false
  choseResponseSearch.value = []
  responseSearch.value = []
}

const fetchData = async () => {
  try {
    const { data } = await fetchDirectSale(params.value)
    if (!data.length) return $errorMessage(t('dataNotFound'))
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
      if (value && value.length) addItemForTable(value[0])
      clearMainPayments()
      changeSellPrice()
      clearFilter()
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

const checkBonusProduct = async (item: DirectSaleDataItemType) => {
  $showLoading()
  const options: CheckBonusType = {
    all_amount: +$clearNonDigits(STORAGE_ITEMS.value.total_amount),
    selling_price_sum: item.selling_price_sum,
    client_type: STORAGE_ITEMS.value.client_type,
  }
  const currencyItem = currencyList.value.find((p) => p.key === currency.value)
  if (currencyItem && currencyItem.id) options.currency_id = currencyItem.id
  let additionalAmount = 0
  if (payments.value.length) {
    payments.value.forEach((p) => {
      additionalAmount += +p.amount
    })
  }
  if (additionalAmount) options.additional_amount_sum = additionalAmount
  try {
    const {
      data: { data },
    } = await checkBonus(options)
    if (items.value?.length) {
      items.value[0].isBonus = items.value[0].product_id
      items.value[0].bonus_id = data.id
      items.value[0].is_bonus = true
      items.value[0].sell_count = 1
    }
  } catch (err: any) {
    const errors = err?.response?.data?.errors
    if (errors && errors.additional_amount && errors.bonus_amount) {
      paymentTypeModalRef.value.openDialog(
        paymentTypeList.value,
        errors.additional_amount
      )
    }
    if (items.value.length) {
      items.value = items.value.map((p) => {
        p.isBonus = 0
        p.is_bonus = false
        return p
      })
    }
    $setResponseErrors(err)
  }
  changeSellPrice()
  $clearLoading()
}

const deleteItem = (index: number) => {
  items.value.splice(index, 1)
  $successMessage(t('notifications.deletedSuccessfully'))
  payments.value = []
  SET_PAYMENTS()
  changeSellPrice()
}

const clearMainPayments = () => {
  payments.value = payments.value.filter(
    (p) => p.type !== PAYMENT_TYPE_ADDITIONAL_OR_MAIN.main
  )
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
  items.value = []
  payments.value = []
  SET_ITEMS()
  SET_PAYMENTS()
})

const SET_ITEMS = () => {
  localStorage.setItem(CASH_REGISTER_KEY, JSON.stringify(items.value))
}

const GET_ITEMS = () => {
  const items = localStorage.getItem(CASH_REGISTER_KEY)
  if (items) return JSON.parse(items)
  return null
}

const SET_PAYMENTS = () => {
  localStorage.setItem(PAYMENTS, JSON.stringify(payments.value))
}

const GET_PAYMENTS = () => {
  const payments = localStorage.getItem(PAYMENTS)
  if (payments) return JSON.parse(payments)
  return []
}

const clearFilter = () => {
  params.value.search = ''
  addQuery(params.value)
}

const useFetchData = async () => {
  $showLoading()
  if (GET_ITEMS()) {
    items.value = GET_ITEMS()
    changeSellPrice()
  }
  if (GET_PAYMENTS()) {
    payments.value = GET_PAYMENTS()
  }
  await fetchCurrencyList()
  await fetchStoreList()
  await getPaymentTypeList()
  await getEmployeeList()
  const giveItem = localStorage.getItem(GIVE_BONUS)
  if (giveItem) {
    STORAGE_ITEMS.value = JSON.parse(giveItem)
    if (STORAGE_ITEMS.value.full_name)
      form.value.full_name = STORAGE_ITEMS.value.full_name
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
