import { defineStore } from 'pinia'
import vote2020 from '@/assets/Vote/2020.json'
import vote2024 from '@/assets/Vote/2024.json'
import { computed } from '@vue/runtime-core'

export const searchStore = defineStore('search-store', () => {
  // 也可以使用 any   const USER_INFO_REF: any = ref({})
  const SEARCH_YEAR = ref('2020')
  const SEARCH_CITY = ref('')
  const SEARCH_CITY_TOWN = ref('')
  const CURRENT_VOTE_DATA = computed(()=>{
    switch(Number(SEARCH_YEAR.value)) {
      case 2020:
        return vote2020
      case 2024:
        return vote2024
      default:
        return vote2020
    } 
  })

  return {
    SEARCH_YEAR,
    SEARCH_CITY,
    SEARCH_CITY_TOWN,
    CURRENT_VOTE_DATA
  }
})
