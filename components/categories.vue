<template>
  <section class="container mx-auto px-4 py-12">
    <h2 class="text-3xl font-bold text-center mb-8 text-[#3ca2fa]">
      تصنيفات المنتجات
    </h2>
    <loading v-if="showLoading" />
    <h3 v-else-if="errorMess" class="w-full text-red-500 text-center">
      {{ errorMess }}
    </h3>
    <div v-else-if="categories.length === 0" class="text-primary text-center">
      لا توجد تصنيفات متاحة حالياً
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="h-48 bg-gray-100 overflow-hidden">
          <img
            :src="category.imageUrl"
            :alt="category.name"
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div
          class="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <h3 class="text-2xl font-semibold text-white">{{ category.name }}</h3>
        </div>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            @click="goToProducts(category.name)"
            class="bg-[#3ca2fa] hover:bg-[#2b8dd8] text-white px-6 py-2 rounded-full inline-block transition-colors duration-300"
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useState } from "#imports";
const categories = ref([]);
const showLoading = ref(false);
const errorMess = ref("");

onBeforeMount(async () => {
  try {
    showLoading.value = true;
    const { data } = await useFetch(
      "https://muaazaltahan-001-site1.dtempurl.com/api/categories",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data.value) {
      categories.value = data.value;
    }
  } catch (error) {
    errorMess.value = "فشل جلب أحدث التصنيفات الرجاء المحاولة لاحقا";
  } finally {
    showLoading.value = false;
  }
});

const router = useRouter();
// الحالة المشتركة لتخزين التصنيف المحدد
const selectedCategory = useState("selectedCategory", () => "");

function goToProducts(categoryName) {
  selectedCategory.value = categoryName;
  router.push({
    path: "/prodect",
    query: { category: categoryName }
  });
}
</script>
