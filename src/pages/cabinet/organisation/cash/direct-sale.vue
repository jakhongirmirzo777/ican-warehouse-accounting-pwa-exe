<template>
  <div class="direct-sale">
    <VBreadcrumb class="mb-18" :list="breadcrumbs" />
    <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
      {{ t('directSale') }}
    </VText>
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
                    :disabled="!params.search || !params.store_id"
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
        <template #item.actions="{ item, iy }">
          <VBtn
            :class="['ml-2', { disabled: item.is_bonus }]"
            small
            @click="deleteItem(iy)"
          >
            <VIcon size="12" icon="delete" />
          </VBtn>
        </template>
        <template #item.selling_price_input="{ item }">
          <div class="d-flex align-center">
            <VInput
              label=""
              v-model="item.selling_price_sum"
              :rules="
                !item.is_bonus
                  ? `min_value:${item.selling_price_min[currency]}`
                  : ''
              "
              :name="$t('price')"
              @update:modelValue="changeAdditionalBonusSum"
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
              @change="
                ($event) => checkBonusProduct(item, iy, false, null, '', $event)
              "
              :true-value="item.product_id"
              :false-value="0"
              :class="{ disabled: availableBonus && !item.is_bonus }"
              hide-details
            />
          </div>
        </template>
        <template #item.sell_count="{ item }">
          <VCounter
            :class="{ disabled: item.is_bonus }"
            v-model="item.sell_count"
            :disabled-plus="item.sell_count >= item.count"
            :disabled-minus="item.sell_count < 2"
            :disabled="+item.count === 1"
            :mask-length="item.count.toString().length"
            :min="1"
            :max="item.count"
            @update:modelValue="changeAdditionalBonusSum"
          />
        </template>
      </VTable>
      <div class="mt-10 mb-15 direct-sale__body__payment-text">
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
            :disabled="!items.length"
            v-for="(item, i) in paymentTypeList"
            :key="`payment-type-${i}`"
            @click="selectPaymentType(item)"
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
      @check-bonus-with-search="checkBonusWithSearch"
    />
    <BonusOrNotModal
      ref="bonusOrNotRef"
      @check-bonus-product="checkBonusWithSearch"
    />
    <!--    <VBtn @click="$refs.checkRef.print()">Print</VBtn>-->
    <!--    <Check ref="checkRef" />-->
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
// import Check from '@/components/pages/cash/Check.vue'

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
} from '@/utils/pure-functions'
import { getCurrencyList } from '@/services/cabinet/ResourcesServices'
import type {
  DirectSaleDataItemType,
  DirectSaleFormType,
  DirectSaleOptionsType,
  CheckBonusType,
  PaymentsType,
} from '@/types/cabinet/CashTypes'
import type { CurrencyKeyList } from '@/types/cabinet/ReferenceCurrenciesTypes'
import { useStorageService } from '@/plugins/storage-service'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage, $errorMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()
const { get, set, remove } = useStorageService()

const { user } = useUserService()

//static variables

const FORM = {
  currency_id: '',
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
  if (!form.value?.user_id && isOrganisation.value) {
    validate.user_id = t('validation.required', {
      field: t('employees'),
    })
  }
  const validateValues = Object.keys(validate)
  if (validateValues.length) {
    cashRegisterRef.value.setErrors(validate)
  }
  const isPayment = payments.value.filter(
    (p) => p.type === PAYMENT_TYPE_ADDITIONAL_OR_MAIN.main
  )
  if (!payments.value.length || !isPayment.length) {
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
    form.value.products[i].sold = fixedNumber(p.selling_price_sum)
    if (p.sell_count) form.value.products[i].count = p.sell_count
    if (p.is_bonus) {
      form.value.products[i].is_bonus = true
      form.value.products[i].bonus_id = p.bonus_id
      form.value.products[i].sold = 0
    }
  })
  const addition_sum = payments.value.find(
    (p) => p.type === PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional
  )
  if (addition_sum?.amount) {
    const additional = $clearNonDigits(addition_sum.amount.toString())
    form.value.additional_amount_sum = fixedNumber(additional)
  }
  if (allCellingPrice.value)
    form.value.total_amount = fixedNumber(allCellingPrice.value)
  if (payments.value) form.value.payments = payments.value
  if (!Object.keys(validate).length) {
    $showLoading()
    try {
      await submitDirectSale(form.value)
      form.value = { ...FORM }
      items.value = []
      params.value.additional_amount_sum = ''
      params.value.search = ''
      params.value.store_id = ''
      payments.value = []
      payment_type.value = ''
      paymentTypeErrorMessage.value = null
      addQuery(params.value)
      cancelChoseSearchResponse()
      $successMessage(t('notifications.addedSuccessfully'))
      changeSellPrice()
      cashRegisterRef.value.resetForm()
      payments.value = []
      SET_PAYMENTS()
    } catch (err) {
      $setResponseErrors(err)
      $setFormErrors(err)
    } finally {
      $clearLoading()
    }
  }
}

