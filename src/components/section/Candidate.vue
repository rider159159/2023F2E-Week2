<script setup>
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { searchStore } from '@/stores'
import { DPPColor, KMTColor, PFPColor } from '@/utils/share/variable'
import { numberWithCommas } from '@/utils'

const store = searchStore()
const { CURRENT_PARTY_DATA } = storeToRefs(store)
</script>

<template>
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
            <span>{{ numberWithCommas(CURRENT_PARTY_DATA.KMT) }}</span>
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
            <span>{{ numberWithCommas(CURRENT_PARTY_DATA.Other) }}</span>
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
            <span>{{ numberWithCommas(CURRENT_PARTY_DATA.DPP) }}</span>
            票
          </div>
        </div>
      </div>
    </div>
    <BarChart />
  </div>
</template>
