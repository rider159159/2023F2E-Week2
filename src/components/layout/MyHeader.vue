<script setup>
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import taiwanCityJSON from '@/assets/City/taiwanCity.json'

const store = searchStore()
const { SEARCH_YEAR, SEARCH_CITY, SEARCH_CITY_TOWN } = storeToRefs(store)
const taiwanCityList = ref()
const dropdownList = ref([
  {
    label: '2016',
    value: '2016',
  },
  {
    label: '2020',
    value: '2020',
  },
  {
    label: '2024',
    value: '2024',
  },
])

function makeJson() {
  taiwanCityList.value = taiwanCityJSON.map((item) => {
    return item.CityName
  })
}

const townsCityList = ref(
  [],
)

watch(SEARCH_CITY, () => {
  if (SEARCH_CITY.value !== 'all') {
    const currentCity = taiwanCityJSON.filter(i => i.CityName === SEARCH_CITY.value)
    townsCityList.value = currentCity[0]?.AreaList
    SEARCH_CITY_TOWN.value = ''
  }
})

onMounted(() => {
  SEARCH_CITY.value = 'all'
  makeJson()
})
</script>

<template>
  <header class="fixed z-10 top-0 left-0 w-full flex bg-#fff shadow-lg py-3 px-6">
    <img src="/header/logo.svg" class="mr-6" alt="logo">
    <div class="flex items-center">
      <p class="text-primary font-bold mr-4">
        選擇年分
      </p>
      <Dropdown v-model="SEARCH_YEAR" :items="dropdownList" />
      <!-- 城市/鄉鎮選單 -->
      <div class="flex items-center rounded-50px bg-#E9ECEF relative w-400px h-42px py-2">
        <div class="flex absolute">
          <select v-model="SEARCH_CITY" class="bg-transparent w-150px px-4 ">
            <option selected value="all">
              全部
            </option>
            <option v-for="item in taiwanCityList" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
          <div class="text-#CED4DA px-4">
            |
          </div>
          <select v-if=" SEARCH_CITY !== 'all'" id="taiwanCity" v-model="SEARCH_CITY_TOWN" placeholder="請選擇區域" class="bg-transparent">
            <option selected disabled value="">
              請選擇區域
            </option>
            <option v-for="item in townsCityList" :key="item" :value="item">
              {{ item.AreaName }}
            </option>
          </select>
        </div>
        <!-- <input v-model="SEARCH_CITY" list="city" class="absolute left-16px bg-transparent" placeholder="請選擇縣市"> -->
      </div>
    </div>
  </header>
</template>
