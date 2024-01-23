<script setup>
import { geoMercator, geoPath } from 'd3-geo'
import * as d3 from 'd3'
import taiwan from '@/assets/taiwan.json'

const computedPath = computed(() => {
  return (feature) => {
    const projection = d3.geoMercator().center([122.7, 24]).scale(8500)
    const path = geoPath().projection(projection)
    return path(feature.geometry)
  }
})

// const bounds = pathGenerator.bounds(item)
</script>

<template>
  <svg
    className="absolute left-0 top-0 h-full w-full"
    viewBox="0 0 380 600"
  >
    <g>
      <g v-for="(item, index) in taiwan.features" :key="index" class="test">
        <g class="relative">
          <path
            :d="computedPath(item)"
            :style="{ strokeWidth: zoom ? '0.1px' : '0.3px' }"
          />
          <text
            class="text-white relative z-10"
          >
            {{ item.properties.county }}
          </text>
          <!-- <text
            :x="(bounds[0][0] + bounds[1][0]) / 2"
            :y="(bounds[0][1] + bounds[1][1]) / 2"
            class="pointer-events-none fill-black text-[0.4em] leading-none"
            text-anchor="middle"
          >
            {{ t(item.properties.county) }}
          </text> -->
        </g>
      </g>
    </g>
  </svg>
</template>
