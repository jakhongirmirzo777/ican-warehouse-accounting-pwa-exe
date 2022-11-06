<template>
  <VMenu
    :class="[
      { 'lang-menu--header': isHeader },
      { 'lang-menu--sidebar': !isHeader },
      { dark: theme === THEME.DARK },
      'lang-menu cursor-pointer mr-10',
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
import { getAppLocale, $changeLocale } from '@/plugins/i18n'
import { $removeLocaleFromPath } from '@/utils/pure-functions'
import { useRoute, useRouter } from 'vue-router'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()
const route = useRoute()
const router = useRouter()

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
  const lang = getAppLocale()
  currentLang.value = LANG[lang]
  Object.keys(LANG).forEach((p: string) => {
    if (LANG[p].value !== currentLang.value.value) {
      options.value.push(LANG[p])
    }
  })
}

const onChangeLocale = async (locale: string) => {
  await router.replace({
    path: `/${locale}/${$removeLocaleFromPath(route.fullPath)}`,
  })
}

const onMenuClick = (fn: () => unknown, body: LangType, i: number) => {
  options.value.push(currentLang.value)
  options.value.splice(i, 1)
  $changeLocale(body.value)
  onChangeLocale(body.value)
  currentLang.value = body
  fn()
}

getLanguage()
</script>

<style scoped lang="scss">
@import '../../assets/styles/layouts/the-header-lang.scss';
</style>
