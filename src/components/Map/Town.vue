<script setup>
import { storeToRefs } from 'pinia'
import townGeoData from '@/assets/GeoData/townGeoData.json'
import Vote from '@/assets/Vote/2020.json'
import { mapStore } from '@/stores'
import { pathGenerator } from '@/utils/d3'
import { removeSpace } from '@/utils'

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

// 返回城市顏色
function findLargestParty(item) {
  const town = removeSpace(item.properties.town_en)
  const county = removeSpace(item.properties.county_en)
  const { candidate1, candidate2, candidate3 } = Vote[county].detail[town]
  // TODO:  candidate1.votes 可比政黨大小
  console.log(candidate1,candidate2,Vote[county].detail[town])

  // console.log(Vote,item.properties.county_en.)
  // const cityData = cityList.value.find(city => city.City === cityName)

  // if (!cityData)
  //   return '#000' // 如果找不到城市，返回 null

  // // 比較 PFP、KMT 和 DPP 的值
  // const maxVotes = Math.max(cityData.PFP, cityData.KMT, cityData.DPP)

  // // 根據最大值返回顏色代碼
  // if (maxVotes === cityData.PFP)
  //   return PFPColor // PFP最大

  // else if (maxVotes === cityData.KMT)
  //   return KMTColor // KMT最大

  // else
  //   return DPPColor // DPP最大
}
</script>

<template>

  <g v-if="targetCountyData.length > 0" class="town">
    <g v-for="item in targetCountyData" :key="item.id" class="cursor-pointer">
      <path
        :fill="findLargestParty(item)"
        :d="computedPath(item)"
      />
    </g>
  </g>
</template>
