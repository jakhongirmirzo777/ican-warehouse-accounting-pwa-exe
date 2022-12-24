<template>
  <TheHeader @toggleMini="toggleMini" />
  <TheSidebar
    :windowWidth="windowWidth"
    :isMini="isMini"
    @toggleMini="toggleMini"
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
import { useStorageService } from '@/plugins/storage-service'
import { $can } from '@/plugins/permission-service'

const route = useRoute()
const IS_MINI_KEY = 'SIDEBAR_MINI'
const { get, set } = useStorageService()
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
  isMini.value = get(IS_MINI_KEY) === 'true'
})
const toggleMini = () => {
  isMini.value = !isMini.value
  set(IS_MINI_KEY, isMini.value)
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
