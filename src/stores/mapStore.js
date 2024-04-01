import { defineStore } from 'pinia'

export const mapStore = defineStore('map-store', () => {
  const TARGET_COUNTY = ref('')
  return {
    TARGET_COUNTY,
  }
})
