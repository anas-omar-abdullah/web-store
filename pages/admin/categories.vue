<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <h1 v-else-if="categories.length === 0" class="text-primary text-center">
    لا يوجد عناصر لعرضها
  </h1>
  <div v-else>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">التصنيفات</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة تصنيف
      </button>
    </div>
    <!-- Categories Table -->
    <div class="table-sm bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">صورة التصنيف</th>
            <th scope="col" class="table-header">اسم التصنيف</th>
            <th scope="col" class="table-header">عدد المنتجات</th>
            <th scope="col" class="table-header">الإجراءات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id">
            <td class="rounded-full w-6 table-cell">{{ category.image }}</td>
            <td class="table-cell">{{ category.name }}</td>
            <td class="table-cell">{{ category.productsCount }}</td>
            <td class="table-cell">
              <div class="flex space-x-2 space-x-reverse">
                <button
                  @click="editCategory(category)"
                  class="text-primary hover:text-primary/80"
                >
                  <Pencil class="h-5 w-5" />
                </button>
                <button
                  @click="deleteCategory(category)"
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

    <!-- Add/Edit Category Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingCategory ? "تعديل تصنيف" : "إضافة تصنيف جديد" }}
        </h2>
        <form @submit.prevent="saveCategory">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >اسم التصنيف</label
            >
            <input
              v-model="categoryForm.name"
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
            <label class="block text-sm font-medium text-gray-700" for="image">
              إرفاق صورة (حد أقصى 1 ميغا بايت)
            </label>
            <input
              id="image"
              type="file"
              @change="handleFileChange"
              accept="image/*"
              class="all-border-input input mt-1 block w-full"
              :class="{ 'border-red-500': errors.photo }"
              @input="clearError('photo')"
            />
            <p v-if="errors.photo" class="text-red-500 text-sm mt-1 pl-2">
              {{ errors.photo }}
            </p>
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
              {{ editingCategory ? "حفظ التغييرات" : "إضافة التصنيف" }}
            </button>
          </div>
          <loading v-if="loadingForm" />
          <div v-if="errorApi" class="mt-4 text-red-600 text-center">
            {{ errorApi.message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";

useHead({
  title: " صفحة التحكم بالتصنيفات",
});

definePageMeta({
  layout: "admin",
});

const categories = ref([]);
const showAddModal = ref(false);
const editingCategory = ref(null);
const categoryForm = ref({
  name: "",
  image: "",
});
const errors = ref({
  name: "",
  photo: "",
});
const errorMess = ref("");
const imgCategory = ref();
const showLoading = ref(false);
const loadingForm = ref(false);
const authStore = useAuthStore();
const errorApi = ref("");
const showErrorInput = ref(false);
function editCategory(category) {
  editingCategory.value = category;
  categoryForm.value = { ...category };
  showAddModal.value = true;
}

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
  if (categoryForm.value.name.trim() === "") {
    errors.value.password = "هذا الحقل مطلوب";
    isValid = false;
  }
  return isValid;
};

function deleteCategory(category) {
  if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
    try {
      showLoading.value = true;
      // TODO: Call API to delete category
      authStore.deletThing(category.value, `api/Categories/${category.id}`);
      categories.value = categories.value.filter((a) => a.id !== category.id);
      if (!authStore.response.ok) {
        setTimeout(() => {
          errorMess.value = "فشل حذف التصنيف الرجاء المحاولة لاحقا";
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        errorMess.value = "فشل حذف التصنيف الرجاء المحاولة لاحقا";
      }, 2000);
    } finally {
      showLoading.value = false;
      errorMess.value = "";
    }
  }
}

async function saveCategory() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  const data = new FormData();
  if (categoryForm.value.image) {
    data.append("file", imgCategory);
  }
  data.append("jsonData", categoryForm.value);
  try {
    loadingForm.value = true;
    if (editingCategory.value) {
      // TODO: Call API to update category
      const result = await authStore.updateProduct(data, "api/Categories");
      const index = categories.value.findIndex(
        (c) => c.id === editingCategory.value.id
      );
      categories.value[index] = {
        ...editingCategory.value,
        ...categoryForm.value,
      };
      if (!authStore.response.ok) {
        setTimeout(() => {
          errorApi.value = "فشل تعديل التصنيف الرجاء المحاولة لاحقا";
        }, 2000);
      }
    } else {
      // TODO: Call API to create category
      const result = await authStore.addProduct(data, "api/Categories");
      categories.value.push({
        ...categoryForm.value,
        productsCount: 0,
      });
      if (!authStore.response.ok) {
        setTimeout(() => {
          errorApi.value = "فشل أضافة التصنيف الرجاء المحاولة لاحقا";
        }, 2000);
      }
    }
    showAddModal.value = false;
    resetForm();
  } catch (error) {
    if (!authStore.response.ok) {
      setTimeout(() => {
        errorApi.value = "فشل أضافة/تعديل التصنيف الرجاء المحاولة لاحقا";
      }, 2000);
    }
  } finally {
    loadingForm.value = false;
    errorApi.value = "";
  }
}

function resetForm() {
  editingCategory.value = null;
  categoryForm.value = {
    name: "",
    image: "",
  };
  imgCategory.value = null;
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
  imgCategory.value = file;
}

// show cat
onBeforeMount(async () => {
  showLoading.value = true;
  try {
    categories.value = await authStore.showProduct("api/Categories");
    if (!authStore.response.ok){
      errorMess.value = "فشل جلب التصنيفات الرجاء المحاولة لاحقا ";
    }
  } catch (error) {
    errorMess.value = "فشل جلب التصنيفات الرجاء المحاولة لاحقا: ";
  } finally {
    showLoading.value = false;
  }

});
</script>
