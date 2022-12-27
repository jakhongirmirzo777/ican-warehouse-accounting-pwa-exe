<template>
  <VLoading v-if="loading" type="linear" />
  <div
    v-if="!loading && items.length && size !== 'sm'"
    v-bind="$attrs"
    class="v-table-desktop__container"
  >
    <table class="v-table-desktop" :class="{ dark: theme === THEME.DARK }">
      <thead class="v-table-desktop__head">
        <tr class="v-table-desktop__head--row">
          <th
            class="v-table-desktop__th"
            v-for="(header, index) in headers"
            :key="`th-${index}`"
            :style="{ width: $clearExtension(header.width) }"
          >
            <slot :name="`header.${header.value}`" :item="header">
              {{ header.text }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="v-table-desktop__body">
        <slot name="body.prepend" />
        <tr
          :class="[
            'v-table-desktop__body--row',
            { 'v-table-desktop__body--row-cursor-pointer': clickable },
          ]"
          v-for="(item, index) in items"
          :key="`body-${item.id || index}`"
          @click="$emit('clicked', item, index)"
        >
          <td
            v-for="(header, i) in headers"
            class="v-table-desktop__td"
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
  <div
    v-if="!loading && items.length && size === 'sm'"
    v-bind="$attrs"
    class="v-table-mobile__container"
  >
    <table class="v-table-mobile" :class="{ dark: theme === THEME.DARK }">
      <tbody class="v-table-mobile__body">
        <slot name="body.prepend" />
        <tr
          :class="[
            'v-table-mobile__body--row',
            { 'v-table-mobile__body--row-cursor-pointer': clickable },
          ]"
          v-for="(item, index) in items"
          :key="`body-${item.id || index}`"
          @click="$emit('clicked', item, index)"
        >
          <td
            v-for="(header, i) in headers"
            class="v-table-mobile__td"
            :key="`td-${i}`"
          >
            <div class="v-table-mobile__td--left">
              <slot :name="`header.${header.value}`" :item="header">
                {{ header.text }}
              </slot>
            </div>
            <div class="v-table-mobile__td--right">
              <slot
                :name="`item.${header.value}`"
                :item="item"
                :ix="i"
                :iy="index"
              >
                {{ item[header.value] }}
              </slot>
            </div>
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
import { useResizeWindow } from '@/composables/resize-window'

const { theme, THEME } = useThemeService()
const { size } = useResizeWindow()

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
@import '../../assets/styles/ui/v-table-desktop';
@import '../../assets/styles/ui/v-table-mobile';
</style>
