<template>
  <VModal
    width="720px"
    :title="!isUpdate ? t('addEmployee') : t('editEmployee')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit" ref="formObj">
      <VRow>
        <VCol md="6" v-if="!isUpdate">
          <VInput
            vid="username"
            rules="required"
            :label="$t('username')"
            v-model="formData.username"
          >
            <template #prepend>
              <VIcon
                icon="user"
                :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
                size="16"
              />
            </template>
          </VInput>
        </VCol>
        <VCol md="6" v-if="!isUpdate">
          <VInput
            vid="password"
            rules="required|min:6"
            type="password"
            :label="$t('password')"
            v-model="formData.password"
          />
        </VCol>
        <VCol md="6">
          <VInput
            vid="full_name"
            :label="t('fio')"
            rules="required|max:255"
            v-model="formData.full_name"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            vid="department_id"
            rules="required"
            :label="t('departments')"
            :items="departments"
            v-model="formData.department_id"
          />
        </VCol>
        <VCol md="6">
          <VSelect
            vid="position_id"
            rules="required"
            :label="t('positions')"
            :items="positions"
            v-model="formData.position_id"
          />
        </VCol>
        <VCol md="6">
          <VInput
            vid="phone"
            type="phone"
            :label="t('phone')"
            rules="required"
            v-model="formData.phone"
          />
        </VCol>
      </VRow>
      <VLine class="mb-24" />
      <div class="d-flex justify-end align-center">
        <VBtn
          type="button"
          class="mr-16"
          outlined
          width="130px"
          color="primary"
          radius="12px"
          @click="$emit('update:modelValue', false)"
        >
          {{ t('cancel') }}
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          width="130px"
          :loading="loading"
          radius="12px"
        >
          {{ !isUpdate ? t('add') : t('edit') }}
        </VBtn>
      </div>
    </Form>
  </VModal>
</template>

<script lang="ts" setup>
import VModal from '@/components/ui/VModal.vue'
import VInput from '@/components/ui/VInput.vue'
import VLine from '@/components/ui/VLine.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VIcon from '@/components/ui/VIcon.vue'

import { ref, watch } from 'vue'
import {
  createEmployee,
  editEmployee,
} from '@/services/cabinet/EmployeesService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import { $clearNonDigits } from '@/utils/pure-functions'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME } = useThemeService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  id: null,
  username: null,
  password: null,
  full_name: null,
  phone: null,
  department_id: null,
  position_id: null,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  departments: {
    type: Array,
    default: () => [],
  },
  positions: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:modelValue', 'submit'])

const formObj = ref<any>(null)
const loading = ref(false)
const formData = ref<Record<string, any>>({ ...FORM_DATA })

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      formData.value = { ...FORM_DATA }
      formObj.value?.resetForm()
    } else if (val && props.isUpdate) {
      formData.value.id = props.data.id || null
      formData.value.full_name = props.data.full_name || null
      formData.value.phone = props.data.phone || null
      formData.value.department_id = props.data.department_id || null
      formData.value.position_id = props.data.position_id || null
    }
  }
)

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const newFormData = { ...formData.value }
    newFormData.phone = $clearNonDigits(newFormData.phone)
    if (!props.isUpdate) await createEmployee(newFormData)
    else await editEmployee(newFormData)
    await emits('submit')
    await emits('update:modelValue', false)
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}
</script>
