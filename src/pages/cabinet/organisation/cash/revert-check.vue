<template>
  <VBreadcrumb class="mb-18" :list="breadcrumbs" />
  <div class="d-flex align-center">
    <VBackBtn class="mb-10" />
    <VText class="mb-10 ml-16" tag="h2" weight="600" color="#0E1E56">
      {{ t('revertDecor') }}
    </VText>
  </div>
  <VCard>
    <Form @submit="submit" ref="revertFormRef">
      <VRow>
        <VCol md="5">
          <form @submit.prevent="searchCheck">
            <VRow>
              <VCol md="5">
                <VSelect
                  :label="$t('salesType')"
                  :items="salesTypeList"
                  item-text="title"
                  item-value="type"
                  clearable
                  autocomplete
                  v-model="form.client_type"
                />
              </VCol>
              <VCol md="5">
                <VInput
                  :label="$t('checkNumber')"
                  v-model="form.check_number"
                  type="number"
                  clearable
                />
              </VCol>
              <VCol md="2">
                <VBtn
                  width="100%"
                  color="primary"
                  type="submit"
                  class="mb-20"
                  :disabled="!form.check_number || !form.client_type"
                >
                  <VIcon icon="search-solid" />
                </VBtn>
              </VCol>
            </VRow>
          </form>
        </VCol>
        <VCol md="7">
          <VRow>
            <VCol md="4">
              <VSelect
                :label="$t('sold')"
                :items="employeeList"
                item-text="full_name"
                item-value="user_id"
                clearable
                disabled
                autocomplete
                v-model="seller_id"
              />
            </VCol>
            <VCol md="4">
              <VSelect
                :items="organisationList"
                item-value="id"
                item-text="name"
                clearable
                disabled
                :label="$t('organisation')"
                v-model="organisation_id"
              />
            </VCol>
            <VCol md="4">
              <VDatepicker
                :label="$t('salesDate')"
                v-model="salesDate"
                disabled
                clearable
              />
            </VCol>
          </VRow>
        </VCol>
        <VCol md="3">
          <VInput
            :disabled="true"
            :label="$t('additionalAmountForBonus')"
            v-model="additional_amount_sum"
            type="money"
          />
        </VCol>
        <VCol md="6" :class="{ disabled: !items.length }">
          <VArea v-model="form.comment" :label="$t('revertReason')" rows="1" />
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
      </VRow>
      <div class="d-flex align-center justify-between mt-10">
        <div>
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
            <span> {{ item.name }}: </span>
            <b class="direct-sale__body__payment-text__amount">{{
              $moneyFormatWithComma(item.amount)
            }}</b>
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <VLine class="my-15" />
      <div class="d-flex justify-between align-center">
        {{ $t('products') }}
        <VBtn
          color="primary"
          type="submit"
          :disabled="
            !form.check_number ||
            !form.client_type ||
            !items.length ||
            !payments.length
          "
        >
          {{ $t('issueRefund') }}
        </VBtn>
      </div>
    </Form>
    <VLine class="my-15" />
    <VTable :headers="headers" :items="items">
      <template #item.is_bonus="{ item }">
        <VCheckbox
          class="disabled"
          v-model="item.is_bonus"
          :true-value="true"
          :false-value="false"
        />
      </template>
      <template #item.sold_sum="{ item }">
        <span v-if="item.sold_sum && item.sold_sum !== '0'">{{
          $moneyFormatWithComma(item.sold_sum)
        }}</span>
        <span v-else> - </span>
      </template>
      <template #item.all_sold_sum="{ item }">
        <span v-if="item.all_sold_sum && item.sold_sum !== '0'">{{
          $moneyFormatWithComma(item.all_sold_sum)
        }}</span>
        <span v-else> - </span>
      </template>
    </VTable>
    <DirectSalePaymentModal
      ref="paymentTypeModalRef"
      @saved-payment-type-dialog="savedPaymentTypeDialog"
    />
  </VCard>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'
