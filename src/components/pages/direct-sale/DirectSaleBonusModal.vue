<template>
  <VModal v-model="dialog" :title="$t('attention') + '!'" width="520">
    <Form @submit="submit">
      <span v-if="bonusError && bonusError.bonus_amount">
        {{ $t('allowedAmountBonusItem') }}
        <b>{{ bonusError.bonus_amount }}</b> {{ CURRENCIES_LIST[currency] }}.
      </span>
      <br />
      <br />
      <span v-if="bonusError && bonusError.additional_amount">
        {{ $t('youTryingAddProductWithValue') }}
        <b>{{ bonusError.additional_amount }}</b>
        {{ CURRENCIES_LIST[currency] }}.
      </span>
      <div class="mt-30">
        <VSelect
          :label="$t('paymentType')"
          :items="paymentTypeList"
          item-text="name"
          item-value="type"
          rules="required"
          vid="bonusPaymentType"
          clearable
          autocomplete
          v-model="bonusPaymentType"
        />
        <VLine class="my-18" />
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
            {{ $t('payExtra') }}
          </VBtn>
        </div>
      </div>
    </Form>
  </VModal>
</template>

<script setup lang="ts">
import VModal from '@/components/ui/VModal.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'
import VBtn from '@/components/ui/VBtn.vue'
import { Form } from 'vee-validate'

import { ref, defineExpose, defineProps } from 'vue'
import { CURRENCIES_LIST } from '@/utils/constants'
import type { DirectSaleDataItemType } from '@/types/cabinet/DirectSaleTypes'

defineProps({
  currency: {
    type: String,
    default: 'UZS',
  },
  paymentTypeList: {
    type: Array,
  },
})

const emits = defineEmits(['check-bonus-with-search', 'check-bonus-product'])

const bonusError = ref<any>({})
const bonusPaymentType = ref('')
const indexBonus = ref<number | null>(null)
const itemDate = ref<Record<string, any>>({})
const isSearchCheck = ref(false)

const submit = () => {
  if (isSearchCheck.value)
    emits(
      'check-bonus-with-search',
      itemDate.value,
      bonusError.value.additional_amount,
      bonusPaymentType.value
    )
  else
    emits(
      'check-bonus-product',
      itemDate.value,
      indexBonus.value,
      false,
      bonusError.value.additional_amount,
      bonusPaymentType.value
    )
}

const openDialog = (
  val: any,
  index: number,
  item: DirectSaleDataItemType,
  isSearchBonusCheck?: boolean
) => {
  bonusError.value = val
  dialog.value = true
  itemDate.value = item
  indexBonus.value = index
  if (isSearchBonusCheck) isSearchCheck.value = isSearchBonusCheck
}

const closeDialog = () => {
  dialog.value = false
}

const dialog = ref(false)

defineExpose({ openDialog, closeDialog })
</script>
