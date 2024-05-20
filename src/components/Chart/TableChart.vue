<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { numberWithCommas, toFixed2 } from '@/utils'
import { drawBarChart } from '@/utils/d3'
import { searchStore } from '@/stores'
import { useScreenWidth } from '@/composables/useScreenWidth'; // 確


const { screenWidth } = useScreenWidth();

const store = searchStore()
const { SEARCH_YEAR, CURRENT_CITY_ARRAY_DATA } = storeToRefs(store)
let tooltip = null

function CURRENT_PARTY_ARRAY_DATA(item) {
  const { candidate1, candidate2, candidate3, validVotes } = item
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
}

function renderTableChart() {
  nextTick(()=>{
    CURRENT_CITY_ARRAY_DATA.value.forEach((item, index) => {
      d3.select(`#chart-${index}`).selectAll('*').remove()
    })

    CURRENT_CITY_ARRAY_DATA.value.forEach((item, index) => {
      const data = CURRENT_PARTY_ARRAY_DATA(item)
      const params = {
        width: barChartWidth.value,
        height: 10,
        chartId: `chart-${index}`,
      }
      drawBarChart(data, params, tooltip)
    })
  })
}

function createTooltip() {
  tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('background', 'white')
    .style('border-radius', '5px')
    .style('box-shadow', '0 0 10px rgba(0,0,0,.25)')
    .style('padding', '10px')
    .style('line-height', '1.3')
    .style('font', '11px sans-serif')
}

function toggleMobileTooltip() {
  
}

const barChartWidth = computed(()=>{
  if(screenWidth.value > 769){
    return 200
  }
  return (screenWidth.value-200)
})

watch(() => SEARCH_YEAR.value, () => {
  renderTableChart()
})

watch(() => CURRENT_CITY_ARRAY_DATA.value, () => {
  renderTableChart()
})

// function openModal(item) {
// }

onMounted(() => {
  createTooltip()
  renderTableChart()
})
</script>

<template>
  <section class=" flex flex-col w-full">

    <table v-if="screenWidth >= 768" class="overflow-x-autos w-full min-w-780px">
      <thead class="bg-gray1 ">
        <tr>
          <th class="text-left p-2 text-primary rounded-l-4px">
            地區
          </th>
          <th class="text-left p-2 text-primary ">
            得票率
          </th>
          <th class="text-left p-2 text-primary ">
            最高得票人
          </th>
          <th class="text-left p-2 text-primary ">
            投票數
          </th>
          <th class="text-left p-2 text-primary rounded-r-4px">
            投票率
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in CURRENT_CITY_ARRAY_DATA" :key="index" class="border-b border-#DEE2E6 last:border-0">
          <td class="py-10px pl-2 font-bold text-#334155">
            {{ item.fieldCN }}
          </td>
          <td class="chart-cell">
            <svg :id="`chart-${index}`" class="bar-chart" />
          </td>
          <td class="cell">
            <div v-if="item.highVotes === '中國國民黨'" class="flex items-center">
              <img src="/Role.png" class="rounded-50px mr-4" alt="德古拉">
              <p>德古拉</p>
            </div>
            <div v-else-if="item.highVotes === '民主進步黨'" class="flex items-center">
              <img src="/Role-2.png" class="rounded-50px mr-4" alt="綠巨魔">
              <p>綠巨魔</p>
            </div>
            <div v-else class="flex items-center">
              <img src="/Role-1.png" class="rounded-50px mr-4" alt="林克">
              <p>林克</p>
            </div>
          </td>
          <td>
            {{ numberWithCommas(item.validVotes) }}
          </td>
          <td class="py-10px pr-2">
            {{ toFixed2(item.voteRate) }}%
          </td>
        </tr>
      </tbody>
    </table>

    <table v-else class="block md:hidden w-full">
      <thead class="bg-gray1 w-full">
        <tr>
          <th class="text-left p-2 text-primary rounded-l-4px">
            地區
          </th>
        </tr>
      </thead>
      <tbody class="w-full">
        <tr v-for="(item, index) in CURRENT_CITY_ARRAY_DATA" :key="index" class="border-b border-#DEE2E6 last:border-0">
          <td class="py-10px pl-2 w-full flex items-center">
            <p class="font-bold text-#334155 min-w-80px">
              {{ item.fieldCN }}
            </p>
            <section class="flex w-full">
              <div>
                <div class="flex items-center mb-4">
                  <p class="mr-4">最高得票人</p>
                  <div v-if="item.highVotes === '中國國民黨'" class="flex items-center">
                    <img src="/Role.png" class="rounded-50px mr-4" alt="德古拉">
                    <p>德古拉</p>
                  </div>
                  <div v-else-if="item.highVotes === '民主進步黨'" class="flex items-center">
                    <img src="/Role-2.png" class="rounded-50px mr-4" alt="綠巨魔">
                    <p>綠巨魔</p>
                  </div>
                  <div v-else class="flex items-center">
                    <img src="/Role-1.png" class="rounded-50px mr-4" alt="林克">
                    <p>林克</p>
                  </div>
                </div>
                <svg :id="`chart-${index}`" class="bar-chart" />
              </div>
              <!-- @click="openModal(item)" -->
              <img  class="px-4" src="/navigate_next.svg" alt="">
            </section>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style>
.bar-chart {
  width: 100%;
  height: 20px;
}

.chart-cell {
  width: 205px; /* Adjust the width as needed */
}

.cell{
  width: 150px;
}

thead{
    border-collapse: separate;
    border-spacing: 0; /* 可選：消除單元格之間的間隔 */
}
</style>
