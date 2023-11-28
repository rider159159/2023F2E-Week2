<script setup>
import * as d3 from 'd3'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'

const d3Chart = ref(null)

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

function drawChart(element, data) {
  const margin = { top: 20, right: 20, bottom: 30, left: 40 }
  const width = 650 - margin.left - margin.right
  const height = 250 - margin.top - margin.bottom

  const svg = d3.select(element)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)

  const x1 = d3.scaleBand()
    .padding(0.05)

  const y = d3.scaleLinear()
    .rangeRound([height, 0])

  const z = d3.scaleOrdinal()
    .range([ KMTColor, PFPColor, DPPColor])

  const keys = ['KMT','PFP', 'DPP']

  x0.domain(data.map(d => d.Year))
  x1.domain(keys).rangeRound([0, x0.bandwidth()])
  y.domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()

  svg.append('g')
    .selectAll('g')
    .data(data)
    .enter().append('g')
    .attr('transform', d => `translate(${x0(d.Year)},0)`)
    .selectAll('rect')
    .data(d => keys.map(key => ({ key, value: d[key] })))
    .enter().append('rect')
    .attr('x', d => x1(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => z(d.key))

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0))

  svg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(null, 's'))
    .append('text')
    .attr('x', 2)
    .attr('y', y(y.ticks().pop()) + 0.5)
    .attr('dy', '0.32em')
    .attr('fill', '#000')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'start')
    .text('Population')

  // 這裡可以添加標籤和標題等其他 SVG 元素
}
onMounted(() => {
  if (d3Chart.value)
    drawChart(d3Chart.value, voteList)
})
</script>

<template>
  <section class="min-w-500px">
    <div ref="d3Chart" />
  </section>
</template>
