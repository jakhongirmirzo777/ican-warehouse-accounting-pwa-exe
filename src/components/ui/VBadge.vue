<template>
  <div class="v-badge">
    <div class="v-badge__content">
      <slot />
    </div>
    <div v-if="content" class="v-badge__index" :style="styles">
      {{ content }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#F94E4F',
  },
  content: {
    type: String,
    default: '',
  },
})

const styles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.color) styles['background-color'] = props.color
  return styles
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-badge';
</style>
