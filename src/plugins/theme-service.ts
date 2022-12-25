import { ref } from 'vue'
import { THEME } from '@/utils/constants'
import { useStorageService } from '@/plugins/storage-service'

const $bgColorLight = '#EFF7FF'
const $bgColorDark = '#3a3f5c'
const { $get, $set } = useStorageService()
const theme = ref($get(THEME.key) || THEME.LIGHT)

export function useThemeService() {
  const setBodyColor = () => {
    const html = document.querySelector('html')
    const body = document.querySelector('body')
    if (body && html) {
      if (theme.value === THEME.LIGHT) {
        html.classList.remove('dark')
      } else {
        html.classList.add('dark')
      }
      body.style.backgroundColor =
        theme.value === THEME.LIGHT ? $bgColorLight : $bgColorDark
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    $set(THEME.key, theme.value)
    setBodyColor()
  }

  return {
    THEME,
    theme,
    setBodyColor,
    toggleTheme,
  }
}
