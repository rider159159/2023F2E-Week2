import { defineStore } from 'pinia'

export const searchStore = defineStore('search-store', () => {
  // 也可以使用 any   const USER_INFO_REF: any = ref({})
  const SEARCH_YEAR = ref('2020')
  const SEARCH_CITY = ref('')
  const SEARCH_CITY_TOWN = ref('')
  return {
    SEARCH_YEAR,
    SEARCH_CITY,
    SEARCH_CITY_TOWN,
  }
})
