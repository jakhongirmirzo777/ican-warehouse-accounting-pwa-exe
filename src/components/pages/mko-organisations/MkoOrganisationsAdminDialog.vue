<template>
  <VModal
    width="966px"
    :title="t('editOrganizations')"
    :model-value="modelValue"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <Form @submit="onSubmit">
      <VRow>
        <VCol md="4">
          <VSelect
            autocomplete
            vid="parent_id"
            :label="t('parentName')"
            :items="parents"
            rules="required"
            v-model="formData.parent_id"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="company_name"
            :label="t('companyName')"
            rules="required|max:255"
            v-model="formData.company_name"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="name"
            :label="t('name')"
            rules="required|max:255"
            v-model="formData.name"
          />
        </VCol>
        <!--        <VCol md="4">-->
        <!--          <VSelect-->
        <!--            autocomplete-->
        <!--            vid="tariff_id"-->
        <!--            :label="t('tariff')"-->
        <!--            :items="tariffs"-->
        <!--            rules="required"-->
        <!--            v-model="formData.tariff_id"-->
        <!--          />-->
        <!--        </VCol>-->
        <VCol md="4">
          <VInput
            vid="username"
            :label="t('username')"
            rules="required|max:255"
            v-model="formData.username"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="password"
            :label="t('password')"
            rules="required|min:6|max:255"
            v-model="formData.password"
          />
        </VCol>
        <VCol md="4">
          <VDatepicker
            vid="start_date"
            :label="t('startDate')"
            rules="required"
            v-model="formData.start_date"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="address"
            :label="t('address')"
            rules="required|max:255"
            v-model="formData.address"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="director"
            :label="t('director')"
            rules="required|max:255"
            v-model="formData.director"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="bank"
            :label="t('bank')"
            rules="required|max:255"
            v-model="formData.bank"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="account"
            :label="t('counterpartyAccounts')"
            pattern="####################"
            counter="20"
            rules="required|length:20"
            v-model="formData.account"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="inn"
            :label="t('tin')"
            pattern="#########"
            counter="9"
            v-model="formData.inn"
          />
        </VCol>
        <VCol md="4">
          <VInput
            vid="mfo"
            :label="t('mfo')"
            pattern="#####"
            counter="5"
            v-model="formData.mfo"
          />
        </VCol>
        <VCol md="4">
          <VSelect
            vid="change_price_type"
            localize
            :label="t('changePriceType')"
            rules="required"
            v-model="formData.change_price_type"
            :items="PRICE_CHANGE_INDEXED"
            item-text="text"
            item-value="value"
          />
        </VCol>
        <VCol md="4">
          <VInput
            clearable
            vid="contract"
            :label="t('contract')"
            rules="required"
            v-model="formData.contract"
          />
        </VCol>
        <VCol md="4">
          <VFile
            clearable
            vid="file"
            :label="t('contract')"
            rules="required"
            v-model="formData.contract_file"
          />
        </VCol>
        <VCol md="4">
          <VSwitch
            color="primary"
            :label="t('systemCourse')"
            true-value="1"
            false-value="0"
            v-model="formData.system_course"
          />
        </VCol>
        <VCol md="4">
          <div class="d-flex">
            <VInput
              class="mr-5"
              type="phone"
              vid="phones"
              :label="$t('phone')"
              v-model="phones.phone"
            />
            <VBtn
              min-width="40px"
              width="50px"
              color="primary"
              @click="phones.phones.push('')"
            >
              <VIcon size="20" icon="circle-plus" />
            </VBtn>
          </div>
          <TransitionGroup name="list">
            <div
              class="d-flex"
              v-for="(_, i) in phones.phones"
              :key="`phone-${i}`"
            >
              <VInput
                class="mr-5"
                type="phone"
                vid="phones"
                :label="$t('phone')"
                v-model="phones.phones[i]"
              />
              <VBtn
                min-width="40px"
                width="50px"
                color="danger"
                @click="phones.phones.splice(i, 1)"
              >
                <VIcon color="#fff" size="20" icon="x-mark" />
              </VBtn>
            </div>
          </TransitionGroup>
        </VCol>
        <VCol md="4">
          <VUpload vid="logo" :label="t('logo')" v-model="formData.logo" />
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
          class="mr-16"
          type="submit"
          color="primary"
          width="130px"
          :loading="loading"
          radius="12px"
        >
          {{ t('edit') }}
        </VBtn>
        <VBtn
          type="button"
          color="primary"
          width="160px"
          radius="12px"
          @click="changePasswordDialog = true"
        >
          {{ t('changePassword') }}
        </VBtn>
      </div>
    </Form>
  </VModal>
  <VModal :title="t('changePassword')" v-model="changePasswordDialog">
    <Form ref="formObj" @submit="onChangePassword">
      <VRow>
        <VCol>
          <VInput
            vid="password"
            :label="t('password')"
            rules="required"
            v-model="formDataPassword.password"
          />
        </VCol>
        <VCol>
          <VInput
            vid="confirm_password"
            :label="t('confirmPassword')"
            rules="required"
            v-model="formDataPassword.confirm_password"
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
          @click="changePasswordDialog = false"
        >
          {{ t('cancel') }}
        </VBtn>
        <VBtn
          type="submit"
          color="primary"
          width="130px"
          :loading="loadingChangePassword"
          radius="12px"
        >
          {{ t('change') }}
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
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VUpload from '@/components/ui/VUpload.vue'
import VSwitch from '@/components/ui/VSwitch.vue'
import VIcon from '@/components/ui/VIcon.vue'

