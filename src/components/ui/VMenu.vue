<template>
  <div class="v-menu" v-click-outside="clickedOutside">
    <div ref="vMenuTitleRef" class="v-menu__title" @click="change">
      <slot name="title" :on="open"></slot>
    </div>
    <VTransition>
      <div v-if="openBody" ref="vMenuBodyRef" class="v-menu__body">
        <slot name="body" :on="closeBody"></slot>
      </div>
    </VTransition>
  </div>
</template>

<script lang="ts" setup>
import VTransition from '@/components/ui/VTransition.vue'
import { ref } from 'vue'

const openBody = ref(false)
const vMenuTitleRef = ref()
const vMenuBodyRef = ref()

const change = () => {
  openBody.value = !openBody.value
}
const clickedOutside = () => {
  openBody.value = false
}

const closeBody = () => {
  openBody.value = false
}

const open = () => {
  openBody.value = true
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-menu';
</style>
