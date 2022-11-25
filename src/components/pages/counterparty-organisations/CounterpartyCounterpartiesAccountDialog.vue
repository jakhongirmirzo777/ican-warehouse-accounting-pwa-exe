<template>
  <VModal :title="$t('addCounterpartyAccount')" v-model="dialog" width="447">
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol>
          <VSelect
            :label="$t('counterparties')"
            rules="required"
            vid="counterparty_id"
            :items="counterpartyList"
            item-value="id"
            item-text="name"
            v-model="form.counterparty_id"
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
import { Form } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { createAccount } from '@/services/cabinet/CounterpartyCounterpartiesService'
import type { CounterpartyOrganisationAccountForm } from '@/types/cabinet/CounterpartyCounterpartiesTypes'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  counterparty_id: null,
  account: null,
}

defineProps({
  counterpartyList: Array,
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form = ref<CounterpartyOrganisationAccountForm>({
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

const openDialog = () => {
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    await createAccount(form.value)
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
