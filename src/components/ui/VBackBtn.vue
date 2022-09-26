<template>
  <VBtn @click="$router.go(-1)" min-width="100px" color="blue">
    <VIcon class="mr-5" color="#fff" size="16" icon="chevron-left" />
    {{ t('back') }}
  </VBtn>
</template>

<script lang="ts" setup>
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
