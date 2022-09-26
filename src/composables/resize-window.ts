import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { $debounce } from '@/utils/pure-functions'

let IS_FIRST_INSTANCE = true
const WINDOW_SIZE = ref(0)

/*eslint-disable */
export enum Resolutions {
  sm = 320,
  md = 768,
  lg = 1000,
  xl = 1440,
}
/*eslint-enable */
export type ResolutionType = 'xl' | 'lg' | 'md' | 'sm'

export function useResizeWindow() {
  if (IS_FIRST_INSTANCE) {
    const updateWidth = (): void => {
      WINDOW_SIZE.value = document.documentElement.offsetWidth
    }

    onMounted(() => {
      updateWidth()
      window.addEventListener('resize', $debounce(updateWidth))
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', $debounce(updateWidth))
    })
    IS_FIRST_INSTANCE = false
  }

  const size = computed<ResolutionType>(() => {
    switch (true) {
      case WINDOW_SIZE.value >= Resolutions.xl:
        return 'xl'
      case WINDOW_SIZE.value >= Resolutions.lg:
        return 'lg'
      case WINDOW_SIZE.value >= Resolutions.md:
        return 'md'
      case WINDOW_SIZE.value >= Resolutions.sm:
        return 'sm'
      default:
        return 'sm'
    }
  })

  return {
    size,
  }
}
