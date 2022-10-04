<template>
  <div class="v-pagination" :class="{ dark: theme === THEME.DARK }">
    <div class="v-pagination__cta">
      <span class="v-pagination__text">{{
        t('totalPages', { length: total })
      }}</span>
      <span class="v-pagination__text">
        {{
          t('currentPage', {
            start: modelValue,
            length: pages,
          })
        }}
      </span>
    </div>
    <div class="v-pagination__box">
      <form @submit.prevent="onPageClick(goPage)" class="v-pagination__go">
        <input
          class="v-pagination__go__input"
          type="number"
          min="1"
          v-model="goPage"
        />
        <button class="v-pagination__go__button" type="submit">
          <VIcon color="#868EAA" size="16" icon="arrow-right" />
        </button>
      </form>
      <div class="v-pagination__buttons">
        <button
          class="v-pagination__button v-pagination__button--prev"
          :class="{ 'v-pagination__button--disabled': isPrevDisabled }"
          @click="onPrevClick"
        >
          <VIcon size="10" icon="chevron-left" />
        </button>
        <button
          v-for="page in pageRange"
          :key="page"
          class="v-pagination__button"
          :class="{ 'v-pagination__button--selected': page === modelValue }"
          @click="onPageClick(page)"
        >
          {{ page }}
        </button>
        <button
          class="v-pagination__button v-pagination__button--next"
          :class="{ 'v-pagination__button--disabled': isNextDisabled }"
          @click="onNextClick"
        >
          <VIcon size="10" icon="chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'

import { computed, ref } from 'vue'
import { useThemeService } from '@/plugins/theme-service'
import { useI18n } from 'vue-i18n'

const { theme, THEME } = useThemeService()

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    default: 4,
  },
})

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const goPage = ref<null | number>(null)

const isPrevDisabled = computed(() => {
  return props.modelValue <= 1
})

const isNextDisabled = computed(() => {
  return props.modelValue >= props.pages
})

const pageRange = computed(() => {
  let length: number = props.length
  const min = 1
  if (length > props.pages) length = props.pages
  let start: number = props.modelValue - Math.floor(length / 2)
  start = Math.max(start, min)
  start = Math.min(start, min + props.pages - length)
  return Array.from({ length }, (el, i) => start + i)
})

const onPageClick = (page: number) => {
  if (page > 0) {
    emit('update:modelValue', page)
  } else {
    goPage.value = 1
  }
}

const onPrevClick = () => {
  let page: number = props.modelValue
  if (page <= 1) return
  onPageClick(--page)
}

const onNextClick = () => {
  let page: number = props.modelValue
  if (page >= props.pages) return
  onPageClick(++page)
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-pagination';
</style>
