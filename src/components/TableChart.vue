<script setup>
import { onMounted, ref } from 'vue'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import * as d3 from 'd3'
import voteJSON2020 from '@/assets/vote2020.json'
import { numberWithCommas, voteRate } from '@/utils/share/methods'

const processedData = voteJSON2020.city
const borderRadius = 5 // 這是你想要的 border-radius 大小

const subgroups = ['KMT','PFP', 'DPP']
const color = d3.scaleOrdinal()
  .domain(subgroups)
  .range([KMTColor, PFPColor, DPPColor])

onMounted(() => {
  processedData.forEach((item, index) => {
    drawBarChart(item, `chart-${index}`)
  })
})

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

function drawBarChart(data, chartId) {
  const width = 200 // Set the width for the bar chart
  const height = 10 // Set the height for each bar chart

  const svg = d3.select(`#${chartId}`)
    .attr('width', width)
    .attr('height', height)

  // 更新比例尺定義
  const x = d3.scaleLinear()
    .domain([0, 100]) // 使用 0 到 100% 的範圍
    .range([0, width])

  const stackGenerator = d3.stack()
    .keys(subgroups)
    .value((d, key) => (d[key] / d.Total) * 100) // 計算每個政黨的票數佔總票數的百分比

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
}

const checkVote = computed(() => {
  if (voteJSON2020.count) {
    const { PFP, KMT, DPP } = voteJSON2020.count
    let maxParty = 'PFP' // 預設為 PFP
    let maxValue = PFP
    if (KMT > maxValue) {
      maxParty = 'KMT'
      maxValue = KMT
    }
    if (DPP > maxValue)
      maxParty = 'DPP'

    return maxParty
  }
  return null
})
</script>

<template>
  <section class="overflow-x-autos flex flex-col">

    <table class="w-full min-w-780px">
      <thead class="bg-gray1 ">
        <tr>
          <th class="text-left p-2 text-primary rounded-l-4px">
            地區
          </th>
          <th class="text-left p-2 text-primary ">
            得票率
          </th>
          <th class="text-left p-2 text-primary ">
            當選人
          </th>
          <th class="text-left p-2 text-primary ">
            投票數
          </th>
          <th class="text-left p-2 text-primary rounded-r-4px">
            投票率
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-#DEE2E6 last:border-0" v-for="(item, index) in processedData" :key="index">
          <td class="py-10px pl-2 font-bold text-#334155">{{ item.City }}</td>
          <td class="chart-cell">
            <svg :id="`chart-${index}`" class="bar-chart" />
          </td>
          <td class="cell">
            <div v-if="checkVote === 'KMT'" class="flex items-center">
              <img src="/Role.png" class="rounded-50px mr-4" alt="德古拉">
              <p>德古拉</p>
            </div>
            <div v-if="checkVote === 'DPD'" class="flex items-center">
              <img src="/Role-1.png" class="rounded-50px mr-4" alt="林克">
              <p>林克</p>
            </div>
            <div v-if="checkVote === 'DPP'" class="flex items-center">
              <img src="/Role-2.png" class="rounded-50px mr-4" alt="綠巨魔">
              <p>綠巨魔</p>
            </div>
          </td>
          <td>
            {{ numberWithCommas(item.Valid) }}
          </td>
          <td  class="py-10px pr-2">
            {{ voteRate(item.Valid ,item.Total)}}%
          </td>
        </tr>
      </tbody>
    </table>
  </section>

</template>

<style>
.bar-chart {
  width: 100%;
  height: 20px;
}

.chart-cell {
  width: 205px; /* Adjust the width as needed */
}

.cell{
  width: 150px;
}

thead{
    border-collapse: separate;
    border-spacing: 0; /* 可選：消除單元格之間的間隔 */
}
</style>
