<script setup>
import * as d3 from 'd3'

const svg = ref()
let zoom
const g = ref(null)

function zoomed(event) {
  const { transform } = event
  d3.select(g.value)
    .attr('transform', transform)
    .attr('stroke-width', 1 / transform.k)
}

onMounted (() => {
  zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', zoomed)
  d3.select(svg.value).call(zoom)
})
</script>

<template>
  <div class="bg-#E4FAFF min-w-400px h-800px">
    <svg
      ref="svg"
      class="h-full w-full"
      viewBox="0,0,400,800"
    >
      <g ref="g">
        <County :svg="svg" />
        <Town />
      </g>
    </svg>
  </div>
</template>

<style scoped>

</style>
