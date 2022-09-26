<template>
  <VModal
    :title="form.id ? t('editPlaces') : t('addPlaces')"
    v-model="dialog"
    width="718"
  >
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol md="6">
          <VInput
            :label="$t('name_uz')"
            rules="required|max:255"
            vid="name_uz"
            v-model="form.name_uz"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('name_oz')"
            rules="required|max:255"
            vid="name_oz"
            v-model="form.name_oz"
          />
        </VCol>
        <VCol md="6">
          <VInput
            :label="$t('name_ru')"
            rules="required|max:255"
            vid="name_ru"
            v-model="form.name_ru"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            :items="locationList"
            item-text="name"
            item-value="id"
            :label="$t('attachAvailablePlaces')"
            v-model="form.parent_id"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            :items="statusList"
            item-text="name"
            item-value="value"
            :label="$t('status')"
            v-model="form.status"
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
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import {
  createEditLocations,
  fetchLocationsList,
} from '@/services/cabinet/LocationsService'
import type {
  LocationListType,
  ReferenceLocationsFormTypes,
} from '@/types/cabinet/LocationsTypes'
import VSelect from '@/components/ui/VSelect.vue'
import { useLoadingService } from '@/plugins/loading-service'

interface ValueType<T> {
  value: T
}

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()

const FORM_DATA = {
  name_uz: '',
  name_oz: '',
  name_ru: '',
  status: 0,
  parent_id: '',
}

defineProps({
  positionList: Array,
  counterpartyList: Array,
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form: ValueType<ReferenceLocationsFormTypes> = ref({
  ...FORM_DATA,
})

const loading = ref(false)

const locationList = ref<LocationListType[]>([])

const formRef = ref()

const statusList = ref<Array<{ name: string; value: number }>>([
  { value: 10, name: t('active') },
  { value: 0, name: t('notActive') },
])

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    if (formRef.value) formRef.value.resetForm()
  }
})

const openDialog = (item: ReferenceLocationsFormTypes) => {
  if (item && item.id) {
    form.value = { ...item }
  }
  dialog.value = true
}

const getLocationList = async () => {
  $showLoading()
  try {
    const { data } = await fetchLocationsList()
    locationList.value = data
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    await createEditLocations(form.value)
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

getLocationList()
defineExpose({ openDialog })
</script>

<style scoped></style>
