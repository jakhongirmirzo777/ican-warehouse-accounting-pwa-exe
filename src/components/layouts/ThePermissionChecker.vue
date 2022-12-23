<template>
  <section class="permission__container">
    <VText class="permission__title" tag="h1">
      {{ t('youDontHaveRightPermission') }}
    </VText>
  </section>
</template>
<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-permission-checker.scss';
</style>
