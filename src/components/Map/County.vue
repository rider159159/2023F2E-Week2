<!-- 縣市 -->
<script setup>
import { storeToRefs } from 'pinia'
import countyGeoData from '@/assets/GeoData/countyGeoData.json'
import { pathGenerator } from '@/utils/d3'
import vote2024 from '@/assets/Vote/2024.json'
import { yearColor } from '@/utils/share/variable'
import { mapStore, searchStore } from '@/stores'
import { removeSpace } from '@/utils'

const props = defineProps({
  voteData: { type: Object, default: vote2024 },
  svg: { type: Object },
})
const emits = defineEmits(['setCountyEmit'])

const SearchStore = searchStore()
const { SEARCH_YEAR, SEARCH_CITY, TRIGGER_EVENT } = storeToRefs(SearchStore)

const findLargestParty = computed(() => {
  return (item) => {
    const { color2020, color2024 } = yearColor
    const county = removeSpace(item.properties.county_en)
    const { candidate1, candidate2, candidate3 } = props.voteData[county]

    switch (SEARCH_YEAR.value) {
      case '2020' :
        if (candidate1.votes > candidate2.votes && candidate1.votes > candidate3.votes)
          return color2020.PFPColor
        if (candidate2.votes > candidate1.votes && candidate2.votes > candidate3.votes)
          return color2020.KMTColor
        if (candidate3.votes > candidate1.votes && candidate3.votes > candidate2.votes)
          return color2020.DPPColor
        break

      case '2024' :
        if (candidate1.votes > candidate2.votes && candidate1.votes > candidate3.votes)
          return color2024.TPPColor
        if (candidate2.votes > candidate1.votes && candidate2.votes > candidate3.votes)
          return color2024.DPPColor
        if (candidate3.votes > candidate1.votes && candidate3.votes > candidate2.votes)
          return color2024.KMTColor
        break

      default:
        if (candidate1.votes > candidate2.votes && candidate1.votes > candidate3.votes)
          return color2024.TPPColor
        if (candidate2.votes > candidate1.votes && candidate2.votes > candidate3.votes)
          return color2024.DPPColor
        if (candidate3.votes > candidate1.votes && candidate3.votes > candidate2.votes)
          return color2024.KMTColor
        break
    }
  }
})

const computedPath = computed(() => {
  return feature => pathGenerator(feature.geometry)
})

const x = computed(() => (feature) => {
  const bounds = pathGenerator.bounds(feature.geometry)
  return (bounds[0][0] + bounds[1][0]) / 2
})

const y = computed(() => (feature) => {
  const bounds = pathGenerator.bounds(feature.geometry)
  return (bounds[0][1] + bounds[1][1]) / 2
})

function setTargetCounty(item) {
  const bounds = pathGenerator.bounds(item.geometry)
  TRIGGER_EVENT.value = 'Click'
  emits('setCountyEmit', {
    county_en: item.properties.county_en,
    bounds,
  })
}

// TODO:下拉選單觸發
watch(SEARCH_CITY, () => {
  if (TRIGGER_EVENT) {
    const targetCity = countyGeoData.features.find(item => item.properties.county_en === SEARCH_CITY.value)
    const bounds = pathGenerator.bounds(targetCity.geometry)

    emits('setCountyEmit', {
      county_en: targetCity.properties.county_en,
      bounds,
    })
  }
})

onMounted (() => {

})
</script>

<template>
  <g v-for="(item, index) in countyGeoData.features" :key="index" class="county">
    <g>
      <path
        :d="computedPath(item)"
        :fill="findLargestParty(item)"
        @click="setTargetCounty(item)"
      />
      <text
        v-if="SEARCH_CITY.length === 0"
        :y="y(item)"
        :x="x(item)"
        text-anchor="middle"
        dominant-baseline="middle"
        class="county-name"
      >
        {{ item.properties.county }}
      </text>
    </g>
  </g>
</template>

<style scoped>
.county-name {
    font-size: 6px;
    fill: #fff;
    pointer-events: none;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
</style>
