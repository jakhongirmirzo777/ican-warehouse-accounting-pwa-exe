import maska from 'maska'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.use(maska)
  },
}
