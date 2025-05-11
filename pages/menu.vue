<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <h1 v-else-if="products?.length === 0" class="text-primary text-center">
    لا يوجد عناصر لعرضها
  </h1>
  <div v-else>
    <div class="table-sm bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
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
              <img :src="product.imageUrl" alt="no-img" />
            </td>
            <td class="table-cell">{{ product.name }}</td>
            <td class="table-cell">{{ product.price }}</td>
            <td class="table-cell">
              <div class="flex">
                <div class="mt-5">{{ product.quantity }}</div>
                <div class="mr-4 text-xl">
                  <div class=""><buttom @click="incOne(10)">+</buttom></div>
                  <div class="block">
                    <buttom @click="clearOne(product.quantity)">-</buttom>
                  </div>
                </div>
              </div>
            </td>
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
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { Trash2 } from "lucide-vue-next";

definePageMeta({
  layout: false,
});

useHead({
  title: "سلة المنتجات",
});

const products = ref([
  { name: "sacdsc", price: "vsvdcsdc", quantity: 10 },
  { name: "sacdsc", price: "vsvdcsdc", quantity: "csacacca" },
  { name: "sacdsc", price: "vsvdcsdc", quantity: "csacacca" },
]);
const showLoading = ref(false);
const errorMess = ref("");

onBeforeMount(async () => {
  showLoading.value = true;
  try {
    products.value = await authStore.showProduct("api/products");
    if (!authStore.response.ok) {
      errorMess.value = "فشل جلب المنتجات الى السلة الرجاء المحاولة لاحقا";
    }
  } catch (error) {
    errorMess.value = "فشل جلب المنتجات الى السلة الرجاء المحاولة لاحقا ";
  } finally {
    showLoading.value = false;
  }
});
function incOne(id) {
  return id++;
}

function clearOne(id) {
  return id--;
}
</script>
<style scoped>
@media (max-width: 470px) {
  .sm-pr-1 {
    padding-right: 3px !important;
  }
}
</style>
