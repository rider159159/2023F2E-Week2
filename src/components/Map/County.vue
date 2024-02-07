<!-- 第二份 -->
<script setup>
import { storeToRefs } from 'pinia'
import countyGeoData from '@/assets/GeoData/countyGeoData.json'
import { pathGenerator } from '@/utils/d3'
import vote2020 from '@/assets/Vote/vote2020.json'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { mapStore } from '@/stores'

const props = defineProps({
  voteData: { type: Object, default: vote2020 },
  svg: { type: Object },
})

const map = mapStore()
const { targetCounty } = storeToRefs(map)

// let zoom

// const svg = ref(null)
// const g = ref(null)

const cityList = computed(() => {
  return props.voteData.city
})

// 尋找指定縣市返回縣市顏色
function findLargestParty(cityName) {
  const cityData = cityList.value.find(city => city.City === cityName)

  if (!cityData)
    return '#000' // 如果找不到城市，返回 null

  // 比較 PFP、KMT 和 DPP 的值
  const maxVotes = Math.max(cityData.PFP, cityData.KMT, cityData.DPP)

  // 根據最大值返回顏色代碼
  if (maxVotes === cityData.PFP)
    return PFPColor // PFP最大

  else if (maxVotes === cityData.KMT)
    return KMTColor // KMT最大

  else
    return DPPColor // DPP最大
}

// function zoomed(event) {
//   const { transform } = event
//   d3.select(g.value)
//     .attr('transform', transform)
//     .attr('stroke-width', 1 / transform.k)
// }

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

const transform = computed(() => (feature) => {
  return `translate(${pathGenerator.centroid(feature)})`
})

onMounted (() => {
  // const svg = document.querySelector('.svg')
  // zoom = d3.zoom()
  //   .scaleExtent([1, 8])
  //   .on('zoom', zoomed)
  // d3.select(svg).call(zoom)
})
</script>

<template>
  <g v-for="(item, index) in countyGeoData.features" :key="index" class="county">
    <g>
      <!-- :style="{ strokeWidth: zoom ? '0.1px' : '0.3px' }" -->
      <path
        :d="computedPath(item)"
        :fill="findLargestParty(item.properties.county)"
        @click="targetCounty = item.properties.county_en"
      />
      <!-- :transform="transform(item)" -->

      <text
        :y="y(item)"
        :x="x(item)"
        class="county-name"
      >
        {{ item.properties.county }}
      </text>
    </g>
  </g>
</template>

<style>
.county-name {
    font-size: 6px;
    fill: #fff;
    pointer-events: none;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
</style>
