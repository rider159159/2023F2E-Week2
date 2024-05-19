import { geoMercator, geoPath } from 'd3-geo'
import * as d3 from 'd3'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { numberWithCommas } from '@/utils'
import { useScreenWidth } from '@/composables/useScreenWidth'; // 確


const { screenWidth } = useScreenWidth();
const projection = geoMercator().center([124.5, 23.4]).scale(4300)
export const pathGenerator = geoPath().projection(projection)
export const  chartMargin = {
  top: 10, right: 30, bottom: 10, left: 30
}
export const chartWidth =  650 - chartMargin.left - chartMargin.right
export const chartHeight =  250 

// 長條圖右
function rightRoundedRect(x, y, width, height, radius) {
  return `m${x},${y
     }h${width - radius
       }a${radius},${radius} 0 0 1 ${radius},${radius
       }v${height - 2 * radius
       }a${radius},${radius} 0 0 1 ${-radius},${radius
       }h${radius - width
       }z`
}

// 長條圖左
function leftRoundedRect(x, y, width, height, radius) {
  return `m${x + radius},${y
     }h${width - radius
       }v${height
       }h${radius - width
       }a${radius},${radius} 0 0 1 ${-radius},${-radius
       }v${2 * radius - height
       }a${radius},${radius} 0 0 1 ${radius},${-radius
       }z`
}

function showTooltip(event, d, dom) {
  // Show the tooltip and update its content when hovering over a bar
  dom.transition()
    .duration(200)
    .style('opacity', 0.9)
    .style('left', `${event.pageX}px`)
    .style('top', `${event.pageY - 28}px`) // Offset to position the tooltip above the cursor
}

function updateTooltipContent(d, dom) {
  let partyName = ''
  switch (d.key) {
    case 'KMT':
      partyName = '蝙蝠黨'
      break
    case 'DPP':
      partyName = '木棍黨'
      break
    default:
      partyName = '弓箭黨'
      break
  }
  dom.html(`<b>${partyName}</b><br/>總票數: ${numberWithCommas(d.data[d.key])}  `)
}

function hideTooltip(dom) {
  // Hide the tooltip when mouse leaves a bar
  dom.transition()
    .duration(200)
    .style('opacity', 0)
}

// 製作長條圖
export function drawBarChart(data, params, tooltipDOM) {
  const { width, height, chartId } = params
  const borderRadius = 5 // 這是你想要的 border-radius 大小

  const subgroups = ['KMT', 'Other', 'DPP']
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range([KMTColor, PFPColor, DPPColor])

  const svg = d3.select(`#${chartId}`)
    .attr('width', width)
    .attr('height', height)

  // 更新比例尺定義
  const x = d3.scaleLinear()
    .domain([0, 100]) // 使用 0 到 100% 的範圍
    .range([0, width])

  const stackGenerator = d3.stack()
    .keys(subgroups)
    .value((d, key) => {
      return (d[key] / d.Total) * 100
    }) // 計算每個政黨的票數佔總票數的百分比

  const layers = stackGenerator([data])

  svg.selectAll('.layer')
    .data(layers)
    .enter()
    .append('g')
    .attr('class', 'layer')
    .attr('fill', d => color(d.key)) // d represents the layer here
    .selectAll('path')
    .data(d => d.map(item => ({ ...item, key: d.key }))) // Pass key into each segment
    .enter()
    .append('path')
    .attr('class', 'bar-chart-path') // 添加类名
    .attr('d', (d) => {
      const x0 = x(d[0])
      const x1 = x(d[1])
      const w = x1 - x0
      const y1 = height

      // 根據圖表的顏色來選擇相應的繪圖函數
      if (d.key === 'DPP')
        return rightRoundedRect(x0, 0, w, y1, borderRadius)
      else if (d.key === 'KMT')
        return leftRoundedRect(x0, 0, w, y1, borderRadius)
      else
        return `M${x0},0 L${x1},0 L${x1},${y1} L${x0},${y1} Z`
    })

  // 設定 tooltip 事件
  svg.selectAll('.bar-chart-path')
    .on('mouseover', (event, d) => {
      if(screenWidth.value <= 768) return
      showTooltip(event, d, tooltipDOM)
      updateTooltipContent(d, tooltipDOM)
    })
    .on('mousemove', (event) => {
      if(screenWidth.value <= 768) return
      tooltipDOM.style('left', `${event.pageX}px`)
      tooltipDOM.style('top', `${event.pageY - 28}px`)
    })
    .on('mouseleave', () => {
      if(screenWidth.value <= 768) return
      hideTooltip(tooltipDOM)
    })
}
