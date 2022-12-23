<template>
  <div
    class="check"
    id="cashCheck"
    style="width: 287px; background: white; padding: 20px"
  >
    <template v-if="data">
      <div
        class="check__logo"
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 25px 0 35px 0;
        "
      >
        <img src="../../../assets/images/check_icon.svg" alt="" />
      </div>
      <div class="mb-20" style="margin-bottom: 20px">
        <VText
          tag="div"
          size="13"
          class="mb-3 text-center"
          color="black"
          style="text-align: center"
          >{{ $t('check') }} №{{ data.check_number }}</VText
        >
        <VText
          tag="div"
          size="13"
          class="mb-3 text-center"
          style="margin-bottom: 3px; text-align: center"
          color="black"
        >
          {{ $t('companyNameForCheck') }}</VText
        >
        <VText
          tag="div"
          class="text-center"
          style="text-align: center"
          size="13"
          color="black"
          >{{ $t('addressForCheck') }}</VText
        >
      </div>
      <div
        class="d-flex justify-between mb-5"
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
        class="d-flex justify-between mb-5"
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
        class="check__dashed-line my-15"
        style="
          border-bottom: 1px dashed #000;
          margin-top: 15px;
          margin-bottom: 15px;
        "
      />
      <div v-for="(product, i) in data.products" :key="`product-${i}`">
        <div
          class="d-flex justify-between mb-8"
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
          class="d-flex justify-between mb-5"
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
          class="d-flex justify-between mb-5"
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
          class="d-flex justify-between mb-5"
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
        <div
          class="check__dashed-line my-15"
          style="border-bottom: 1px dashed #000; margin-bottom: 15px"
        />
      </div>
      <div>
        <div
          class="check__payments-info d-flex justify-between mb-5"
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
      <div
        class="check__dashed-line my-15"
        style="border-bottom: 1px dashed #000; margin-bottom: 15px"
      />
      <div class="text-center" style="text-align: center">
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
    </template>
  </div>
</template>

<script setup lang="ts">
import VText from '@/components/ui/VText.vue'
import { defineProps, defineExpose } from 'vue'
import { $printScreen } from '@/utils/pure-functions'

defineProps({
  item: {},
})

const print = () => {
  const html = document.getElementById('cashCheck')
  if (html) $printScreen('cashCheck', html.innerHTML)
}

defineExpose({ print })

const data = {
  id: 87,
  organisation_id: 2,
  organisation_name: 'Organisation2',
  organisation_address: 'address test',
  check_number: '16715567342',
  status: 10,
  seller_name: 'Sotuvchi',
  sale_date: '20.12.2022 17:12:18',
  total_amount_sum: 9225000,
  products: [
    {
      id: 175,
      product_name: 'iphone13',
      barcode: '021670618459',
      articule: 'apple',
      category_id: 6,
      category_name: 'Elektronika',
      unit_id: 6,
      unit_name: 'штук',
      sell_count: 1,
      returned_count: 1,
      is_bonus: false,
      sold_sum: '9225000',
      all_sold_sum: 9225000,
    },
    {
      id: 176,
      product_name: 'Salmsung',
      barcode: '021670618432',
      articule: 'samsung',
      category_id: 7,
      category_name: 'Elektronika',
      unit_id: 7,
      unit_name: 'штук',
      sell_count: 2,
      returned_count: 1,
      is_bonus: false,
      sold_sum: '8225000',
      all_sold_sum: 16440100,
    },
  ],
  payments: [
    {
      type: 'main',
      payment_type: 'apelsin',
      amount_sum: '9225000',
    },
    {
      type: 'main',
      payment_type: 'payme',
      amount_sum: '9225000',
    },
  ],
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/pages/check.scss';
</style>
