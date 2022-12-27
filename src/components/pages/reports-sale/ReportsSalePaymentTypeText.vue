<template>
  <div v-for="(p, i) in item.payments" :key="`payments-${i}`">
    <div class="mb-5 text-no-wrap">
      {{ p.payment_type_name }}:
      <b>{{ $moneyFormat(p.amount_sum) }} {{ item.currency_symbol }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  item: {
    type: Object,
  },
})
</script>
