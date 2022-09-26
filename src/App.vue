<template>
  <RouterView :key="locale" />
  <VNotification />
  <TheReloadPrompt />
  <TheLoading />
</template>

<script setup lang="ts">
import VNotification from '@/components/ui/VNotification.vue'
import TheReloadPrompt from '@/components/layouts/TheReloadPrompt.vue'
import TheLoading from '@/components/layouts/TheLoading.vue'
import { useResizeWindow } from '@/composables/resize-window'
import { useI18n } from 'vue-i18n'

useResizeWindow()
const { locale } = useI18n()
</script>
