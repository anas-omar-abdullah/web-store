<template>
  <loading overlay v-if="showLoading" />
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <div v-else>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">المشرفين</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        إضافة مشرف
      </button>
    </div>
    <h1 v-if="subAdmins.length === 0" class="text-primary text-center">
      لا يوجد عناصر لعرضها
    </h1>

    <!-- Sub-Admins Table -->
    <div v-else class="responsive-table-container">
      <div class="responsive-table-inner table-sm bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">الاسم</th>
            <th scope="col" class="table-header">البريد الإلكتروني</th>
            <th scope="col" class="table-header">رقم الجوال</th>
            <th scope="col" class="table-header">كلمة السر</th>
            <th scope="col" class="table-header">تاريخ الإضافة</th>
            <th scope="col" class="table-header">الإجراءات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="admin in subAdmins" :key="admin.id">
            <td class="table-cell">{{ admin.name }}</td>
            <td class="table-cell">{{ admin.email }}</td>
            <td class="table-cell">{{ admin.phoneNumber }}</td>
            <td class="table-cell">{{ admin.password }}</td>
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
    </div>

    <!-- Add/Edit Sub-Admin Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-[100] bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
            <div>
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
            <!-- here input phonenumber -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >رقم الهاتف</label
              >
              <div class="flex-number">
                <!-- زر اختيار رمز الدولة -->
                <div ref="dropdownRef" class="relative flex-grow-0">
                  <button
                    type="button"
                    @click="toggleCountryCodeDropdown"
                    class="w-full inline-flex items-center px-2 py-2 all-border-input rounded-l-md"
                  >
                    {{ selectedCountryCode }}
                    <ChevronDown class="ml-2 h-4 w-4" />
                  </button>
                  <!-- قائمة رموز الدول -->
                  <div
                    v-if="showCountryCodeDropdown"
                    class="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200"
                  >
                    <div
                      v-for="country in countries"
                      :key="country.code"
                      @click="selectCountryCode(country)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ country.name }} ({{ country.code }})
                    </div>
                  </div>
                </div>
                <!-- حقل إدخال الرقم -->
                <input
                  v-model="adminForm.phoneNumber"
                  type="number"
                  class="w-full text-po m-2 border rounded-r-md all-border-input"
                  placeholder="أدخل رقم الهاتف"
                  :class="{ '!border-red-500': errors.phone }"
                  @input="clearError('phone')"
                />
              </div>
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.phone }}
              </p>
            </div>
            <!-- here end -->
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
import { Pencil, Trash2, ChevronDown } from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";
import { onClickOutside } from "@vueuse/core";
import Swal from "sweetalert2";

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
  phoneNumber: "",
});
const errors = ref({
  name: "",
  password: "",
  phone: "",
});
const errorMess = ref("");
const showLoading = ref(false);
const loadingForm = ref(false);
const errorApi = ref("");
const showErrorInput = ref(false);
const authStore = useAuthStore();

const countries = ref([
  { code: "+964", name: "العراق" },
  { code: "+963", name: "سوريا" },
  // يمكنك إضافة المزيد من الدول
]);
const selectedCountryCode = ref("+964"); // رمز الدولة الافتراضي
const showCountryCodeDropdown = ref(false);
const dropdownRef = ref(null);

const toggleCountryCodeDropdown = () => {
  showCountryCodeDropdown.value = !showCountryCodeDropdown.value;
};

const selectCountryCode = (country) => {
  selectedCountryCode.value = country.code;
  showCountryCodeDropdown.value = false;
};

// إغلاق القائمة عند النقر خارجها
onClickOutside(dropdownRef, () => {
  showCountryCodeDropdown.value = false;
});

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
    errorMess.value = "";
  }
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("ar-SA");
}

function editAdmin(admin) {
  editingAdmin.value = admin;
  adminForm.value = {
    ...admin,
  };
  showAddModal.value = true;
}

const showToast = (message, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon: icon,
    title: message
  });
};

async function deleteAdmin(admin) {
  try {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استرجاع هذا المشرف!",
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
        admin,
        `api/users/admins/admin/${admin.id}`
      );
      subAdmins.value = subAdmins.value.filter((a) => a.id !== admin.id);
      showToast('تم حذف المشرف بنجاح');
    }
  } catch (error) {
    errorMess.value = "فشل حذف المشرف الرجاء المحاولة لاحقا";
    showToast('فشل حذف المشرف', 'error');
    setTimeout(() => {
      errorMess.value = "";
    }, 2000);
  } finally {
    showLoading.value = false;
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

  if (!adminForm.value.password || adminForm.value.password.trim() === "") {
    errors.value.password = "هذا الحقل مطلوب";
    isValid = false;
  } else if (adminForm.value.password.length < 6) {
    errors.value.password = "يجب أن تكون كلمة المرور اكبر من 5 عناصر";
    isValid = false;
  }

  if (!adminForm.value.phoneNumber ||  String(adminForm.value.phoneNumber).trim() === "") {
    errors.value.phone = "هذا الحقل مطلوب";
    isValid = false;
  }

  return isValid;
};

async function saveAdmin() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  try {
    loadingForm.value = true;
    if (editingAdmin.value) {
      const result = await authStore.updateProduct(
        adminForm.value,
        "api/users/user"
      );
      const index = subAdmins.value.findIndex(
        (a) => a.id === editingAdmin.value.id
      );
      subAdmins.value[index] = {
        ...editingAdmin.value,
        name: adminForm.value.name,
        email: adminForm.value.email,
        phoneNumber: adminForm.value.phoneNumber,
      };
      adminForm.value = result;
      showToast('تم تعديل المشرف بنجاح');
    } else {
      const result = await authStore.addProduct(
        adminForm.value,
        "api/users/admins/admin"
      );
      subAdmins.value.push({
        name: adminForm.value.name,
        email: adminForm.value.email,
        createdAt: new Date().toISOString(),
      });
      showToast('تم إضافة المشرف بنجاح');
    }
  } catch (error) {
    errorApi.value = "فشل أضافة/ تعديل المشرف الرجاء المحاولة لاحقا";
    showToast('فشل العملية', 'error');
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
  editingAdmin.value = null;
  adminForm.value = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  };
  showErrorInput.value = false;
}
const bothJob = () => {
  showAddModal.value = false;
  resetForm();
  resterror();
};
function resterror() {
  errors.value.name = "";
  errors.value.password = "";
  errors.value.phone = "";
}

</script>
<style scoped>
.flex-number {
  display: flex;
  justify-content: center;
  align-items: center;
  direction: ltr;
}
.text-po {
  direction: rtl;
}
@media (max-width: 425px) {
  .w-small {
    width: 100%;
  }
}
</style>
