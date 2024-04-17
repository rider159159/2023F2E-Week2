<script setup>
import * as d3 from 'd3'
import { onMounted, ref } from 'vue'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'

const d3Chart = ref(null)

onMounted(() => {
  if (d3Chart.value)
    drawChart(d3Chart.value)
})

const voteList = [
  { Year: 2024, vote: 5586019, total: 14048311, partyEN: 'DPP', partyZH: '民主進步黨', color: DPPColor },
  { Year: 2024, vote: 4671021, total: 14048311, partyEN: 'KMT', partyZH: '中國國民黨', color: KMTColor },
  { Year: 2020, vote: 8170231, total: 14300940, partyEN: 'DPP', partyZH: '民主進步黨', color: DPPColor },
  { Year: 2020, vote: 5522119, total: 14300940, partyEN: 'KMT', partyZH: '中國國民黨', color: KMTColor },
  { Year: 2016, vote: 6894744, total: 12284970, partyEN: 'DPP', partyZH: '民主進步黨', color: DPPColor },
  { Year: 2016, vote: 3813365, total: 12284970, partyEN: 'KMT', partyZH: '中國國民黨', color: KMTColor },
  { Year: 2012, vote: 2403228, total: 14179647, partyEN: 'DPP', partyZH: '民主進步黨', color: DPPColor },
  { Year: 2012, vote: 5210121, total: 14179647, partyEN: 'KMT', partyZH: '中國國民黨', color: KMTColor },
]

function drawChart(element) {
  const data = voteList

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

  // 計算顯示的年份範圍
  const years = data.map(d => d.Year)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const yearTicks = d3.range(minYear, maxYear + 1, 4) // 每四年顯示一次

  // 添加 X 軸
  const x = d3.scaleLinear()
    .domain([maxYear, minYear])
    .range([0, width])
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(yearTicks).tickFormat(d3.format('d')))

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
    .y(d => y(Math.min(d.vote / d.total * 100, 60))) // 限制最大值為 60%

  // 添加線條
  data.forEach((party) => {
    svg.append('path')
      .datum(data.filter(d => d.partyEN === party.partyEN))
      .attr('fill', 'none')
      .attr('stroke', party.color)
      .attr('stroke-width', 1.5)
      .attr('d', lineGenerator.y(d => y(d.vote / d.total * 100)))
  })
}
</script>

<template>
  <section class="min-w-500px">
    <div ref="d3Chart" />
  </section>
</template>
