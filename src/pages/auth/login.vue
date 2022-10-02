<template>
  <div class="login__wrapper">
    <div class="login__box">
      <div class="login__box--top">
        <Form @submit="onSubmit">
          <div class="d-flex justify-center mb-30">
            <VImg class="login__logo" static src="logo.png" />
          </div>
          <VRow>
            <VCol>
              <VInput
                vid="username"
                rules="required"
                :label="$t('username')"
                v-model="formData.username"
              >
                <template #prepend>
                  <VIcon icon="user" color="#868EAA" size="16" />
                </template>
              </VInput>
            </VCol>
            <VCol>
              <VInput
                vid="password"
                rules="required|min:6"
                type="password"
                :label="$t('password')"
                v-model="formData.password"
              />
            </VCol>
            <VCol>
              <VBtn
                :loading="loading"
                color="primary"
                width="100%"
                type="submit"
              >
                {{ $t('login') }}
              </VBtn>
            </VCol>
          </VRow>
        </Form>
      </div>
      <div class="login__box--bottom">
        <div class="d-flex align-center flex-column">
          <p>{{ $t('supportService') }}</p>
          <a href="tel:+998939825001">+998 93 982 5001</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VInput from '@/components/ui/VInput.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VImg from '@/components/ui/VImg.vue'

import { reactive, ref } from 'vue'
import type { LoginFormDataInterface } from '@/types/auth/LoginTypes'
import { useUserService } from '@/plugins/user-service'
import { useTokenService } from '@/plugins/token-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useFormActions, useErrorActions } from '@/composables/set-errors'

const loading = ref(false)
const userService = useUserService()
const tokenService = useTokenService()
const { $setResponseErrors } = useErrorActions()

const formData = reactive<LoginFormDataInterface>({
  username: '',
  password: '',
})

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const {
      data: { data },
    } = await userService.loginUser(formData)
    await tokenService.setToken(data)
    await userService.fetchUser()
    await tokenService.setTimeOutRefreshToken()
    await userService.redirectToCabinet()
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/pages/login';
</style>
