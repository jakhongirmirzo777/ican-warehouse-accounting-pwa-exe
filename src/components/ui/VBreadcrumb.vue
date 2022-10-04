<template>
  <div class="v-breadcrumb" :class="{ dark: theme === THEME.DARK }">
    <!--    :is="i !== list.length - 1 ? 'router-link' : 'span'"-->
    <!--    :to="item.path"-->
    <component
      v-for="(item, i) in list"
      :key="`breadcrumb-${i}`"
      :is="'span'"
      :class="[
        { 'v-breadcrumb__active': i === list.length - 1 },
        'v-breadcrumb__items',
      ]"
    >
      {{ item.name }}
      <VIcon
        v-if="i !== list.length - 1"
        icon="chevron-right"
        size="10"
        :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
        class="mx-10"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'

import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-breadcrumb';
</style>
