<template>
  <div class="not-found__wrapper" :class="{ dark: theme === THEME.DARK }">
    <h1 class="not-found__title">404</h1>
    <h3 class="not-found__subtitle">{{ $t('notFound') }}</h3>
    <VBtn @click="$router.go(-1)" color="primary">{{ $t('returnBack') }}</VBtn>
  </div>
</template>

<script lang="ts" setup>
import VBtn from '@/components/ui/VBtn.vue'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()
</script>

<style lang="scss" scoped>
@import '../assets/styles/layouts/error';
</style>
