<template>
  <div class="d-flex align-center flex-column flex-md-row">
    <VBtn
      style="display: flex"
      :width="size === 'sm' ? '100%' : '40px'"
      min-width="40px"
      outlined
      color="danger"
      class="mr-md-8 mb-30 mb-md-0 justify-center align-center"
      @click="$emit('clear')"
    >
      <VIcon color="#F94E4F" size="24" icon="x-mark" />
    </VBtn>
    <VBtn
      style="display: flex"
      :width="size === 'sm' ? '100%' : '40px'"
      min-width="40px"
      color="primary"
      class="mb-20 mb-md-0 justify-center align-center"
      @click="$emit('filter')"
    >
      <VIcon size="24" icon="search-solid" />
    </VBtn>
  </div>
</template>

<script lang="ts" setup>
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import { useResizeWindow } from '@/composables/resize-window'
const { size } = useResizeWindow()

defineEmits(['clear', 'filter'])
</script>
