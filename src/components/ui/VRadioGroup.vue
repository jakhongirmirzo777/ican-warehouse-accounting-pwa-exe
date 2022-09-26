<template>
  <Field
    :model-value="modelValue"
    :name="vid || name"
    :label="name"
    :rules="rules"
    v-slot="{ errors }"
  >
    <div :class="$attrs.class">
      <div
        :class="[
          'v-radio-group',
          { 'v-radio-group--error': errors && errors[0] },
          { disabled: disabled },
        ]"
      >
        <slot />
      </div>
      <span class="v-radio-group-error" :class="{ hidden: hideDetails }">
        {{ errors && errors[0] }}
      </span>
    </div>
  </Field>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'

const props = defineProps({
  vid: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: [String, Object],
    default: '',
  },
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  hideDetails: { type: Boolean, default: false },
})
const uniqName = ref(Math.random().toString(36).substr(2, 9))

const emits = defineEmits(['update:modelValue'])
const selectedValue = (val: string) => {
  emits('update:modelValue', val)
}

provide('radioValue', {
  selectedValue,
  uniqName,
  modelValue: props.modelValue,
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-radio.scss';
</style>
