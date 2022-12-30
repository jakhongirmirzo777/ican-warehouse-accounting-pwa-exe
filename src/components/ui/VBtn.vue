<template>
  <component
    v-ripple
    :is="tag"
    class="v-btn"
    :class="[clickAnimationClass, classes, $attrs.class]"
    :type="type"
    :style="{ ...styles, ...$attrs.style }"
    @mousedown="effect"
    @click.stop="onClick"
    :to="$localePath(to)"
  >
    <span class="v-btn__loading" :class="{ loading: loading }" />
    <div
      class="v-btn__content d-flex justify-center align-center h-100"
      :class="{ loading: loading }"
    >
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import { $clearExtension } from '@/utils/pure-functions'

const props = defineProps({
  color: {
    type: String as PropType<
      | 'blue'
      | 'success'
      | 'gray'
      | 'danger'
      | 'warning'
      | 'light-red'
      | 'primary'
    >,
    default: 'default',
  },
  type: {
    type: String as PropType<string>,
    default: 'button',
  },
  outlined: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
  fab: { type: Boolean, default: false },
  absolute: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  text: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
  radius: { type: String, default: '6px' },
  to: { type: String },
  height: { type: String, default: '40px' },
  width: { type: String },
  minHeight: { type: String },
  minWidth: { type: String, default: '60px' },
  borderRadius: { type: String },
})

const emit = defineEmits(['click'])

const clickAnimationClass: any = ref([])

const styles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.height) styles['height'] = $clearExtension(props.height)
  if (props.width) styles['width'] = $clearExtension(props.width)
  if (props.minHeight) styles['min-height'] = $clearExtension(props.minHeight)
  if (props.borderRadius)
    styles.borderRadius = $clearExtension(props.borderRadius)
  if (props.minWidth) styles['min-width'] = $clearExtension(props.minWidth)
  if (props.radius) styles['border-radius'] = $clearExtension(props.radius)
  return styles
})
const classes = computed(() => {
  const name = 'v-btn'
  const className: Array<string> = []
  if (props.outlined) className.push(`${name}__outlined`)
  if (props.dark) className.push(`${name}__dark`)
  if (props.disabled) className.push(`${name}__disabled`)
  if (props.loading) className.push(`${name}__disabled`)
  if (props.absolute) className.push(`${name}__absolute`)
  if (props.fab) className.push(`${name}__fab`)
  if (props.small) className.push(`${name}__small`)
  if (props.text) className.push(`${name}__text`)
  if (props.flat) className.push(`${name}__flat`)
  className.push(`${name}__theme-${props.color}`)
  return className
})

const tag = computed(() => {
  if (props.to) return 'router-link'
  else return 'button'
})

const effect = () => {
  if (clickAnimationClass.value.length) clickAnimationClass.value = []
  else if (!props.disabled && !props.loading)
    clickAnimationClass.value = ['v-btn__click-animate']
}

const onClick = () => {
  effect()
  if (props.disabled || props.loading) return
  emit('click')
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-btn';
</style>
