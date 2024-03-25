<!-- 第二份 -->
<script setup>
import { storeToRefs } from 'pinia'
import countyGeoData from '@/assets/GeoData/countyGeoData.json'
import { pathGenerator } from '@/utils/d3'
import vote2020 from '@/assets/Vote/vote2020.json'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { mapStore } from '@/stores'
import { removeSpace } from '@/utils'
import Vote from '@/assets/Vote/2020.json'

const props = defineProps({
  voteData: { type: Object, default: vote2020 },
  svg: { type: Object },
})
const emits = defineEmits(['setCountyEmit'])

const map = mapStore()
const { targetCounty } = storeToRefs(map)

// 尋找指定縣市返回縣市顏色
function findLargestParty(item) {
  const county = removeSpace(item.properties.county_en)
  console.log(Vote[county])
  const { candidate1, candidate2, candidate3 } = Vote[county]
  if (candidate1.votes > candidate2.votes && candidate1.votes > candidate3.votes)
    return PFPColor
  if (candidate2.votes > candidate1.votes && candidate2.votes > candidate3.votes)
    return KMTColor
  if (candidate3.votes > candidate1.votes && candidate3.votes > candidate2.votes)
    return DPPColor
}

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
  emits('setCountyEmit', {
    county_en: item.properties.county_en,
    bounds,
  })
}

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
        v-if="targetCounty.length === 0"
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
