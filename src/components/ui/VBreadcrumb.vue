<template>
  <div class="v-breadcrumb">
    <component
      v-for="(item, i) in list"
      :key="`breadcrumb-${i}`"
      :is="i !== list.length - 1 ? 'router-link' : 'span'"
      :to="item.path"
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
        color="#868EAA"
        class="mx-2"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'

defineProps({
  list: {
    type: Array,
    default: () => [
      { name: 'Управление клиентами', path: '/client' },
      { name: 'Организации', path: '' },
    ],
  },
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-breadcrumb';
</style>
