<template>
  <div class="header">
    <div class="header__list-icon">
      <VIcon icon="menu-list" @click="$emit('toggleMini')"></VIcon>
    </div>
    <div class="header__logo">
      <VIcon size="100%" icon="logo" />
    </div>
    <div class="header__search">
      <VInput :label="t('search')" hide-details v-model="search">
        <template #prepend>
          <VIcon icon="search" size="16" />
        </template>
      </VInput>
    </div>
    <VSpacer></VSpacer>
    <div class="header__setting-icons">
      <VIcon class="mr-3" size="100%" icon="setting" />
      <VIcon size="100%" icon="notification" />
    </div>
    <VMenu class="header__profile-menu cursor-pointer">
      <template #title>
        <div class="header__user-block">
          <VImg static class="header__user-block__img" src="user.png" />
          <div class="header__user-block__info">
            <h4 class="header__user-block__info__title">
              {{ user?.type?.toUpperCase() }}
            </h4>
            <p class="header__user-block__info__sub-title">
              {{ user?.username }}
            </p>
          </div>
        </div>
      </template>
      <template #body="{ on }">
        <div
          v-for="(body, i) in options"
          :key="`body-${i}`"
          class="block-hover"
          @click="onMenuClick(on)"
        >
          {{ body.title }}
        </div>
      </template>
    </VMenu>
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import VInput from '@/components/ui/VInput.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import VImg from '@/components/ui/VImg.vue'
import VMenu from '@/components/ui/VMenu.vue'

import { ref } from 'vue'
import { useUserService } from '@/plugins/user-service'
import { useI18n } from 'vue-i18n'
const { logoutUser, user } = useUserService()
const { t } = useI18n()

const options = ref([{ title: t('logout'), value: 'logout' }])

const search = ref('')

const onMenuClick = (fn: () => unknown) => {
  fn()
  logoutUser()
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-header';
</style>
