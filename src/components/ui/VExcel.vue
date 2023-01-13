<template>
  <VBtn
    color="success"
    min-width="141px"
    :loading="loading"
    @click="handleDownload"
  >
    <div class="d-flex align-center">
      <VIcon class="mr-2" size="18" icon="file" color="#fff" />
      <span>{{ t('excelDownload') }}</span>
    </div>
  </VBtn>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import http from '@/plugins/http'
import { useErrorActions } from '@/composables/set-errors'
import { $downloadBlobFile } from '@/utils/pure-functions'
import { ref } from 'vue'
import VIcon from '@/components/ui/VIcon.vue'
import VBtn from '@/components/ui/VBtn.vue'

const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
})

const loading = ref(false)

const handleDownload = async () => {
  try {
    if (!props.url) return console.error('The url is not provided')
    const allFilters = Object.entries(props.filters).reduce(
      (acc: Record<string, any>, [key, val]) => {
        if (val) acc[key] = val
        return acc
      },
      {}
    )
    delete allFilters.lastPage
    delete allFilters.perPage
    delete allFilters.total
    loading.value = true
    const { data } = await http.get(props.url, {
      params: { ...allFilters, excel: 1 },
      responseType: 'blob',
    })
    await $downloadBlobFile(data)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-excel';
</style>
