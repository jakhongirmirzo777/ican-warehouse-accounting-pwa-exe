<template>
  <div>
    <div class="pb-17 pt-17">
      <span v-if="item?.sum[show]">{{
        item.sum[show] ? item.sum[show] + ' ' + $t('UZS') : '0'
      }}</span>
      <span
        v-if="
          (show === 'debit' && item.sum.credit) ||
          (show === 'credit' && item.sum.debit)
        "
        >0 {{ $t('UZS') }}</span
      >
    </div>
    <div
      :class="{
        'finance-debit-amount':
          (show === 'debit' && item.usd.credit) ||
          (show === 'credit' && item.usd.debit) ||
          item.usd[show],
      }"
    >
      <span v-if="item?.usd[show]">
        {{ item.usd[show] ? item.usd[show] + ' ' + $t('USD') : '0' }}
      </span>
      <span
        v-if="
          (show === 'debit' && item.usd.credit) ||
          (show === 'credit' && item.usd.debit)
        "
        >0 {{ $t('USD') }}</span
      >
    </div>
    <div
      :class="{
        'finance-debit-amount':
          (show === 'debit' && item.rub.credit) ||
          (show === 'credit' && item.rub.debit) ||
          item.rub[show],
      }"
    >
      <span v-if="item?.rub[show]">
        {{ item.rub[show] ? item.rub[show] + ' ' + $t('RUB') : '0' }}
      </span>
      <span
        v-if="
          (show === 'debit' && item.rub.credit) ||
          (show === 'credit' && item.rub.debit)
        "
        >0 {{ $t('RUB') }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FinanceAccountDataItemType } from '@/types/cabinet/FinancialAccountingTypes'
import type { PropType } from 'vue'

type ShowText = 'debit' | 'credit' | 'balance'

defineProps({
  item: {
    type: Object as PropType<FinanceAccountDataItemType>,
  },
  show: {
    type: String as PropType<ShowText>,
  },
})
</script>

<style scoped lang="scss">
@import '../../../assets/styles/pages/finance-accounting';
</style>
