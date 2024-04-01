<script setup>

</script>

<template>
  <main class="flex flex-col items-center relative h-100vh pt-60px">
    <section class="flex flex-col items-center">
      <img src="/logo.svg" class="w-137px mb-2" alt="">
      <h2 class="font-mantou text-#334155 text-58px mb-6">
        台灣歷年總統 都幾?
      </h2>
      <p class="text-#D4009B font-bold mb-6">
        選擇查詢年分
      </p>
    </section>
    <div class="grid grid-cols-5 gap-6 w-924px">
      <RouterLink to="/vote?q=2016" class="bg-gray-1 b-rounded-50px text-center p-3">
        2016
      </RouterLink>
      <RouterLink to="/vote?q=2020" class="bg-gray-1 b-rounded-50px text-center p-3">
        2020
      </RouterLink>
      <RouterLink to="/vote?q=2020" class="bg-gray-1 b-rounded-50px text-center p-3">
        2024
      </RouterLink>
    </div>
    <div class="w-full absolute left-0 bottom-0% grid grid-cols-6 gap-6">
      <img src="/home/Frame33036.png" alt="">
      <img src="/home/Frame33037.png" alt="">
      <img src="/home/Frame33038.png" alt="">
      <img src="/home/Frame33039.png" alt="">
      <img src="/home/Frame33040.png" alt="">
      <img src="/home/Frame33041.png" alt="">
    </div>
  </main>
</template>
