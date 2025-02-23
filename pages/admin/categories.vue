<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">التصنيفات</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة تصنيف
      </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
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
              required
            />
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
            />
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
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
});

const categories = ref([]);
const showAddModal = ref(false);
const editingCategory = ref(null);
const categoryForm = ref({
  name: "",
  image: null,
});

function editCategory(category) {
  editingCategory.value = category;
  categoryForm.value = { ...category };
  showAddModal.value = true;
}

function deleteCategory(category) {
  if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
    // TODO: Call API to delete category
    categories.value = categories.value.filter((c) => c.id !== category.id);
  }
}

function saveCategory() {
  if (editingCategory.value) {
    // TODO: Call API to update category
    const index = categories.value.findIndex(
      (c) => c.id === editingCategory.value.id
    );
    categories.value[index] = {
      ...editingCategory.value,
      ...categoryForm.value,
    };
    // add photo
    function handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // الحجم الأقصى المسموح به: 1 ميغا بايت = 1048576 بايت
      if (file.size > 1048576) {
        alert("حجم الصورة المسموح به هو 1 ميغا بايت كحد أقصى");
        event.target.value = null; // إعادة تعيين حقل الملف
        return;
      }
      form.image = file;
    }
  } else {
    // TODO: Call API to create category
    categories.value.push({
      id: Date.now(),
      ...categoryForm.value,
      productsCount: 0,
    });
  }
  showAddModal.value = false;
  editingCategory.value = null;
  categoryForm.value = { name: "", image: null };
}
</script>
