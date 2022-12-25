<template>
  <VMenu class="profile-menu cursor-pointer">
    <template #title>
      <div class="profile-menu__user-block">
        <VImg static class="profile-menu__user-block__img" src="user.png" />
        <div class="profile-menu__user-block__info">
          <h4
            class="profile-menu__user-block__info__title"
            :class="{
              'profile-menu__user-block__info__title__light': theme,
            }"
          >
            {{ user?.type?.toUpperCase() }}
          </h4>
          <p
            class="profile-menu__user-block__info__sub-title"
            :class="{
              'profile-menu__user-block__info__sub-title__light': theme,
            }"
          >
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
</template>

<script lang="ts" setup>
import VMenu from '@/components/ui/VMenu.vue'
import VImg from '@/components/ui/VImg.vue'

import { ref } from 'vue'
import { useUserService } from '@/plugins/user-service'
import { useI18n } from 'vue-i18n'

const { $logoutUser, user } = useUserService()
const { t } = useI18n()

defineProps({
  theme: {
    type: Boolean,
    default: false,
  },
})

const options = ref([{ title: t('logout'), value: 'logout' }])

const onMenuClick = (fn: () => unknown) => {
  fn()
  $logoutUser()
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/layouts/the-profile-dropdown.scss';
</style>
