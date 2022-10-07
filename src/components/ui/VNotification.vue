<template>
  <Teleport to="#notifications">
    <TransitionGroup name="notify" tag="div" class="notify">
      <div
        v-for="notify in NOTIFICATION_LIST"
        :key="notify"
        :class="[
          'notify__item',
          { success: notify.type === 'success' },
          { error: notify.type === 'error' },
          { warning: notify.type === 'warning' },
        ]"
      >
        <span>{{ notify.message }}</span>
        <div
          :class="['notify__item__close-icon']"
          @click="$closeNotification(notify.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 14 14"
          >
            <path
              d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z"
              transform="translate(-5 -5)"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script lang="ts" setup>
import {
  NOTIFICATION_LIST,
  useNotificationService,
} from '@/plugins/notification-service'

const { $closeNotification } = useNotificationService()
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-notification';
</style>
