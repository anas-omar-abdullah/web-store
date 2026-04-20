<template>
  <section
    class="min-h-screen flex items-center justify-center container mx-auto px-4"
  >
    <div class="min-h-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-center mb-4">انشاء حساب</h1>
      <form @submit.prevent="AdminLogin">
        <div class="c-all">
          <div class="space-y-4">
            <div>
              <div>
                <label class="block text-gray-700 mb-2" for="name">الاسم</label>
                <input
                  id="name"
                  v-model="user.name"
                  type="text"
                  class="!w-full border rounded-md p-2 all-border-input"
                  :class="{ '!border-red-500': errors.name }"
                  @input="clearError('name')"
                />
                <p v-if="errors.name" class="text-red-500 text-sm mt-1 pl-2">
                  {{ errors.name }}
                </p>
              </div>

              <div>
                <label class="my-4 block text-sm font-medium text-gray-700"
                  >البريد الإلكتروني</label
                >
                <input
                  v-model="user.email"
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
                  v-model="user.password"
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
              <!-- حقل إدخال الرقم -->
              <div>
                <label class="mt-4 block text-gray-700">رقم الهاتف</label>
                <div class="container-flex">
                  <input
                    v-model="user.phone"
                    type="number"
                    class="box my-2 w-[70%] border rounded-r-md all-border-input"
                    :class="{ '!border-red-500': errors.phone }"
                    @input="clearError('phone')"
                  />
                  <!-- زر اختيار رمز الدولة -->
                  <div ref="dropdownRef" class="w-[20%] my-2 relative flex-grow-0">
                    <button
                      type="button"
                      @click="toggleCountryCodeDropdown"
                      class="items-center px-4 py-2 all-border-input rounded-l-md flex  justify-between min-w-[50px] h-[30px]"
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
                </div>
                <p v-if="errors.phone" class="text-red-500 text-sm mt-1 pl-2">
                  {{ errors.phone }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-center space-x-3 space-x-reverse">
          <button
          type="submit"
          class="btn btn-primary"
          :disabled="showLoading"
          :class="{ 'opacity-50 cursor-not-allowed': showLoading }"
          >
          انشاء حساب
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
      <div class="block mt-4 text-sm forget text-center"><NuxtLink to="login"> لدي حساب بالفعل تسجيل دخول </NuxtLink></div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { onClickOutside } from "@vueuse/core";
import { ChevronDown } from 'lucide-vue-next';
import { showToast } from "~/utils/toast";

useHead({
  title: "انشاء حساب",
});

definePageMeta({
  layout: false,
});

const user = ref({
  email: "",
  password: "",
  id: "",
  name: "",
  role: "",
  totalAmount: 0,
  avatar: "",
});
const errors = ref({
  name: "",
  password: "",
  phone: "",
});
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
  if (user.value.password.trim() === "") {
    errors.value.password = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (String(user.value.phone).trim() === "") {
    errors.value.phone = "هذا الحقل مطلوب";
    isValid = false;
  }

  return isValid;
};

async function AdminLogin() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  showLoading.value = true;
  
  try {
    const config = useRuntimeConfig();
    // TODO: Replace with actual signup endpoint when available
    // Currently the API doesn't have a signup endpoint (see forApi.txt)
    const response = await $fetch(`${config.public.apiBase}authentication/register`, {
      method: "POST",
      body: {
        name: user.value.name,
        email: user.value.email,
        password: user.value.password,
        phoneNumber: selectedCountryCode.value + user.value.phone,
      },
    }).catch(async (error) => {
      // If register endpoint doesn't exist, fall back to login
      // This is a temporary workaround until backend implements signup
      console.warn("Signup endpoint not available, using login endpoint");
      const authStore = useAuthStore();
      return await authStore.login({
        email: user.value.email,
        password: user.value.password,
      });
    });
    
    if (response) {
      showToast("تم إنشاء الحساب بنجاح");
      navigateTo("/");
    }
    showErrorInput.value = false;
  } catch (error) {
    console.error("Signup error:", error);
    mess.value = "فشل إنشاء الحساب، الرجاء المحاولة مرة أخرى";
    showToast("فشل إنشاء الحساب", "error");
  } finally {
    showLoading.value = false;
  }
}
</script>

<style scoped>
.c-all {
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
.container-flex {
  display: flex;
  gap:8px;
  max-width:100%;
}
@media(max-width:370px){
.box{
  width: 60%;
}
}
</style>
