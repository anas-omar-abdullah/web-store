<template>
  <h2 class="my-8 text-3xl font-bold text-center mb-8 text-[#3ca2fa]">
    جديدنا من المنتجات
  </h2>
  <div class="relative mb-12">
    <!-- مكون Swiper مع إعدادات الاستجابة والتخصيص -->
    <Swiper
      :modules=[Pagination]
      :space-between="20"
      :loop="true"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
      }"
      :breakpoints="{
        340: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1025: { slidesPerView: 3 },
        1275: { slidesPerView: 4 },
      }"
    >
      <SwiperSlide v-for="(product, index) in products" :key="index">
        <div class="p-4 bg-white rounded shadow">
          <img :src="product.image" alt="صورة المنتج" class="w-full rounded" />
          <h3 class="mt-2 text-lg text-center">{{ product.title }}</h3>
        </div>
      </SwiperSlide>
    </Swiper>
    <!-- نقاط Pagination -->
    <div class="swiper-pagination mt-4 !bottom-[-30px]"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
const modules = [Pagination];
const products = ref([
  {
    id: 1,
    title: "منتج 1",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 2,
    title: "منتج 2",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 3,
    title: "منتج 3",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 4,
    title: "منتج 4",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 5,
    title: "منتج 5",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 6,
    title: "منتج 6",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 7,
    title: "منتج 7",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 8,
    title: "منتج 8",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
]);
</script>
