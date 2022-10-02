<template>
  <div class="not-found__wrapper">
    <h1 class="not-found__title">404</h1>
    <h3 class="not-found__subtitle">{{ $t('notFound') }}</h3>
    <VBtn @click="$router.go(-1)" color="primary">{{ $t('goMainPage') }}</VBtn>
  </div>
</template>

<script lang="ts" setup>
import VBtn from '@/components/ui/VBtn.vue'
</script>

<style lang="scss" scoped>
@import '../assets/styles/layouts/error';
</style>
