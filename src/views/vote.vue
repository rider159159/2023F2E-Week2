<script setup>
import * as d3 from 'd3'
import vote2020 from '@/assets/vote2020.json'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { numberWithCommas, voteRate } from '@/utils/share/methods'

const subgroups = ['KMT', 'PFP', 'DPP']
const route = useRoute()
const borderRadius = 5 // 這是你想要的 border-radius 大小

const voteData = ref(vote2020)

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

function getData() {
  const q = route.query || ''
  switch (String(q)) {
    case '2020':
      voteData.value = vote2020
      break
    default:
      voteData.value = vote2020
      break
  }
}

function drawBarChart(data) {
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
  if (voteData.value.count) {
    const { PFP, KMT, DPP } = voteData.value.count
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

onMounted(() => {
  getData()
  drawBarChart(voteData.value.count)
})
</script>

<template>
  <main>
    <MyHeader />
    <div class="flex mt-66px">
      <TaiwanMap />
      <section class="w-full px-48px">
        <h2 class="font-bold text-28px pt-32px pb-12px">
          全臺縣市總統得票
        </h2>
        <!-- 總統票數 -->
        <div class="bg-#F3F4F4 p-4 pt-6 rounded-12px mb-6">
          <h3 class="text-20px font-bold">
            總統得票數
          </h3>
          <section class="w-full grid grid-cols-2 gap-4">
            <!-- 左側政黨 -->
            <div class="overflow-auto bg-white rounded-12px flex flex-col justify-center scrollbar">
              <div class="min-w-500px  grid grid-cols-3 w-full">
                <div class="flex justify-center">
                  <img class="w-48px h-48px mr-3" src="/Role.png" alt="德古拉">
                  <div>
                    <p class="text-12px font-400 text-#64748B">
                      蝙蝠黨
                    </p>
                    <div class="flex">
                      <p class="text-primary mr-2">
                        德古拉
                      </p>
                      <img v-if="checkVote === 'KMT'" src="/check_circle.png" class="w-20px h-20px" alt="">
                    </div>
                    <div class="text-primary">
                      <span>{{ numberWithCommas(voteData.count.KMT) }}</span>
                      票
                    </div>
                  </div>
                </div>
                <div class="flex justify-center">
                  <img class="w-48px h-48px mr-3" src="/Role-1.png" alt="林克">
                  <div>
                    <p class="text-12px font-400 text-#64748B">
                      弓箭黨
                    </p>
                    <div class="flex">
                      <p class="text-primary mr-2">
                        林克
                      </p>
                      <img v-if="checkVote === 'PFP'" src="/check_circle.png" class="w-20px h-20px" alt="">
                    </div>
                    <div class="text-primary">
                      <span>{{ numberWithCommas(voteData.count.PFP) }}</span>
                      票
                    </div>
                  </div>
                </div>
                <div class="flex justify-center">
                  <img class="w-48px h-48px mr-3" src="/Role-2.png" alt="綠巨魔">
                  <div>
                    <p class="text-12px font-400 text-#64748B">
                      木棍黨
                    </p>
                    <div class="flex">
                      <p class="text-primary mr-2">
                        綠巨魔
                      </p>
                      <img v-if="checkVote === 'DPP'" src="/check_circle.png" class="w-20px h-20px" alt="">
                    </div>
                    <div class="text-primary">
                      <span>{{ numberWithCommas(voteData.count.DPP) }}</span>
                      票
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center min-w-500px">
                <svg id="totalChart" />
              </div>
            </div>
            <!-- 右側投票率 -->
            <div class="overflow-auto bg-white rounded-12px flex gap-4 scrollbar">
              <ProgressBar :percentage="voteRate(voteData.count.Valid, voteData.count.Total)" />
              <div class="min-w-200px grid grid-cols-2 pt-3 pb-6 gap-6">
                <div>
                  <div class="mb-4">
                    <p class="text-#64748B text-14px">
                      投票數
                    </p>
                    <p class="text-primary font-bold">
                      {{ numberWithCommas(voteData.count.Total) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-#64748B text-14px">
                      有效投票數
                    </p>
                    <p class="text-primary font-bold">
                      {{ numberWithCommas(voteData.count.Valid) }}
                    </p>
                  </div>
                </div>

                <div>
                  <div class="mb-4">
                    <p class="text-#64748B text-14px">
                      投票率
                    </p>
                    <p class="text-primary font-bold">
                      {{ voteRate(voteData.count.Valid, voteData.count.Total) }}%
                    </p>
                  </div>
                  <div>
                    <p class="text-#64748B text-14px">
                      無效票數
                    </p>
                    <p class="text-primary font-bold">
                      {{ numberWithCommas(voteData.count.Invalid) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <!-- 總統票數 -->
        <div class="w-full grid grid-cols-2 gap-4 mb-10">
          <div class="b b-#DEE2E6 rounded-12px overflow-auto scrollbar">
            <h3 class="text-20px font-bold px-4 pt-6">
              歷屆政黨得票數
            </h3>
            <GroupBarChat />
          </div>
          <div class="b b-#DEE2E6 rounded-12px overflow-auto scrollbar">
            <h3 class="text-20px font-bold px-4 pt-6">
              歷屆政黨得票率
            </h3>
            <LineChat />
          </div>
        </div>
        <!-- 各區域投票總攬 -->
        <div class="overflow-x-auto scrollbar">
          <h3 class="text-20px font-bold pt-6 mb-2">
            各縣市投票總覽
          </h3>
          <TableChart />
        </div>
      </section>
    </div>
    <MYFooter />
  </main>
</template>

<style>
*{
  line-height: 150%;
}
</style>
