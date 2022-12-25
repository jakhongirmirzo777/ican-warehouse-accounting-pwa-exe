<template>
  <VLoading v-if="loading" type="linear" />
  <div
    v-if="!loading && items.length"
    v-bind="$attrs"
    class="v-table__container"
  >
    <table class="v-table" :class="{ dark: theme === THEME.DARK }">
      <thead class="v-table__head">
        <slot name="head.prepend" />
        <tr class="v-table__head--row">
          <th
            class="v-table__th"
            v-for="(header, index) in headers"
            :key="`th-${index}`"
            :style="{ width: $clearExtension(header.width) }"
          >
            <slot :name="`header.${header.value}`" :item="header">
              {{ header.text }}
            </slot>
          </th>
        </tr>
        <slot name="head.append" />
      </thead>
      <tbody class="v-table__body">
        <slot name="body.prepend" />
        <tr
          :class="[
            'v-table__body--row',
            { 'v-table__body--row-cursor-pointer': clickable },
          ]"
          v-for="(item, index) in items"
          :key="`body-${item.id || index}`"
          @click="$emit('clicked', item, index)"
        >
          <td
            v-for="(header, i) in headers"
            class="v-table__td"
            :key="`td-${i}`"
          >
            <slot
              :name="`item.${header.value}`"
              :item="item"
              :ix="i"
              :iy="index"
            >
              {{ item[header.value] }}
            </slot>
          </td>
        </tr>
        <slot name="body.append" />
      </tbody>
      <tfoot v-if="$slots.footer">
        <slot name="footer" />
      </tfoot>
    </table>
  </div>
  <VText v-if="!loading && !items.length" tag="h2" class="text-center">
    {{ $t('notFoundRecords') }}
  </VText>
</template>

<script lang="ts" setup>
import VLoading from '@/components/ui/VLoading.vue'
import VText from '@/components/ui/VText.vue'

import type { PropType } from 'vue'
import { $clearExtension } from '@/utils/pure-functions'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()

interface HeadersInterface {
  text: string
  value: string
  width?: string | number
}

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array as PropType<HeadersInterface[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-table';
</style>
