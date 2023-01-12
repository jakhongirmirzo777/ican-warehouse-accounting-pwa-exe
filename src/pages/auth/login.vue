<template>
  <div class="login__wrapper" :class="{ dark: theme === THEME.DARK }">
    <div class="login__box">
      <div class="login__box--top">
        <Form @submit="onSubmit">
          <div class="d-flex justify-center mb-30">
            <VImg
              v-if="theme === THEME.LIGHT"
              class="login__logo"
              static
              src="logo.png"
            />
            <VImg v-else class="login__logo" static src="logo-dark.png" />
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
                  <VIcon
                    icon="user"
                    :color="theme === THEME.DARK ? '#fff' : '#868EAA'"
                    size="16"
                  />
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
import { useThemeService } from '@/plugins/theme-service'
import { useUserService } from '@/plugins/user-service'
import { useTokenService } from '@/plugins/token-service'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { useFormActions, useErrorActions } from '@/composables/set-errors'
import { useQuery } from '@/composables/router-query'
import { FROM_ANOTHER_SERVICE, IS_SHARED_SYSTEM } from '@/utils/constants'

const { $getQuery, $clearQuery } = useQuery()
const { theme, THEME } = useThemeService()
const loading = ref(false)
const { $loginUser, $fetchUser, $redirectToCabinet, $clearUser } =
  useUserService()
const { $setToken, $setTimeOutRefreshToken, $setCredentials, $getCredentials } =
  useTokenService()
const { $setResponseErrors } = useErrorActions()

const formData = reactive<LoginFormDataInterface>({
  username: '',
  password: '',
})
const queries = $getQuery([FROM_ANOTHER_SERVICE])
$clearQuery([FROM_ANOTHER_SERVICE])

const handleUserCredentials = async () => {
  try {
    const fromAnotherService = queries[FROM_ANOTHER_SERVICE] === 'true'
    if (!fromAnotherService || !IS_SHARED_SYSTEM) return
    const credentials = await $getCredentials()
    if (credentials) {
      const {
        data: { data },
      } = await $loginUser(credentials as any)
      await $setToken(data)
      await $fetchUser()
      await $setTimeOutRefreshToken()
      await $redirectToCabinet()
    } else {
      console.warn('Block is working')
      // await $clearQuery([])
      // await $clearUser()
    }
  } catch (err) {
    $setResponseErrors(err)
    await $clearQuery([])
    await $clearUser()
  }
}

const onSubmit = async (_: never, actions: ActionInterface) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const {
      data: { data },
    } = await $loginUser(formData)
    await $setCredentials({
      email: formData.username,
      username: formData.username,
      password: formData.password,
    })
    await $setToken(data)
    await $fetchUser()
    await $setTimeOutRefreshToken()
    await $redirectToCabinet()
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

handleUserCredentials()
</script>

<style lang="scss" scoped>
@import '../../assets/styles/pages/login';
</style>
