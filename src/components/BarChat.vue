<script setup>
import * as d3 from 'd3'
import voteJSON2020 from '@/assets/vote2022.json'

const chart = ref(null)

function convertToNumber(str) {
  return +str.replace(/,/g, '')
}

function drawChart(element, data) {
  data.forEach((d) => {
    d.PFP = convertToNumber(d.PFP)
    d.KMT = convertToNumber(d.KMT)
    d.DPP = convertToNumber(d.DPP)
    d.Total = convertToNumber(d.Total)
  })

  const margin = { top: 20, right: 30, bottom: 40, left: 90 }
  const width = 960 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  const svg = d3.select(element)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const subgroups = ['PFP', 'KMT', 'DPP']
  const groups = data.map(d => d.City)

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Total)])
    .range([0, width])

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(null, 's'))

  const y = d3.scaleBand()
    .domain(groups)
    .range([0, height])
    .padding([0.2])

  svg.append('g')
    .call(d3.axisLeft(y))

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#ff8c00', '#1f77b4', '#2ca02c'])

  const stackedData = d3.stack()
    .keys(subgroups)(data)

  svg.append('g')
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', d => color(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('y', d => y(d.data.City))
    .attr('x', d => x(d[0]))
    .attr('width', d => x(d[1]) - x(d[0]))
    .attr('height', y.bandwidth())
}

onMounted(() => {
  if (chart.value)
    drawChart(chart.value, voteJSON2020)
})
</script>

<template>
  <div ref="chart" />
</template>
