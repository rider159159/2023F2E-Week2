<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { numberWithCommas, voteRate } from '@/utils/share/methods'

const store = searchStore()
const { CURRENT_CITY_DATA, CURRENT_PARTY_DATA } = storeToRefs(store)
const subgroups = ['KMT', 'Other', 'DPP']
const borderRadius = 5 // 這是你想要的 border-radius 大小
const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range([KMTColor, PFPColor, DPPColor])

function rightRoundedRect(x, y, width, height, radius) {
  return `m${x},${y
    }h${width - radius
    }a${radius},${radius} 0 0 1 ${radius},${radius
    }v${height - 2 * radius
    }a${radius},${radius} 0 0 1 ${-radius},${radius
    }h${radius - width
    }z`
}

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

function clearChart() {
  d3.select('#totalChart')
    .selectAll('*')
    .remove()
}

function drawBarChart() {
  const width = 420 // Set the width for the bar chart
  const height = 20 // Set the height for each bar chart

  const svg = d3.select(`#totalChart`)
    .attr('width', width)
    .attr('height', height)

  // 更新比例尺定義
  const x = d3.scaleLinear()
    .domain([0, 100]) // 使用 0 到 100% 的範圍
    .range([0, width])

  const stackGenerator = d3.stack()
    .keys(subgroups)
    .value((d, key) => (d[key] / d.Total) * 100) // 計算每個政黨的票數佔總票數的百分比

  const layers = stackGenerator([
    CURRENT_PARTY_DATA.value,
  ])

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
}

watch(
  () => CURRENT_CITY_DATA.value,
  (newValue) => {
    clearChart() // 清除上一次的圖表
    drawBarChart(newValue) // 重新繪製圖表
  },
  {
    deep: true,
  },
)

onMounted(() => {
  drawBarChart(CURRENT_CITY_DATA.value)
})
</script>

<template>
  <div class="flex justify-center min-w-500px">
    <svg id="totalChart" />
  </div>
</template>
