<template>
  <label :aria-label="label" :class="['v-switch', { disabled: disabled }]">
    <input
      :value="value"
      v-model="isCheck"
      type="checkbox"
      :class="['v-switch__input']"
      @change="updateInput"
    />
    <span
      :class="[
        'v-switch__indicator',
        { 'v-switch__indicator--error': errorMessage },
        ...classes,
      ]"
    ></span>
    <span
      :class="['v-switch__label', { 'v-switch__label--error': errorMessage }]"
      >{{ label }}</span
    >
  </label>
  <div v-if="!hideDetails" class="v-switch__error">
    <VTransition>
      <span v-if="errorMessage && !isCheck" class="v-switch__error__text">{{
        errorMessage
      }}</span>
    </VTransition>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import type { PropType } from 'vue'
import VTransition from '@/components/ui/VTransition.vue'

const props = defineProps({
  label: { type: String, required: true },
  hideDetails: { type: Boolean, default: false },
  value: { type: [String, Number, Boolean], default: null },
  modelValue: { type: [String, Number, Boolean, Array], default: '' },
  color: {
    type: String as PropType<
      'primary' | 'gray' | 'danger' | 'warning' | 'light-red'
    >,
    default: 'default',
  },
  disabled: { type: Boolean, default: false },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  errorMessage: { type: String, default: '' },
})

const emits = defineEmits(['update:modelValue'])
const isMultiple = Array.isArray(props.modelValue)

onMounted(() => {
  if (props.modelValue === props.value && props.trueValue) {
    emits('update:modelValue', props.trueValue)
  }
  if (props.modelValue !== props.value && props.falseValue) {
    emits('update:modelValue', props.falseValue)
  }
})

const isCheck = computed(() => {
  if (isMultiple) {
    if (props.modelValue.includes(props.value)) return true
  }
  return props.modelValue === props.value
})

const classes = computed(() => {
  const name: Array<string> = []
  name.push(`v-switch--theme__indicator-${props.color}`)
  return name
})

const updateInput = (val: Event) => {
  const target = val.target as HTMLInputElement
  if (isMultiple) {
    const value = props.modelValue
    if (target.checked) {
      value.push(target.value)
    } else {
      const index = props.modelValue.indexOf(val)
      if (index) value.splice(index, 1)
    }
    return emits('update:modelValue', value)
  }
  if (target.checked) {
    emits('update:modelValue', props.trueValue)
  } else {
    emits('update:modelValue', props.falseValue)
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-switch';
</style>
