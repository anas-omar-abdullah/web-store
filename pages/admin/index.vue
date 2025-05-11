<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <div v-else>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">المنتجات</h1>
      <button @click="addpro" class="btn btn-primary">إضافة منتج</button>
    </div>
    <h2 v-if="errorMessone" class="w-full h-4 text-red-500 text-center">
      {{ errorMessone }}
    </h2>
    <h1 v-if="products?.length === 0" class="text-primary text-center">
      لا يوجد عناصر لعرضها
    </h1>
    <!-- Products Table -->
    <div v-else class="table-sm bg-white shadow rounded-lg overflow-hidden">
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
            <td class="w-8 table-cell">
              <img class="w-full" :src="product.imageUrl" alt="no-img" />
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
      class="fixed inset-0 z-[100] bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
                >التصنيفات</label
              >
              <div class="relative" @click.stop>
                <div
                  class="all-border-input input mt-1 block w-full h-8 overflow-hidden cursor-pointer items-center"
                  :class="{ '!border-red-500': errors.categories }"
                  @click="isOpen = !isOpen"
                >
                  <div class="flex items-center justify-between">
                    <span
                      class="flex-1 text-gray-500"
                      v-if="
                        !productForm.categories ||
                        productForm.categories.length === 0
                      "
                    >
                      لا يوجد تصنيف
                    </span>
                    <span v-else class="flex-1 truncate">
                      {{ productForm.categories?.length }} تصنيف{{
                        productForm.categories?.length > 1 ? "ات" : ""
                      }}
                      مختار{{ productForm.categories?.length > 1 ? "ة" : "" }}
                    </span>
                    <ChevronDown v-if="!isOpen" class="w-4 h-4 text-gray-400" />
                    <ChevronUp v-else class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div
                  v-if="isOpen"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="category in categories"
                    :key="category.id"
                    class="p-2 cursor-pointer flex items-center"
                    :class="{
                      'text-primary': productForm.categories?.includes(
                        category.name
                      ),
                    }"
                    @click="toggleCategory(category.name)"
                  >
                    <Check
                      v-if="productForm.categories?.includes(category.name)"
                      class="w-4 h-4 mr-2 text-primary"
                    />
                    <span v-else class="w-4 h-4 mr-2"></span>
                    {{ category.name }}
                  </div>
                </div>
              </div>
              <div
                v-if="productForm.categories?.length > 0"
                class="mt-2 flex flex-wrap gap-2"
              >
                <span
                  v-for="(category, index) in productForm.categories"
                  :key="index"
                  class="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {{ category }}
                </span>
              </div>
              <p
                v-if="errors.categories"
                class="text-red-500 text-sm mt-1 pl-2"
              >
                {{ errors.categories }}
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
                class="block text-sm font-medium text-gray-700 mb-2"
                for="image"
              >
                إرفاق صورة
              </label>
              <div class="relative">
                <div class="flex items-center justify-center w-full">
                  <label
                    for="image"
                    class="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload class="w-8 h-8 mb-2 text-gray-500" />
                      <p class="mb-1 text-sm text-gray-500">
                        <span class="font-semibold">اضغط للرفع</span>
                      </p>
                      <p class="text-xs text-gray-500">PNG, JPG أو JPEG (الحد الأقصى: 1MB)</p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      @change="handleFileChange"
                      accept="image/*"
                      class="hidden"
                      :class="{ 'border-red-500': errors.photo }"
                      @input="clearError('photo')"
                    />
                  </label>
                </div>
              </div>
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
              @click="bothJob"
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
              :disabled="loadingForm"
              :class="{ 'opacity-50 cursor-not-allowed': loadingForm }"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loadingForm"
              :class="{ 'opacity-50 cursor-not-allowed': loadingForm }"
            >
              {{ editingProduct ? "حفظ التغييرات" : "إضافة المنتج" }}
            </button>
          </div>
          <loading v-if="loadingForm" />
          <div v-if="errorApi" class="mt-4 text-red-600 text-center">
            {{ errorApi }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted } from "vue";
