<template>
  <Field
    validate-on-input
    :model-value="modelValue"
    :name="vid || name || label"
    :label="name || label"
    :rules="rules"
    v-slot="{ errors, field }"
    class="v-select"
  >
    <label
      class="v-select__v-select-block w-100"
      :class="{ dark: theme === THEME.DARK }"
    >
      <span
        v-if="label"
        :class="[
          'v-select__v-select-block__label',
          {
            'v-select__v-select-block__label--label-up': isFocused,
          },
          { 'v-select__v-select-block__label--error': errors && errors[0] },
        ]"
        >{{ label }}</span
      >
      <el-select
        style="height: 42px; width: 100%"
        size="large"
        :no-data-text="noDataText || t('noDataText')"
        :no-match-text="noMatchText || t('noMatchText')"
        v-model="value"
        :multiple="multiple"
        @change="changeValue"
        @focus="isFocused = true"
        @clear="cleared"
        :collapse-tags="collapseTags"
        @blur="blur"
        :disabled="disabled"
        :filterable="autocomplete"
        :placeholder="' '"
        :clearable="clearable"
        v-bind="field"
        :loading="loading"
      >
        <el-option
          v-for="(item, i) in items"
          :key="`select-${i}`"
          :label="!localize ? item[itemText] : t(item[itemText])"
          :value="item[itemValue]"
        />
        <template v-if="canAdd" #empty>
          <p
            class="el-select-dropdown__empty cursor-pointer"
            @click="$emit('add')"
          >
            {{ t('add') }}
          </p>
        </template>
      </el-select>
    </label>
    <div
      class="d-flex justify-start"
      style="min-height: 20px"
      v-if="!hideDetails"
    >
      <VTransition>
        <span v-if="errors && errors.length" class="v-select__error-message">
          {{ errors[0] }}
        </span>
      </VTransition>
    </div>
  </Field>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption } from 'element-plus'
import VTransition from '@/components/ui/VTransition.vue'

import { useThemeService } from '@/plugins/theme-service'
import { onMounted, onUpdated, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { theme, THEME } = useThemeService()
const { t } = useI18n()

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  itemValue: {
    type: String,
    default: 'id',
  },
  itemText: {
    type: String,
    default: 'name',
  },
  localize: {
    type: Boolean,
    default: false,
  },
  collapseTags: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: [Array, String, Number],
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  canAdd: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  vid: {
    type: String,
    default: '',
  },
  noDataText: {
    type: String,
    default: '',
  },
  noMatchText: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  rules: {
    type: [String, Object],
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
})

const value = ref<any>(null)
const isFocused = ref(false)
const emits = defineEmits(['update:modelValue', 'add'])

watch(
  () => props.modelValue,
  (val) => {
    value.value = val
    isFocused.value = !!(val || val === 0 || Array.isArray(val))
  }
)

onMounted(() => {
  if (props.modelValue || props.modelValue === 0) {
    value.value = props.modelValue
    if (Array.isArray(props.modelValue) && props.modelValue.length) {
      isFocused.value = true
    } else if (
      !Array.isArray(props.modelValue) &&
      (props.modelValue || props.modelValue === 0)
    ) {
      isFocused.value = true
    }
  }
})

onUpdated(() => {
  if (props.modelValue || props.modelValue === 0) {
    value.value = props.modelValue
    if (Array.isArray(props.modelValue) && props.modelValue.length) {
      isFocused.value = true
    } else if (
      !Array.isArray(props.modelValue) &&
      (props.modelValue || props.modelValue === 0)
    ) {
      isFocused.value = true
    }
  }
})

const changeValue = (event: Event) => {
  emits('update:modelValue', event)
}

const cleared = () => {
  emits('update:modelValue', '')
}

const blur = () => {
  setTimeout(() => {
    if (
      (!props.modelValue && props.modelValue !== 0) ||
      (Array.isArray(props.modelValue) && !props.modelValue.length)
    ) {
      isFocused.value = false
    } else {
      isFocused.value = true
    }
  }, 200)
}
</script>

<style lang="scss">
@import '../../assets/styles/ui/v-select';
</style>
