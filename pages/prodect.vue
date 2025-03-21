<template>
  <div class="all container mx-auto px-4 py-8">
    <!-- قسم التصفية -->
    <div class="mb-8 bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-color">تصفية المنتجات</h2>
      <div class="flex flex-wrap gap-4">
        <select v-model="selectedCategory" class="p-2 border rounded-md">
          <option value="">جميع الفئات</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <!-- شبكة عرض المنتجات -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <NuxtLink :to="`/product/${product.id}`">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">{{ product.category }}</span>
              <span class="text-color font-bold">{{ product.price }} $</span>
            </div>
            <button class="w-full border-var py-2 rounded-md transition-colors">
              إضافة للسلة
              <ShoppingCart class="inline-block w-4 h-4 ml-2" />
            </button>
            <NuxtLink :to="`buying/${product.id}`"
              ><button
                class="pay mt-4 w-full bg-color text-white py-2 rounded-md"
              >
                الذهاب للشراء
              </button></NuxtLink
            >
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ShoppingCart } from "lucide-vue-next";
import { useState } from "#imports";

useHead({
  title: 'كافة المنتجات'
})

// بيانات المنتجات (يمكنك استبدالها ببياناتك الفعلية)
const products = ref([
  {
    id: 1,
    name: "كريم مرطب للوجه",
    category: "العناية بالبشرة",
    price: 129,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
  },
  {
    id: 2,
    name: "مسكرة طويلة الأمد",
    category: "مستحضرات التجميل",
    price: 89,
    image: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500",
  },
  {
    id: 3,
    name: "شامبو طبيعي",
    category: "العناية بالشعر",
    price: 59,
    image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=500",
  },
]);

// تصنيفات المنتجات المتاحة (يجب أن تتطابق مع التصنيفات في صفحة التصنيفات)
const categories = ["العناية بالبشرة", "مستحضرات التجميل", "العناية بالشعر"];

// استخدام الحالة المشتركة لنفس المفتاح المستخدم في صفحة التصنيفات
const selectedCategory = useState("selectedCategory", () => "");

// تصفية المنتجات بناءً على التصنيف المختار
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter(
    (product) => product.category === selectedCategory.value
  );
});
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
</style>
