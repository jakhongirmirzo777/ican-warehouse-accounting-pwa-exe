<template>
  <div class="v-status" :style="styles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#868EAA',
  },
  theme: {
    type: String,
    default: 'rgba(134, 142, 170, 0.24)',
  },
  minWidth: {
    type: String,
    default: '',
  },
})

const styles = computed(() => {
  const allStyles: Record<string, string> = {}
  if (props.color) allStyles['color'] = props.color
  if (props.theme) allStyles['background-color'] = props.theme
  if (props.minWidth) allStyles['min-width'] = props.minWidth
  return allStyles
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-status';
</style>
