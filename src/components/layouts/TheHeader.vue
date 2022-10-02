<template>
  <div class="header">
    <div class="header__list-icon">
      <VIcon icon="menu-list" @click="$emit('toggleMini')"></VIcon>
    </div>
    <div class="header__logo">
      <VIcon size="100%" icon="logo" />
    </div>
    <div class="header__search">
      <VInput :label="$t('search')" hide-details v-model="search">
        <template #prepend>
          <VIcon icon="search" size="16" />
        </template>
      </VInput>
    </div>
    <VSpacer class="header__spacer"></VSpacer>
    <div class="header__setting-icons mr-10">
      <VIcon
        class="mr-3 header__setting-icons__setting"
        size="100%"
        icon="setting"
      />
      <VIcon
        class="header__setting-icons__notifications"
        size="100%"
        icon="notification"
      />
    </div>
    <ProfileDropdown class="header__profile-dropdown" />
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import VInput from '@/components/ui/VInput.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import { ref } from 'vue'
import ProfileDropdown from '@/components/layouts/ProfileDropdown.vue'

const search = ref('')
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-header';
</style>