import VArea from '@/components/ui/VArea.vue'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'
import DirectSalePaymentModal from '@/components/pages/direct-sale/DirectSalePaymentModal.vue'
import VBackBtn from '@/components/ui/VBackBtn.vue'
import { Form } from 'vee-validate'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchOrganisationsList } from '@/services/cabinet/OrganisationsService'
import { useErrorActions } from '@/composables/set-errors'
import { useLoadingService } from '@/plugins/loading-service'
import { fetchEmployeeList } from '@/services/cabinet/EmployeesService'
import { getPaymentTypes } from '@/services/cabinet/CashService'
import { $moneyFormatWithComma } from '@/utils/pure-functions'
import { useNotificationService } from '@/plugins/notification-service'

import {
  revertCheck,
  searchCheckWith,
} from '@/services/cabinet/RevertCheckServices'
import { useUserService } from '@/plugins/user-service'
import type {
  RevertedCheckDataItemType,
  RevertedCheckFormType,
} from '@/types/cabinet/RevertCheckTypes'
import type { MkoOrganisationListType } from '@/types/cabinet/MkoOrganisationsTypes'
import type { PaymentsType } from '@/types/cabinet/CashTypes'
import { CLIENT_TYPES, ROLES } from '@/utils/constants'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage } = useNotificationService()
const { user } = useUserService()

const FORM = {
  check_number: '',
  client_type: '',
  user_id: null,
  comment: null,
}

const items = ref<RevertedCheckDataItemType[]>([])
const payments = ref<Array<PaymentsType>>([])
const allPriceWithFormat = ref('')
const { t } = useI18n()

const form = ref<RevertedCheckFormType>({
  ...FORM,
})

const salesDate = ref('')
const organisation_id = ref('')
const seller_id = ref('')
const additional_amount_sum = ref('')

const salesTypeList = ref<
  Array<{
    type: string
    title: string
  }>
>([
  { type: CLIENT_TYPES.entity, title: t('entity') },
  { type: CLIENT_TYPES.individual, title: t('individual') },
])

const breadcrumbs = [
  {
    name: t('cashRegister'),
  },
  {
    name: t('revertProduct'),
  },
  {
    name: t('revertDecor'),
  },
]

const organisationList = ref<Array<MkoOrganisationListType>>([])
const paymentTypeList = ref<Array<Record<string, any>>>([])
const employeeList = ref<
  Array<{
    id: number
    full_name: string
  }>
>([])

const isOrganisation = computed(() => user.value?.type === ROLES.ORGANISATION)

//refs

const revertFormRef = ref()

const searchCheck = async () => {
  $showLoading()
  try {
    const { data } = await searchCheckWith(form.value)
    items.value = data.products
    salesDate.value = data.sale_date
    organisation_id.value = data.organisation_id
    seller_id.value = data.seller_user_id
    if (data.additional_amount_sum)
      additional_amount_sum.value = data.additional_amount_sum
    allPriceWithFormat.value = $moneyFormatWithComma(data.total_amount_sum)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
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

const submit = async () => {
  form.value.payments = payments.value.map((p) => {
    return {
      payment_type: p.payment_type,
      amount: p.amount,
    }
  })
  try {
    await revertCheck(form.value)
    form.value = { ...FORM }
    payments.value = []
    allPriceWithFormat.value = ''
    organisation_id.value = ''
    salesDate.value = ''
    seller_id.value = ''
    additional_amount_sum.value = ''
    items.value = []
    revertFormRef.value.resetForm()
    $successMessage(t('notifications.successRevert'))
  } catch (err) {
    $setResponseErrors(err)
  }
}

const getOrganisationsList = async () => {
  try {
    const { data } = await fetchOrganisationsList()
    organisationList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const savedPaymentTypeDialog = (val: Array<PaymentsType>) => {
  payments.value.push(...val)
}

const useFetchData = async () => {
  $showLoading()
  await getOrganisationsList()
  await getEmployeeList()
  await getPaymentTypeList()
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
  { text: t('category'), value: 'category_name' },
  { text: t('articule'), value: 'articule' },
  { text: t('barcode'), value: 'barcode' },
  { text: t('qtySold'), value: 'sell_count' },
  { text: t('qtyReverted'), value: 'returned_count' },
  { text: t('salesBonus'), value: 'is_bonus' },
  { text: t('price'), value: 'sold_sum' },
  { text: t('amount'), value: 'all_sold_sum' },
  { text: t('unit'), value: 'unit_name' },
])
</script>

<style scoped></style>
