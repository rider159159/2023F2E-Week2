<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    default: 0,
  },
})
const size = 160 // SVG size
const stroke = 10 // Stroke width
const radius = size / 2 // Circle radius
const normalizedRadius = radius - stroke * 2
const circumference = normalizedRadius * 2 * Math.PI

const fillColor = 'transparent' // The fill color of the circle

const strokeDashOffset = computed(() => circumference - (props.percentage / 100) * circumference)
</script>

<template>
  <div class="progress-ring flex justify-center items-center relative">
    <svg :width="size" :height="size">
      <!-- 背景圓形，顯示剩餘的進度 -->
      <circle
        class="progress-ring__circle-background"
        :stroke-width="stroke"
        :fill="fillColor"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
        :stroke-dasharray="`${circumference} ${circumference}`"
        :stroke-dashoffset="0"
      />
      <!-- 前景圓形，顯示已完成的進度 -->
      <circle
        class="progress-ring__circle"
        :stroke-width="stroke"
        :fill="fillColor"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
        :stroke-dasharray="`${circumference} ${circumference}`"
        :stroke-dashoffset="strokeDashOffset"
      />
    </svg>
    <div class="absolute flex flex-col justify-center items-center">
      <p class="text-primary text-14px">
        投票率
      </p>
      <span class="text-#D4009B font-bold text-20px">{{ props.percentage }}%</span>
    </div>
  </div>
</template>

<style>
.progress-ring {
  position: relative;
}

.progress-ring__circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  stroke: #D4009B; /* Change this to the color you want for the progress */
}

.progress-ring__circle-background {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  stroke: #E2E8F0; /* 這是未完成進度的顏色 */
}

.progress-ring__text {
  position: absolute;
}
</style>
