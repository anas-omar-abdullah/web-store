<template>
  <loading overlay v-if="showLoading"></loading>
  <h1 v-if="errorMess" class="mt-8 w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <div v-else class="all mt-[80px] container mx-auto px-4 py-8 min-h-scc">
    <!-- قسم التصفية -->
    <div class="mb-8 bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-color">تصفية المنتجات</h2>
      <div class="flex flex-wrap gap-4">
        <select
          v-model="selectedCategory"
          class="p-2 border border-pr rounded-md"
        >
          <option value="">جميع الفئات</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    <h2 v-if="products?.length === 0" class="mt-8 text-primary text-center">
      لا يوجد منتجات لعرضها
    </h2>
    <h2
      v-if="filteredProducts.length === 0"
      class="mt-8 text-primary text-center"
    >
      لا يوجد منتجات ضمن هذا التصنيف
    </h2>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <NuxtLink :to="`/product/${product.id}`">
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
        </NuxtLink>
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">
              <span
                v-for="(category, index) in product.categories"
                :key="index"
              >
                {{ category
                }}{{ index < product.categories.length - 1 ? "، " : "" }}
              </span>
            </span>
            <span class="text-color font-bold">{{ product.price }} $</span>
          </div>
          <div
            class="flex items-center justify-evenly mb-2 border rounded-2xl border-primary"
          >
            <span
              @click="increment(product)"
              :disabled="product.count >= 25"
              class="text-2xl w-4 text-center text-color cursor-pointer"
              :class="{
                'opacity-50 !cursor-not-allowed':
                  product.count >= product.quantity,
              }"
              >+</span
            >
            <span class="text-xl text-center">{{ product.count }}</span>
            <span
              @click="decrement(product)"
              :disabled="product.count <= 1"
              class="text-2xl w-4 text-center text-red-500 cursor-pointer"
              :class="{ 'opacity-50 !cursor-not-allowed': product.count <= 1 }"
              >-</span
            >
          </div>

          <button
            @click="goMenu(product)"
            class="w-full border-var py-2 rounded-md transition-colors"
          >
            إضافة للسلة
            <ShoppingCart class="inline-block w-4 h-4 ml-2" />
          </button>
          <NuxtLink :to="`/buying?id=${product.id}&count=${product.count}`">
            <button class="pay mt-4 w-full bg-color text-white py-2 rounded-md">
              الذهاب للشراء
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { ShoppingCart } from "lucide-vue-next";
import { useState } from "#imports";
import { useRoute } from "vue-router";
import { showToast } from "~/utils/toast";

useHead({
  title: "كافة المنتجات",
});
const products = ref([]);
const categories = ref([]);
const showLoading = ref(false);
const errorMess = ref("");

const increment = (product) => {
  if (product.count < product.quantity) {
    product.count = (product.count || 0) + 1;
  }
};
const decrement = (product) => {
  if (product.count > 1) {
    product.count = product.count - 1;
  }
};

const route = useRoute();
const selectedCategory = useState(
  "selectedCategory",
  () => route.query.category || ""
);

// تصفية المنتجات بناءً على التصنيف المختار
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter(
    (product) => product.category === selectedCategory.value
  );
});

onBeforeMount(async () => {
  try {
    showLoading.value = true;
    const data = await $fetch(
      "https://muaazaltahan-001-site1.dtempurl.com/api/Categories",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data) {
      categories.value = data;
    }
  } catch (error) {
    errorMess.value = "فشل جلب التصنيفات الرجاء المحاولة لاحقا";
  } finally {
    showLoading.value = false;
  }
  try {
    showLoading.value = true;
    const data = await $fetch(
      "https://muaazaltahan-001-site1.dtempurl.com/api/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data) {
      products.value = data.map((product) => ({
        ...product,
        count: 1,
      }));
    }
  } catch (error) {
    errorMess.value = "فشل جلب المنتجات الرجاء المحاولة لاحقا";
  } finally {
    showLoading.value = false;
  }
});
function goMenu(product) {
  try {
    const stored = localStorage.getItem("products");
    let cartProducts = stored ? JSON.parse(stored) : [];
    const productIndex = cartProducts.findIndex((item) => item.id === product.id);

    if (productIndex !== -1) {
      // تحديث الكمية إذا كان المنتج موجود بالفعل
      const newCount = cartProducts[productIndex].count + product.count;
      if (newCount <= product.quantity) {
        cartProducts[productIndex].count = newCount;
      } else {
        showToast("الكمية المطلوبة غير متوفرة", "error");
        return;
      }
    } else {
      // إضافة منتج جديد
      cartProducts.push({
        ...product,
        count: product.count || 1,
      });
    }
    
    localStorage.setItem("products", JSON.stringify(cartProducts));
    showToast("تمت إضافة المنتج إلى السلة بنجاح");
  } catch (error) {
    showToast("حدث خطأ أثناء إضافة المنتج إلى السلة", "error");
  }
}

async function handleSubmit() {
  try {
    // ... existing code ...
    await showToast("تم إرسال الطلب بنجاح");
    // ... rest of the code ...
  } catch (error) {
    showToast("فشل إرسال الطلب", "error");
  }
}
</script>

<style scoped>
.text-color {
  color: var(--primary-color);
}
.bg-color {
  background: var(--primary-color);
}
.border-var {
  border: 2px solid var(--primary-color);
}
.border-var:hover {
  background-color: var(--primary-color);
  color: white;
}
.pay:hover {
  background-color: #0f8fff;
}
.min-h-scc {
  min-height: calc(100vh - 80px);
}
.border-pr {
  border: 1px solid var(--primary-color);
  outline: none;
}

.border-pr:focus {
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}
</style>
