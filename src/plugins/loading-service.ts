import { ref } from 'vue'

const loading = ref(false)

export function useLoadingService() {
  const $showLoading = () => {
    if (loading.value) loading.value = false
    loading.value = true
  }

  const $clearLoading = () => {
    loading.value = false
  }

  return {
    loading,
    $showLoading,
    $clearLoading,
  }
}
