<!-- 區、鄉 -->
<script setup>
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import { pathGenerator } from '@/utils/d3'
import { removeSpace } from '@/utils'
import { yearColor } from '@/utils/share/variable'

import townGeoData from '@/assets/GeoData/townGeoData.json'
import vote2024 from '@/assets/Vote/2024.json'

const props = defineProps({
  voteData: { type: Object, default: vote2024 },
})

const SearchStore = searchStore()
const { SEARCH_YEAR, SEARCH_CITY } = storeToRefs(SearchStore)

const targetCountyData = computed(() => {
  const list = townGeoData.features.filter((item) => {
    return item.properties.county_en === SEARCH_CITY.value
  })
  if (list)
    return list
  return []
})

const computedPath = computed(() => {
  return (feature) => {
    if (feature)
      return pathGenerator(feature.geometry)
    return {}
  }
})

const x = computed(() => (feature) => {
  const bounds = pathGenerator.bounds(feature.geometry)
  return (bounds[0][0] + bounds[1][0]) / 2
})

const y = computed(() => (feature) => {
  const bounds = pathGenerator.bounds(feature.geometry)
  return (bounds[0][1] + bounds[1][1]) / 2
})

// 返回城市顏色
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
</script>

<template>
  <g v-if="targetCountyData.length > 0" class="town">
    <g v-for="item in targetCountyData" :key="item.id" class="cursor-pointer stroke-white stroke-[0.1]">
      <path
        :d="computedPath(item)"
        :fill="findLargestParty(item)"
      />
      <text
        :x="x(item)"
        :y="y(item)"
        text-anchor="middle"
        dominant-baseline="middle"
        class="town-name"
      >
        {{ item.properties.town }}
      </text>
    </g>
  </g>
</template>

<style scoped>
.town-name {
  font-weight: 100;
  font-size: 1px;
  stroke:#fff;
  /* fill: #000; */
  pointer-events: none;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
</style>
