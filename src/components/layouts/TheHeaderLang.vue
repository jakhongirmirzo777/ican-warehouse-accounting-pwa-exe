<template>
  <VMenu
    :class="[
      { 'lang-menu--header': isHeader },
      { 'lang-menu--sidebar': !isHeader },
      'lang-menu cursor-pointer',
    ]"
  >
    <template #title>
      <div class="lang-menu__user-block">
        <div class="lang-menu__user-block__info">
          {{ currentLang.title }}
        </div>
      </div>
    </template>
    <template #body="{ on }">
      <div
        v-for="(body, i) in options"
        :key="`body-${i}`"
        class="block-hover"
        @click="onMenuClick(on, body, i)"
      >
        {{ body.title }}
      </div>
    </template>
  </VMenu>
</template>

<script lang="ts" setup>
import VMenu from '@/components/ui/VMenu.vue'

import { ref } from 'vue'
import { APP_LANG_KEY } from '@/utils/constants'
import { $changeLocale } from '@/plugins/i18n'
import { useStorageService } from '@/plugins/storage-service'

const storageService = useStorageService()

interface LangType {
  title: string
  value: string
}

defineProps({
  isHeader: {
    type: Boolean,
  },
})

const LANG: Record<string, LangType> = {
  uz: { title: 'UZ', value: 'uz' },
  oz: { title: 'УЗ', value: 'oz' },
  ru: { title: 'РУ', value: 'ru' },
}

const currentLang = ref<LangType>({ title: 'RU', value: 'ru' })

const options = ref<Array<LangType>>([])

const getLanguage = () => {
  const lang = storageService.get(APP_LANG_KEY)
  if (lang) {
    currentLang.value = LANG[lang]
  }
  Object.keys(LANG).forEach((p: string) => {
    if (LANG[p].value !== currentLang.value.value) {
      options.value.push(LANG[p])
    }
  })
}

const onMenuClick = (fn: () => unknown, body: LangType, i: number) => {
  options.value.push(currentLang.value)
  options.value.splice(i, 1)
  storageService.set(APP_LANG_KEY, body.value)
  $changeLocale(body.value)
  currentLang.value = body
  fn()
}

getLanguage()
</script>

<style scoped lang="scss">
@import '@/assets/styles/layouts/the-header-lang.scss';
</style>
