<template>
  <loading overlay v-if="showLoading" />
  <div class="container mx-auto px-4 py-8 relative">
    <!-- زر الرجوع -->
    <button
      @click="router.back()"
      class="absolute top-0 right-4 flex items-center mt-4 text-primary hover:text-primary-dark transition-colors duration-200"
    >
      <ArrowRight class="h-6 w-6 ml-1" />
      <span>رجوع</span>
    </button>

    <h1 v-if="errorMess" class="w-full text-red-500 text-center mt-8">
      {{ errorMess }}
    </h1>
    <h1
      v-else-if="products?.length === 0"
      class="text-primary text-center mt-8"
    >
      لا يوجد عناصر لعرضها
    </h1>
    <div v-else class="container mx-auto px-4 py-8">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-primary">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-right text-sm font-bold text-white"
              >
                صورة المنتج
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-sm font-bold text-white"
              >
                اسم المنتج
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-sm font-bold text-white"
              >
                السعر
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-sm font-bold text-white"
              >
                الكمية
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-sm font-bold text-white"
              >
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="h-20 w-20 object-cover rounded-lg"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.price }} $
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="flex items-center justify-start space-x-4 space-x-reverse"
                >
                  <div
                    class="flex items-center border rounded-lg overflow-hidden"
                  >
                    <button
                      @click="incOne(product)"
                      class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg"
                      :disabled="product.count >= product.quantity"
                      :class="{
                        'opacity-50 cursor-not-allowed':
                          product.count >= product.quantity,
                      }"
                    >
                      +
                    </button>
                    <span class="px-4 py-1 text-gray-700">{{
                      product.count
                    }}</span>
                    <button
                      @click="clearOne(product)"
                      class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg"
                      :disabled="product.count <= 1"
                      :class="{
                        'opacity-50 cursor-not-allowed': product.count <= 1,
                      }"
                    >
                      -
                    </button>
                  </div>
                  <span class="text-sm text-gray-500"
                    >من {{ product.quantity }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="deleteProduct(product)"
                  class="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-8 flex justify-center">
        <button
          type="submit"
          @click="goToBuying"
          class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
        >
          <span class="ml-2">شراء</span>
          <ShoppingCart class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-vue-next";
import { useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

useHead({
  title: "سلة المنتجات",
});

const router = useRouter();
const products = ref([]);
const showLoading = ref(false);
const errorMess = ref("");

onBeforeMount(() => {
  showLoading.value = true;
  try {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      products.value = JSON.parse(storedProducts);
    }
  } catch (error) {
    errorMess.value = "فشل جلب المنتجات من السلة الرجاء المحاولة لاحقا";
  } finally {
    showLoading.value = false;
  }
});

function incOne(product) {
  if (product.count < product.quantity) {
    product.count++;
    updateLocalStorage();
  }
}

function clearOne(product) {
  if (product.count > 1) {
    product.count--;
    updateLocalStorage();
  }
}

function deleteProduct(product) {
  const index = products.value.findIndex((p) => p.id === product.id);
  if (index !== -1) {
    products.value.splice(index, 1);
    updateLocalStorage();
  }
}

function updateLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products.value));
}

function goToBuying() {
  if (products.value.length > 0) {
    router.push("/buying");
  }
}
</script>
<style scoped>
.bg-primary {
  background-color: var(--primary-color);
}

.bg-primary-dark {
  background-color: var(--primary-color-dark, #0f8fff);
}

.text-primary {
  color: var(--primary-color);
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  td,
  th {
    padding: 0.5rem !important;
  }

  img {
    height: 3rem !important;
    width: 3rem !important;
  }
}
</style>
