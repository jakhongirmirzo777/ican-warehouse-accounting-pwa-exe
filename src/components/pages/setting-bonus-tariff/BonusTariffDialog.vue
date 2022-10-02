<template>
  <VModal
    :title="form.id ? t('editBonusTariff') : t('addBonusTariff')"
    v-model="dialog"
    width="718"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol md="6">
          <VInput
            :label="$t('name')"
            rules="required|max:255"
            vid="name"
            v-model="form.name"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('amountFrom')"
            rules="required"
            type="money"
            vid="amount_from"
            v-model="form.amount_from"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('percentSell')"
            rules="required|max_value:100"
            type="number"
            vid="percent_sell"
            v-model="form.percent_sell"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('amountTo')"
            rules="required"
            type="money"
            vid="amount_to"
            v-model="form.amount_to"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('percentSellLeg')"
            rules="required|max_value:100"
            type="number"
            max="100"
            vid="percent_sell_leg"
            v-model="form.percent_sell_leg"
          />
        </VCol>
        <VCol md="6"></VCol>
        <VCol md="6">
          <VInput
            :label="$t('percentCredit')"
            rules="required|max_value:100"
            type="number"
            vid="percent_credit"
            v-model="form.percent_credit"
          />
        </VCol>
      </VRow>
      <VLine class="mt-12" />
      <VCardAction class="mt-24">
        <VSpacer />
        <VBtn color="primary" outlined @click="dialog = false"
          >{{ $t('cancel') }}
        </VBtn>
        <VBtn color="primary" type="submit" class="ml-16" :loading="loading"
          >{{ form.id ? $t('edit') : $t('add') }}
        </VBtn>
      </VCardAction>
    </Form>
  </VModal>
</template>

<script setup lang="ts">
import VModal from '@/components/ui/VModal.vue'
import VCardAction from '@/components/ui/VCardAction.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VLine from '@/components/ui/VLine.vue'
import { Form } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { createEditSettingBonuses } from '@/services/cabinet/SettingBonusTariffService'
import type { SettingBonusFormTypes } from '@/types/cabinet/SettingBonusTariffTypes'
import { $clearNonDigits } from '@/utils/pure-functions'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  name: '',
  amount_from: '',
  amount_to: '',
  percent_sell: '',
  percent_sell_leg: '',
  percent_credit: '',
}

defineProps({
  positionList: Array,
  counterpartyList: Array,
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form = ref<SettingBonusFormTypes>({
  ...FORM_DATA,
})

const loading = ref(false)

const formRef = ref()

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    if (formRef.value) formRef.value.resetForm()
  }
})

const openDialog = (item: SettingBonusFormTypes) => {
  if (item && item.id) {
    form.value = { ...item }
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    form.value.amount_from = $clearNonDigits(form.value.amount_from)
    form.value.amount_to = $clearNonDigits(form.value.amount_to)
    loading.value = true
    await createEditSettingBonuses(form.value)
    emits('fetch-data')
    $successMessage(t('notifications.addedSuccessfully'))
    dialog.value = false
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

defineExpose({ openDialog })
</script>

<style scoped></style>
