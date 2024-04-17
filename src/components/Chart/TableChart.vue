<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { numberWithCommas } from '@/utils'
import { drawBarChart } from '@/utils/d3'
import { searchStore } from '@/stores'

const store = searchStore()
const { ARRAY_VOTE_DATA, SEARCH_YEAR } = storeToRefs(store)

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
  ARRAY_VOTE_DATA.value.forEach((item, index) => {
    d3.select(`#chart-${index}`).selectAll('*').remove()
  })

  ARRAY_VOTE_DATA.value.forEach((item, index) => {
    const data = CURRENT_PARTY_ARRAY_DATA(item)
    const params = {
      width: 200,
      height: 10,
      chartId: `chart-${index}`,
    }
    drawBarChart(data, params)
  })
}

watch(() => SEARCH_YEAR.value, () => {
  renderTableChart()
})

onMounted(() => {
  renderTableChart()
})
</script>

<template>
  <section class="overflow-x-autos flex flex-col">
    <table class="w-full min-w-780px">
      <thead class="bg-gray1 ">
        <tr>
          <th class="text-left p-2 text-primary rounded-l-4px">
            地區
          </th>
          <th class="text-left p-2 text-primary ">
            得票率
          </th>
          <th class="text-left p-2 text-primary ">
            當選人
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
        <tr v-for="(item, index) in ARRAY_VOTE_DATA" :key="index" class="border-b border-#DEE2E6 last:border-0">
          <td class="py-10px pl-2 font-bold text-#334155">
            {{ item.fieldCN }}
          </td>
          <td class="chart-cell">
            <svg :id="`chart-${index}`" class="bar-chart" />
          </td>
          <td class="cell">
            <!-- v-if="checkVote === 'KMT'"  -->
            <!-- <div class="flex items-center">
              <img src="/Role.png" class="rounded-50px mr-4" alt="德古拉">
              <p>德古拉</p>
            </div> -->
            <!-- v-if="checkVote === 'DPD'" -->
            <!-- <div class="flex items-center">
              <img src="/Role-1.png" class="rounded-50px mr-4" alt="林克">
              <p>林克</p>
            </div> -->
            <!-- v-if="checkVote === 'DPP'" -->
            <div class="flex items-center">
              <img src="/Role-2.png" class="rounded-50px mr-4" alt="綠巨魔">
              <p>綠巨魔</p>
            </div>
          </td>
          <td>
            {{ numberWithCommas(item.validVotes) }}
          </td>
          <td class="py-10px pr-2">
            {{ item.voteRate }}%
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