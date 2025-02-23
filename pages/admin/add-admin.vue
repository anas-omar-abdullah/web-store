<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">المشرفين</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة مشرف
      </button>
    </div>

    <!-- Sub-Admins Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
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
                required
              />
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
              {{ editingAdmin ? "حفظ التغييرات" : "إضافة المشرف" }}
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
    layout:"admin"
})

const subAdmins = ref([]);
const showAddModal = ref(false);
const editingAdmin = ref(null);
const adminForm = ref({
  name: "",
  email: "",
  password: "",
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
    subAdmins.value = subAdmins.value.filter((a) => a.id !== admin.id);
  }
}

function saveAdmin() {
  if (editingAdmin.value) {
    // TODO: Call API to update admin
    const index = subAdmins.value.findIndex(
      (a) => a.id === editingAdmin.value.id
    );
    subAdmins.value[index] = {
      ...editingAdmin.value,
      name: adminForm.value.name,
      email: adminForm.value.email,
    };
  } else {
    // TODO: Call API to create admin
    subAdmins.value.push({
      id: Date.now(),
      name: adminForm.value.name,
      email: adminForm.value.email,
      createdAt: new Date().toISOString(),
    });
  }
  showAddModal.value = false;
  editingAdmin.value = null;
  adminForm.value = {
    name: "",
    email: "",
    password: "",
  };
}
</script>
