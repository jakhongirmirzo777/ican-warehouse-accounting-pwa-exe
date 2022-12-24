<template>
  <VModal
    :title="form.id ? t('editCounterparty') : t('addCounterparty')"
    v-model="dialog"
    width="718"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('brandName')"
            rules="required|max:255"
            vid="brand_name"
            v-model="form.brand_name"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('companyName')"
            rules="required|max:255"
            vid="company_name"
            v-model="form.company_name"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('tin')"
            rules="required|length:9"
            vid="tin"
            pattern="#########"
            counter="9"
            v-model="form.tin"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('address')"
            rules="required|max:255"
            vid="address"
            v-model="form.address"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('director')"
            rules="required|max:255"
            vid="director"
            v-model="form.director"
          />
        </VCol>
      </VRow>
      <TransitionGroup name="list">
        <VRow v-for="(_, i) in phones" :key="`phone-${i}`">
          <VCol cols="12" md="6">
            <VInput
              rules="required"
              type="phone"
              :vid="`phones[${i}]`"
              :label="$t('phone')"
              :name="$t('phone')"
              v-model="phones[i]"
            />
          </VCol>
          <VCol cols="12" md="6">
            <VBtn
              v-if="i === 0"
              color="primary"
              outlined
              border-radius="12"
              @click="phones.push('')"
              >{{ $t('addPhone') }}</VBtn
            >
            <VBtn
              v-if="i > 0"
              color="danger"
              outlined
              border-radius="12"
              @click="phones.splice(i, 1)"
              >{{ $t('delete') }}</VBtn
            >
          </VCol>
        </VRow>
      </TransitionGroup>
      <TransitionGroup name="list">
        <VRow
          v-for="(_, i) in form.counterparty_accounts"
          :key="`counterparty_account-${i}`"
        >
          <VCol cols="12" md="6">
            <VInput
              :label="$t('counterpartyAccounts')"
              rules="required|length:20"
              pattern="####################"
              counter="20"
              :name="$t('counterpartyAccounts')"
              :vid="`counterparty_accounts[${i}]`"
              v-model="form.counterparty_accounts[i].account"
            />
          </VCol>
          <VCol cols="12" md="6">
            <VBtn
              v-if="i === 0"
              color="primary"
              outlined
              border-radius="12"
              @click="form.counterparty_accounts.push({ account: '' })"
              >{{ $t('addFacture') }}</VBtn
            >
            <VBtn
              v-if="i > 0"
              color="danger"
              outlined
              border-radius="12"
              @click="form.counterparty_accounts.splice(i, 1)"
              >{{ $t('delete') }}</VBtn
            >
          </VCol>
        </VRow>
      </TransitionGroup>
      <VLine class="mt-12" />
      <VCardAction class="mt-24">
        <VSpacer />
        <VBtn color="primary" outlined @click="dialog = false">{{
          $t('cancel')
        }}</VBtn>
        <VBtn color="primary" type="submit" class="ml-16" :loading="loading">
          {{ form.id ? $t('edit') : $t('add') }}
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
import { Form } from 'vee-validate'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createEditOrganisations } from '@/services/cabinet/CounterpartyCounterpartiesService'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { $clearNonDigits } from '@/utils/pure-functions'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import type { OrganizationsCounterpartyTypesFetch } from '@/types/cabinet/CounterpartyCounterpartiesTypes'
import VLine from '@/components/ui/VLine.vue'

interface ValueType<T> {
  value: T
}

const { $successMessage } = useNotificationService()

const FORM_DATA = {
  brand_name: '',
  company_name: '',
  tin: '',
  address: '',
  director: '',
  phones: [''],
  counterparty_accounts: [{ account: '' }],
}

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const { $setResponseErrors } = useErrorActions()

const phones: ValueType<Array<string>> = ref([''])

const form: ValueType<OrganizationsCounterpartyTypesFetch> = ref({
  ...FORM_DATA,
})

const { t } = useI18n()

const loading = ref(false)

const formRef = ref()

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    phones.value = ['']
    form.value.counterparty_accounts = [{ account: '' }]
    if (formRef.value) formRef.value.resetForm()
  }
})

const openDialog = (item?: OrganizationsCounterpartyTypesFetch) => {
  if (item && item.id) {
    form.value = { ...item }
    item.phones.length
      ? (phones.value = [...item.phones])
      : (form.value.phones = [''])
    if (!item.counterparty_accounts.length)
      form.value.counterparty_accounts = [{ account: '' }]
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  phones.value.forEach((p: string, i: number) => {
    form.value.phones[i] = $clearNonDigits(p)
  })
  try {
    loading.value = true
    await createEditOrganisations(form.value as any)
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

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
