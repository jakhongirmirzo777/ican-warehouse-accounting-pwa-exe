<template>
  <div class="v-table-actions">
    <VBtn
      v-if="actions.view && (props.view ? $can(props.view) : true)"
      class="mr-8"
      @click="$emit('view')"
      small
    >
      <VIcon size="14" color="#17BDC0" icon="eye" />
    </VBtn>
    <VBtn
      v-if="actions.edit && (props.update ? $can(props.update) : true)"
      small
      class="mr-8"
      @click="$emit('edit')"
    >
      <VIcon size="16" icon="pencil" />
    </VBtn>
    <ElPopconfirm
      v-if="actions.delete && (props.delete ? $can(props.delete) : true)"
      hide-icon
      :title="title"
      cancel-button-type="primary"
      confirm-button-type="danger"
      :confirm-button-text="t('yes')"
      :cancel-button-text="t('no')"
      @confirm="$emit('delete')"
    >
      <template #reference>
        <VBtn class="ml-2" small>
          <VIcon size="12" icon="delete" />
        </VBtn>
      </template>
    </ElPopconfirm>
  </div>
</template>

<script setup lang="ts">
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import { ElPopconfirm } from 'element-plus'

import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  view: {},
  update: {},
  delete: {},
  actions: {
    type: Object,
    default: () => {
      return {
        view: false,
        edit: true,
        delete: true,
        title: null,
      }
    },
  },
})

const title = computed(() => {
  if (props.actions?.title) return props.actions?.title
  else return t('areYouSureDelete')
})
</script>

<style lang="scss">
@import '../../assets/styles/ui/v-table-actions';
</style>
