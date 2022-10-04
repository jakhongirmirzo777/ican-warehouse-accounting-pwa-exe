<template>
  <div>
    <slot name="top" :toggle="toggle" />
  </div>
  <div :style="collapseStyle">
    <div ref="bottomWrapper">
      <slot name="bottom" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const isOpen = ref(false)
const collapseHeight = ref('0')
const bottomWrapper = ref<any>(null)
const collapseStyle = computed(() => {
  return {
    height: collapseHeight.value,
    overflow: 'hidden',
    transition: 'all 0.3s',
  }
})
const toggle = () => {
  if (isOpen.value) {
    collapseHeight.value = '0'
  } else {
    collapseHeight.value = bottomWrapper.value?.clientHeight + 'px'
  }
  isOpen.value = !isOpen.value
}
</script>
