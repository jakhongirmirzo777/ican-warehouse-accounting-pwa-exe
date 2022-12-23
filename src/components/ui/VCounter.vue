<template>
  <div class="v-counter">
    <button
      @click="onMinus"
      class="v-counter__minus v-counter__btn"
      type="reset"
      :class="{ disabled: disabledMinus }"
    >
      <VIcon size="16" icon="minus-circle" />
    </button>
    <input
      :value="modelValue"
      :class="['v-counter__input v-counter__btn mx-8', { disabled: disabled }]"
      v-maska="maska"
      @input="changeInput"
    />
    <button
      @click="onPlus"
      class="v-counter__plus v-counter__btn"
      type="reset"
      :class="{ disabled: disabledPlus }"
    >
      <VIcon size="16" icon="plus-circle" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 10,
  },
  disabled: {
    type: Boolean,
    default: true,
  },
  disabledMinus: {
    type: Boolean,
    default: false,
  },
  disabledPlus: {
    type: Boolean,
    default: false,
  },
  maskLength: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue', 'minus', 'plus'])

const maska = computed(() => {
  let result = ''
  if (props.maskLength > 0) {
    for (let i = 0; i < props.maskLength; i++) {
      result += '#'
    }
  }
  return result
})

const onMinus = () => {
  if (props.min < props.modelValue) {
    const number = props.modelValue - 1
    emit('update:modelValue', number)
    emit('minus', number)
  }
}

const onPlus = () => {
  if (props.max > props.modelValue) {
    const number = props.modelValue + 1
    emit('update:modelValue', number)
    emit('plus', number)
  }
}

const changeInput = ($event: Event) => {
  const target = $event.target as HTMLInputElement
  const value = target.value
  if (+value > props.max) return emit('update:modelValue', props.max)
  if (+value < props.min) return emit('update:modelValue', props.min)
  else emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-counter';
</style>
