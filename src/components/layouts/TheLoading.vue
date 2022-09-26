<template>
  <VTransition>
    <div class="the-loading__container" v-if="loading">
      <div class="the-loading__loader" />
    </div>
  </VTransition>
</template>

<script lang="ts" setup>
import VTransition from '@/components/ui/VTransition.vue'
import { useLoadingService } from '@/plugins/loading-service'

const { loading } = useLoadingService()
</script>

<style lang="scss">
@import '../../assets/styles/layouts/the-loading';
</style>
