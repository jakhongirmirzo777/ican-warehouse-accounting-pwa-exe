<template>
  <div
    class="d-flex justify-center align-center flex-column"
    style="height: 100vh"
  >
    <div style="width: 300px">
      <VInput label="username" v-model="formData.username">
        <template #prepend>
          <VIcon icon="user" color="#868EAA" size="16" />
        </template>
      </VInput>
      <VInput label="password" type="password" v-model="formData.password" />
      <button @click="onSubmit">Click me</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VInput from '@/components/ui/VInput.vue'
import { reactive } from 'vue'
import type { LoginFormDataInterface } from '@/types/auth/LoginTypes'
import { useUserService } from '@/plugins/user-service'
import { useTokenService } from '@/plugins/token-service'
import VIcon from '@/components/ui/VIcon.vue'

const userService = useUserService()
const tokenService = useTokenService()

const formData = reactive<LoginFormDataInterface>({
  username: 'organisation1',
  password: 'admin12345',
})

const onSubmit = async () => {
  try {
    const {
      data: { data },
    } = await userService.loginUser(formData)
    await tokenService.setToken(data)
    await userService.fetchUser()
    await tokenService.setTimeOutRefreshToken()
    await userService.redirectToCabinet()
  } catch (err) {
    console.error(err)
  }
}
</script>
