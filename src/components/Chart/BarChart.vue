<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { drawBarChart } from '@/utils/d3'

const store = searchStore()
const { CURRENT_PARTY_DATA } = storeToRefs(store)

function clearChart() {
  d3.select('#totalChart')
    .selectAll('*')
    .remove()
}

watch(
  () => CURRENT_PARTY_DATA.value,
  (newValue) => {
    const params = {
      width: 400,
      height: 20,
      chartId: `totalChart`,
    }
    clearChart() // 清除上一次的圖表
    drawBarChart(newValue, params) // 重新繪製圖表
  },
  {
    deep: true,
  },
)

onMounted(() => {
  const params = {
    width: 400,
    height: 20,
    chartId: `totalChart`,
  }
  drawBarChart(CURRENT_PARTY_DATA.value, params)
})
</script>

<template>
  <div class="flex justify-center min-w-500px">
    <svg id="totalChart" />
  </div>
</template>
