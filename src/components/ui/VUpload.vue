<template>
  <Field
    validate-on-input
    :model-value="modelValue"
    :name="vid || name || label"
    :label="name || label"
    :rules="rules"
    v-slot="{ errors }"
  >
    <div class="v-upload__wrapper" :class="{ 'hide-details': hideDetails }">
      <div class="v-upload__logo">{{ label }}</div>
      <div class="v-upload__container">
        <div
          class="v-upload__previewer"
          :class="{ has__image: backgroundImage }"
          :style="{ 'background-image': `url(${backgroundImage})` }"
          @click="selectImage"
        >
          <span class="text" :class="{ has__image: backgroundImage }"
            >+ {{ $t('uploadFile') }}</span
          >
          <span
            @click.stop="clearImage"
            v-if="backgroundImage && !disabled"
            class="clear"
          >
            &times;
          </span>
        </div>
        <input
          :disabled="disabled"
          :accept="accept"
          class="v-upload__input"
          ref="fileInput"
          type="file"
          @input="pickFile"
        />
      </div>
      <VTransition>
        <span
          v-if="!hideDetails && errors && errors[0]"
          class="v-upload__error"
        >
          {{ errors[0] }}
        </span>
      </VTransition>
    </div>
  </Field>
</template>

<script lang="ts" setup>
import VTransition from '@/components/ui/VTransition.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {},
  disabled: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: 'image/*',
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
  hideDetails: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)

const backgroundImage = computed(() => {
  if (previewImage.value && !props.modelValue) {
    return previewImage.value
  } else if (!previewImage.value && props.modelValue) {
    return props.modelValue
  } else if (previewImage.value && props.modelValue) {
    return previewImage.value
  }
  return null
})

const selectImage = () => {
  fileInput.value?.click()
}

const pickFile = () => {
  const input = fileInput.value
  const file = input?.files
  if (file && file[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file[0])
    emits('update:modelValue', file[0])
  }
}

const clearImage = () => {
  emits('update:modelValue', null)
  previewImage.value = null
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-upload';
</style>
