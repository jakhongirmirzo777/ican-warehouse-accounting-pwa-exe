<template>
  <component
    class="v-text"
    :class="{ dark: theme === THEME.DARK }"
    :is="tag"
    :style="styles"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeService } from '@/plugins/theme-service'

const DARK_COLOR = '#0E1E56'
const { theme, THEME } = useThemeService()

const props = defineProps({
  tag: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    default: '500',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: [String, Number],
    default: '',
  },
  dark: {
    type: Boolean,
    default: false,
  },
})

const styles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.size) styles['font-size'] = `${props.size}px`
  if (props.color) styles['color'] = props.color
  if (props.dark) styles['color'] = DARK_COLOR
  if (props.weight) styles['font-weight'] = props.weight
  return styles
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-text';
</style>
