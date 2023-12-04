<script setup>
import * as d3 from 'd3'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'

const d3Chart = ref(null)

onMounted(() => {
  if (d3Chart.value)
    drawChart(d3Chart.value)
})

const voteList = [
  {
    Year: 2020,
    PFP: 608590,
    KMT: 5522119,
    DPP: 8170231,
    Total: 14300940,
  },
  {
    Year: 2016,
    PFP: 7814787,
    KMT: 2707493,
    DPP: 6604989,
    Total: 17127269,
  },
  {
    Year: 2012,
    PFP: 6566298,
    KMT: 5210121,
    DPP: 2403228,
    Total: 16879647,
  },
  {
    Year: 2008,
    PFP: 6921187,
    KMT: 2703067,
    DPP: 5860981,
    Total: 15485235,
  },
  {
    Year: 2004,
    PFP: 5087548,
    KMT: 8403765,
    DPP: 3177909,
    Total: 16669222,
  },
  {
    Year: 2000,
    PFP: 6427031,
    KMT: 3720094,
    DPP: 4359432,
    Total: 14506557,
  },
]

function drawChart(element) {
  const data = voteList

  // 計算每個黨的百分比
  data.forEach((d) => {
    d.PFP_Percent = d.PFP / d.Total * 100
    d.KMT_Percent = d.KMT / d.Total * 100
    d.DPP_Percent = d.DPP / d.Total * 100
  })

  // 設定圖表的尺寸和邊距
  const margin = { top: 10, right: 30, bottom: 30, left: 60 }
  const width = 650 - margin.left - margin.right
  const height = 250 - margin.top - margin.bottom

  // 添加 SVG 元素到頁面的元素中
  const svg = d3.select(element)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // 添加 X 軸
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Year))
    .range([0, width])
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')))

  // 添加 Y 軸 (百分比)
  const y = d3.scaleLinear()
    .domain([0, 60]) // 將 Y 軸的最大值設定為 60%
    .range([height, 0])
  svg.append('g')
    .call(d3.axisLeft(y)
      .tickValues(d3.range(0, 61, 10)) // 這將只會在 0%, 10%, 20%, ..., 60% 處添加刻度
      .tickFormat(d => `${d}%`))
  // 定義線條生成器
  const lineGenerator = d3.line()
    .x(d => x(d.Year))
    .y(d => y(Math.min(d.Percent, 60))) // 限制最大值為 60%

  // 添加 PFP 線條
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', PFPColor)
    .attr('stroke-width', 1.5)
    .attr('d', lineGenerator.y(d => y(d.PFP_Percent)))
  // 添加 KMT 線條
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', KMTColor)
    .attr('stroke-width', 1.5)
    .attr('d', lineGenerator.y(d => y(d.KMT_Percent)))

  // 添加 DPP 線條
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', DPPColor)
    .attr('stroke-width', 1.5)
    .attr('d', lineGenerator.y(d => y(d.DPP_Percent)))

  // 現在圖表只會顯示到 60% 的數據
}
</script>

<template>
  <section class="min-w-500px">
    <div ref="d3Chart" />
  </section>
</template>
