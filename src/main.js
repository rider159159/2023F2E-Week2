import { createApp } from 'vue'
import '../src/style/style.scss'
import VueDatePicker from '@vuepic/vue-datepicker'
import App from './App.vue'
import 'uno.css'
import '@unocss/reset/tailwind.css'
import { setupStore } from './stores'
import { setupRouter } from './router'

function setupApp() {
  const app = createApp(App)
  app.component('VueDatePicker', VueDatePicker)
  setupStore(app)
  setupRouter(app)
  app.mount('#app')
}
setupApp()
