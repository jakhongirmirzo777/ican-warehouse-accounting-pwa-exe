<template>
  <label :aria-label="label" class="v-radio">
    <input
      type="radio"
      :name="uniqName"
      :value="value"
      :class="['v-radio__input', ...inputClasses]"
      v-model="modelValue"
      @change="updateInput"
    />
    <span :class="['v-radio__indicator', ...indicatorClasses]"></span>
    <span class="v-radio__label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  color: {
    type: String as PropType<
      'blue' | 'success' | 'gray' | 'danger' | 'warning' | 'light-red'
    >,
    default: 'default',
  },
  label: { type: String, required: true },
  value: {
    type: String,
    required: true,
  },
})

const indicatorClasses = computed(() => {
  const className: Array<string> = []
  className.push(`v-radio__indicator--theme__${props.color}`)
  return className
})

const inputClasses = computed(() => {
  const className: Array<string> = []
  className.push(`v-radio__input--theme__${props.color}`)
  return className
})

const updateInput = () => {
  selectedValue(props.value)
}

const { selectedValue, uniqName, modelValue }: any = inject('radioValue')
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-radio';
</style>
