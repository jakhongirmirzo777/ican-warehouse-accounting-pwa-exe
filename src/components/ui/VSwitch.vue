<template>
  <label
    :aria-label="label"
    :class="['v-switch', { disabled: disabled, dark: theme === THEME.DARK }]"
  >
    <input
      :checked="isChecked"
      type="checkbox"
      :class="['v-switch__input']"
      @change="updateInput"
    />
    <span :class="['v-switch__indicator', ...classes]"></span>
    <span :class="['v-switch__label']">{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
import { useThemeService } from '@/plugins/theme-service'
import { computed } from 'vue'
import type { PropType } from 'vue'

const { theme, THEME } = useThemeService()

const props = defineProps({
  label: { type: String, required: true },
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
})

const emits = defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  return props.modelValue === props.trueValue
})

const classes = computed(() => {
  const name: Array<string> = []
  name.push(`v-switch--theme__indicator-${props.color}`)
  return name
})

const updateInput = (val: Event) => {
  const target = val.target as HTMLInputElement
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
