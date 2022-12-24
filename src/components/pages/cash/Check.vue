<template>
  <div id="cashCheck" class="check">
    <div style="width: 287px; background: white; padding: 20px">
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 25px 0 35px 0;
        "
      >
        <img src="../../../assets/images/check_icon.svg" alt="" />
      </div>
      <div style="margin-bottom: 20px">
        <VText tag="div" size="13" color="black" style="text-align: center"
          >{{ $t('check') }} №{{ data.check_number }}</VText
        >
        <VText
          tag="div"
          size="13"
          style="margin-bottom: 3px; text-align: center"
          color="black"
        >
          {{ $t('companyNameForCheck') }}</VText
        >
        <VText tag="div" style="text-align: center" size="13" color="black">
          {{ $t('addressForCheck') }}</VText
        >
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        "
      >
        <VText size="13" tag="div" color="black">{{ $t('dateAndTime') }}</VText>
        <VText size="13" tag="div" color="black">{{ data.sale_date }}</VText>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        "
        v-for="(payment, i) in data.payments"
        :key="`payment-${i}`"
      >
        <VText size="13" tag="div" color="black">
          {{ $t('typePayment') }}:</VText
        >
        <VText size="13" tag="div" color="black">{{
          payment.payment_type
        }}</VText>
      </div>
      <div
        style="
          border-bottom: 1px dashed #000;
          margin-top: 15px;
          margin-bottom: 15px;
        "
      />
      <div v-for="(product, i) in data.products" :key="`product-${i}`">
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          "
        >
          <VText
            size="13"
            tag="div"
            color="black"
            weight="bold"
            style="font-weight: bold"
          >
            {{ $t('productRealName') }}:</VText
          >
          <VText
            size="13"
            tag="div"
            color="black"
            weight="bold"
            style="font-weight: bold"
            >{{ product.product_name }}</VText
          >
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          "
        >
          <VText size="13" tag="div" color="black">
            {{ $t('onePrice') }}:</VText
          >
          <VText size="13" tag="div" color="black">{{
            $moneyFormat(product.sold_sum)
          }}</VText>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          "
        >
          <VText size="13" tag="div" color="black">
            {{ $t('onePrice') }}:</VText
          >
          <VText size="13" tag="div" color="black">{{
            $moneyFormat(product.sell_count)
          }}</VText>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          "
        >
          <VText size="13" tag="div" color="black"> {{ $t('amount') }}:</VText>
          <VText size="13" tag="div" color="black">{{
            $moneyFormat(product.all_sold_sum)
          }}</VText>
        </div>
        <div style="border-bottom: 1px dashed #000; margin-bottom: 15px" />
      </div>
      <div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          "
          v-for="(payment, i) in data.payments"
          :key="`payment2-${i}`"
        >
          <VText
            size="13"
            tag="div"
            color="black"
            weight="bold"
            style="font-weight: bold"
          >
            {{ payment.payment_type }}:</VText
          >
          <VText
            size="13"
            tag="div"
            color="black"
            weight="bold"
            style="font-weight: bold"
            >{{ $moneyFormat(payment.amount_sum) }}</VText
          >
        </div>
      </div>
      <div style="border-bottom: 1px dashed #000; margin-bottom: 15px" />
      <div style="text-align: center">
        <VText
          tag="div"
          size="20"
          color="black"
          weight="bold"
          style="font-weight: bold"
          >{{ $t('payment') }}</VText
        >
        <VText
          tag="div"
          size="20"
          color="black"
          weight="bold"
          style="font-weight: bold"
          >{{ $moneyFormat(data.total_amount_sum) }}</VText
        >
        <VText
          tag="div"
          size="20"
          color="black"
          weight="bold"
          style="font-weight: bold"
          >{{ $t('approved') }}</VText
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import { defineExpose, defineProps } from 'vue'
import { $printScreen } from '@/utils/pure-functions'

defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const print = () => {
  $printScreen('cashCheck', '')
}

defineExpose({ print })
</script>

<style lang="scss" scoped>
@import '@/assets/styles/pages/check.scss';
</style>
