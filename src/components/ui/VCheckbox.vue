<template>
  <Field
    :model-value="isChecked"
    :name="vid || name || label"
    :label="name || label"
    :rules="rules"
    v-slot="{ errors, field }"
  >
    <div
      class="v-checkbox__box"
      :class="[
        $attrs.class,
        {
          'v-checkbox__hidden-details': hideDetails,
          dark: theme === THEME.DARK,
        },
      ]"
    >
      <label class="v-checkbox">
        <input
          type="checkbox"
          v-bind="field"
          :class="['v-checkbox__input']"
          :checked="isChecked"
          @change="updateInput"
        />
        <span
          :class="[
            'v-checkbox__indicator',
            { 'v-checkbox__indicator--error': errors && errors[0] },
            ...classes,
          ]"
        />
        <span
          v-if="label"
          :class="[
            'v-checkbox__label',
            { 'v-checkbox__label--error': errors && errors[0] },
          ]"
          >{{ label }}</span
        >
      </label>
      <VTransition>
        <div
          v-if="!hideDetails && errors && errors[0]"
          class="v-checkbox__error"
        >
          <span class="v-checkbox__error__text">{{ errors && errors[0] }}</span>
        </div>
      </VTransition>
    </div>
  </Field>
</template>

<script lang="ts" setup>
import VTransition from '@/components/ui/VTransition.vue'

import { computed } from 'vue'
import type { PropType } from 'vue'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()

const props = defineProps({
  hideDetails: { type: Boolean, default: false },
  vid: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  label: { type: String, default: '' },
  rules: {
    type: [String, Object],
    default: '',
  },
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: '',
  },
  color: {
    type: String as PropType<
      'primary' | 'gray' | 'danger' | 'warning' | 'light-red'
    >,
    default: 'default',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  value: {
    type: String,
  },
})

const emits = defineEmits(['update:modelValue', 'change'])

const isChecked = computed(() => {
  if (
    props.modelValue &&
    props.value &&
    Array.isArray(props.modelValue) &&
    props.modelValue.includes(props.value)
  ) {
    return true
  }
  return props.modelValue === props.trueValue
})

const classes = computed(() => {
  const name: Array<string> = []
  name.push(`v-checkbox--theme__indicator-${props.color}`)
  return name
})

const updateInput = (val: Event) => {
  const target = val.target as HTMLInputElement
  if (props.modelValue && Array.isArray(props.modelValue)) {
    const index = props.modelValue.indexOf(props.value)
    const result = props.modelValue
    if (index > -1) {
      result.splice(index, 1)
      emits('change', result)
      return emits('update:modelValue', result)
    } else {
      result.push(props.value)
      emits('change', result)
      return emits('update:modelValue', result)
    }
  }
  if (target.checked) {
    emits('change', props.trueValue)
    return emits('update:modelValue', props.trueValue)
  } else {
    emits('change', props.falseValue)
    return emits('update:modelValue', props.falseValue)
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-checkbox';
</style>
