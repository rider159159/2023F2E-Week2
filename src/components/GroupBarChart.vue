<script setup>
import * as d3 from 'd3'
import { DPPColor, KMTColor, PFPColor, TPPColor } from '@/utils/share/variable'

const d3Chart = ref(null)

const voteList = [
  {
    Year: 2024,
    vote: 5586019,
    partyEN: 'DPP',
    partyZH: '民主進步黨',
    color: DPPColor,
  },
  {
    Year: 2024,
    vote: 4671021,
    partyEN: 'KMT',
    partyZH: '中國國民黨',
    color: KMTColor,
  },
  {
    Year: 2024,
    vote: 3690466,
    partyEN: 'TPP',
    partyZH: '台灣民眾黨',
    color: TPPColor,
  },
  {
    Year: 2020,
    vote: 8170231,
    partyEN: 'DPP',
    partyZH: '民主進步黨',
    color: DPPColor,
  },
  {
    Year: 2020,
    vote: 5522119,
    partyEN: 'KMT',
    partyZH: '中國國民黨',
    color: KMTColor,
  },
  {
    Year: 2020,
    vote: 608590,
    partyEN: 'PFP',
    partyZH: '親民黨',
    color: PFPColor,
  },
  {
    Year: 2016,
    vote: 6894744,
    partyEN: 'DPP',
    partyZH: '民主進步黨',
    color: DPPColor,
  },
  {
    Year: 2016,
    vote: 3813365,
    partyEN: 'KMT',
    partyZH: '中國國民黨',
    color: KMTColor,
  },
  {
    Year: 2016,
    vote: 1576861,
    partyEN: 'PFP',
    partyZH: '親民黨',
    color: PFPColor,
  },
  {
    Year: 2012,
    vote: 2403228,
    partyEN: 'DPP',
    partyZH: '民主進步黨',
    color: DPPColor,
  },
  {
    Year: 2012,
    vote: 5210121,
    partyEN: 'KMT',
    partyZH: '中國國民黨',
    color: KMTColor,
  },
  {
    Year: 2012,
    vote: 6566298,
    partyEN: 'None',
    partyZH: '無黨派',
    color: '#9D9D9D',
  },
]
function drawChart(element, data) {
  const width = 650
  const height = 250
  const marginTop = 10
  const marginBottom = 20
  const marginLeft = 40

  const years = new Set(data.map(d => d.Year))
  const yearParties = new Map()
  // const parties = new Set(data.map(d => d.partyEN))
  for (const year of years) {
    const parties = new Set(data.filter(d => d.Year === year).map(d => d.partyEN))
    yearParties.set(year, parties)
  }

  const fx = d3.scaleBand()
    .domain([...years])
    .rangeRound([marginLeft, 450])
    .paddingInner(0.2)

  const x = (year) => {
    const parties = yearParties.get(year)
    return d3.scaleBand()
      .domain([...parties])
      .rangeRound([0, fx.bandwidth()])
      .padding(0.05)
  }
  // console.log(x)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.vote)]).nice()
    .rangeRound([height - marginBottom, marginTop])

  const svg = d3.select(element)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;')

  svg.append('g')
    .selectAll()
    .data(d3.group(data, d => d.Year))
    .join('g')
    .attr('transform', ([year]) => `translate(${fx(year)},0)`)
    .selectAll()
    .data(([, data]) => data.length > 0 ? data : []) // 判斷是否有資料
    .join('rect')
    .attr('x', (d) => {
      return x(d.Year)(d.partyEN)
    })

    .attr('y', d => y(d.vote))
    .attr('width', 26)
    .attr('height', d => y(0) - y(d.vote))
    .attr('fill', d => d.color) // 使用 voteList 中的 color 屬性作為填充顏色

  svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(fx).tickSizeOuter(0))
    .call(g => g.selectAll('.domain').remove())

  svg.append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, 's'))
    .call(g => g.selectAll('.domain').remove())

  // return Object.assign(svg.node(), { scales: { color: d3.scaleOrdinal().range([DPPColor, KMTColor, PFPColor, TPPColor]) } })
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
