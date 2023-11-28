import { createPinia } from 'pinia'

export function setupStore(AppInstance) {
  const store = createPinia()
  AppInstance.use(store)
}
export * from './searchStore'
