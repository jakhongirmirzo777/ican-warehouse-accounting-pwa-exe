<template>
  <TheHeader @toggleMini="toggleMini" />
  <TheSidebar
    :windowWidth="windowWidth"
    :isMini="isMini"
    @toggleMini="toggleMini"
  >
    <RouterView v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <main :key="route.name">
          <component :is="Component" />
        </main>
      </transition>
    </RouterView>
  </TheSidebar>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/layouts/TheHeader.vue'
import TheSidebar from '@/components/layouts/TheSidebar.vue'
import { onMounted, ref } from 'vue'

const IS_MINI_KEY = 'SIDEBAR_MINI'

const isMini = ref(false)
const windowWidth = ref(0)
onMounted(() => {
  windowWidth.value = window.innerWidth
  isMini.value = localStorage.getItem(IS_MINI_KEY) === 'true'
})
const toggleMini = () => {
  isMini.value = !isMini.value
  localStorage.setItem(IS_MINI_KEY, `${isMini.value}`)
}
</script>

<style lang="scss">
.page {
  &-enter-active,
  &-leave-active {
    transition: all 0.2s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
}
</style>
