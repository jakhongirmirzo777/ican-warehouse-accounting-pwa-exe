<template>
  <a :href="creditPath" class="header__system__container" target="_blank">
    <div class="header__system__left">
      <VIcon
        v-show="theme === THEME.LIGHT && !white"
        size="100%"
        icon="logo-ican"
      />
      <VIcon
        v-show="theme === THEME.DARK || white"
        size="100%"
        icon="logo-dark-ican"
      />
    </div>
    <div class="header__system__right">
      <VText
        tag="span"
        weight="500"
        size="12"
        :color="white ? '#fff' : '#18275D'"
      >
        {{ t('goToCreditSystem') }}
      </VText>
    </div>
  </a>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import VIcon from '@/components/ui/VIcon.vue'
import VText from '@/components/ui/VText.vue'
import { useThemeService } from '@/plugins/theme-service'
import { FROM_ANOTHER_SERVICE } from '@/utils/constants'

const { theme, THEME } = useThemeService()
const { t } = useI18n()

defineProps({
  white: {
    type: Boolean,
    default: false,
  },
})

const creditPath = `${
  import.meta.env.VITE_BASE_CREDIT_PATH
}/auth?${FROM_ANOTHER_SERVICE}=true`
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-header-system';
</style>
