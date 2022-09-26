<template>
  <div v-bind="$attrs" :class="className">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  cols: {
    type: [String, Number],
    default: 12,
  },
  sm: {
    type: [String, Number],
  },
  md: {
    type: [String, Number],
  },
  lg: {
    type: [String, Number],
  },
  xl: {
    type: [String, Number],
  },
  order: {
    type: [String, Number],
  },
  orderSm: {
    type: [String, Number],
  },
  orderMd: {
    type: [String, Number],
  },
  orderLg: {
    type: [String, Number],
  },
  orderXl: {
    type: [String, Number],
  },
  dense: {
    type: Boolean,
    default: false,
  },
  denseSm: {
    type: Boolean,
    default: false,
  },
  denseMd: {
    type: Boolean,
    default: false,
  },
  denseLg: {
    type: Boolean,
    default: false,
  },
  denseXl: {
    type: Boolean,
    default: false,
  },
})

const className = computed(() => {
  const classes = []
  if (props.cols) classes.push(`col-${props.cols}`)
  if (props.sm) classes.push(`col-sm-${props.sm}`)
  if (props.md) classes.push(`col-md-${props.md}`)
  if (props.lg) classes.push(`col-lg-${props.lg}`)
  if (props.xl) classes.push(`col-xl-${props.xl}`)
  if (props.order) classes.push(`order-${props.order}`)
  if (props.orderSm) classes.push(`order-sm-${props.orderSm}`)
  if (props.orderMd) classes.push(`order-md-${props.orderMd}`)
  if (props.orderLg) classes.push(`order-lg-${props.orderLg}`)
  if (props.orderXl) classes.push(`order-xl-${props.orderXl}`)
  if (props.dense) classes.push('col-dense')
  if (props.denseSm) classes.push('col-sm-dense')
  if (props.denseMd) classes.push('col-md-dense')
  if (props.denseLg) classes.push('col-lg-dense')
  if (props.denseXl) classes.push('col-xl-dense')
  return classes
})
</script>
