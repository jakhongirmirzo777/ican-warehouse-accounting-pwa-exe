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

import { useThemeService } from '@/plugins/theme-service'
import { useResizeWindow } from '@/composables/resize-window'
import { useI18n } from 'vue-i18n'

const { setBodyColor } = useThemeService()
const { locale } = useI18n()

setBodyColor()
useResizeWindow()
</script>
