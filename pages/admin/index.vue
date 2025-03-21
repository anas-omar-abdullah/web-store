<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <h1 v-else-if="products?.length === 0" class="text-primary text-center">
    لا يوجد عناصر لعرضها
  </h1>
  <div v-else>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">المنتجات</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة منتج
      </button>
    </div>

    <!-- Products Table -->
    <div class="table-sm bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">صورة المنتج</th>
            <th scope="col" class="table-header">اسم المنتج</th>
            <th scope="col" class="table-header">التصنيف</th>
            <th scope="col" class="table-header">السعر</th>
            <th scope="col" class="table-header">الكمية</th>
            <th scope="col" class="table-header">الحالة</th>
            <th scope="col" class="table-header">الإجراءات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="w-6 table-cell">
              <img :src="product.imageUrl" alt="no-img" />
            </td>
            <td class="table-cell">{{ product.name }}</td>
            <td class="table-cell">{{ product.category }}</td>
            <td class="table-cell">{{ product.price }}</td>
            <td class="table-cell">{{ product.quantity }}</td>
            <td class="table-cell">
              <span
                :class="
                  product.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ product.active ? "ظاهر" : "مخفي" }}
              </span>
            </td>
            <td class="table-cell">
              <div class="flex space-x-2 space-x-reverse">
                <button
                  @click="editProduct(product)"
                  class="text-primary hover:text-primary/80"
                >
                  <Pencil class="h-5 w-5" />
                </button>
                <button
                  @click="toggleVisibility(product)"
                  class="text-yellow-500 hover:text-yellow-600"
                >
                  <Eye v-if="product.active" class="h-5 w-5" />
                  <EyeOff v-else class="h-5 w-5" />
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="text-red-500 hover:text-red-600"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Product Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingProduct ? "تعديل منتج" : "إضافة منتج جديد" }}
        </h2>
        <form @submit.prevent="saveProduct">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >اسم المنتج</label
              >
              <input
                v-model="productForm.name"
                type="text"
                class="all-border-input input mt-1 block w-full"
                :class="{ '!border-red-500': errors.name }"
                @input="clearError('name')"
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.name }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >التصنيف</label
              >
              <select
                v-model="productForm.category"
                class="all-border-input input mt-1 block w-full"
                :class="{ '!border-red-500': errors.category }"
                :disabled="categories.length === 0"
                @input="clearError('category')"
              >
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
                <option v-if="!categories" disabled>لا يوجد أصناف</option>
              </select>
              <p v-if="errors.category" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.category }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >وصف المنتج(اختياري)</label
              >
              <input
                v-model="productForm.description"
                type="text"
                class="all-border-input input mt-1 block w-full"
                :class="{ '!border-red-500': errors.description }"
                @input="clearError('description')"
              />
              <p
                v-if="errors.description"
                class="text-red-500 text-sm mt-1 pl-2"
              >
                {{ errors.description }}
              </p>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700"
                for="image"
              >
                إرفاق صورة (حد أقصى 1 ميغا بايت)
              </label>
              <input
                id="image"
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="rounded-full all-border-input input mt-1 block w-full"
                :class="{ 'border-red-500': errors.photo }"
                @input="clearError('photo')"
              />
              <p v-if="errors.photo" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.photo }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >السعر</label
              >
              <input
                v-model="productForm.price"
                type="number"
                class="all-border-input input mt-1 block w-full"
                :class="{ '!border-red-500': errors.price }"
                @input="clearError('price')"
              />
              <p v-if="errors.price" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.price }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >الكمية</label
              >
              <input
                v-model="productForm.quantity"
                type="number"
                class="all-border-input input mt-1 block w-full"
                :class="{ '!border-red-500': errors.quantity }"
                @input="clearError('quantity')"
              />
              <p v-if="errors.quantity" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.quantity }}
              </p>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              @click="showAddModal = false"
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingProduct ? "حفظ التغييرات" : "إضافة المنتج" }}
            </button>
          </div>
          <loading v-if="loadingForm" />
          <div
            v-if="errorApi"
            :class="{
              'mt-4 text-red-600 text-center': errorApi,
            }"
          >
            {{ errorApi.message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

useHead({
  title: "صفحة التحكم بالمنتجات",
});

definePageMeta({
  layout: "admin",
});

const products = ref([]);
const categories = ref([]);
const showAddModal = ref(false);
const editingProduct = ref(null);
const productForm = ref({
  name: "",
  category: "",
  description: "",
  price: "",
  quantity: "",
  imageUrl: "",
  addedBy: "",
});
const errors = ref({
  name: "",
  category: "",
  price: "",
  quantity: "",
  description: "",
  photo: "",
});
const showErrorInput = ref(false);
const errorMess = ref("");
const imgProduct = ref();
const showLoading = ref(false);
const authStore = useAuthStore();
const loadingForm = ref(false);
const errorApi = ref("");
// دالة لتنظيف الأخطاء عند البدء بالكتابة
const clearError = (field) => {
  if (errors.value[field] && showErrorInput.value) {
    errors.value[field] = "";
    validateForm();
  }
};

// التحقق من صحة البيانات
const validateForm = () => {
  let isValid = true;
  if (productForm.value.name.trim() === "") {
    errors.value.name = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (productForm.value.name.length > 12) {
    errors.value.name = "عدد الأحرف يجب أن يكون 12 حرف أو أقل";
    isValid = false;
  }
  if (productForm.value.category.trim() === "") {
    errors.value.category = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (productForm.value.description.length >= 500) {
    errors.value.description = "عدد الأحرف أصفر من 500";
    isValid = false;
  }
  if (productForm.value.price.trim() === "") {
    errors.value.price = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (productForm.value.quantity.trim() === "") {
    errors.value.quantity = "هذا الحقل مطلوب";
    isValid = false;
  }
  return isValid;
};

onBeforeMount(async () => {
  showLoading.value = true;
  try {
    products.value = await authStore.showProduct("api/products");
    if(!authStore.response.ok){
      errorMess.value = "فشل جلب المنتجات الرجاء المحاولة لاحقا: "
    }
  } catch (error) {
    errorMess.value = "فشل جلب المنتجات الرجاء المحاولة لاحقا: "
  } finally {
    showLoading.value = false;
  }
});

async function toggleVisibility(product) {
  product.active = !product.active;
  const token = localStorage.getItem("token");
  showLoading.value = true;
  // TODO: Call API to update visibility
  const url = `https://192.168.1.103:7010/api/products`;
  try {
    const response = await $fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
  } catch (error) {
    product.active = !product.active;
    setTimeout(()=> {
      errorMess.value = "فشل تعديل حالة المنتج الرجاء المحاولة من جديد"
  }, 2000);
  } finally {
    showLoading.value = false;
    errorMess.value = "";
  }
}

async function deleteProduct(product) {
  if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
    try {
      showLoading.value = true;
      // TODO: Call API to delete product
      await authStore.deletThing(product, `api/products/${product.id}`);
      products.value = products.value.filter((a) => a.id !== product.id);
      if(!authStore.response.ok){
        setTimeout(()=> {
      errorMess.value = "فشل حذف المنتج الرجاء المحاولة من جديد"
  }, 2000);
      }
    } catch (error) {
      setTimeout(()=> {
      errorMess.value = "فشل حذف المنتج الرجاء المحاولة من جديد"
  }, 2000);
    } finally {
      showLoading.value = false;
      errorMess.value = "";
    }
  }
}

function editProduct(product) {
  editingProduct.value = product;
  productForm.value = { ...product };
  showAddModal.value = true;
}

async function saveProduct() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  const data = new FormData();
  if (imgProduct.value) {
    data.append("file", imgProduct.value);
  }
  data.append("jsonData", JSON.stringify(productForm.value));
  try {
    loadingForm.value = true;
    if (editingProduct.value) {
      // TODO: Call API to update product
      const result = await authStore.updateProduct(data, "api/products");
      const index = products.value.findIndex(
        (p) => p.id === editingProduct.value.id
      );

      products.value[index] = {
        ...editingProduct.value,
        ...productForm.value,
      };
      productForm.value = authStore.yourForm;
      imgProduct.value = authStore.your - ulr - image;
      if(!authStore.response.ok){
        setTimeout(() => {
          errorApi.value = "فشل أضافة منتج الرجاء المحاولة لاحقا";
        },2000)
      }
    } else {
      // TODO: Call API to create product
      const newProduct = await authStore.addProduct(data, "api/products","المنتج");
      products.value.push({
        ...newProduct.yorform,
        active: true,
      });
    }
    if(!authStore.response.ok){
        setTimeout(() => {
          errorApi.value = "فشل تعديل منتج الرجاء المحاولة لاحقا";
        },2000)
      }
    showAddModal.value = false;
    resetForm();
  } catch (error) {
    if(!authStore.response.ok){
        setTimeout(() => {
          errorApi.value = "فشل أضافة/ تعديل منتج الرجاء المحاولة لاحقا";
        },2000)
      }
  } finally {
    loadingForm.value = false;
    errorApi.value = "";
  }
}
function resetForm() {
  editingProduct.value = null;
  productForm.value = {
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    imageUrl: "",
  };
  imgProduct.value = null;
  showErrorInput.value = false;
}

// add photo
function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  // الحجم الأقصى المسموح به: 1 ميغا بايت = 1048576 بايت
  if (file.size > 1048576) {
  errors.photo.value = "حجم الصورة المسموح به هو 1 ميغا بايت كحد أقصى";
    event.target.value = null; // إعادة تعيين حقل الملف
    return;
  }
  imgProduct.value = file;
}
</script>
<style>
.all-border-input {
  border: 1px solid #1a1a1a;
  padding: 2px 25px;
  transition: all 0.3s;
  outline: none;
  color: #1a1a1a;
}
.all-border-input:hover,
.all-border-input:focus,
.all-border-input:active,
.all-border-input:focus-visible,
.all-border-input:focus-within,
.all-border-input:target {
  border: 1px solid var(--primary-color);
}
@media (max-width: 600px) {
  .table-sm {
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
