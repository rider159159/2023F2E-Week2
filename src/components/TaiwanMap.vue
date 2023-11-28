<script setup>
import * as d3 from 'd3'
import { geoMercator, geoPath } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import taiwanMap from '@/assets/COUNTY_MOI_1090820.json'
import vote2020 from '@/assets/vote2020.json'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
let selectedCounty
const cityList = vote2020.city
const width = 400;
const height = 800;

const path = d3.geoPath()
const zoom = d3.zoom()
const svg = d3.create("svg")
const g = svg.append("g");

const projectmethod = d3.geoMercator().center([122.7, 24]).scale(8500)
const pathGenerator = path.projection(projectmethod)

// 引入 JSON
const geometries = feature(taiwanMap, taiwanMap.objects.COUNTY_MOI_1090820)
const paths = g.selectAll('path').data(geometries.features)
const map = ref()
// 尋找指定縣市返回縣市顏色
function findLargestParty(cityName) {
  const cityData = cityList.find(city => city.City === cityName)

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

// 計算放大的視圖
function calculateZoomView(d, width, height) {
  const bounds = pathGenerator.bounds(d)
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]
  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = 0.9 / Math.max(dx / width, dy / height)
  const translate = [width / 2 - scale * x, height / 2 - scale * y]

  return { scale, translate }
}

// 點擊地圖事件
function clicked(event, d) {
  if (selectedCounty === d.properties.COUNTYNAME) {
    // 如果點擊的是同一個縣市，則不進行放大
    return
  }
  const [[x0, y0], [x1, y1]] = path.bounds(d);
  selectedCounty = d.properties.COUNTYNAME

  const { scale, translate } = calculateZoomView(d, width, height)
  // 拉近相關

  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
  )

  // 更新縣市顏色
  g.selectAll('.county')
    .style('fill', d => findLargestParty(d.properties.COUNTYNAME))

  // 高亮當前點擊的縣市
  d3.select(this)
    .style('fill', d => d3.rgb(findLargestParty(d.properties.COUNTYNAME)).brighter(0.2).toString())
}

function zoomed(event) {
  const {transform} = event;
  g.attr("transform", transform);
  g.attr("stroke-width", 1 / transform.k);
}


// 繪製地圖
async function drawChart() {

  // 創建新的 SVG 元素
  svg.attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;")

  zoom.scaleExtent([1, 8])
    .on("zoom", zoomed)

  paths.enter()
    .append('path')
    .attr('d', pathGenerator)
    .attr('class', 'county')
    .attr('fill', (d) => {
      return findLargestParty(d.properties.COUNTYNAME)
    })
    .on('click', clicked)

  // 繪製縣市名稱
  g.selectAll('.county-name')
    .data(geometries.features)
    .enter()
    .append('text')
    .attr('class', 'county-name')
    .attr('transform', (d) => {
      return `translate(${pathGenerator.centroid(d)})` // 將文字定位在每個縣市的地理中心點
    })
    .attr('dy', '.35em') // 輕微垂直調整以改善位置
    .style('text-anchor', 'middle') // 確保文字居中對齊

    .text((d) => { return d.properties.COUNTYNAME })
    svg.call(zoom);

  map.value.appendChild(svg.node());
}

onMounted(() => {
  drawChart()
})
</script>

<template>
  <section class="flex bg-#BDBDBD">
    <div ref="map" class="bg-#E4FAFF min-w-400px h-800px"></div>
  </section>
</template>

<style>

.custom_tooltip {
  position: absolute;
  text-align: left;
  width: max-content;
  padding: 10px;
  font: 10px;
  background: #f0eeeb;
  color: dimgray;
  border: 1px solid dimgray;
  border-radius: 3px;
  pointer-events: none;
}
.county-name {
  font-size: 6px;
  fill: #fff; /* 文字顏色 */
  pointer-events: none; /* 確保文字不會影響點擊事件 */
  text-shadow:
        -1px -1px 0 #000,
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000; /* 每一行代表一個陰影的方向和顏色 */
}

.county-background{
  background: #fff;
}

.outlined-text {
    color: white; /* 設置文字顏色為白色 */
    text-shadow:
        -2px -2px 0 #000,
        2px -2px 0 #000,
        -2px  2px 0 #000,
         2px  2px 0 #000; /* 每一行代表一個陰影的方向和顏色 */
    font-size:24px
}
</style>
