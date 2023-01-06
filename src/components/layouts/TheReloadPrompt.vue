<template>
  <Teleport to="#notifications">
    <div
      v-if="offlineReady || needRefresh"
      class="reload__container"
      role="alert"
    >
      <div class="reload__message">
        <h3 class="reload__message__title" v-if="offlineReady">
          {{ t('readyToWorkOffline') }}
        </h3>
        <h3 class="reload__message__title" v-else>
          {{ t('reloadContent') }}
        </h3>
      </div>
      <button
        v-if="needRefresh"
        class="reload__btn reload__btn--reload"
        @click="updateServiceWorker()"
      >
        {{ t('reload') }}
      </button>
      <button class="reload__btn reload__btn--close" @click="close">
        {{ t('close') }}
      </button>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-reload-prompt';
</style>
