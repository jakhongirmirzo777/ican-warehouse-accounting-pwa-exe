<template>
  <transition :name="name">
    <slot />
  </transition>
</template>

<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    default: 'v',
  },
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-transition';
</style>
