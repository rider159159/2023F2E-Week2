<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'

import { searchStore } from '@/stores'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { numberWithCommas, voteRate } from '@/utils/share/methods'

const store = searchStore()
const { SEARCH_CITY, ARRAY_VOTE_DATA, CURRENT_VOTE_DATA, CURRENT_CITY_DATA } = storeToRefs(store)

const subgroups = ['KMT', 'PFP', 'DPP']
const route = useRoute()
const borderRadius = 5 // 這是你想要的 border-radius 大小
const voteData = ref(ARRAY_VOTE_DATA)

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
    
    const { candidate1, candidate2, candidate3, validVotes } = data
    let checkParty1 = 0
    let checkParty2 = 0
    let checkParty3 = 0
    switch (candidate1.part) {
      case '中國國民黨':
        checkParty1 = 1
        break;
      case '民主進步黨':
        checkParty1 = 3
        break
      default:
        checkParty1 = 2
        break;
    }
    switch (candidate2.part) {
      case '中國國民黨':
        checkParty2 = 1
        break;
      case '民主進步黨':
        checkParty2 = 3
        break
      default:
        checkParty2 = 2
        break;
    }
    switch (candidate3.part) {
      case '中國國民黨':
        checkParty3 = 1
        break;
      case '民主進步黨':
        checkParty3 = 3
        break
      default:
        checkParty3 = 2
        break;
    }
  
    function getPref(c1, c2, c3, pref) {
      console.log('test',['民主進步黨', '中國國民黨'][pref - 1])
      if (c3.part === ['民主進步黨', '中國國民黨'][pref - 1]) {
        return c3.votes;
      } else if (c2.part === ['民主進步黨', '中國國民黨'][pref - 1]) {
        return c2.votes;
      } else if (c1.part === ['民主進步黨', '中國國民黨'][pref - 1]) {
        return c1.votes;
      } else {
        return '';
      }
    }
    function getPref(c1, c2, c3, pref) {
      const parties = ['民主進步黨', '中國國民黨'];
      if (c3.part === parties[pref - 1]) {
        return c3.votes;
      } else if (c2.part === parties[pref - 1]) {
        return c2.votes;
      } else if (c1.part === parties[pref - 1]) {
        return c1.votes;
      } else {
        return c3.votes; // 如果都沒有匹配,則取最後一個候選人的票數
      }
    }

    const chartData = {
  "PFP": getPref(candidate1, candidate2, candidate3, 3),
  "KMT": getPref(candidate1, candidate2, candidate3, 1),
  "DPP": getPref(candidate1, candidate2, candidate3, 2),
  "Total": validVotes
};
  // const chartData = { 
  //     // "Name": "總計", 
  //     "PFP": checkParty3 === 3 ? candidate3.votes : checkParty2 === 2 ? candidate2.votes : checkParty1 === 1 ? candidate1.votes :'', 
  //     "KMT": checkParty3 === 3 ? candidate3.votes : checkParty2 === 2 ? candidate2.votes : checkParty1 === 1 ? candidate1.votes :'', 
  //   "DPP": checkParty3 === 3 ? candidate3.votes : checkParty2 === 2 ? candidate2.votes : checkParty1 === 1 ? candidate1.votes :'', 
  //   "Total": validVotes // "Valid": 12329520, // "Invalid": 4502741 
  // } 

  console.log('chartData',chartData)
  const layers = stackGenerator([
    chartData,
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
      console.log(layer)
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

// const checkVote = computed(() => {
//   if (voteData.value.count) {
//     const { PFP, KMT, DPP } = voteData.value.count
//     let maxParty = 'PFP' // 預設為 PFP
//     let maxValue = PFP
//     if (KMT > maxValue) {
//       maxParty = 'KMT'
//       maxValue = KMT
//     }
//     if (DPP > maxValue)
//       maxParty = 'DPP'

//     return maxParty
//   }
//   return null
// })

onMounted(() => {
  drawBarChart(CURRENT_CITY_DATA.value)
})
</script>

<template>
  <main>
    <MyHeader />
    <div class="flex mt-66px">
      <!-- <TaiwanMap :vote-data="voteData" /> -->
      <!-- <TaiwanVoteMap /> -->
      <!-- {{ CURRENT_CITY_DATA }} -->
      <section class="w-full px-48px">
        <h2 class="font-bold text-28px pt-32px pb-12px">
          全臺縣市總統得票
        </h2>
        <!-- 總統票數 -->
        <div class="bg-#F3F4F4 p-4 pt-6 rounded-12px mb-6">
          <h3 class="text-20px font-bold">
            {{ SEARCH_CITY === 'all' ? '全台總統得票數' : `${CURRENT_CITY_DATA.fieldCN}總統得票數` }}
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
                      <img src="/check_circle.png" class="w-20px h-20px" alt="">
                    </div>
                    <div class="text-primary">
                      <span>{{ numberWithCommas(CURRENT_CITY_DATA.candidate1.votes) }}</span>
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
                      <img src="/check_circle.png" class="w-20px h-20px" alt="">
                    </div>
                    <div class="text-primary">
                      <span>{{ numberWithCommas(CURRENT_CITY_DATA.candidate2.votes) }}</span>
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
                      <img src="/check_circle.png" class="w-20px h-20px" alt="">
                    </div>
                    <div class="text-primary">
                      <span>{{ numberWithCommas(CURRENT_CITY_DATA.candidate3.votes) }}</span>
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
            <!-- <div class="overflow-auto bg-white rounded-12px flex gap-4 scrollbar">
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
            </div> -->
          </section>
        </div>

        <!-- 總統票數 -->
        <!-- <div class="w-full grid grid-cols-2 gap-4 mb-10">
          <div class="b b-#DEE2E6 rounded-12px overflow-auto scrollbar">
            <h3 class="text-20px font-bold px-4 pt-6">
              歷屆政黨得票數
            </h3>
            <GroupBarChart />
          </div>
          <div class="b b-#DEE2E6 rounded-12px overflow-auto scrollbar">
            <h3 class="text-20px font-bold px-4 pt-6">
              歷屆政黨得票率
            </h3>
            <LineChart />
          </div>
        </div> -->
        <!-- 各區域投票總攬 -->
        <!-- <div class="overflow-x-auto scrollbar">
          <h3 class="text-20px font-bold pt-6 mb-2">
            各縣市投票總覽
          </h3>
          <TableChart :vote-data="voteData" />
        </div> -->
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
