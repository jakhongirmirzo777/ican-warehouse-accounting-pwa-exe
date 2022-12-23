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
import { useUserService } from '@/plugins/user-service'

const route = useRoute()
const IS_MINI_KEY = 'SIDEBAR_MINI'
const { get, set } = useStorageService()
const { user } = useUserService()
const permissions = user.value?.permissions || []
const permissionsFromMeta = route.meta.permissions || []
const hasPermission =
  !!permissions.find((item) =>
    permissionsFromMeta.some((innerItem) => item === innerItem)
  ) || true
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
