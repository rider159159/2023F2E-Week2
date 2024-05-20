<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'

const SearchStore = searchStore()
const { SEARCH_CITY, SEARCH_YEAR } = storeToRefs(SearchStore)

let zoom, svgElement, initialTransform
let modalZoom, modalSvgElement, modalInitialTransform
const svg = ref()
const g = ref(null)
const modalG = ref(null)
function zoomed(event,dom) {
  const { transform } = event
  d3.select(dom)
    .attr('transform', transform)
}

function test(item,type='modal'){
  const { county_en, bounds } = item
  SEARCH_CITY.value = county_en
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]

  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = 0.9 / Math.max(dx / 400, dy / 600)

  // 取得目前的縮放比例和平移量
  const element = type == 'mounted'? svgElement.node() : modalSvgElement.node()
  const currentTransform = d3.zoomTransform(element)
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
  if(type=='mounted'){
    svgElement.transition()
    .duration(300)
    .call(zoom.transform, newTransform)
  }else{
    modalSvgElement.transition()
    .duration(300)
    .call(modalZoom.transform, newTransform)
  }
}

function setCounty(item,type='mounted') {
  const { county_en, bounds } = item
  SEARCH_CITY.value = county_en
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]

  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = 0.9 / Math.max(dx / 400, dy / 600)

  // 取得目前的縮放比例和平移量
  const element = type == 'mounted'? svgElement.node() : modalSvgElement.node()
  const currentTransform = d3.zoomTransform(element)
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
  if(type=='mounted'){
    svgElement.transition()
    .duration(300)
    .call(zoom.transform, newTransform)
  }else{
    modalSvgElement.transition()
    .duration(300)
    .call(modalZoom.transform, newTransform)
  }
}

function setMapZoom(type='mounted',dom) {
  if(type=='mounted'){
    zoom = d3.zoom()
    .scaleExtent([1, 12])
    .on('zoom', (event)=>zoomed(event,g.value))
    svgElement = d3.select(dom)
    svgElement.call(zoom)

    
  } else{
    modalZoom=d3.zoom()
    .scaleExtent([1, 12])
    .on('zoom', (event)=>zoomed(event,modalG.value))
    modalSvgElement = d3.select(dom)
    modalSvgElement.call(modalZoom)
  }
}

function back() {
  SEARCH_CITY.value = 'all'
  resetTransform()
}

function resetTransform() {
  svgElement.transition()
    .duration(300)
    .call(zoom.transform, initialTransform)
}

watch(SEARCH_CITY, (newValue) => {
  if (newValue === 'all')
    resetTransform()
})

watch(SEARCH_YEAR, (newValue, oldValue) => {
  if (newValue !== oldValue)
    back()
})
const modal = ref(false)
const modalSvg = ref(null)

function openModal() {
  modal.value = true

  setMapZoom('modal',modalSvg.value)
  modalInitialTransform = d3.zoomTransform(modalSvgElement.node())
}
function closeModal() {
  modal.value = false
}

onMounted (() => {
  setMapZoom('mounted',svg.value)
  // 設定初始化位置
  initialTransform = d3.zoomTransform(svgElement.node())
})
</script>

<template>
  <div 
    class="bg-#E4FAFF w-full lg:min-w-400px lg:max-w-400px max-h-200px lg:max-h-none lg:h-600px overflow-hidden relative">
    <div
      v-if="SEARCH_CITY !== 'all'"
      class="absolute top-0 w-full left-0 cursor-pointer bg-white opacity-90 text-center py-2"
      @click="back"
    >
      回上一步
    </div>
    <svg
      ref="svg"
      class="h-full w-full"
      viewBox="0,0,400,600"
    >
      <g ref="g" class="g" stroke-width="0.1">
        <County :svg="svg" @set-county-emit="(item)=>setCounty(item,'mounted')" />
        <Town />
      </g>
    </svg>
    <!-- 遮罩 -->
    <div class="flex justify-center items-center lg:hidden absolute top-0 left-0 w-full h-full bg-black/50 z-8">
      <button @click="openModal" class="text-white bg-#DA29A8 py-2 px-4 rounded-10px">進入地圖</button>
    </div>
  </div>
  <Modal v-model="modal" @update:modelValue="closeModal" :title="'台灣地圖'">
    <section class="bg-#E4FAFF w-full lg:w-400px max-70vh md:max-h-none md:h-600px overflow-hidden relative">
      <svg
        ref="modalSvg"
        class="h-full w-full"
        viewBox="0,0,400,600"
      >
        <g ref="modalG" class="g" stroke-width="0.1">
          <County :svg="svg" @set-mobile-county-emit="(item)=>setCounty(item,'modal')" />
          <Town />
        </g>
      </svg>
    </section>
  </Modal>
</template>

<style scoped>

</style>
