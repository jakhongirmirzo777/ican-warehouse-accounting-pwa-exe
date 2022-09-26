<template>
  <div
    class="v-tab"
    @click="changeTab"
    :class="[
      isActive ? classes : '',
      { 'v-tab--active': isActive },
      { 'v-tab__first': index === 0 },
      { 'v-tab__last': index === tabs.length - 1 },
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, watchEffect } from 'vue'

const props = defineProps({
  href: { type: String },
})

const { change, tabs, active, color }: any = inject('tabs')
const instance = getCurrentInstance()
const classes = computed(() => `v-tab__active--${color}`)
watchEffect(() => {
  tabs.value.push(instance)
})
const index = tabs.value.findIndex((p: any) => p.uid === instance?.uid)
const isActive = computed(() => {
  if (props.href) return active.value === props.href
  else return index === active.value
})
const changeTab = () => {
  if (props.href) {
    return change(props.href)
  }
  change(index)
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-tab';
</style>
