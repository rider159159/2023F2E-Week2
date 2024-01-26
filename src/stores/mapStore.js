import { defineStore } from 'pinia'

export const mapStore = defineStore('map-store', () => {
  // 也可以使用 any   const USER_INFO_REF: any = ref({})
  const targetCounty = ref('')
  return {
    targetCounty,
  }
})
