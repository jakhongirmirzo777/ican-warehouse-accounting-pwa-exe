<template>
  <VLoading v-if="loading" type="linear" />
  <div v-else v-bind="$attrs" class="v-table__container">
    <table class="v-table">
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
          class="v-table__body--row"
          v-for="(item, index) in items"
          :key="`body-${item.id || index}`"
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
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import VLoading from '@/components/ui/VLoading.vue'
import { $clearExtension } from '@/utils/pure-functions'

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
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-table';
</style>
