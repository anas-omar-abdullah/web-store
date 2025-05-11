<template>
  <div
    class="mt-[126px] all flex flex-col items-center justify-center px-4 bg-gray-50 "
  >
    <p class="text-center text-lg sm:text-xl font-medium text-gray-800 mb-4">
      استمتع بتجربه وتسوق أفضل عبر تنزيل التطبيق
    </p>
    <NuxtLink to="/">
      <button
        class="flex items-center justify-center bg-gradient-to-r from-[#3ca2fa] to-blue-600 hover:from-blue-600 hover:to-[#3ca2fa] text-white font-semibold py-3 px-6 rounded-full transform"
      >
      حمل التطبيق
      <Download class="w-6 h-6 mr-2" />
      </button>
    </NuxtLink>
  </div>
</template>

<script setup>
import { Download } from "lucide-vue-next";
</script>

<style scoped>
.all{
height:calc((100vh - 128px)/2);
}
</style>
