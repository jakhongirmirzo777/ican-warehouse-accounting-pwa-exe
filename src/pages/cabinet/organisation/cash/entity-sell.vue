<template>
  <div class="direct-sale">
    <VBreadcrumb class="mb-18" :list="breadcrumbs" />
    <Form ref="cashRegisterRef" @submit="submit">
      <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
        {{ t('entitySell') }}
      </VText>
      <VCard class="direct-sale__body">
        <VRow>
          <VCol md="12">
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
                <VCol md="4">
                  <VInput
                    :label="$t('search')"
                    v-model="params.search"
                    clearable
                  />
                </VCol>
                <VCol md="1">
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
                <VCol md="3">
                  <VSelect
                    :label="$t('saleCurrency')"
                    :items="currencyList"
                    item-text="name"
                    item-value="key"
                    @change="changeParams"
                    rules="required"
                    hide-details
                    vid="currency_id"
                    autocomplete
                    v-model="params.currency_id"
                  />
                </VCol>
              </VRow>
            </form>
          </VCol>
          <VCol md="3">
            <VSelect
              :items="counterpartyList"
              item-text="company_name"
              item-value="id"
              rules="required"
              can-add
              @add="$refs.organizationDialogRef.openDialog()"
              vid="counterparty_id"
              @change="changeParams"
              autocomplete
              :label="$t('counterparties')"
              v-model="params.counterparty_id"
              clearable
            />
          </VCol>
          <VCol md="3">
            <VSelect
              :label="$t('invoice')"
              :items="invoiceList"
              item-text="number"
              item-value="id"
              clearable
              can-add
              @add="$refs.organizationInvoiceDialogRef.openDialog()"
              @change="changeParams"
              autocomplete
              rules="required"
              vid="invoice_id"
              v-model="params.invoice_id"
            />
          </VCol>
          <VCol md="3">
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
          <VCol md="3">
            <VSelect
              :label="$t('agreement')"
              :items="contractList"
              item-text="number"
              item-value="id"
              clearable
              can-add
              @add="$refs.organizationContractDialogRef.openDialog()"
              @change="changeParams"
              rules="required"
              vid="contract_id"
              autocomplete
              v-model="params.contract_id"
            />
          </VCol>
        </VRow>
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
          <template #item.selling_price_input="{ item, iy }">
            <div class="d-flex align-center">
              <VInput
                label=""
                v-model="item.selling_price_sum"
                :rules="
                  !item.is_bonus
                    ? `min_value:${item.selling_price_min[params.currency_id]}`
                    : ''
                "
                :name="$t('price')"
                @update:modelValue="changeAdditionalBonusSum"
                type="number"
                :vid="`price-${iy}`"
                class="mt-18"
                :disabled="item.is_bonus"
              />
            </div>
          </template>
          <template #item.selling_price_sum="{ item }">
            <div>
              {{
                $moneyFormatWithComma(
                  +item.selling_price_sum * +item.sell_count
                )
              }}
            </div>
          </template>
          <template #item.bonusOnSale="{ item, iy }">
            <div>
              <VCheckbox
                v-model="item.isBonus"
                :value="item.product_id"
                @change="($event) => checkBonusProduct(item, iy)"
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
        <VLine v-if="additional_sum" class="mb-10" />
        <div
          v-if="additional_sum"
          class="mb-10 direct-sale__body__payment-text"
        >
          <span>{{ $t('additionalAmount') }}: </span>
          <b class="direct-sale__body__payment-text__amount">{{
            $moneyFormatWithComma(additional_sum)
          }}</b>
        </div>
        <VLine class="my-20" />
        <div class="d-flex">
          <VSpacer />
          <VBtn
            :disabled="!items.length"
            color="primary"
            radius="12"
            type="submit"
          >
            {{ $t('makePayment') }}
          </VBtn>
        </div>
      </VCard>
    </Form>
    <DirectSaleBonusModal
      ref="directSaleBonusRef"
      :currency="params.currency_id"
      :paymentTypeList="paymentTypeList"
      :is-payment-type="false"
      @check-bonus-product="checkBonusProduct"
      @check-bonus-with-search="checkBonusWithSearch"
    />
    <BonusOrNotModal
      ref="bonusOrNotRef"
      @check-bonus-product="checkBonusWithSearch"
    />
    <CounterpartyCounterpartiesDialog
      @fetchData="getCounterPartyList"
      ref="organizationDialogRef"
    />
    <CounterpartyInvoicesDialog
      ref="organizationInvoiceDialogRef"
      :counterpartyList="counterpartyList"
      @fetchData="getInvoiceList"
    />
    <CounterpartyContractsDialog
      ref="organizationContractDialogRef"
      :counterpartyList="counterpartyList"
      @fetchData="getCounterpartyContractList"
    />
    <Check ref="checkRef" :data="checkData" />
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
import DirectSaleBonusModal from '@/components/pages/direct-sale/DirectSaleBonusModal.vue'
import BonusOrNotModal from '@/components/pages/direct-sale/BonusOrNotModal.vue'
import CounterpartyCounterpartiesDialog from '@/components/pages/counterparty-organisations/CounterpartyCounterpartiesDialog.vue'
import CounterpartyInvoicesDialog from '@/components/pages/counterparty-invoices/CounterpartyInvoicesDialog.vue'
import CounterpartyContractsDialog from '@/components/pages/counterparty-contracts/CounterpartyContractsDialog.vue'
import Check from '@/components/pages/cash/Check.vue'

