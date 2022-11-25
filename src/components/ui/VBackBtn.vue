<template>
  <VBtn @click="$router.go(-1)" min-width="32px">
    <VIcon color="#868EAA" size="16" icon="arrow-left" />
  </VBtn>
</template>

<script lang="ts" setup>
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
</script>
