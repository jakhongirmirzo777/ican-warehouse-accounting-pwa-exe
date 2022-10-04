<template>
  <div class="v-tabs" :class="{ dark: theme === THEME.DARK }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref } from 'vue'
import type { PropType } from 'vue'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()

const props = defineProps({
  modelValue: { type: [String, Number] },
  color: {
    type: String as PropType<
      'green' | 'gray' | 'danger' | 'warning' | 'light-red'
    >,
    default: 'default',
  },
})

const emits = defineEmits(['update:modelValue'])

const active = computed(() => props.modelValue)

const tabs = ref([])

const change = (val: number) => {
  emits('update:modelValue', val)
}

provide('tabs', {
  change,
  tabs,
  active,
  color: props.color,
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/ui/v-tab';
</style>
