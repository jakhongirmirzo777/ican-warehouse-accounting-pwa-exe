<template>
  <Field
    validate-on-input
    :model-value="modelValue"
    :name="vid || name || label"
    :label="name || label"
    :rules="rules"
    v-slot="{ errors, field }"
  >
    <div
      :class="[
        'v-datepicker',
        {
          'v-datepicker--error-message': errors && errors.length,
          dark: theme === THEME.DARK,
        },
      ]"
    >
      <ElConfigProvider :locale="el">
        <ElDatePicker
          size="large"
          locale="ru"
          auto-apply
          v-bind="field"
          @update:modelValue="$emit('update:modelValue', $event)"
          @focus="open"
          @blur="isOpen = false"
          :model-value="modelValue"
          :clearable="clearable"
          :format="format"
          :value-format="valueFormat"
        />
      </ElConfigProvider>
      <span
        :class="[
          'v-datepicker__label',
          { 'v-datepicker__label-up': isOpen || modelValue },
          { 'v-datepicker__label-up__error': errors && errors[0] },
        ]"
      >
        {{ label }}
      </span>
    </div>
    <div
      class="d-flex justify-start"
      style="min-height: 20px"
      v-if="!hideDetails"
    >
      <VTransition>
        <span
          v-if="errors && errors.length"
          class="v-datepicker__error-message"
        >
          {{ errors[0] }}
        </span>
      </VTransition>
    </div>
  </Field>
</template>

<script setup lang="ts">
import VTransition from '@/components/ui/VTransition.vue'
import { ElDatePicker, ElConfigProvider } from 'element-plus'

import { useThemeService } from '@/plugins/theme-service'
import { onMounted, onUpdated, ref, watch } from 'vue'
import lang from '@//locales/date-locale/locale'

const { el } = lang()
const { theme, THEME } = useThemeService()

defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Date' },
  hideTime: { type: Boolean, default: false },
  hideDetails: { type: Boolean, default: false },
  rules: { type: String, default: '' },
  vid: { type: String, default: '' },
  name: { type: String, default: '' },
  format: { type: String, default: 'YYYY-MM-DD' },
  valueFormat: { type: String, default: 'YYYY-MM-DD' },
  clearable: {
    type: Boolean,
    default: false,
  },
})

const isOpen = ref(false)

watch(props, (val) => {
  if (!val.modelValue && isOpen.value) {
    isOpen.value = false
  }
})

onMounted(() => {
  if (props.modelValue) isOpen.value = true
})

onUpdated(() => {
  if (props.modelValue) isOpen.value = true
})

const open = () => {
  isOpen.value = true
}
</script>

<style lang="scss">
@import '../../assets/styles/ui/v-datepicker';
</style>
