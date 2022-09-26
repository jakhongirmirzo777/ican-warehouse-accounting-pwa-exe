import { Form, Field } from 'vee-validate'
import type { App } from 'vue'
/*eslint-disable */
export default {
  install(app: App) {
    app.component('Form', Form)
    app.component('Field', Field)
  },
}
/*eslint-enable */
