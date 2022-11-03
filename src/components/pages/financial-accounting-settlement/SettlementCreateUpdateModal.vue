<template>
  <VModal
    :title="
      form.id ? t('editCounterpartyAccounts') : t('addCounterpartyAccounts')
    "
    v-model="dialog"
    width="447"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol>
          <VSelect
            :label="$t('organisation')"
            rules="required"
            vid="name_uz"
            :items="organisationList"
            item-value="id"
            item-text="name"
            v-model="form.organisation_id"
          />
        </VCol>
        <VCol>
          <VInput
            :label="$t('accountNumber')"
            rules="required|max:255"
            pattern="####################"
            counter="20"
            type="number"
            vid="account"
            v-model="form.account"
          />
        </VCol>
        <VCol>
          <VArea
            :label="$t('comment')"
            rules="required|max:10000"
            vid="comment"
            rows="5"
            v-model="form.comment"
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
import VSelect from '@/components/ui/VSelect.vue'
import VArea from '@/components/ui/VArea.vue'
import { Form } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { createEditSettlement } from '@/services/cabinet/FinancialAccountingSettlementServices'
import type { SettlementFormTypes } from '@/types/cabinet/FinancialAccountingSettlementTypes'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  organisation_id: null,
  account: null,
  comment: '',
}

defineProps({
  positionList: Array,
  counterpartyList: Array,
  organisationList: Array,
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form = ref<SettlementFormTypes>({
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

const openDialog = (item: SettlementFormTypes) => {
  if (item && item.id) {
    form.value = { ...item }
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    await createEditSettlement(form.value)
    emits('fetch-data')
    $successMessage(t('notifications.addedSuccessfully'))
    dialog.value = false
  } catch (err) {
    $setResponseErrors(err)
    $setFormErrors(err)
  } finally {
    loading.value = false
  }
}

defineExpose({ openDialog })
</script>

<style scoped></style>
