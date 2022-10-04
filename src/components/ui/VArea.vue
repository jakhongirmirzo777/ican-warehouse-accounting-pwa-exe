<template>
  <Field
    validate-on-input
    :model-value="modelValue"
    :name="vid || name || label"
    :label="name || label"
    :rules="rules"
    v-slot="{ field, errors }"
  >
    <textarea
      :placeholder="label"
      class="v-area__input"
      :class="{ dark: theme === THEME.DARK }"
      v-bind="field"
      :rows="rows"
      :value="modelValue"
      @input="(e) => $emit('update:modelValue', e.target?.value)"
    />
    <VTransition>
      <div v-if="errors && errors[0]" class="v-area__error">
        {{ errors[0] }}
      </div>
    </VTransition>
  </Field>
</template>

<script lang="ts" setup>
import VTransition from '@/components/ui/VTransition.vue'

import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  vid: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  rules: {
    type: [String, Object],
    default: '',
  },
  rows: {
    type: String,
    default: '8',
  },
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-area';
</style>
