<template>
  <VModal v-model="dialog" :title="$t('attention') + '!'" width="520">
    <Form @submit="$emit('check-bonus-product', itemDate)">
      {{ $t('bonusProductText') }}
      <div class="mt-30">
        <VLine class="my-18" />
        <div class="d-flex justify-end align-center">
          <VBtn
            type="button"
            class="mr-16"
            outlined
            width="130px"
            color="primary"
            radius="12px"
            @click="dialog = false"
          >
            {{ $t('cancel') }}
          </VBtn>
          <VBtn type="submit" color="primary" width="130px" radius="12px">
            {{ $t('payExtra') }}
          </VBtn>
        </div>
      </div>
    </Form>
  </VModal>
</template>

<script setup lang="ts">
import VModal from '@/components/ui/VModal.vue'
import VLine from '@/components/ui/VLine.vue'
import VBtn from '@/components/ui/VBtn.vue'
import { Form } from 'vee-validate'

import { ref, defineExpose, defineProps } from 'vue'
import type { DirectSaleDataItemType } from '@/types/cabinet/DirectSaleTypes'

defineProps({
  currency: {
    type: String,
    default: 'UZS',
  },
  paymentTypeList: {
    type: Array,
  },
})

const itemDate = ref<Record<string, any>>({})

const openDialog = (item: DirectSaleDataItemType) => {
  dialog.value = true
  itemDate.value = item
}

const closeDialog = () => {
  dialog.value = false
}

const dialog = ref(false)

defineExpose({ openDialog, closeDialog })
</script>
