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
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
})

const styles = computed(() => {
  const allStyles: Record<string, string> = {}
  if (props.color) allStyles['color'] = props.color
  if (props.theme) allStyles['background-color'] = props.theme
  return allStyles
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-status';
</style>
