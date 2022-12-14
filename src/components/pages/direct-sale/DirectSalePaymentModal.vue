<template>
  <VModal v-model="dialog" width="660" :title="$t('paymentDifferentWays')">
    <h4 class="mb-20">
      {{ $t('totalPayable') }}: <b class="total-price">{{ totalPrice }}</b>
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
                type="money"
                :name="`amount_${i}`"
                v-model="item.amount"
                @input="($event) => changesAmount($event, item)"
              />
            </VCol>
          </VRow>
        </div>
      </div>
      <div class="amount-exceeded">
        <span v-if="errorMessage">{{ errorMessage }}</span>
        <span v-if="errorMessageNonAmount">{{ errorMessageNonAmount }}</span>
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

import { computed, ref, watch } from 'vue'
import { $clearNonDigits } from '@/utils/pure-functions'
import { useI18n } from 'vue-i18n'
import type { PaymentsType } from '@/types/cabinet/DirectSaleTypes'
import { useNotificationService } from '@/plugins/notification-service'
import { PAYMENT_TYPE_ADDITIONAL_OR_MAIN } from '@/utils/constants'

const { $successMessage } = useNotificationService()

const { t } = useI18n()

const emits = defineEmits(['saved-payment-type-dialog'])

const dialog = ref(false)
const totalPrice = ref('')
const paymentsTypes = ref<Array<Record<string, any>>>([])
const errorMessageNonAmount = ref('')

//refs

const typesRef = ref()

watch(dialog, (val) => {
  if (!val) {
    paymentsTypes.value = []
    totalPrice.value = ''
  }
})

const selectedPaymentType = (e: string | boolean, val: Record<string, any>) => {
  if (errorMessageNonAmount.value) errorMessageNonAmount.value = ''
  if (e && !val.amount) {
    let count = 0
    paymentsTypes.value.forEach((p) => {
      if (p.amount && typeof p.amount === 'number') count += +p.amount
      if (p.amount && typeof p.amount === 'string') {
        count += +$clearNonDigits(p.amount)
      }
    })
    if (!count) {
      val.amount = +$clearNonDigits(totalPrice.value)
      typesRef.value.resetForm()
    }
    if (count > 1) {
      val.amount = +$clearNonDigits(totalPrice.value) - count
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
  allPrice: string
) => {
  paymentsTypes.value = JSON.parse(JSON.stringify(paymentTypeList))
  totalPrice.value = allPrice
  dialog.value = true
}

const saveTypes = () => {
  let count = 0
  paymentsTypes.value.forEach((p) => {
    if (p.amount) count++
  })
  if (!count) {
    errorMessageNonAmount.value = t('paymentAmountNotFilled')
  } else {
    const resultArr: Array<PaymentsType> = []
    paymentsTypes.value.forEach((p) => {
      if (p.payment_type && p.amount) {
        resultArr.push({
          payment_type: p.payment_type,
          name: p.name,
          amount:
            typeof p.amount === 'string' ? $clearNonDigits(p.amount) : p.amount,
          type: PAYMENT_TYPE_ADDITIONAL_OR_MAIN.main,
        })
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
    if (p && typeof p.amount === 'string') amount += +$clearNonDigits(p.amount)
    else if (p && typeof p.amount === 'number') amount += +p.amount
  })
  if (amount > +$clearNonDigits(totalPrice.value))
    return t('exceedsErrorMessage')
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