import { ref, watch } from 'vue'
import {
  fetchTariffs,
  fetchOrganisationsParents,
  editOrganisation,
  changePassword,
} from '@/services/cabinet/MkoOrganisationsAdminService'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import { PRICE_CHANGE_INDEXED } from '@/utils/constants'
import { $getValuesByKey, $clearNonDigits } from '@/utils/pure-functions'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useI18n } from 'vue-i18n'
import VDatepicker from '@/components/ui/VDatepicker.vue'
import VFile from '@/components/ui/VFile.vue'
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const FORM_DATA = {
  parent_id: null,
  tariff_id: null,
  name: null,
  username: null,
  password: null,
  start_date: null,
  company_name: null,
  system_course: 0,
  change_price_type: null,
  inn: null,
  mfo: null,
  director: null,
  address: null,
  bank: null,
  account: null,
  contract: null,
  phones: [],
  contract_file: 'https://www.africau.edu/images/default/sample.pdf',
  logo: null,
}

const FORM_DATA_PASSWORD = {
  password: null,
  confirm_password: null,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      formData.value = $getValuesByKey(FORM_DATA, props.data)
      formData.value.logo = props.data.logo_url
      phones.value.phone = $clearNonDigits(props.data.phones[0]) || ''
      phones.value.phones =
        props.data.phones?.length > 1
          ? props.data.phones.slice(1).map((p: string) => $clearNonDigits(p))
          : []
    }
  }
)

const emits = defineEmits(['update:modelValue', 'submit'])

const formObj = ref<any>(null)
const loading = ref(false)
const changePasswordDialog = ref(false)
const loadingChangePassword = ref(false)
const formData = ref<Record<string, any>>({ ...FORM_DATA })
const formDataPassword = ref<Record<string, any>>({ ...FORM_DATA_PASSWORD })
const phones = ref<{ phone: string; phones: string[] }>({
  phone: '',
  phones: [],
})
const parents = ref([])
const tariffs = ref([])

watch(
  () => changePasswordDialog.value,
  (val) => {
    if (!val) {
      formDataPassword.value = { ...FORM_DATA_PASSWORD }
      formObj.value?.resetForm()
    }
  }
)

const useFetchOrganisationsParents = async () => {
  try {
    const {
      data: { data },
    } = await fetchOrganisationsParents()
    parents.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchTariffs = async () => {
  try {
    const {
      data: { data },
    } = await fetchTariffs()
    tariffs.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchData = async () => {
  try {
    await useFetchOrganisationsParents()
    await useFetchTariffs()
  } catch (err) {
    $setResponseErrors(err)
  }
}

const onChangePassword = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loadingChangePassword.value = true
    await changePassword({ id: props.data.id, ...formDataPassword.value })
    changePasswordDialog.value = false
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loadingChangePassword.value = false
  }
}

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    formData.value.phones =
      phones.value.phone && phones.value.phones.length
        ? [phones.value.phone, ...phones.value.phones]
        : phones.value.phone && !phones.value.phones.length
        ? [phones.value.phone]
        : []
    formData.value.phones = formData.value.phones.map((phone: string) =>
      $clearNonDigits(phone)
    )
    const handledFormData = new FormData()
    await Object.entries(formData.value).forEach(([key, val]) => {
      if (val && key !== 'logo' && key !== 'phones') {
        handledFormData.append(key, val)
      }
      if (val && key === 'logo' && typeof val === 'object') {
        handledFormData.append(key, val)
      }
      if (val && key === 'phones') {
        val.forEach((p: string) => {
          handledFormData.append('phones[]', p)
        })
      }
    })
    await handledFormData.append('_method', 'PUT')
    await editOrganisation(props.data.id, handledFormData)
    await emits('submit')
    await emits('update:modelValue', false)
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

useFetchData()
</script>

<style>
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
