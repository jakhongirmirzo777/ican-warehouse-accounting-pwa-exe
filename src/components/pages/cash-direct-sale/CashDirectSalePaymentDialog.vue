<template>
  <VModal v-model="dialog" width="660" :title="$t('paymentDifferentWays')">
    <div v-if="isGiveBonus" class="mb-15">
      <ElAlert
        :title="$t('needPayGetProductWarningText')"
        type="warning"
        :closable="false"
      />
    </div>
    <h4 class="mb-20">
      <VText tag="span">{{ $t('totalPayable') }}: </VText>
      <VText tag="b" class="total-price">
        {{ $moneyFormat(totalPrice) }}
      </VText>
    </h4>
    <Form @submit="saveTypes" ref="typesRef">
      <div>
        <div
          v-for="(item, i) in paymentsTypes"
          :key="`payment-types-${i}`"
          class="d-flex align-center justify-space-between"
        >
          <VRow>
            <VCol md="1">
              <VCheckbox
                v-model="item.payment_type"
                :true-value="item.type"
                :false-value="false"
                :name="`payment_type_${i}`"
                @change="($event) => selectedPaymentType($event, item)"
              />
            </VCol>
            <VCol md="4">
              {{ item.name }}
            </VCol>
            <VCol md="7">
              <VInput
                type="text"
                label=""
                :name="`amount_${i}`"
                v-model="item.amount"
                @input="($event) => changesAmount($event, item)"
              />
            </VCol>
          </VRow>
        </div>
      </div>
      <div class="amount-exceeded">
        <ElAlert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          :closable="false"
        />
        <ElAlert
          v-if="errorMessageNonAmount"
          :title="errorMessageNonAmount"
          type="error"
          :closable="false"
        />
      </div>
      <div>
        <VLine class="mb-24" />
        <div class="d-flex justify-end align-center">
          <VBtn
            type="button"
            class="mr-16"
            outlined
            width="130px"
            color="primary"
            radius="12px"
            @click="dialog = false"
          >
            {{ $t('cancel') }}
          </VBtn>
          <VBtn type="submit" color="primary" width="130px" radius="12px">
            {{ $t('save') }}
          </VBtn>
        </div>
      </div>
    </Form>
  </VModal>
</template>

<script setup lang="ts">
import VModal from '@/components/ui/VModal.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'
import VInput from '@/components/ui/VInput.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VLine from '@/components/ui/VLine.vue'
import { Form } from 'vee-validate'
import { ElAlert } from 'element-plus'

import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PaymentsType } from '@/types/cabinet/CashSaleTypes'
import { useNotificationService } from '@/plugins/notification-service'
import { PAYMENT_TYPE_ADDITIONAL_OR_MAIN } from '@/utils/constants'
import { $fixedNumber } from '@/utils/pure-functions'
import VText from '@/components/ui/VText.vue'

const { $successMessage } = useNotificationService()

const { t } = useI18n()

const emits = defineEmits(['saved-payment-type-dialog', 'closed-dialog'])

const dialog = ref(false)
const totalPrice = ref(0)
const paymentsTypes = ref<Array<Record<string, any>>>([])
const errorMessageNonAmount = ref('')

//refs

const typesRef = ref()

defineProps({
  isGiveBonus: {
    type: Boolean,
    default: false,
  },
})

watch(dialog, (val) => {
  if (!val) {
    paymentsTypes.value = []
    totalPrice.value = 0
    emits('closed-dialog')
  }
})

const selectedPaymentType = (e: string | boolean, val: Record<string, any>) => {
  if (errorMessageNonAmount.value) errorMessageNonAmount.value = ''
  if (e && !val.amount) {
    let count = 0
    paymentsTypes.value.forEach((p) => {
      if (p.amount) count += +p.amount
    })
    if (!count) {
      val.amount = +totalPrice.value
      typesRef.value.resetForm()
    }
    if (count > 1) {
      val.amount = +totalPrice.value - +count
    }
  } else val.amount = ''
}

const changesAmount = (val: Event, item: Record<string, any>) => {
  if (errorMessageNonAmount.value) errorMessageNonAmount.value = ''
  const target = val?.target as HTMLInputElement
  const value = target.value
  if (value && !item.payment_type) {
    item.payment_type = item.type
  } else if (!item.amount) {
    item.payment_type = false
  }
}

const openDialog = (
  paymentTypeList: Array<Record<string, any>>,
  allPrice: string | number
) => {
  paymentsTypes.value = JSON.parse(JSON.stringify(paymentTypeList))
  totalPrice.value = +allPrice
  dialog.value = true
}

const saveTypes = () => {
  let count = 0
  let allPrice = 0
  paymentsTypes.value.forEach((p) => {
    if (p.amount) {
      count++
      allPrice += +p.amount
    }
  })
  if (!count) {
    errorMessageNonAmount.value = t('paymentAmountNotFilled')
  } else if (allPrice < +totalPrice.value) {
    errorMessageNonAmount.value = t('amountEnteredLessAmountDue')
  } else {
    const resultArr: Array<PaymentsType> = []
    paymentsTypes.value.forEach((p) => {
      if (p.payment_type && p.amount) {
        resultArr.push({
          payment_type: p.payment_type,
          name: p.name,
          amount: +$fixedNumber(p.amount),
          type: PAYMENT_TYPE_ADDITIONAL_OR_MAIN.main,
        })
        console.log($fixedNumber(p.amount));
      }
    })
    emits('saved-payment-type-dialog', resultArr)
    dialog.value = false
    $successMessage(t('notifications.paidSuccessfully'))
  }
}

const errorMessage = computed(() => {
  let amount = 0
  paymentsTypes.value.forEach((p) => {
    if (p.amount) amount += +p.amount
  })
  const total = totalPrice.value
  if (amount > +total) return t('exceedsErrorMessage')
  return null
})

defineExpose({ openDialog })
</script>

<style scoped>
.amount-exceeded {
  height: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #f94e4f;
}
.total-price {
  color: black;
}
</style>