import { computed, ref, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  checkBonus,
  fetchDirectSale,
  getPaymentTypes,
  submitEntitySell,
} from '@/services/cabinet/CashService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { fetchWarehouseList } from '@/services/cabinet/WarehousesService'
import { fetchEmployeeList } from '@/services/cabinet/EmployeesService'
import { $debounce, $moneyFormatWithComma } from '@/utils/pure-functions'
import { getCurrencyList } from '@/services/cabinet/ResourcesServices'
import {
  fetchCounterpartyContractList,
  fetchCounterpartyWithContract,
} from '@/services/cabinet/CounterpartyContractsServices'
import { fetchInvoiceList } from '@/services/cabinet/CounterpartyInvoicesService'
import type {
  DirectSaleDataItemType,
  EntitySellFormType,
  DirectSaleOptionsType,
  CheckBonusType,
} from '@/types/cabinet/CashTypes'
import type { CurrencyKeyList } from '@/types/cabinet/ReferenceCurrenciesTypes'
import type {
  CounterpartyListWitContractType,
  CounterpartyContractListType,
} from '@/types/cabinet/CounterpertyContractsTypes'
import type { InvoiceListType } from '@/types/cabinet/CounterpartyInvoiceTypes'

import { CLIENT_TYPES, ROLES } from '@/utils/constants'
import { useStorageService } from '@/plugins/storage-service'
import { useUserService } from '@/plugins/user-service'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage, $errorMessage } = useNotificationService()
const { addQuery, getQuery, clearQuery } = useQuery()
const { get, set, remove } = useStorageService()
//static variables

const { user } = useUserService()

