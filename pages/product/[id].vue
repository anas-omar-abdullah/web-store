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
              @click="addToCart"
              :disabled="isAddingToCart"
              class="w-full border-var text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isAddingToCart }"
            >
              <span v-if="!isAddingToCart">إضافة إلى السلة</span>
              <span v-else>جاري الإضافة...</span>
            </button>
            <button
              @click="buyNow"
              :disabled="isBuying"
              class="w-full bg-primary text-white py-3 px-6 rounded-lg text-lg font-semibold bg-hover"
              :class="{ 'opacity-50 cursor-not-allowed': isBuying }"
            >
              <span v-if="!isBuying">شراء</span>
              <span v-else>جاري المعالجة...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter, useAsyncData } from "#imports";
import { LucideArrowLeft } from "lucide-vue-next";
import { useAdvertisement } from "~/composables/useAdvertisement";
import { showToast } from "~/utils/toast";

const { isAdVisible } = useAdvertisement();
const router = useRouter();
const route = useRoute();
const productId = route.params.id;

// Loading states
const isAddingToCart = ref(false);
const isBuying = ref(false);
const config = useRuntimeConfig();

useHead({
  title: "تفاصيل المنتج",
});

// جلب بيانات المنتج من الـ API
const { data: product, error } = await useAsyncData("product", () =>
  $fetch(
    `${config.public.apiBase}api/products/${productId}`
  )
);

// إذا كان هناك خطأ أو لم يتم العثور على المنتج، يتم إطلاق خطأ 404
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "المنتج غير موجود",
  });
}

/**
 * Add product to shopping cart
 */
function addToCart() {
  if (!product.value || isAddingToCart.value) return;
  
  isAddingToCart.value = true;
  
  try {
    if (process.client) {
      const stored = localStorage.getItem("products");
      let cartProducts = stored ? JSON.parse(stored) : [];
      
      const productIndex = cartProducts.findIndex((item) => item.id === product.value.id);
      
      if (productIndex !== -1) {
        // Product already in cart, increment quantity
        const newCount = cartProducts[productIndex].count + 1;
        if (newCount <= product.value.quantity) {
          cartProducts[productIndex].count = newCount;
        } else {
          showToast("الكمية المطلوبة غير متوفرة", "error");
          return;
        }
      } else {
        // Add new product to cart
        cartProducts.push({
          ...product.value,
          count: 1,
        });
      }
      
      localStorage.setItem("products", JSON.stringify(cartProducts));
      showToast("تمت إضافة المنتج إلى السلة بنجاح");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showToast("حدث خطأ أثناء إضافة المنتج إلى السلة", "error");
  } finally {
    isAddingToCart.value = false;
  }
}

/**
 * Buy product now (redirect to checkout)
 */
function buyNow() {
  if (!product.value || isBuying.value) return;
  
  isBuying.value = true;
  
  try {
    // Redirect to buying page with product ID and count
    router.push(`/buying?id=${product.value.id}&count=1`);
  } catch (error) {
    console.error("Error navigating to checkout:", error);
    showToast("حدث خطأ، الرجاء المحاولة مرة أخرى", "error");
  } finally {
    isBuying.value = false;
  }
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
