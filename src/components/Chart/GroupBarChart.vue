<script setup>
import * as d3 from 'd3'
import { DPPColor, KMTColor, PFPColor, TPPColor } from '@/utils/share/variable'
import { numberWithCommas } from '@/utils'
import { chartMargin, chartWidth, chartHeight } from '@/utils/d3.js'

const d3Chart = ref(null)
const tooltip = ref(null) // Reference to the tooltip element

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
    color: PFPColor,
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
    color: PFPColor,
  },
]

function createTooltip() {
  tooltip.value = d3.select('body')
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

function updateTooltipContent(d) {
  let partyName = ''
  switch (d.partyZH) {
    case '中國國民黨':
      partyName = '蝙蝠黨'
      break
    case '民主進步黨':
      partyName = '木棍黨'
      break
    default:
      partyName = '弓箭黨'
      break
  }
  tooltip.value.html(`<b>${partyName}</b><br/>總票數: ${numberWithCommas(d.vote)}`)
}

function showTooltip(event, d) {
  // Show the tooltip and update its content when hovering over a bar
  tooltip.value.transition()
    .duration(200)
    .style('opacity', 0.9)
    .style('left', `${event.pageX}px`)
    .style('top', `${event.pageY - 28}px`) // Offset to position the tooltip above the cursor
  updateTooltipContent(d)
}

function hideTooltip() {
  // Hide the tooltip when mouse leaves a bar
  tooltip.value.transition()
    .duration(200)
    .style('opacity', 0)
}

function drawChart(element, data) {
  const years = new Set(data.map(d => d.Year))
  const yearParties = new Map()
  // const parties = new Set(data.map(d => d.partyEN))
  for (const year of years) {
    const parties = new Set(data.filter(d => d.Year === year).map(d => d.partyEN))
    yearParties.set(year, parties)
  }

  const fx = d3.scaleBand()
    .domain([...years])
    .rangeRound([chartMargin.left, 450])
    .paddingInner(0.2)

  const x = (year) => {
    const parties = yearParties.get(year)
    return d3.scaleBand()
      .domain([...parties])
      .rangeRound([0, fx.bandwidth()])
      .padding(0.05)
  }

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.vote)]).nice()
    .rangeRound([chartHeight - chartMargin.bottom, chartMargin.top])

  const svg = d3.select(element)
    .append('svg')
    .attr('width', chartWidth-50)
    .attr('height', chartHeight)
    .attr('viewBox', [0, 0, chartWidth-50, chartHeight])
    .attr('style', 'max-width: 100%')

  // 製作 bar Group 圖片
  svg.append('g')
    .selectAll()
    .data(d3.group(data, d => d.Year))
    .join('g')
    .attr('transform', ([year]) => `translate(${fx(year)+30},0)`)
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

  // 處理 X 軸上指標
  svg.append('g')
    .attr('transform', `translate(30,${chartHeight - chartMargin.bottom})`)
    .call(d3.axisBottom(fx).tickSizeOuter(0))
    .call(g => g.selectAll('.domain').remove())

  // 處理 Y 軸效果
  svg.append('g')
    .attr('transform', `translate(${20+chartMargin.left},10)`)
    .call(d3.axisLeft(y).ticks(10, 's').tickFormat((d) => {
      return `${d / 10000}萬`; // 設定中文格式
    }))
    .call(g => g.selectAll('.domain').remove())

  // 設定 tooltip 事件
  svg.selectAll('rect')
    .on('mouseover', (event, d) => showTooltip(event, d))
    .on('mousemove', (event) => {
      tooltip.value.style('left', `${event.pageX}px`)
      tooltip.value.style('top', `${event.pageY - 28}px`)
    })
    .on('mouseleave', hideTooltip)
}

onMounted(() => {
  createTooltip()
  if (d3Chart.value)
    drawChart(d3Chart.value, voteList)
})
</script>

<template>
  <section class="min-w-500px">
    <div ref="d3Chart" />
  </section>
</template>