const savedPaymentTypeDialog = (val: Array<PaymentsType>) => {
  clearMainPayments()
  payments.value.push(...val)
  payment_type.value = ''
  SET_PAYMENTS()
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
  let index = -1
  let isBonus = false
  items.value.forEach((p, i) => {
    if (
      p.store_id === item.store_id &&
      p.product_id === item.product_id &&
      !p.is_bonus
    ) {
      index = i
    } else if (
      p.store_id === item.store_id &&
      p.product_id === item.product_id &&
      p.is_bonus
    ) {
      isBonus = true
    }
  })
  if (isBonus) {
    $errorMessage(t('selectedProductAvailableList'))
    return
  }
  if (index > -1 && !isBonus) bonusOrNotRef.value.openDialog(item)
  else {
    items.value.push(item)
    isManyRes.value = false
  }
  clearFilter()
  clearMainPayments()
  changeSellPrice()
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
      let index = -1
      let isBonus = false
      items.value.forEach((p, i) => {
        if (
          p.store_id === value[0].store_id &&
          p.product_id === value[0].product_id
        ) {
          index = i
        }
        if (
          p.store_id === value[0].store_id &&
          p.product_id === value[0].product_id &&
          p.bonus_id
        ) {
          isBonus = true
        }
      })
      if (isBonus) {
        $errorMessage(t('selectedProductAvailableList'))
        clearFilter()
        return
      }
      if (index > -1) {
        // items.value[index].sell_count++
        bonusOrNotRef.value.openDialog(value[0])
        return
      } else {
        items.value.push(...value)
        clearMainPayments()
      }
      $successMessage(t('notifications.addedSuccessfully'))
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

const selectPaymentType = (item: Record<string, any>) => {
  paymentTypeErrorMessage.value = null
  payment_type.value = item.type
  clearMainPayments()
  payments.value.push({
    payment_type: item.type,
    name: item.name,
    type: PAYMENT_TYPE_ADDITIONAL_OR_MAIN.main,
    amount: allCellingPrice.value,
  })
}

const changeAdditionalBonusSum = $debounce(() => {
  const addition_sum = payments.value.find(
    (p) => p.type === PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional
  )
  let amount = 0
  if (addition_sum && addition_sum.amount) amount = +addition_sum.amount | 0
  let counter = 0
  if (items.value) {
    items.value.forEach((p, i) => {
      if (p.is_bonus && p.isBonus) {
        counter++
        checkBonusProduct(
          p,
          i,
          true,
          amount,
          addition_sum?.payment_type,
          0,
          true
        )
      }
    })
    addQuery(params.value)
    if (counter === 0) {
      changeSellPrice()
    }
  }
}, 500)

const bonusRepeatCodeBody = (
  item: DirectSaleDataItemType,
  data: any,
  additional_amount_sum?: number,
  payment_type?: string
) => {
  item.isBonus = item.product_id
  item.bonus_id = data.id
  item.is_bonus = true
  item.selling_price_sum = 0
  item.sell_count = 1
  payments.value = []
  if (additional_amount_sum) directSaleBonusRef.value.closeDialog()
  if (payment_type && additional_amount_sum) {
    payments.value.push({
      payment_type,
      type: PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional,
      amount: additional_amount_sum,
    })
    SET_PAYMENTS()
  }
}

const bonusStartCheckRepeatCode = (
  item: DirectSaleDataItemType,
  additional_amount_sum?: number,
  main = false,
  recheck?: boolean
) => {
  let allPrice = 0
  if (items.value.length) {
    items.value.forEach((p) => {
      if (
        (main && !p.is_bonus && p.product_id !== item.product_id) ||
        (!main && !p.is_bonus)
      ) {
        allPrice += +p.selling_price_sum * +p.sell_count
      }
    })
  }
  allPrice = +fixedNumber(allPrice)
  const options: CheckBonusType = {
    all_amount: allPrice,
    selling_price_sum: recheck
      ? item.price
      : fixedNumber(item.selling_price_sum),
    client_type: CLIENT_TYPES.individual,
  }
  if (additional_amount_sum) {
    options.additional_amount_sum = form.value.additional_amount_sum =
      fixedNumber(additional_amount_sum)
  }
  const currencyItem = currencyList.value.find((p) => p.key === currency.value)
  if (currencyItem && currencyItem.id) options.currency_id = currencyItem.id

  return {
    allPrice,
    options,
  }
}

const checkBonusProduct = async (
  item: DirectSaleDataItemType,
  index: number,
  changeAdditional?: boolean,
  additional_amount_sum?: number,
  payment_type?: string,
  $event?: number,
  recheck?: boolean
) => {
  $showLoading()
  if (changeAdditional || !item.is_bonus) {
    const { allPrice, options } = bonusStartCheckRepeatCode(
      item,
      additional_amount_sum,
      true,
      recheck
    )
    try {
      if (allPrice) {
        const {
          data: { data },
        } = await checkBonus(options)
        bonusRepeatCodeBody(item, data, additional_amount_sum, payment_type)
      } else if ((!allPrice || allPrice < 1) && !item.is_bonus) {
        $errorMessage(t('notifications.amountInsufficient'))
        if (!changeAdditional) {
          setTimeout(() => {
            items.value[index].isBonus = 0
          }, 200)
        }
      } else {
        item.isBonus = 0
        item.bonus_id = 0
        item.is_bonus = false
        const indexWithType = payments.value
          .map((p) => p.type)
          .indexOf(PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional)

        if (indexWithType > -1) payments.value.splice(indexWithType, 1)
      }
    } catch (err: any) {
      const errors = err?.response?.data?.errors
      if (errors && errors.additional_amount && errors.bonus_amount) {
        directSaleBonusRef.value.openDialog(
          err.response.data.errors,
          index,
          item
        )
        items.value[index].isBonus = 0
      } else {
        directSaleBonusRef.value.closeDialog()
        item.is_bonus = false
        item.isBonus = 0
        item.bonus_id = 0
        item.selling_price_sum = item.price
        checkPayments()
      }
      $setResponseErrors(err)
    }
  } else if (item.is_bonus) {
    let count = 0
    items.value.forEach((p) => {
      if (p.product_id === item.product_id) {
        count++
      }
    })
    if (count > 1) {
      items.value.splice(index, 1)
    } else {
      item.is_bonus = false
      item.isBonus = 0
      item.bonus_id = 0
      item.selling_price_sum = item.price
      checkPayments()
    }
  }
  if ($event === 0 && payments.value.length && !recheck) {
    checkPayments()
  }
  changeSellPrice()
  $clearLoading()
}

const checkPayments = () => {
  let additionalIndex = -1
  payments.value.forEach((p, i) => {
    if (p.type === PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional) {
      additionalIndex = i
    }
  })
  if (additionalIndex > -1) payments.value.splice(additionalIndex, 1)
}

const checkBonusWithSearch = async (
  item: DirectSaleDataItemType,
  additional_amount_sum?: number,
  payment_type?: string
) => {
  const { options } = bonusStartCheckRepeatCode(item, additional_amount_sum)
  try {
    const {
      data: { data },
    } = await checkBonus(options)
    bonusRepeatCodeBody(item, data, additional_amount_sum, payment_type)
    items.value.push(item)
    if (isManyRes.value) isManyRes.value = false
    changeSellPrice()
    bonusOrNotRef.value.closeDialog()
    clearFilter()
  } catch (err: any) {
    bonusOrNotRef.value.closeDialog()
    const errors = err?.response?.data?.errors
    if (errors && errors.additional_amount && errors.bonus_amount) {
      directSaleBonusRef.value.openDialog(
        err.response.data.errors,
        0,
        item,
        true
      )
    } else {
      directSaleBonusRef.value.closeDialog()
    }
    $setResponseErrors(err)
  }
}

const deleteItem = (index: number) => {
  const addition_sum = payments.value.find(
    (p) => p.type === PAYMENT_TYPE_ADDITIONAL_OR_MAIN.additional
  )
  let amount = 0
  if (addition_sum && addition_sum.amount) amount = +addition_sum.amount | 0
  items.value.splice(index, 1)
  if (items.value.length === 1 && items.value[0].is_bonus) {
    items.value[0].is_bonus = false
    items.value[0].bonus_id = 0
    items.value[0].isBonus = 0
    items.value[0].selling_price_sum = items.value[0].price
    SET_ITEMS()
    checkPayments()
  } else {
    items.value.forEach((p, i) => {
      if (p.is_bonus && p.bonus_id) {
        checkBonusProduct(p, i, true, amount, '', 0, true)
      }
    })
  }
  $successMessage(t('notifications.deletedSuccessfully'))
  // payments.value = []
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
  remove(CASH_REGISTER_KEY)
  remove(PAYMENTS)
})

const SET_ITEMS = () => {
  set(CASH_REGISTER_KEY, items.value)
}

const GET_ITEMS = (): any => {
  const items = get(CASH_REGISTER_KEY)
  if (items) return items
  return null
}

const SET_PAYMENTS = () => {
  set(PAYMENTS, payments.value)
}

const GET_PAYMENTS = (): any => {
  const payments = get(PAYMENTS)
  if (payments) return payments
  return []
}

const clearFilter = () => {
  params.value.search = ''
  addQuery(params.value)
}

const fixedNumber = (price: number | string) => {
  const checkNumber =
    typeof price === 'string' ? parseInt(price).toFixed() : price.toFixed()
  const wholePartNumberLength = checkNumber.length
  const totalLengthPrice =
    typeof price === 'string' ? price.length - 1 : price.toString().length - 1
  if (totalLengthPrice - wholePartNumberLength > 2) {
    return typeof price === 'string'
      ? parseInt(price).toFixed(2)
      : price.toFixed(2)
  } else {
    return price
  }
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
  { text: t('quantity'), value: 'sell_count' },
  { text: t('inStock'), value: 'count' },
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
@import '../../../../assets/styles/pages/direct-sale.scss';
</style>
