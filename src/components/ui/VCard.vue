<template>
  <div class="v-card" :class="{ dark: theme === THEME.DARK }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { useThemeService } from '@/plugins/theme-service'
const { theme, THEME } = useThemeService()
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-card';
</style>