const FORM = {
  currency_id: '',
  counterparty_id: '',
  contract_id: '',
  invoice_id: '',
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

const queries = getQuery([
  'search',
  'store_id',
  'counterparty_id',
  'contract_id',
  'invoice_id',
  'additional_amount_sum',
  'currency_id',
])
clearQuery([
  'search',
  'store_id',
  'counterparty_id',
  'contract_id',
  'invoice_id',
  'additional_amount_sum',
  'currency_id',
])
const { t } = useI18n()

const params = ref<DirectSaleOptionsType>({
  search: queries.search || '',
  store_id: +queries.store_id || '',
  counterparty_id: +queries.counterparty_id || '',
  contract_id: +queries.contract_id || '',
  invoice_id: +queries.invoice_id || '',
  additional_amount_sum: queries.additional_amount_sum || '',
  currency_id: queries.currency_id || 'UZS',
})

const breadcrumbs = [
  {
    name: t('cashRegister'),
  },
  {
    name: t('entitySell'),
  },
]

const currencyList = ref<Array<CurrencyKeyList>>([])
const paymentTypeList = ref<Array<Record<string, any>>>([])
const storeList = ref<Array<Record<string, any>>>([])
const form = ref<EntitySellFormType>({ ...FORM })
const payment_type = ref('')
const items = ref<DirectSaleDataItemType[]>([])
const responseSearch = ref<DirectSaleDataItemType[]>([])
const choseResponseSearch = ref<DirectSaleDataItemType[]>([])
const counterpartyList = ref<Array<CounterpartyListWitContractType>>([])
const contractList = ref<Array<CounterpartyContractListType>>([])
const invoiceList = ref<Array<InvoiceListType>>([])
const checkData = ref<Record<string, any>>({})
const allCellingPrice = ref(0)
const additional_sum = ref<string | number>(0)
const employeeList = ref<
  Array<{
    id: number
    full_name: string
  }>
>([])

const isManyRes = ref(false)

//refs
const cashRegisterRef = ref()
const directSaleBonusRef = ref()
const bonusOrNotRef = ref()
const checkRef = ref()

const allPriceWithFormat = computed(() =>
  $moneyFormatWithComma(allCellingPrice.value)
)

const isOrganisation = computed(() => user.value?.type === ROLES.ORGANISATION)

const availableBonus = computed(() => {
  let count = false
  items.value.forEach((p) => {
    if (p.is_bonus) count = true
  })
  return count
})

const changeParams = () => {
  setTimeout(() => {
    addQuery(params.value)
  }, 200)
}

const submit = async () => {
  const { $setFormErrors } = useFormActions(cashRegisterRef.value)
  const currencyItem = currencyList.value.find(
    (p) => p.key === params.value.currency_id
  )
  if (currencyItem) form.value.currency_id = currencyItem.id
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
  if (allCellingPrice.value)
    form.value.total_amount = fixedNumber(allCellingPrice.value)
  if (additional_sum.value)
    form.value.additional_amount_sum = additional_sum.value
  if (params.value.contract_id)
    form.value.contract_id = params.value.contract_id
  if (params.value.counterparty_id)
    form.value.counterparty_id = params.value.counterparty_id
  if (params.value.invoice_id) form.value.invoice_id = params.value.invoice_id
  $showLoading()
  try {
    const { data } = await submitEntitySell(form.value)
    checkData.value = data
    setTimeout(() => {
      checkRef.value.print()
    }, 200)
    form.value = { ...FORM }
    items.value = []
    params.value.additional_amount_sum = ''
    params.value.counterparty_id = ''
    params.value.contract_id = ''
    params.value.invoice_id = ''
    params.value.store_id = ''
    additional_sum.value = ''
    payment_type.value = ''
    cancelChoseSearchResponse()
    changeSellPrice()
    addQuery(params.value)
    $successMessage(t('notifications.addedSuccessfully'))
    cashRegisterRef.value.resetForm()
  } catch (err) {
    $setResponseErrors(err)
    $setFormErrors(err)
  } finally {
    $clearLoading()
  }
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
  changeSellPrice()
}

const cancelChoseSearchResponse = () => {
  isManyRes.value = false
  choseResponseSearch.value = []
  responseSearch.value = []
}

const getCounterPartyList = async (id: number | null) => {
  try {
    const { data } = await fetchCounterpartyWithContract(id)
    counterpartyList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getInvoiceList = async () => {
  try {
    const { data } = await fetchInvoiceList()
    invoiceList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getCounterpartyContractList = async () => {
  try {
    const { data } = await fetchCounterpartyContractList()
    contractList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
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

const changeAdditionalBonusSum = $debounce(() => {
  if (items.value && items.value.length) {
    let counter = 0
    items.value.forEach((p, i) => {
      if (p.is_bonus && p.isBonus) {
        counter++
        checkBonusProduct(p, i, true, params.value.additional_amount_sum, true)
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
  additional_amount_sum?: number | string
) => {
  item.isBonus = item.product_id
  item.bonus_id = data.id
  item.is_bonus = true
  item.selling_price_sum = 0
  item.sell_count = 1
  if (additional_amount_sum) directSaleBonusRef.value.closeDialog()
  if (additional_amount_sum) {
    additional_sum.value = additional_amount_sum
  }
}

const bonusStartCheckRepeatCode = (
  item: DirectSaleDataItemType,
  additional_amount_sum?: number | string,
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
      : fixedNumber(item.selling_price_sum) ?? fixedNumber(item.price),
    client_type: CLIENT_TYPES.entity,
  }
  if (additional_amount_sum) {
    options.additional_amount_sum =
      form.value.additional_amount_sum =
      params.value.additional_amount_sum =
      additional_sum.value =
        fixedNumber(additional_amount_sum)

    addQuery(params.value)
  }
  const currencyItem = currencyList.value.find(
    (p) => p.key === params.value.currency_id
  )
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
  additional_amount_sum?: number | string,
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
        bonusRepeatCodeBody(item, data, additional_amount_sum)
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
      additional_sum.value = ''
    }
  }
  changeSellPrice()
  $clearLoading()
}

const checkBonusWithSearch = async (
  item: DirectSaleDataItemType,
  additional_amount_sum?: number
) => {
  const { options } = bonusStartCheckRepeatCode(item, additional_amount_sum)
  try {
    const {
      data: { data },
    } = await checkBonus(options)
    bonusRepeatCodeBody(item, data, additional_amount_sum)
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
  items.value.splice(index, 1)
  if (items.value.length === 1 && items.value[0].is_bonus) {
    items.value[0].is_bonus = false
    items.value[0].bonus_id = 0
    items.value[0].isBonus = 0
    items.value[0].selling_price_sum = items.value[0].price
    additional_sum.value = ''
    SET_ITEMS()
  } else {
    items.value.forEach((p, i) => {
      if (p.is_bonus && p.bonus_id) {
        checkBonusProduct(p, i, true, 0, true)
      }
    })
  }
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
  remove(CASH_REGISTER_KEY)
})

const SET_ITEMS = () => {
  set(CASH_REGISTER_KEY, items.value)
}

const GET_ITEMS = (): any => {
  const items = get(CASH_REGISTER_KEY)
  if (items) return items
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
  await fetchCurrencyList()
  await fetchStoreList()
  await getPaymentTypeList()
  await getEmployeeList()
  await getInvoiceList()
  await getCounterpartyContractList()
  await getCounterPartyList(null)
  if (GET_ITEMS()) {
    items.value = GET_ITEMS()
    changeSellPrice()
  }
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
