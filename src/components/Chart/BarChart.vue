<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { drawBarChart } from '@/utils/d3'
import { useScreenWidth } from '@/composables/useScreenWidth'; // 確

let tooltip = null

const store = searchStore()
const { CURRENT_PARTY_DATA } = storeToRefs(store)
const { screenWidth } = useScreenWidth();


function clearChart() {
  d3.select('#totalChart')
    .selectAll('*')
    .remove()
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

watch(
  () => CURRENT_PARTY_DATA.value,
  (newValue) => {
    const params = {
      width: isMobile.value,
      height: 20,
      chartId: `totalChart`,
    }
    clearChart() // 清除上一次的圖表
    drawBarChart(newValue, params, tooltip) // 重新繪製圖表
  },
  {
    deep: true,
  },
)

const isMobile = computed(() => {
    if(screenWidth.value <= 768)return 300
    if(screenWidth.value <= 400)return 200

    return 400
});

onMounted(() => {
  createTooltip()
  const params = {
    width: isMobile.value,
    height: 20,
    chartId: `totalChart`,
  }
  drawBarChart(CURRENT_PARTY_DATA.value, params, tooltip)
})
</script>

<template>
  <div class="flex justify-center md:min-w-500px">
    <svg id="totalChart" />
  </div>
</template>
