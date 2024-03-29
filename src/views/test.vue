<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { mapStore } from '@/stores'
import vote2020 from '@/assets/Vote/2020.json'
import vote2024 from '@/assets/Vote/2024.json'

const map = mapStore()
const { targetCounty } = storeToRefs(map)

let zoom, svgElement
const svg = ref()
const g = ref(null)

function zoomed(event) {
  const { transform } = event
  d3.select(g.value)
    .attr('transform', transform)
}

function setCounty(item) {
  const { county_en, bounds } = item
  targetCounty.value = county_en
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]

  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = 0.9 / Math.max(dx / 400, dy / 600)

  // 取得目前的縮放比例和平移量
  const currentTransform = d3.zoomTransform(svgElement.node())
  const currentScale = currentTransform.k
  const currentTranslateX = currentTransform.x
  const currentTranslateY = currentTransform.y

  // 考慮目前的縮放比例，計算視窗寬度和高度
  const scaledWidth = 400 / currentScale
  const scaledHeight = 600 / currentScale

  // 計算中心點的座標
  const centerX = (scaledWidth / 2) - (currentTranslateX / currentScale)
  const centerY = (scaledHeight / 2) - (currentTranslateY / currentScale)

  // 根据中心点和新的缩放比例，计算平移量
  const translateX = centerX - scale * x
  const translateY = centerY - scale * y

  // 根據中心點和新的縮放比例，計算平移量
  const newTransform = d3.zoomIdentity.translate(translateX, translateY).scale(scale)

  // 設定新的平移和縮放變換
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
  <div class="bg-#E4FAFF w-400px h-600px relative">
    <div class="absolute top-0 w-full left-0 cursor-pointer bg-white opacity-90 text-center py-2" @click="targetCounty = ''">
      回上一步
    </div>
    <svg
      ref="svg"
      class="h-full w-full"
      viewBox="0,0,400,600"
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
