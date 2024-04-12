<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'

import { searchStore } from '@/stores'
import { numberWithCommas, voteRate } from '@/utils/share/methods'

const store = searchStore()
const { SEARCH_CITY, CURRENT_CITY_DATA } = storeToRefs(store)
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
            <!-- 左側候選人+政黨 -->
            <Candidate />
            <!-- 右側投票率 -->
            <div class="overflow-auto bg-white rounded-12px flex gap-4 scrollbar">
              <ProgressBar :vote-rate="CURRENT_CITY_DATA.voteRate" />
              <div class="min-w-200px grid grid-cols-2 pt-3 pb-6 gap-6">
                <div>
                  <div class="mb-4">
                    <p class="text-#64748B text-14px">
                      投票數
                    </p>
                    <p class="text-primary font-bold">
                      {{ numberWithCommas(CURRENT_CITY_DATA.allVotes) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-#64748B text-14px">
                      有效投票數
                    </p>
                    <p class="text-primary font-bold">
                      {{ numberWithCommas(CURRENT_CITY_DATA.validVotes) }}
                    </p>
                  </div>
                </div>

                <div>
                  <div class="mb-4">
                    <p class="text-#64748B text-14px">
                      投票率
                    </p>
                    <p class="text-primary font-bold">
                      {{ CURRENT_CITY_DATA.voteRate }}%
                    </p>
                  </div>
                  <div>
                    <p class="text-#64748B text-14px">
                      無效票數
                    </p>
                    <p class="text-primary font-bold">
                      {{ numberWithCommas(CURRENT_CITY_DATA.invalidVotes) }}
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
            <GroupBarChart />
          </div>
          <div class="b b-#DEE2E6 rounded-12px overflow-auto scrollbar">
            <h3 class="text-20px font-bold px-4 pt-6">
              歷屆政黨得票率
            </h3>
            <LineChart />
          </div>
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
