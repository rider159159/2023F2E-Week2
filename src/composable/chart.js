import { geoMercator, geoPath } from 'd3-geo'
import * as d3 from 'd3'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'

const projection = geoMercator().center([124.5, 23.4]).scale(4300)
export const pathGenerator = geoPath().projection(projection)
const tooltip = null

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

function showTooltip(event, d) {
  // Show the tooltip and update its content when hovering over a bar
  tooltip.transition()
    .duration(200)
    .style('opacity', 0.9)
    .style('left', `${event.pageX}px`)
    .style('top', `${event.pageY - 28}px`) // Offset to position the tooltip above the cursor
  updateTooltipContent(d)
}

function hideTooltip() {
  // Hide the tooltip when mouse leaves a bar
  tooltip.transition()
    .duration(200)
    .style('opacity', 0)
}

// 製作長條圖
export function drawBarChart(data, params) {
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
    .data(d => d) // d is the layer
    .enter()
    .append('path')
    .attr('d', (d, i, nodes) => {
      const layer = nodes[i].parentNode.__data__ // Access the parent node's data
      const x0 = x(d[0])
      const x1 = x(d[1])
      const w = x1 - x0
      const y1 = height

      // 根據圖表的顏色來選擇相應的繪圖函數
      if (layer.key === 'DPP') {
        // 綠色圖表，右邊圓角
        return rightRoundedRect(x0, 0, w, y1, borderRadius)
      }
      else if (layer.key === 'KMT') {
        return leftRoundedRect(x0, 0, w, y1, borderRadius)
      }
      else {
        // 對於其他圖表，這裡可以添加條件來選擇不同的繪製函數或返回普通矩形
        return `M${x0},0 L${x1},0 L${x1},${y1} L${x0},${y1} Z`
      }
    })

  // 設定 tooltip 事件
  svg.selectAll('path')
    .on('mouseover', (event, d) => showTooltip(event, d))
    .on('mousemove', (event) => {
      tooltip.style('left', `${event.pageX}px`)
      tooltip.style('top', `${event.pageY - 28}px`)
    })
    .on('mouseleave', hideTooltip)
}
