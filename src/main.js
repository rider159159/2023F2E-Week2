import { createApp } from 'vue'
import '../src/style/style.scss'
import App from './App.vue'
import 'uno.css'
import '@unocss/reset/tailwind.css'
import { setupStore } from './stores'
import { setupRouter } from './router'

function setupApp() {
  const app = createApp(App)
  setupStore(app)
  setupRouter(app)
  app.mount('#app')
}
setupApp()
