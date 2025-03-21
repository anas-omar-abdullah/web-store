<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 class="text-2xl font-semibold text-center mb-4">تغيير كلمة السر</h1>
        <form @submit.prevent="handleChangePassword">
          <!-- حقل كلمة السر الجديدة -->
          <div class="mb-4">
            <label for="newPassword" class="block text-gray-700 mb-1">كلمة السر الجديدة</label>
            <div class="relative">
              <input
                v-model="newPassword"
                type="password"
                id="newPassword"
                placeholder="أدخل كلمة السر الجديدة"
                class="w-full rounded-md p-2 pl-10 all-border-input"
                :class="{ ' !border-red-500': newPasswordError }"
                @input="clearError('newPassword')"
              />
              <!-- أيقونة القفل -->
              <LockIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1" />
            </div>
            <p v-if="newPasswordError" class="text-red-500 text-sm mt-1">{{ newPasswordError }}</p>
          </div>
  
          <!-- حقل تأكيد كلمة السر -->
          <div class="mb-4">
            <label for="confirmPassword" class="block text-gray-700 mb-1">تأكيد كلمة السر الجديدة</label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                @input="clearError('confirmPassword')"
                placeholder="أعد إدخال كلمة السر الجديدة"
                class="w-full rounded-md p-2 pl-10 all-border-input"
                :class="{ ' !border-red-500': confirmPasswordError }"
              />
              <!-- أيقونة القفل -->
              <LockIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1" />
            </div>
            <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{ confirmPasswordError }}</p>
          </div>
  
          <button type="submit" class="w-full  text-white py-2 rounded btn-primary">
            تغيير كلمة السر
          </button>
          <p v-if="successMessage" class="text-green-500 mt-4 text-center">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { LockIcon } from 'lucide-vue-next'
  // استدعِ axios إذا كنت تحتاج للتعامل مع API
  // import axios from 'axios'
  
  const newPassword = ref('')
  const confirmPassword = ref('')
  const newPasswordError = ref('')
  const confirmPasswordError = ref('')
  const successMessage = ref('')
  const showErrorInput = ref(false);
  useHead({
  title: "تغيير كلمة المرور",
});

definePageMeta({
  layout: false,
});

// دالة لتنظيف الأخطاء عند البدء بالكتابة
const clearError = () => {
  if (newPasswordError.value && showErrorInput.value) {
    newPasswordError.value = "";
    valdateForm();
  }
  if (confirmPasswordError.value && showErrorInput.value) {
    confirmPasswordError.value = "";
    valdateForm();
  }

};

  const handleChangePassword = async () => {
    showErrorInput.value = false;
    // newPasswordError.value = ''
    // confirmPasswordError.value = ''
    // successMessage.value = ''
    if(!valdateForm()) return;

    // التحقق من تعبئة الحقول
    // if (!newPassword.value) {
    //   newPasswordError.value = 'يرجى إدخال كلمة السر الجديدة'
    //   return
    // }
    // if (!confirmPassword.value) {
    //   confirmPasswordError.value = 'يرجى تأكيد كلمة السر'
    //   return
    // }
    // if (newPassword.value !== confirmPassword.value) {
    //   confirmPasswordError.value = 'كلمتا السر غير متطابقتين'
    //   return
    // }
  
    try {
      // مثال على استدعاء API لتغيير كلمة السر
      // await axios.post('/api/change-password', { password: newPassword.value })
      successMessage.value = 'تم تغيير كلمة السر بنجاح';
      resetForm();
    } catch (error) {
      newPasswordError.value = 'حدث خطأ أثناء تغيير كلمة السر، يرجى المحاولة مرة أخرى'
    }finally{

    }
  }
  function valdateForm() {
    let isValid = true;
    if (!newPassword.value) {
      newPasswordError.value = 'يرجى إدخال كلمة السر الجديدة'
      isValid = false;
    }
    if (!confirmPassword.value) {
      confirmPasswordError.value = 'يرجى تأكيد كلمة السر'
      isValid = false;
    }
    if (newPassword.value !== confirmPassword.value) {
      confirmPasswordError.value = 'كلمتا السر غير متطابقتين'
      isValid = false;
    }
  return isValid;
  }
  function resetForm() {
    newPasswordError.value = "";
    confirmPasswordError.value = "";
  showErrorInput.value = false;
  successMessage.value = '';
}

  </script>
  <style scoped>
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