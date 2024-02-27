<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { mapStore } from '@/stores'

const map = mapStore()
const { targetCounty } = storeToRefs(map)

const svg = ref()
let zoom
const g = ref(null)

function zoomed(event) {
  const { transform } = event
  console.log(transform)
  d3.select(g.value)
    .attr('transform', transform)
}

let svgElement

function setCounty(item) {
  const { county_en, bounds } = item
  targetCounty.value = county_en
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]

  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = 0.9 / Math.max(dx / 300, dy / 400)

  // 計算可視區域的中心點
  const currentTransform = d3.zoomTransform(svgElement.node())
  const center = [400 / 2 - currentTransform.x / currentTransform.k, 800 / 2 - currentTransform.y / currentTransform.k]

  const translate = [center[0] - scale * x, center[1] - scale * y]

  // 設置新的平移和縮放變換
  const newTransform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)

  // 使用過渡效果實現平滑移動
  svgElement.transition()
    .duration(300)
    .call(zoom.transform, newTransform)
}

onMounted (() => {
  zoom = d3.zoom()
    .scaleExtent([1, 12])
    .on('zoom', zoomed)
  svgElement = d3.select(svg.value)
  svgElement.call(zoom)
})
</script>

<template>
  <div class="bg-#E4FAFF min-w-400px h-800px">
    <svg
      ref="svg"
      class="h-full w-full"
      viewBox="0,0,400,800"
    >
      <g ref="g" class="g" stroke-width="0.1">
        <County :svg="svg" @set-county-emit="setCounty" />
        <Town />
      </g>
    </svg>
  </div>
</template>

<style scoped>

</style>
