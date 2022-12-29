<template>
  <div class="header" :class="{ dark: theme === THEME.DARK }">
    <div class="header__list-icon">
      <VIcon
        :color="theme === THEME.DARK ? '#fff' : ''"
        icon="menu-list"
        @click="$emit('toggle-mini')"
      />
    </div>
    <div class="header__logo">
      <VIcon v-show="theme === THEME.LIGHT" size="100%" icon="logo" />
      <VIcon v-show="theme === THEME.DARK" size="100%" icon="logo-dark" />
    </div>
    <TheHeaderSystem v-if="size === 'lg' || size === 'xl'" />
    <VSpacer class="header__spacer" />
    <TheHeaderCourse v-if="role !== ROLES.SUPER_ADMIN" class="mr-10" />
    <div v-if="role === ROLES.SUPER_ADMIN" class="header__setting-icons mr-10">
      <VIcon
        v-show="theme === THEME.LIGHT"
        class="mr-3 header__setting-icons__setting cursor-pointer"
        size="100%"
        icon="theme-icon-light"
        @click="$toggleTheme"
      />
      <VIcon
        v-show="theme === THEME.DARK"
        class="mr-3 header__setting-icons__setting cursor-pointer"
        size="100%"
        icon="theme-icon-dark"
        @click="$toggleTheme"
      />
    </div>
    <div v-else class="header__setting-icons mr-10">
      <VIcon
        v-show="theme === THEME.LIGHT"
        class="mr-3 header__setting-icons__setting hide cursor-pointer"
        size="100%"
        icon="theme-icon-light"
        @click="$toggleTheme"
      />
      <VIcon
        v-show="theme === THEME.DARK"
        class="mr-3 header__setting-icons__setting hide cursor-pointer"
        size="100%"
        icon="theme-icon-dark"
        @click="$toggleTheme"
      />
      <VIcon
        :color="theme === THEME.DARK ? '#fff' : ''"
        class="header__setting-icons__notifications cursor-pointer"
        size="100%"
        icon="notification"
      />
    </div>
    <TheHeaderLang is-header />
    <TheProfileDropdown
      :theme="theme === THEME.DARK"
      class="header__profile-dropdown"
    />
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import TheHeaderLang from '@/components/layouts/TheHeaderLang.vue'
import TheHeaderCourse from '@/components/layouts/TheHeaderCourse.vue'
import TheHeaderSystem from '@/components/layouts/TheHeaderSystem.vue'
import TheProfileDropdown from '@/components/layouts/TheProfileDropdown.vue'

import { useThemeService } from '@/plugins/theme-service'
import { useUserService } from '@/plugins/user-service'
import { ROLES } from '@/utils/constants'
import { useResizeWindow } from '@/composables/resize-window'

const { size } = useResizeWindow()
const { theme, THEME, $toggleTheme } = useThemeService()
const { role } = useUserService()
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-header';
</style>
