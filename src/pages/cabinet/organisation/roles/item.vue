<template>
  <VBackBtn class="mb-10" />
  <VCard>
    <Form @submit="submit" ref="formRef">
      <VRow>
        <VCol md="5">
          <VInput
            :label="$t('name')"
            rules="required|max:255"
            vid="name"
            v-model="form.name"
          />
        </VCol>
        <VCol md="5">
          <VArea
            rows="1"
            :label="$t('description')"
            rules="required|max:255"
            vid="description"
            v-model="form.description"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VCheckbox
            :label="$t('chooseAll')"
            v-model="chooseAll"
            @change="selectedAll"
          />
        </VCol>
        <VCol
          v-for="(permission, key, i) in permissionsList"
          :key="`permission-${i}`"
          md="4"
        >
          <VText size="18" tag="p" class="mb-20">
            {{ key }}
          </VText>
          <div v-for="(item, j) in permission" :key="`list-${j}`">
            <VCheckbox
              :label="item.description"
              :value="item.name"
              vid="is_main"
              @change="choseRole"
              v-model="permissionResult"
            />
          </div>
        </VCol>
      </VRow>
      <VLine class="mt-12" />
      <VCardAction class="mt-24">
        <VSpacer />
        <VBtn color="primary" type="submit" class="ml-16" :loading="loading"
          >{{ form.id ? $t('edit') : $t('add') }}
        </VBtn>
      </VCardAction>
    </Form>
  </VCard>
</template>

<script setup lang="ts">
import VCardAction from '@/components/ui/VCardAction.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VLine from '@/components/ui/VLine.vue'
import VArea from '@/components/ui/VArea.vue'
import VCard from '@/components/ui/VCard.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'
import VText from '@/components/ui/VText.vue'
import VBackBtn from '@/components/ui/VBackBtn.vue'
import { Form } from 'vee-validate'

import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import {
  createEditOrganisationsRoles,
  getOneRole,
  getPermissionsList,
} from '@/services/cabinet/RolesService'
import type {
  RolesFormTypes,
  PermissionsListTypes,
} from '@/types/cabinet/RolesTypes'
import { useLoadingService } from '@/plugins/loading-service'
import { $localePath } from '@/plugins/i18n'

const { $successMessage } = useNotificationService()
const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { t } = useI18n()
const { params } = useRoute()
const router = useRouter()

const { id: paramsId } = params

const FORM_DATA = {
  name: '',
  description: '',
  permissions: [],
}

defineProps({
  positionList: Array,
  counterpartyList: Array,
})

const emits = defineEmits(['fetch-data'])

const dialog = ref(false)

const form = ref<RolesFormTypes>({
  ...FORM_DATA,
})

const permissionsList = ref<Record<string, Array<PermissionsListTypes>>>({})

const loading = ref(false)

const chooseAll = ref(false)

const formRef = ref()

const permissionResult = ref<Array<string>>([])

watch(dialog, (val) => {
  if (!val) {
    form.value = { ...FORM_DATA }
    if (formRef.value) formRef.value.resetForm()
  }
})

const getPermissions = async () => {
  $showLoading()
  try {
    const { data } = await getPermissionsList()
    permissionsList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const selectedAll = (val: boolean) => {
  if (val) {
    const roles = Object.keys(permissionsList.value)
    roles.forEach((p: string) => {
      permissionsList.value[p].forEach((p: PermissionsListTypes) => {
        permissionResult.value.push(p.name)
      })
    })
  } else {
    permissionResult.value = []
  }
}

const getOne = async () => {
  try {
    const { data } = await getOneRole(+paramsId)
    data.permissions.forEach((p: Record<string, string>) => {
      if (p.name) permissionResult.value.push(p.name)
    })
    form.value.name = data.name
    form.value.description = data.description
    form.value.id = data.id
    checkChoseAll()
  } catch (err) {
    $setResponseErrors(err)
  }
}

const choseRole = () => {
  checkChoseAll()
}

const checkChoseAll = () => {
  const list = Object.keys(permissionsList.value)
  let listIndex = 0
  list.forEach((p: string) => {
    listIndex += permissionsList.value[p].length
  })
  if (listIndex === permissionResult.value.length)
    return (chooseAll.value = true)
  chooseAll.value = false
}

const useFetchData = async () => {
  $showLoading()
  await getPermissions()
  if (paramsId) {
    await getOne()
  }
  $clearLoading()
}

const submit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    form.value.permissions = permissionResult.value
    await createEditOrganisationsRoles(form.value)
    emits('fetch-data')
    if (form.value.id) $successMessage(t('notifications.editedSuccessfully'))
    else $successMessage(t('notifications.addedSuccessfully'))
    await router.push($localePath('/cabinet/roles'))
    dialog.value = false
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

useFetchData()
</script>

<style scoped></style>
