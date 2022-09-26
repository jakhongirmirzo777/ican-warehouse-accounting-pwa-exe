<template>
  <div class="v-status" :style="styles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { $clearExtension } from '@/utils/pure-functions'

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: '64px',
  },
})

const styles = computed(() => {
  const allStyles: Record<string, string> = {}
  if (props.color) allStyles['color'] = props.color
  if (props.theme) allStyles['background-color'] = props.theme
  if (props.width) allStyles['width'] = $clearExtension(props.width)
  return allStyles
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-status';
</style>
