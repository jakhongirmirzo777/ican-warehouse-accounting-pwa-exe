<template>
  <div class="v-loading--container">
    <div v-if="type === 'linear'" class="v-loading--linear">
      <div class="v-loading--indeterminate"></div>
    </div>
    <div v-else class="v-loading--spinner">
      <VIcon icon="spinner" size="18" :color="color" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import type { PropType } from 'vue'

defineProps({
  type: {
    type: String as PropType<'linear' | 'circular'>,
    default: 'circular',
  },
  color: {
    type: String,
    default: '#fff',
  },
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-loading';
</style>
