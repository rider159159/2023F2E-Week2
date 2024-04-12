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

  const CURRENT_PARTY_DATA = computed(() => {
    const { candidate1, candidate2, candidate3, validVotes } = CURRENT_CITY_DATA.value

    let checkParty1 = 0
    let checkParty2 = 0
    let checkParty3 = 0

    switch (candidate1.party) {
      case '中國國民黨':
        checkParty1 = 1
        break
      case '民主進步黨':
        checkParty1 = 3
        break
      default:
        checkParty1 = 2
        break
    }

    switch (candidate2.party) {
      case '中國國民黨':
        checkParty2 = 1
        break
      case '民主進步黨':
        checkParty2 = 3
        break
      default:
        checkParty2 = 2
        break
    }

    switch (candidate3.party) {
      case '中國國民黨':
        checkParty3 = 1
        break
      case '民主進步黨':
        checkParty3 = 3
        break
      default:
        checkParty3 = 2
        break
    }

    const chartData = {
      Other: checkParty3 === 2 ? candidate3.votes : checkParty2 === 2 ? candidate2.votes : checkParty1 === 2 ? candidate1.votes : '',
      KMT: checkParty3 === 1 ? candidate3.votes : checkParty2 === 1 ? candidate2.votes : checkParty1 === 1 ? candidate1.votes : '',
      DPP: checkParty3 === 3 ? candidate3.votes : checkParty2 === 3 ? candidate2.votes : checkParty1 === 3 ? candidate1.votes : '',
      Total: validVotes,
    }

    return chartData
  })

  return {
    SEARCH_YEAR,
    SEARCH_CITY,
    SEARCH_CITY_TOWN,
    TRIGGER_EVENT,
    CURRENT_VOTE_DATA,
    ARRAY_VOTE_DATA,
    CURRENT_CITY_DATA,
    CURRENT_PARTY_DATA,
  }
})
