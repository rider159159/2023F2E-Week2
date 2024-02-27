<script setup>
import { storeToRefs } from 'pinia'
import { mapStore } from '@/stores'
import { pathGenerator } from '@/utils/d3'
import { removeSpace } from '@/utils'
import townGeoData from '@/assets/GeoData/townGeoData.json'
import Vote from '@/assets/Vote/2020.json'

const map = mapStore()
const { targetCounty } = storeToRefs(map)

const targetCountyData = computed(() => {
  const list = townGeoData.features.filter((item) => {
    return item.properties.county_en === targetCounty.value
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
function findLargestParty(item) {
  const town = removeSpace(item.properties.town_en)
  const county = removeSpace(item.properties.county_en)
  const { candidate1, candidate2, candidate3 } = Vote[county].detail[town]
  // TODO:  candidate1.votes 可比政黨大小
  if (candidate1.votes > candidate2.votes && candidate1.votes > candidate3.votes)
    return '#F4A76F'

  if (candidate2.votes > candidate1.votes && candidate2.votes > candidate3.votes)
    return '#8082FF'

  if (candidate3.votes > candidate1.votes && candidate3.votes > candidate2.votes)
    return '#57D2A9'
}
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
