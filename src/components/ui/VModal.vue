<template>
  <Teleport to="#modal">
    <div class="v-modal__container" :class="{ hide: hide }">
      <VTransition>
        <div
          v-if="modelValue"
          class="v-modal__overlay"
          @click.self="!persistent && close()"
        />
      </VTransition>
      <VTransition name="bounce">
        <div v-if="modelValue" class="v-modal__body" :style="styles">
          <div class="v-modal__top" :class="{ 'justify-end': !title }">
            <h3 v-if="title" class="v-modal__title">{{ title }}</h3>
            <VBtn class="v-modal__btn" small text @click="close">
              <VIcon icon="x-mark" size="20" color="#F94E4F" />
            </VBtn>
          </div>
          <slot :close="close" />
        </div>
      </VTransition>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { $clearExtension } from '@/utils/pure-functions'
import VTransition from '@/components/ui/VTransition.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '400',
  },
  persistent: {
    type: Boolean,
    default: false,
  },
})

const hide = ref(true)
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      setTimeout(() => {
        hide.value = true
      }, 1000 * 0.3)
    } else {
      hide.value = false
    }
  }
)

const emit = defineEmits(['update:modelValue'])

const styles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width)
    styles['max-width'] = $clearExtension(props.width.toString()).toString()
  return styles
})

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-modal';
</style>
