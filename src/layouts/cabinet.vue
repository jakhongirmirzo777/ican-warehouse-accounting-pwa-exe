<template>
  <TheHeader />
  <TheSidebar
    :windowWidth="windowWidth"
    :isMini="isMini"
    @toggle-mini="toggleMini"
  >
    <RouterView v-if="hasPermission" v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <main :key="route.name">
          <component :is="Component" />
        </main>
      </transition>
    </RouterView>
    <ThePermissionChecker v-else />
  </TheSidebar>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/layouts/TheHeader.vue'
import TheSidebar from '@/components/layouts/TheSidebar.vue'
import ThePermissionChecker from '@/components/layouts/ThePermissionChecker.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { $can } from '@/plugins/permission-service'
import { MEDIUM_MENU_MEDIA_WIDTH } from '@/utils/constants'

const route = useRoute()
const permissionsFromMeta = route.meta.permissions || []
//1) If there is no "permissions" key in the meta, the return value of hasPermission should be true.
//2) If there is "permissions" key in the meta, the return value of hasPermission should depend on permission check.
const hasPermission = Array.isArray(route.meta.permissions)
  ? $can(permissionsFromMeta)
  : true
const isMini = ref(false)
const windowWidth = ref(0)
onMounted(() => {
  windowWidth.value = window.innerWidth
  isMini.value = windowWidth.value < MEDIUM_MENU_MEDIA_WIDTH
})
const toggleMini = () => {
  isMini.value = !isMini.value
}
</script>

<style lang="scss" scoped>
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
