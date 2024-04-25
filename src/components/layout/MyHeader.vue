<script setup>
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import taiwanCityJSON from '@/assets/City/taiwanCity.json'

const store = searchStore()
const { SEARCH_YEAR, SEARCH_CITY, SEARCH_CITY_TOWN, TRIGGER_EVENT } = storeToRefs(store)
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
    return {
      fieldCN: item.CityName,
      fieldEn: item.CityEngName,
    }
  })
}

const townsCityList = ref(
  [],
)

// 監聽年分，年份更改時 SEARCH_CITY 變成全部
watch(SEARCH_YEAR, (newValue, oldValue) => {
  if (newValue !== oldValue)
    SEARCH_CITY.value = 'all'
})

// 監聽縣市，當縣市變換，更換 SEARCH_CITY_TOWN
watch(SEARCH_CITY, () => {
  TRIGGER_EVENT.value = 'select'
  if (SEARCH_CITY.value !== 'all') {
    const currentCity = taiwanCityJSON.filter(i => i.CityEngName === SEARCH_CITY.value)
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
    
    <div class="grid grid-cols-4 md:grid-cols-7 gap-4">
      <!-- MD 上 3 份，小於 MD 也是 3 份 -->
      <div class="col-span-3 md:col-span-3">
        <img src="/header/logo.svg" class="mr-6" alt="logo">
      </div>

      <!-- MD 上 1 份，小於 MD 也是 1 份 -->
      <div class="flex col-span-1 md:col-span-2 items-center">
        <p class="hidden md:block text-primary font-bold mr-4">
          選擇年分
        </p>
      <Dropdown v-model="SEARCH_YEAR" :title="SEARCH_YEAR" :items="dropdownList" />
      </div>

      <!-- MD 上 1 份，小於 MD 占 2 份(1/2) -->
      <div class="col-span-2 md:col-span-1 flex items-center">
        <select v-model="SEARCH_CITY" class="bg-transparent w-full md:w-150px px-4 ">
            <option selected value="all">
              全部
            </option>
            <option v-for="item in taiwanCityList" :key="item" :value="item.fieldEn">
              {{ item.fieldCN }}
            </option>
        </select>
        <div class="text-#CED4DA px-4">
          |
        </div>
      </div> 

      <!-- MD 上 1 份，小於 MD 占 2 份(1/2) -->
      <div class="col-span-2 md:col-span-1">
        <select v-if=" SEARCH_CITY !== 'all'" id="taiwanCity" v-model="SEARCH_CITY_TOWN" placeholder="請選擇區域" class="bg-transparent w-full">
          <option selected disabled value="">
            請選擇區域
          </option>
          <option v-for="item in townsCityList" :key="item" :value="item">
            {{ item.AreaName }}
          </option>
        </select>
      </div> 
    </div>

  </header>
</template>
