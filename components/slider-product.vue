<template>
  <h2 class="my-8 text-3xl font-bold text-center mb-8 text-[#3ca2fa]">
    جديدنا من المنتجات
  </h2>
  <loading v-if="showLoading" />
  <h3 v-else-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h3>
  <div v-else-if="products.length === 0" class="text-primary text-center">
    لا توجد منتجات متاحة حالياً
  </div>
  <div v-else class="relative mb-12">
    <!-- مكون Swiper مع إعدادات الاستجابة والتخصيص -->
    <Swiper
      :modules="[Pagination]"
      :space-between="20"
      :loop="products.length > 4"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
      }"
      :breakpoints="{
        340: { slidesPerView: 1, slidesPerGroup: 1 },
        640: { slidesPerView: Math.min(2, products.length), slidesPerGroup: 1 },
        1025: { slidesPerView: Math.min(3, products.length), slidesPerGroup: 1 },
        1275: { slidesPerView: Math.min(4, products.length), slidesPerGroup: 1 },
      }"
    >
      <SwiperSlide v-for="(product, index) in products" :key="index">
        <div class="p-4 bg-white rounded shadow">
          <NuxtLink :to="`/product/${product.id}`"
            ><img
              :src="product.imageUrl"
              alt="صورة المنتج"
              class="w-full h-[200px] object-cover rounded"
          /></NuxtLink>
          <h3 class="mt-2 text-lg text-center">{{ product.name }}</h3>
          <p class="mt-2 text-sm font-bold text-center text-[#3ca2fa]">{{ product.price }} $</p>
        </div>
      </SwiperSlide>
    </Swiper>
    <!-- نقاط Pagination -->
    <div class="swiper-pagination mt-4 !bottom-[-30px]"></div>
  </div>
</template>

<script setup>
import loading from "/components/loading.vue";
import { ref, onBeforeMount } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
const errorMess = ref("");
const modules = [Pagination];
const showLoading = ref(false);
const products = ref([]);
onBeforeMount(async () => {
  try {
    showLoading.value = true;
    const { data } = await useFetch(
      "https://muaazaltahan-001-site1.dtempurl.com/api/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        onResponse({ response }) {
          if (!response.ok) {
            throw new Error(`خطأ في الاستجابة: ${response.status}`);
          }
        },
        onRequestError({ error }) {
          throw new Error(`خطأ في الطلب: ${error.message}`);
        },
      }
    );
    if (data.value) {
      products.value = data.value;
    }
    
  } catch (error) {
    errorMess.value = "فشل جلب أحدث المنتجات الرجاء المحاولة لاحقا";
  } finally {
    showLoading.value = false;
  }
});
</script>
