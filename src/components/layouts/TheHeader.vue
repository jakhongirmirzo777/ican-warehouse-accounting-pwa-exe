<template>
  <div class="header" :class="{ dark: theme === THEME.DARK }">
    <div class="header__list-icon">
      <VIcon
        :color="theme === THEME.DARK ? '#fff' : ''"
        icon="menu-list"
        @click="$emit('toggleMini')"
      />
    </div>
    <div class="header__logo">
      <VIcon v-show="theme === THEME.LIGHT" size="100%" icon="logo" />
      <VIcon v-show="theme === THEME.DARK" size="100%" icon="logo-dark" />
    </div>
    <div class="header__search">
      <VInput :label="$t('search')" hide-details v-model="search">
        <template #prepend>
          <VIcon v-show="theme === THEME.LIGHT" icon="search" size="16" />
          <VIcon
            v-show="theme === THEME.DARK"
            icon="search-small-white"
            size="16"
          />
        </template>
      </VInput>
    </div>
    <VSpacer class="header__spacer"></VSpacer>
    <div class="header__setting-icons mr-10">
      <VIcon
        v-show="theme === THEME.LIGHT"
        class="mr-3 header__setting-icons__setting cursor-pointer"
        size="100%"
        icon="theme-icon-light"
        @click="toggleTheme"
      />
      <VIcon
        v-show="theme === THEME.DARK"
        class="mr-3 header__setting-icons__setting cursor-pointer"
        size="100%"
        icon="theme-icon-dark"
        @click="toggleTheme"
      />
      <VIcon
        :color="theme === THEME.DARK ? '#fff' : ''"
        class="header__setting-icons__notifications cursor-pointer"
        size="100%"
        icon="notification"
      />
    </div>
    <ProfileDropdown
      :theme="theme === THEME.DARK"
      class="header__profile-dropdown"
    />
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import VInput from '@/components/ui/VInput.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import ProfileDropdown from '@/components/layouts/ProfileDropdown.vue'

import { useThemeService } from '@/plugins/theme-service'
import { ref } from 'vue'

const { theme, THEME, toggleTheme } = useThemeService()

const search = ref('')
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-header';
</style>
