<template>
  <VModal
    :title="form.id ? t('addCurrencies') : t('editCurrencies')"
    v-model="dialog"
    width="718"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('name_uz')"
            rules="required|max:255"
            vid="name_uz"
            v-model="form.name_uz"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('name_ru')"
            rules="required|max:255"
            vid="name_ru"
            v-model="form.name_ru"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('name_oz')"
            rules="required|max:255"
            vid="name_en"
            v-model="form.name_oz"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('url')"
            rules="required|max:255"
            vid="url"
            v-model="form.url"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VInput
            :label="$t('symbol')"
            rules="required|max:255"
            vid="symbol"
            v-model="form.symbol"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            :label="$t('counterparties')"
            :items="currencyKeyList"
            item-text="name"
            item-value="id"
            rules="required|max:255"
            vid="key"
            v-model="form.key"
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
import {
  createEditCourses,
  getCurrencyList,
} from '@/services/cabinet/ReferenceCurrenciesServise'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import type { ReferenceCoursesFormTypes } from '@/types/cabinet/ReferenceCurrenciesTypes'
import type { CurrencyKeyList } from '@/types/cabinet/ReferenceCurrenciesTypes'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  name_uz: '',
  name_ru: '',
  name_oz: '',
  key: '',
  url: '',
  symbol: '',
}

defineProps({
  positionList: Array,
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form = ref<ReferenceCoursesFormTypes>({
  ...FORM_DATA,
})

const currencyKeyList = ref<Array<CurrencyKeyList>>([])

const loading = ref(false)

const formRef = ref()

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    if (formRef.value) formRef.value.resetForm()
  }
})

const openDialog = (item: ReferenceCoursesFormTypes) => {
  if (item && item.id) {
    form.value = { ...item }
  }
  dialog.value = true
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    await createEditCourses(form.value)
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

const fetchCurrencyList = async () => {
  try {
    const { data } = await getCurrencyList()
    currencyKeyList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

fetchCurrencyList()

defineExpose({ openDialog })
</script>

<style scoped></style>
