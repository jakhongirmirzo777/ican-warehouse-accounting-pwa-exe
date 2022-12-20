<template>
  <component v-bind="$attrs" :style="styles" :is="currentIcon" />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  color: {
    type: String,
    default: '',
  },
})

const currentIcon = computed(() => {
  const path = `../../assets/icons/${props.icon}.svg`
  return defineAsyncComponent(() => import(path))
})
const styles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.color) {
    styles.fill = props.color
    styles.color = props.color
    styles.stroke = props.color
  }
  if (props.size) {
    styles.height = `${props.size}px`
    styles.width = `${props.size}px`
  }
  return styles
})
</script>
