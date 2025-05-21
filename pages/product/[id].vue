<template>
  <div class="flex flex-col min-h-[calc(100vh-44px-64px-64px)]">
    <div class="container mx-auto p-4 flex-grow">
      <!-- زر العودة -->
      <NuxtLink
        to="/"
        class="inline-flex items-center text-primary hover:underline mb-6"
      >
        <LucideArrowLeft class="w-5 h-5 mr-1" />
        العودة
      </NuxtLink>
      <div class="mt-[60px]" v-if="product">
        <!-- صورة المنتج -->
        <div
          class="bg-gray-100 p-4 rounded-lg shadow-lg mb-6 h-[400px] flex items-center justify-center"
        >
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            alt="صورة المنتج"
            class="w-full h-full object-contain rounded-lg"
          />
          <div v-else class="text-gray-400 text-xl">لا توجد صورة للمنتج</div>
        </div>
        <!-- تفاصيل المنتج -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <!-- اسم المنتج والسعر -->
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-primary">{{ product.name }}</h1>
            <span class="text-2xl font-bold text-primary"
              >{{ product.price }} $</span
            >
          </div>

          <!-- معلومات المنتج -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-600">الرقم التعريفي:</span>
              <span class="font-semibold mr-2">{{ product.id }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-600">الفئة:</span>
              <span class="font-semibold mr-2">{{
                product.category || "غير محدد"
              }}</span>
            </div>
          </div>

          <!-- وصف المنتج -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-3">الوصف</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <div class="flex flex-col md:flex-row gap-4 mt-6">
            <button
              class="w-full border-var text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors"
            >
              إضافة إلى السلة
            </button>
            <button
              class="w-full bg-primary text-white py-3 px-6 rounded-lg text-lg font-semibold bg-hover"
            >
              شراء
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useAsyncData } from "#imports";
import { LucideArrowLeft } from "lucide-vue-next";
import { useAdvertisement } from "~/composables/useAdvertisement";

const { isAdVisible } = useAdvertisement();

useHead({
  title: "تفاصيل المنتج",
});

const route = useRoute();
const productId = route.params.id;

// جلب بيانات المنتج من الـ API
const { data: product, error } = await useAsyncData("product", () =>
  $fetch(
    `https://muaazaltahan-001-site1.dtempurl.com/api/products/${productId}`
  )
);

// إذا كان هناك خطأ أو لم يتم العثور على المنتج، يتم إطلاق خطأ 404
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "المنتج غير موجود",
  });
}
</script>

<style scoped>
.text-primary {
  color: var(--primary-color);
}

.bg-primary {
  background-color: var(--primary-color);
}

.bg-hover:hover {
  background-color: #0f8fff;
}

/* إزالة الـ scroll الأفقي */
html,
body {
  overflow-x: hidden;
  width: 100%;
}
.border-var {
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}
.border-var:hover {
  background-color: var(--primary-color);
  color: white;
}
</style>
