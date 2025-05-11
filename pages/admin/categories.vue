<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <div v-else>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">التصنيفات</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة تصنيف
      </button>
      <h2 v-if="errorMessone" class="w-full h-4 text-red-500 text-center">
        {{ errorMessone }}
      </h2>
    </div>
    <h1 v-if="categories.length === 0" class="text-primary text-center">
      لا يوجد عناصر لعرضها
    </h1>
    <!-- Categories Table -->
    <div v-else class="table-sm bg-white shadow rounded-lg overflow-hidden">
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
            <td class="rounded-full w-6 table-cell">
              <img :src="category.imageUrl" alt="no-img" />
            </td>
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
      class="fixed z-[100] inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
            <label class="mt-2 block text-sm font-medium text-gray-700" for="image">
              إرفاق صورة
            </label>
            <div class="relative">
              <div class="flex items-center justify-center w-full">
                <label
                  for="image"
                  class="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div
                    class="flex flex-col items-center justify-center pt-5 pb-6"
                  >
                    <Upload class="w-8 h-8 mb-2 text-gray-500" />
                    <p class="mb-1 text-sm text-gray-500">
                      <span class="font-semibold">اضغط للرفع</span>
                    </p>
                    <p class="text-xs text-gray-500">
                      PNG, JPG أو JPEG (الحد الأقصى: 1MB)
                    </p>
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
          <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              @click="bothJob"
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loadingForm"
              :class="{ 'opacity-50 cursor-not-allowed': loadingForm }"
            >
              {{ editingCategory ? "حفظ التغييرات" : "إضافة التصنيف" }}
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
import { ref, onBeforeMount } from "vue";
import { Pencil, Trash2,Upload } from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";
import Swal from "sweetalert2";

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
  imageUrl: "",
  addedBy: JSON.parse(localStorage.getItem("_user")).id,
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
const errorMessone = ref("");
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
    errors.value.name = "هذا الحقل مطلوب";
    isValid = false;
  }
  if(errors.value.photo){
    isValid = false;
  }

  return isValid;
};

async function deleteCategory(category) {
  try {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استرجاع هذا التصنيف!",
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
        category,
        `api/Categories/${category.id}`
      );
      categories.value = categories.value.filter((a) => a.id !== category.id);

      await Swal.fire({
        title: "تم الحذف!",
        text: "تم حذف التصنيف بنجاح.",
        icon: "success",
        size: "small",
        showConfirmButton: false,
        timer: 600,
        timerProgressBar: true,
        width: "300px",
      });
    }
  } catch (error) {
    errorMessone.value = "فشل حذف التصنيف الرجاء المحاولة لاحقا";
    setTimeout(() => {
      errorMessone.value = "";
    }, 2000);
  } finally {
    showLoading.value = false;
  }
}
async function saveCategory() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  const data = new FormData();
  if (imgCategory.value) {
    data.append("file", imgCategory.value);
  }
  data.append("jsonData", JSON.stringify(categoryForm.value));
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
      categoryForm.value = result;
      imgCategory.value = result.imageUrl;
    } else {
      // TODO: Call API to create category
      const resultCat = await authStore.addProduct(data, "api/Categories");
      categories.value.push({
        ...resultCat,
        // productsCount: 0,
      });
    }
  } catch (error) {
    errorApi.value = "فشل أضافة/تعديل التصنيف الرجاء المحاولة لاحقا";
    setTimeout(() => {
      errorApi.value = "";
    }, 2000);
  } finally {
    showAddModal.value = false;
    resetForm();
    loadingForm.value = false;
  }
}

function resetForm() {
  editingCategory.value = null;
  categoryForm.value = {
    ...categoryForm.value,
    name: "",
    imageUrl: "",
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
    errors.value.photo = "حجم الصورة المسموح به هو 1 ميغا بايت كحد أقصى";
    event.target.value = null; // إعادة تعيين حقل الملف
    return;
  }
  imgCategory.value = file;
  errors.value.photo = "";

}
const bothJob = () => {
  showAddModal.value = false;
  resterror();
  resetJustForm();
};
function resetJustForm() {
  categoryForm.value = {
    name: "",
    imageUrl: "",
  };
}
function resterror() {
  errors.value = {
    name: "",
    photo: "",
  };
}

// show cat
onBeforeMount(async () => {
  showLoading.value = true;
  try {
    categories.value = await authStore.showProduct("api/Categories");
    if (!authStore.response.ok) {
      errorMess.value = "فشل جلب التصنيفات الرجاء المحاولة لاحقا ";
    }
  } catch (error) {
    errorMess.value = "فشل جلب التصنيفات الرجاء المحاولة لاحقا: ";
  } finally {
    showLoading.value = false;
    errorMess.value = "";
  }
});
</script>
