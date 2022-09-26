<template>
  <TheHeader @toggleMini="toggleMini" />
  <TheSidebar
    :windowWidth="windowWidth"
    :isMini="isMini"
    @toggleMini="toggleMini"
  >
    <RouterView />
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
  const isStorage = localStorage.getItem(IS_MINI_KEY) === 'true'
  isMini.value = windowWidth.value > 1265 && isStorage
})
const toggleMini = () => {
  isMini.value = !isMini.value
  localStorage.setItem(IS_MINI_KEY, `${isMini.value}`)
}
</script>
