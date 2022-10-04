<template>
  <Field
    v-if="!isUrl"
    validate-on-input
    :model-value="modelValue"
    :name="vid || name || label"
    :label="name || label"
    :rules="rules"
    v-slot="{ handleChange, handleBlur, errors }"
  >
    <div
      class="v-file__wrapper"
      :class="{ 'hide-details': hideDetails, dark: theme === THEME.DARK }"
    >
      <div
        class="v-file__element"
        @click="onClick"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <VIcon
          class="v-file__icon"
          :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
          icon="paperclip"
          size="20"
        />
        <span
          class="v-file__label"
          :class="{
            focused: modelValue,
            error: errors && errors[0] && !hideDetails,
          }"
        >
          {{ label }}
        </span>
        <span class="v-file__value">{{ modelValue?.name }}</span>
        <VIcon
          v-show="clearable && modelValue"
          class="v-file__clear cursor-pointer"
          :class="{ hovered: isHovered }"
          icon="circle-x-mark"
          :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
          size="16"
          @click.stop="$emit('update:modelValue', null)"
        />
      </div>
      <VTransition>
        <div v-if="errors && errors[0] && !hideDetails" class="v-file__error">
          {{ errors[0] }}
        </div>
      </VTransition>
    </div>
    <input
      ref="fileInput"
      class="v-file__input"
      type="file"
      :accept="accept"
      @change="
        ($event) => {
          handleSelect($event)
          handleChange($event)
        }
      "
      @blur="handleBlur"
    />
  </Field>
  <div v-else class="v-file__download" :class="{ dark: theme === THEME.DARK }">
    <VIcon
      class="mr-15 cursor-pointer"
      icon="x-mark"
      color="#F94E4F"
      size="20"
      @click.stop="$emit('update:modelValue', null)"
    />
    <span class="v-file__download__label mr-15">{{ label }}</span>
    <VIcon
      class="cursor-pointer"
      icon="download"
      color="#17BDC0"
      size="18"
      @click.stop="handleDownload"
    />
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import VTransition from '@/components/ui/VTransition.vue'

import { useThemeService } from '@/plugins/theme-service'
import { useErrorActions } from '@/composables/set-errors'
import { $downloadFile } from '@/utils/pure-functions'
import { ref, watchEffect } from 'vue'

const { theme, THEME } = useThemeService()
const { $setResponseErrors } = useErrorActions()

const props = defineProps({
  modelValue: {},
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
  disabled: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: [String, Object],
    default: '',
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  accept: {},
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<any>(null)
const isHovered = ref(false)
const isUrl = ref(false)

watchEffect(() => {
  isUrl.value = !!(props.modelValue && typeof props.modelValue === 'string')
})

const onClick = () => {
  fileInput.value.click()
}

const handleSelect = (e: any) => {
  const file = e.target?.files?.[0]
  emit('update:modelValue', file)
}

const handleDownload = async () => {
  try {
    await $downloadFile(props.modelValue as string)
  } catch (err) {
    $setResponseErrors(err)
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-file';
</style>