import {
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Upload
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import Swal from "sweetalert2";

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
  categories: [],
  description: "",
  price: null,
  quantity: null,
  imageUrl: "",
  addedBy: JSON.parse(localStorage.getItem("_user")).id,
  active: true,
});
const errors = ref({
  name: "",
  categories: "",
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
const errorMessone = ref("");
const isOpen = ref(false);

// دالة لتنظيف الأخطاء عند البدء بالكتابة
const clearError = (field) => {
  if (errors.value[field] && showErrorInput.value) {
    errors.value[field] = "";
    validateForm();
  }
};
// rest errors
function resterror() {
  errors.value.name = "";
  errors.value.categories = "";
  errors.value.price = "";
  errors.value.quantity = "";
  errors.value.description = "";
  errors.value.photo = "";
}
const bothJob = () => {
  showAddModal.value = false;
  resterror();
  resetJustForm();
};
const addpro = async () => {
  showAddModal.value = true;
  try {
    categories.value = await authStore.showProduct("api/Categories");
  } catch (error) {
    errorMess.value = "error";
  } finally {
    errorMess.value = "";
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
  if (productForm.value.description.length >= 500) {
    errors.value.description = "عدد الأحرف أصفر من 500";
    isValid = false;
  }
  if (productForm.value.price === null) {
    errors.value.price = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (productForm.value.quantity === null) {
    errors.value.quantity = "هذا الحقل مطلوب";
    isValid = false;
  }
  if(errors.value.photo){
    isValid = false;
  }
  return isValid;
};

onBeforeMount(async () => {
  showLoading.value = true;
  try {
    products.value = await authStore.showProduct("api/products");
    if (!authStore.response.ok) {
      errorMess.value = "فشل جلب المنتجات الرجاء المحاولة لاحقا ";
    }
  } catch (error) {
    errorMess.value = "فشل جلب المنتجات الرجاء المحاولة لاحقا ";
  } finally {
    showLoading.value = false;
    errorMess.value = "";
  }
});

async function toggleVisibility(product) {
  product.active = !product.active;
  const token = localStorage.getItem("token");
  showLoading.value = true;
  const data = new FormData();
  if (imgProduct.value) {
    data.append("file", imgProduct.value);
  }
  data.append("jsonData", JSON.stringify(product));

  // TODO: Call API to update visibility
  const url = `https://muaazaltahan-001-site1.dtempurl.com/api/products`;
  try {
    const response = await $fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
  } catch (error) {
    console.log(product.active);
    product.active = !product.active;
    errorMessone.value = "فشل تعديل حالة المنتج الرجاء المحاولة من جديد";
    setTimeout(() => {
      errorMessone.value = "";
    }, 2000);
  } finally {
    showLoading.value = false;
  }
}

async function deleteProduct(product) {
  try {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استرجاع هذا المنتج!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary-color)",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      showLoading.value = true;
      const deleteResult = await authStore.deletThing(
        product,
        `api/products/${product.id}`
      );

      products.value = products.value.filter((a) => a.id !== product.id);

      await Swal.fire({
        title: "تم الحذف!", 
        text: "تم حذف المنتج بنجاح.",
        icon: "success",
        size: "small",
        showConfirmButton: false,
        timer: 600,
        timerProgressBar: true,
        width: "300px",
      });
    }
  } catch (error) {
    errorMessone.value = "فشل حذف المنتج الرجاء المحاولة من جديد";
    setTimeout(() => {
      errorMessone.value = "";
    }, 2000);
  } finally {
    showLoading.value = false;
  }
}

async function editProduct(product) {
  try {
    products.value = await authStore.showProduct("api/products");
    if (!authStore.response.ok) {
      errorMess.value = "فشل جلب المنتجات الرجاء المحاولة لاحقا ";
    }
  } catch (error) {
    errorMess.value = "فشل جلب المنتجات الرجاء المحاولة لاحقا ";
  } finally {
    showLoading.value = false;
    errorMess.value = "";
  }

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
      productForm.value = result;
      imgProduct.value = result.imageUrl;
    } else {
      // TODO: Call API to create product
      const newProduct = await authStore.addProduct(data, "api/products");
      products.value = [...products.value, newProduct];
    }
  } catch (error) {
    errorApi.value = "فشل أضافة/ تعديل منتج الرجاء المحاولة لاحقا";
    setTimeout(() => {
      errorApi.value = "";
    }, 2000);
  } finally {
    loadingForm.value = false;
    showAddModal.value = false;
    resetForm();
  }
}
function resetForm() {
  editingProduct.value = null;
  productForm.value = {
    ...productForm.value,
    name: "",
    categories: [],
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
    addedBy: JSON.parse(localStorage.getItem("_user")).id,
  };
  imgProduct.value = null;
  showErrorInput.value = false;
  isOpen.value = false;
  resterror();
}
function resetJustForm() {
  productForm.value = {
    ...productForm.value,
    name: "",
    categories: [],
    price: 0,
    quantity: 0,
    imageUrl: "",
  };
  isOpen.value = false;
}
// add photo
function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  // الحجم الأقصى المسموح به: 1 ميغا بايت = 1048576 بايت
  if (file.size > 1048576) {
    errors.value.photo = "حجم الصورة المسموح به هو 1 ميغا بايت كحد أقصى";
    event.target.value = null;
    return;
  }

  imgProduct.value = file;
  errors.value.photo = "";
}

function toggleCategory(category) {
  if (!productForm.value.categories) {
    productForm.value.categories = [];
  }
  const index = productForm.value.categories.indexOf(category);
  if (index === -1) {
    productForm.value.categories.push(category);
  } else {
    productForm.value.categories.splice(index, 1);
  }
}
// إضافة معالج للنقر خارج القائمة
function handleClickOutside(event) {
  const selectContainer = event.target.closest(".relative");
  if (!selectContainer) {
    isOpen.value = false;
  }
}
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
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
body {
  padding-top: 84px;
}
/* تأثير انتقال شفاف للنافذة */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
