<script setup>
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import taiwanCityJSON from '@/assets/taiwanCity.json'

const store = searchStore()
const { SEARCH_YEAR, SEARCH_CITY, SEARCH_CITY_TOWN } = storeToRefs(store)

const taiwanCityList = ref()

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
      <select v-model="SEARCH_YEAR" class="bg-#E9ECEF py-2 px-4 rounded-50px mr-4">
        <option selected value="2020">
          2020
        </option>
        <option value="2016">
          2016
        </option>
        <option value="2012">
          2012
        </option>
        <option value="2008">
          2008
        </option>
        <option value="2004">
          2004
        </option>
      </select>

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
