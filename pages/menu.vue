<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <h1 v-else-if="products?.length === 0" class="text-primary text-center">
    لا يوجد عناصر لعرضها
  </h1>
  <div class="table-sm bg-white shadow rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="table-header sm-pr-1">اختيار</th>
          <th scope="col" class="table-header sm-pr-1">صورة المنتج</th>
          <th scope="col" class="table-header sm-pr-1">اسم المنتج</th>
          <th scope="col" class="table-header sm-pr-1">السعر</th>
          <th scope="col" class="table-header sm-pr-1">الكمية</th>
          <th scope="col" class="table-header sm-pr-1">الإجراءات</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="product in products" :key="product.id">
          <td class="table-cell">
            <div
              @click="toggleRemember"
              class="cursor-pointer flex items-center"
            >
              <div
                class="border-b mx-2 w-4 h-4 border border-gray-300 flex items-center justify-center"
                :class="{ 'bg-primary': remember }"
              >
                <LucideCheck
                  v-if="remember"
                  class="w-3 h-3 text-white text-center"
                />
              </div>
            </div>
          </td>
          <td class="table-cell">
            <img :src="product.imageUrl" alt="no-img" />
          </td>
          <td class="table-cell">{{ product.name }}</td>
          <td class="table-cell">{{ product.price }}</td>
          <td class="table-cell">{{ product.quantity }}</td>
          <td class="table-cell">
            <button
              @click="deleteProduct(product)"
              class="text-red-500 hover:text-red-600"
            >
              <Trash2 class="h-5 w-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <button type="submit" class="btn btn-primary mt-4 mr-[50%]">
    <h1>شراء</h1>
  </button>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { LucideCheck, Trash2 } from "lucide-vue-next";

definePageMeta({
  layout: false,
});

useHead({
  title: "سلة المنتجات",
});

const products = ref([
  { name: "sacdsc", price: "vsvdcsdc", quantity: "csacacca" },
  { name: "sacdsc", price: "vsvdcsdc", quantity: "csacacca" },
  { name: "sacdsc", price: "vsvdcsdc", quantity: "csacacca" },
]);
const remember = ref(true);
const showLoading = ref(false);
const errorMess = ref("");
const toggleRemember = () => {
  remember.value = !remember.value;
};

onBeforeMount(async () => {
  showLoading.value = true;
  try {
    products.value = await authStore.showProduct("api/products");
    if (!authStore.response.ok) {
      errorMess.value = "فشل جلب المنتجات الى السلة الرجاء المحاولة لاحقا: ";
    }
  } catch (error) {
    errorMess.value = "فشل جلب المنتجات الى السلة الرجاء المحاولة لاحقا: ";
  } finally {
    showLoading.value = false;
  }
});
</script>
<style scoped>
@media (max-width: 470px) {
  .sm-pr-1 {
    padding-right: 3px !important;
  }
}
</style>
