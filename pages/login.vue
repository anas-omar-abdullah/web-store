<template>
  <section
    class="min-h-screen flex items-center justify-center container mx-auto px-4 c-all"
  >
    <div class="min-h-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-center mb-4">تسجيل الدخول</h1>
      <form @submit.prevent="AdminLogin">
        <div class="">
          <div class="space-y-4">
            <div>
              <div>
                <label class="my-4 block text-sm font-medium text-gray-700"
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
                <label class="my-4 block text-sm font-medium text-gray-700"
                  >كلمة المرور</label
                >
                <input
                  v-model="adminForm.password"
                  type="password"
                  class="all-border-input input mt-1 block w-full"
                  :class="{ 'error-border': errors.password }"
                  @input="clearError('password')"
                />
                <p
                  v-if="errors.password"
                  class="text-red-500 text-sm mt-1 pl-2"
                >
                  {{ errors.password }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 forget"><NuxtLink to="forgot-password"> هل نسيت كلمة السر </NuxtLink></div>
        <div class="mt-6 flex justify-center space-x-3 space-x-reverse">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="showLoading"
            :class="{ 'opacity-50 cursor-not-allowed': showLoading }"
          >
            تسجيل الدخول
          </button>
        </div>
        <loading v-if="showLoading" />
        <div
          v-if="mess"
          :class="{
            'mt-4 text-red-600 text-center': !mess.success,
          }"
        >
          {{ mess.message }}
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

useHead({
  title: "تسجيل الدخول",
});

definePageMeta({
  layout: false,
});

const adminForm = ref({
  email: "",
  password: "",
  id: "",
  name: "",
  role: "",
  totalAmount: 0,
  avatar: "",
});
const errors = ref({
  password: "",
});
const mess = ref(null);
const showLoading = ref(false);
const showErrorInput = ref(false);
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
  if (adminForm.value.password.trim() === "") {
    errors.value.password = "هذا الحقل مطلوب";
    isValid = false;
  }
  return isValid;
};

async function AdminLogin() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  showLoading.value = true;
  const authStore = useAuthStore();
  try {
    const result = await authStore.login({
      email: adminForm.value.email,
      password: adminForm.value.password,
    });
    mess.value = result;
    navigateTo("/admin");
    showErrorInput.value = false;
  } catch (error) {
    mess.value = "error cant login try later";
  } finally {
    showLoading.value = false;
  }
}
</script>

<style scoped>
.c-all {
  display: flex;
  justify-content: center;
  align-items: center;
}
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
.error-border:hover,
.error-border:focus,
.error-border:active,
.error-border {
  border: 1px solid red;
  outline: none;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.forget {
  color: var(--primary-color);
  cursor: pointer;
}
</style>
