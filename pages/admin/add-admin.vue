<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">{{ errorMess }}</h1>
  <h1 v-else-if="subAdmins.length === 0" class="text-primary text-center">
    لا يوجد عناصر لعرضها
  </h1>
  <div v-else>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">المشرفين</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة مشرف
      </button>
    </div>

    <!-- Sub-Admins Table -->
    <div class="table-sm bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">الاسم</th>
            <th scope="col" class="table-header">البريد الإلكتروني</th>
            <th scope="col" class="table-header">تاريخ الإضافة</th>
            <th scope="col" class="table-header">الإجراءات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="admin in subAdmins" :key="admin.id">
            <td class="table-cell">{{ admin.name }}</td>
            <td class="table-cell">{{ admin.email }}</td>
            <td class="table-cell">{{ formatDate(admin.createdAt) }}</td>
            <td class="table-cell">
              <div class="flex space-x-2 space-x-reverse">
                <button
                  @click="editAdmin(admin)"
                  class="text-primary hover:text-primary/80"
                >
                  <Pencil class="h-5 w-5" />
                </button>
                <button
                  @click="deleteAdmin(admin)"
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

    <!-- Add/Edit Sub-Admin Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingAdmin ? "تعديل مشرف" : "إضافة مشرف جديد" }}
        </h2>
        <form @submit.prevent="saveAdmin">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >الاسم</label
              >
              <input
                v-model="adminForm.name"
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
                >البريد الإلكتروني</label
              >
              <input
                v-model="adminForm.email"
                type="email"
                class="all-border-input input mt-1 block w-full"
                required
              />
            </div>
            <div v-if="!editingAdmin">
              <label class="block text-sm font-medium text-gray-700"
                >كلمة المرور</label
              >
              <input
                v-model="adminForm.password"
                type="password"
                class="all-border-input input mt-1 block w-full"
                :class="{ '!border-red-500': errors.password }"
                @input="clearError('password')"
              />
              <p v-if="errors.password" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.password }}
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
              {{ editingAdmin ? "حفظ التغييرات" : "إضافة المشرف" }}
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
import { ref, onBeforeMount } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";

useHead({
  title: "لوحة التحكم بالمشرفين",
});

definePageMeta({
  layout: "admin",
});

const subAdmins = ref([]);
const showAddModal = ref(false);
const editingAdmin = ref(null);
const adminForm = ref({
  name: "",
  email: "",
  password: "",
});
const errors = ref({
  name: "",
  password: "",
});
const errorMess = ref("");
const showLoading = ref(false);
const loadingForm = ref(false);
const errorApi = ref("");
const showErrorInput = ref(false);
const authStore = useAuthStore();

onBeforeMount(async () => {
  showLoading.value = true;
  try {
    subAdmins.value = await authStore.showProduct("api/users/admins");
    if (!authStore.response.ok) {
          errorMess.value = "فشل جلب المشرفين الرجاء المحاولة لاحقا";
    }
  } catch (error) {
    errorMess.value = "فشل جلب المشرفين الرجاء المحاولة لاحقا";
  } finally {
    showLoading.value = false;
  }
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("ar-SA");
}

function editAdmin(admin) {
  editingAdmin.value = admin;
  adminForm.value = {
    name: admin.name,
    email: admin.email,
    password: "",
  };
  showAddModal.value = true;
}

function deleteAdmin(admin) {
  if (confirm("هل أنت متأكد من حذف هذا المشرف؟")) {
    // TODO: Call API to delete admin
    try {
      showLoading.value = true;
      authStore.deletThing(admin, `api/users/admins/admin/${admin.id}`);
      subAdmins.value = subAdmins.value.filter((a) => a.id !== admin.id);
      if (!authStore.response.ok) {
        setTimeout(() => {
          errorMess.value = "فشل حذف المشرف الرجاء المحاولة لاحقا";
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
          errorMess.value = "فشل حذف المشرف الرجاء المحاولة لاحقا";
        }, 2000);
    } finally {
      showLoading.value = false;
      errorMess.value = "";
    }
  }
}
// دالة لتنظيف الأخطاء عند البدء بالكتابة
const clearError = (field) => {
  if (errors.value[field] && showErrorInput.value) {
    errors.value[field] = "";
    validateForm();
  }
};
const validateForm = () => {
  let isValid = true;
  if (adminForm.value.name.trim() === "") {
    errors.value.name = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (adminForm.value.password.length < 6) {
    errors.value.password = "هذا الحقل مطلوب ويجب أن يكون اكبر من 5 عناصر";
    isValid = false;
  }
  return isValid;
};

async function saveAdmin() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  try {
    if (editingAdmin.value) {
      loadingForm.value = true;
      // TODO: Call API to update admin
      const result = await authStore.updateProduct(
        adminForm.value,
        "api/users/user",
      );
      const index = subAdmins.value.findIndex(
        (a) => a.id === editingAdmin.value.id
      );
      subAdmins.value[index] = {
        ...editingAdmin.value,
        name: adminForm.value.name,
        email: adminForm.value.email,
      };
      if(!authStore.response.ok){
      setTimeout(() => {
          errorApi.value = "فشل تعديل المشرف الرجاء المحاولة لاحقا";
        }, 2000);
      }
    } else {
      // TODO: Call API to create admin
      const result = await authStore.addProduct(
        adminForm.value,
        "api/users/admins/admin",
      );
      subAdmins.value.push({
        name: adminForm.value.name,
        email: adminForm.value.email,
        createdAt: new Date().toISOString(),
      });
      if(!authStore.response.ok){
      setTimeout(() => {
          errorApi.value = "فشل أضافة المشرف الرجاء المحاولة لاحقا";
        }, 2000);
      }
    }
    showAddModal.value = false;
    resetForm();
  } catch (error) {
    errorApi.value = "falid:" + error;
  } finally {
    loadingForm.value = false;
    errorApi.value = "";
  }
}
function resetForm() {
  editingAdmin.value = null;
  adminForm.value = {
    name: "",
    email: "",
    password: "",
  };
  showErrorInput.value = false;
}
</script>
