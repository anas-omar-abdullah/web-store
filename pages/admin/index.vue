<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">المنتجات</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة منتج
      </button>
    </div>

    <!-- Products Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
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
          <tr v-for="product in displayedProducts" :key="product.id">
            <td class="w-6 table-cell">{{ product.image }}</td>
            <td class="table-cell">{{ product.name }}</td>
            <td class="table-cell">{{ product.category }}</td>
            <td class="table-cell">{{ product.price }} ر.س</td>
            <td class="table-cell">{{ product.quantity }}</td>
            <td class="table-cell">
              <span
                :class="
                  product.isVisible
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ product.isVisible ? "ظاهر" : "مخفي" }}
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
                  <Eye v-if="product.isVisible" class="h-5 w-5" />
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

    <!-- Pagination -->
    <div class="mt-4 flex justify-center">
      <nav
        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          السابق
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          التالي
        </button>
      </nav>
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
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >التصنيف</label
              >
              <select
                v-model="productForm.category"
                class="all-border-input input mt-1 block w-full"
                required
              >
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700" for="image">
                إرفاق صورة (حد أقصى 1 ميغا بايت)
              </label>
              <input
              id="image"
              type="file"
              @change="handleFileChange"
              accept="image/*"
              class="rounded-full all-border-input input mt-1 block w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >السعر</label
              >
              <input
                v-model="productForm.price"
                type="number"
                step="0.01"
                class="all-border-input input mt-1 block w-full"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >الكمية</label
              >
              <input
                v-model="productForm.quantity"
                type="number"
                class="all-border-input input mt-1 block w-full"
                required
              />
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
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
});

const products = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const showAddModal = ref(false);
const editingProduct = ref(null);
const productForm = ref({
  name: "",
  category: "",
  price: 0,
  quantity: 0,
  image:null,
});

const totalPages = computed(() =>
  Math.ceil(products.value.length / itemsPerPage)
);
const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.value.slice(start, end);
});

function editProduct(product) {
  editingProduct.value = product;
  productForm.value = { ...product };
  showAddModal.value = true;
}

function toggleVisibility(product) {
  product.isVisible = !product.isVisible;
  // TODO: Call API to update visibility
}

function deleteProduct(product) {
  if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
    // TODO: Call API to delete product
    products.value = products.value.filter((p) => p.id !== product.id);
  }
}

function saveProduct() {
  if (editingProduct.value) {
    // TODO: Call API to update product
    const index = products.value.findIndex(
      (p) => p.id === editingProduct.value.id
    );
    products.value[index] = { ...editingProduct.value, ...productForm.value };
  } else {
    // TODO: Call API to create product
    products.value.push({
      id: Date.now(),
      ...productForm.value,
      isVisible: true,
    });
  }
  // add photo
    function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return
  
    // الحجم الأقصى المسموح به: 1 ميغا بايت = 1048576 بايت
    if (file.size > 1048576) {
      alert('حجم الصورة المسموح به هو 1 ميغا بايت كحد أقصى')
      event.target.value = null  // إعادة تعيين حقل الملف
      return
    }
    form.image = file
  }

  showAddModal.value = false;
  editingProduct.value = null;
  productForm.value = {
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    image: null,
  };    
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
</style>
