<template>
  <div class="v-tab-items" :class="{ dark: theme === THEME.DARK }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()

const props = defineProps({
  modelValue: {},
})

const tabBodies: any = ref([])
const active = computed(() => props.modelValue)
// let length = ref(0)

// const getBodyIndex = () => {
//   tabBodies.value.push(length.value)
//   length.value++
// }

provide('tabItems', {
  active,
  tabBodies,
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-tab';
</style>
