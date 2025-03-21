<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-semibold text-center mb-4">نسيت كلمة السر</h1>
      <p class="text-gray-600 text-center mb-6">
        أدخل بريدك الإلكتروني لاستعادة كلمة السر.
      </p>
      <form @submit.prevent="handleForgotPassword">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-1"
            >البريد الإلكتروني</label
          >
          <div class="relative">
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="example@domain.com"
              @input="clearError('email')"
              class="w-full rounded-md p-2 pl-10 all-border-input"
              :class="{
                '!border-red-500': emailError,
              }"
            />
            <!-- أيقونة البريد -->
            <MailIcon class=" w-5 h-5 text-gray-400 absolute left-3 top-1" />
          </div>
          <p v-if="emailError" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </p>
        </div>
        <button
          type="submit"
          class="w-full text-white py-2 rounded btn-primary"
        >
          إرسال
        </button>
        <p v-if="successMessage" class="text-green-500 mt-4 text-center">
          {{ successMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { MailIcon } from "lucide-vue-next";
//  يمكنك استدعاء API

const email = ref("");
const emailError = ref("");
const successMessage = ref("");

useHead({
  title: "صفحة نسيان كلمة السر",
});

definePageMeta({
  layout: false,
});

// دالة لتنظيف الأخطاء عند البدء بالكتابة
const clearError = () => {
  if (emailError.value) {
    emailError.value = "";
  }
};

const handleForgotPassword = async () => {
  emailError.value = "";
  successMessage.value = "";

  // التحقق من وجود البريد الإلكتروني
  if (!email.value) {
    emailError.value = "يرجى إدخال البريد الإلكتروني";
    return;
  }
  // التحقق من صيغة البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "صيغة البريد الإلكتروني غير صحيحة";
    return;
  }

  try {
    // مثال على استدعاء API لإرسال تعليمات استعادة كلمة السر
    successMessage.value =
      "تم إرسال تعليمات استعادة كلمة السر إلى بريدك الإلكتروني";
      navigateTo("/admin");
  } catch (error) {
    emailError.value = "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى";
  }
};
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
