<template>
  <div class="v-counter">
    <button
      @click="onMinus"
      class="v-counter__minus v-counter__btn"
      type="reset"
    >
      <VIcon size="16" icon="minus-circle" />
    </button>
    <div class="v-counter__index v-counter__btn">
      {{ modelValue }}
    </div>
    <button @click="onPlus" class="v-counter__plus v-counter__btn" type="reset">
      <VIcon size="16" icon="plus-circle" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'

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
})

const emit = defineEmits(['update:modelValue', 'minus', 'plus'])

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
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-counter';
</style>
