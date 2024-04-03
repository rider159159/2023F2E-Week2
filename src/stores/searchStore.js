import { defineStore } from 'pinia'
import { computed } from '@vue/runtime-core'
import vote2016 from '@/assets/Vote/2016.json'
import vote2020 from '@/assets/Vote/2020.json'
import vote2024 from '@/assets/Vote/2024.json'
import { removeSpace } from '@/utils'

export const searchStore = defineStore('search-store', () => {
  // 也可以使用 any   const USER_INFO_REF: any = ref({})
  const SEARCH_YEAR = ref('2024')
  const SEARCH_CITY = ref('all')
  const SEARCH_CITY_TOWN = ref('')
  const TRIGGER_EVENT = ref('')

  const CURRENT_VOTE_DATA = computed(() => {
    switch (Number(SEARCH_YEAR.value)) {
      case 2016:
        return vote2016
      case 2020:
        return vote2020
      case 2024:
        return vote2024
      default:
        return 2024
    }
  })

  const ARRAY_VOTE_DATA = computed(() => {
    switch (Number(SEARCH_YEAR.value)) {
      case 2016: {
        const data = Object.values(vote2016)
        return data
      }
      case 2020: {
        const data = Object.values(vote2020)
        return data
      }
      case 2024: {
        const data = Object.values(vote2024)
        return data
      }
      default: {
        const data = Object.values(vote2024)
        return data
      }
    }
  })

  const CURRENT_CITY_DATA = computed(() => {
    const data = CURRENT_VOTE_DATA.value[removeSpace(SEARCH_CITY.value)]
    return data
  })

  return {
    SEARCH_YEAR,
    SEARCH_CITY,
    SEARCH_CITY_TOWN,
    TRIGGER_EVENT,
    CURRENT_VOTE_DATA,
    ARRAY_VOTE_DATA,
    CURRENT_CITY_DATA,
  }
})
