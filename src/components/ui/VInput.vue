<template>
  <Field
    validate-on-input
    :model-value="modelValue"
    :name="vid || name || label"
    :label="name || label"
    :rules="rules"
    v-slot="{ field, errors }"
  >
    <div
      v-bind="$attrs"
      class="v-input__container"
      :class="{ dark: theme === THEME.DARK }"
      :style="containerStyles"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="v-input__box">
        <span
          class="v-input__prepend"
          :class="{
            has__prepend:
              $slots?.prepend || type === 'password' || type === 'email',
          }"
          @click.stop="onPrependClick"
        >
          <slot name="prepend">
            <VIcon
              v-if="type === 'email'"
              icon="at"
              :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
              size="16"
            />
            <VIcon
              v-if="type === 'password'"
              icon="lock"
              :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
              size="16"
            />
          </slot>
        </span>
        <input
          ref="inputEl"
          v-bind="field"
          v-focus="focus"
          v-maska="mask"
          class="v-input__element"
          :class="{
            has__prepend:
              $slots?.prepend || type === 'password' || type === 'email',
            has__append:
              $slots?.append ||
              type === 'password' ||
              (type === 'text' && clearable && modelValue),
            has__append__and__clearable:
              ($slots?.append && clearable && modelValue) ||
              (type === 'password' && clearable && modelValue),
          }"
          :min="min"
          :max="max"
          :style="styles"
          :disabled="disabled"
          :type="inputType"
          :value="handledValue"
          @input="onInput"
        />
        <span
          class="v-input__label"
          :class="{
            error: errors && errors[0],
            has__value: !!modelValue,
            has__prepend:
              $slots?.prepend || type === 'password' || type === 'email',
          }"
          @click="focusInput"
        >
          {{ label }}
        </span>
        <span
          class="v-input__append"
          :class="{
            has__append:
              $slots?.append ||
              type === 'password' ||
              (type === 'text' && clearable && modelValue),
            has__append__and__clearable:
              ($slots?.append && clearable && modelValue) ||
              (type === 'password' && clearable && modelValue),
          }"
          @click.stop="onAppendClick"
        >
          <VIcon
            v-show="clearable && modelValue && isHovered"
            class="cursor-pointer"
            icon="circle-x-mark"
            :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
            size="16"
            @click.stop="$emit('update:modelValue', null)"
          />
          <slot name="append">
            <template v-if="type === 'password'">
              <VIcon
                v-show="!isVisiblePassword"
                class="cursor-pointer"
                icon="eye"
                :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
                size="16"
              />
              <VIcon
                v-show="isVisiblePassword"
                class="cursor-pointer"
                icon="eye-slash"
                :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
                size="16"
              />
            </template>
          </slot>
        </span>
      </div>
      <VTransition>
        <span
          v-if="!hideDetails && errors && errors[0]"
          class="v-input__error"
          :class="{ has__counter: !!counter }"
          >{{ errors[0] }}</span
        >
      </VTransition>
      <span class="v-input__counter" v-if="counter"
        >{{ counterValue }}/{{ counter }}</span
      >
    </div>
  </Field>
</template>

<script lang="ts" setup>
import VTransition from '@/components/ui/VTransition.vue'
import VIcon from '@/components/ui/VIcon.vue'

import { computed, ref } from 'vue'
import { $moneyFormatWithComma } from '@/utils/pure-functions'
import { useThemeService } from '@/plugins/theme-service'
import type { PropType } from 'vue'
import type { EventWithTarget } from '@/types/globals/EventTypes'

const { theme, THEME } = useThemeService()

const props = defineProps({
  type: {
    type: String as PropType<
      'text' | 'number' | 'password' | 'email' | 'phone' | 'money'
    >,
    default: 'text',
  },
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
  focus: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: [String, Object],
    default: '',
  },
  borderColor: {
    type: String,
    default: '',
  },
  uppercase: {
    type: Boolean,
    default: false,
  },
  pattern: {
    type: [String, Object, Array],
    default: '',
  },
  only: {
    type: String as PropType<'number' | 'alpha' | undefined>,
    default: '',
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '40px',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  counter: {
    type: [String, Number],
    default: '',
  },
  min: {
    type: [String, Number],
    default: '',
  },
  max: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'append', 'prepend'])

const inputEl = ref<any>(null)
const isVisiblePassword = ref(false)
const inputType = ref(props.type === 'money' ? 'text' : props.type)
const isHovered = ref(false)

const focusInput = () => {
  if (!props.modelValue && inputEl.value) {
    inputEl.value.focus()
  }
}

const onInput = (e: EventWithTarget) => {
  if (props.type === 'money')
    emit('update:modelValue', $moneyFormatWithComma(e?.target?.value))
  else emit('update:modelValue', e?.target?.value || '')
}

const onAppendClick = () => {
  if (props.type === 'password') {
    isVisiblePassword.value = !isVisiblePassword.value
    inputType.value = inputType.value === 'text' ? 'password' : 'text'
  }
  emit('append')
}

const onPrependClick = () => {
  emit('prepend')
}

const handledValue = computed(() => {
  const copyModelValue = props.modelValue
  if (props.type === 'money') return $moneyFormatWithComma(copyModelValue)
  return copyModelValue
})

const counterValue = computed(() => {
  return props.modelValue?.length || 0
})

const styles = computed(() => {
  const styles: Record<string, string> = {
    height: props.height,
  }
  if (props.borderColor) styles.borderColor = props.borderColor
  return styles
})

const containerStyles = computed(() => {
  const defaultHeightOfErrorMessage = '20px'
  const styles: Record<string, string> = {}
  if (!props.hideDetails)
    styles.minHeight = `${
      parseInt(props.height) + parseInt(defaultHeightOfErrorMessage)
    }px`
  return styles
})

const mask = computed(() => {
  if (props.type === 'phone') return '998(##)###-##-##'
  if (props.pattern) return props.pattern
  if (props.only === 'number')
    return {
      mask: '#*',
      tokens: { '#': { pattern: /[0-9]/ } },
    }
  if (props.only === 'alpha' && !props.uppercase)
    return { mask: 'A*', tokens: { A: { pattern: /[a-zA-Z]/ } } }
  if (props.only === 'alpha' && props.uppercase)
    return {
      mask: 'A*',
      tokens: { A: { pattern: /[a-zA-Z]/, uppercase: true } },
    }
  if (!props.only && props.uppercase)
    return {
      mask: 'X*',
      tokens: { X: { pattern: /[0-9a-zA-Z]/, uppercase: true } },
    }
  return ''
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-input';
</style>
