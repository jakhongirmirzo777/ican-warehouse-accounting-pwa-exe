<template>
  <transition name="tab" tag="div" style="min-width: 100px">
    <div v-if="isActive" class="v-tab-item">
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  getCurrentInstance,
  inject,
  watchEffect,
} from 'vue'

const props = defineProps({
  value: { type: String },
})
const { active, tabBodies }: any = inject('tabItems')
// eslint-disable-next-line no-unused-vars
// const index = tabBodies.value.indexOf((p: number) => p === active.value)
const instance = getCurrentInstance()

watchEffect(() => {
  tabBodies.value.push(instance)
})
const isActive = computed(() => {
  if (props.value) return props.value === active.value
  else {
    return tabBodies.value[active.value]?.uid === instance?.uid
  }
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-tab';
</style>
