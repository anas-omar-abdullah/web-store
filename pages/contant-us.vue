<template>
  <loading overlay v-if="showLoading" />
  <section class="mt-8 container mx-auto px-4">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6 text-[#3ca2fa] text-center">
        الدعم واتصل بنا
      </h1>
      <p class="text-gray-600 mb-8 text-center">
        نرحب بمشاركتكم واستفساراتكم، يرجى ملء النموذج أدناه وسنتواصل معكم
        قريباً.
      </p>
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- حقل الاسم -->
          <div>
            <label class="block text-gray-700 mb-2" for="name">الاسم</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="أدخل اسمك"
              class="w-full border rounded-md p-2 all-border-input"
              :class="{ '!border-red-500': errors.name }"
              @input="clearError('name')"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1 pl-2">
              {{ errors.name }}
            </p>
          </div>
          <!-- حقل البريد الإلكتروني -->
          <div>
            <label class="block text-gray-700 mb-2" for="email"
              >البريد الإلكتروني (اختياري)</label
            >
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              class="w-full border rounded-md p-2 all-border-input"
            />
          </div>
        </div>
        <!-- حقل الموضوع -->
        <div class="mt-6">
          <label class="block text-gray-700 mb-2" for="subject">الموضوع</label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            placeholder="موضوع الرسالة"
            class="w-full border rounded-md p-2 all-border-input"
            :class="{ '!border-red-500': errors.subject }"
            @input="clearError('subject')"
          />
          <p v-if="errors.subject" class="text-red-500 text-sm mt-1 pl-2">
            {{ errors.subject }}
          </p>
        </div>
        <!-- حقل الرسالة -->
        <div class="mt-6">
          <label class="block text-gray-700 mb-2" for="message">الرسالة</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="5"
            placeholder="اكتب رسالتك هنا..."
            class="resize-none w-full border rounded-md p-2 all-border-input"
            :class="{ '!border-red-500': errors.message }"
            @input="clearError('message')"
          >
          
        </textarea>
        <p v-if="errors.message" class="text-red-500 text-sm mt-1 pl-2">
            {{ errors.message }}
          </p>
        </div>
        <!-- زر الإرسال -->
        <div class="mt-8 text-center">
          <button
            type="submit"
            class="bg-[#3ca2fa] hover:bg-[#349ed1] text-white font-bold py-2 px-6 rounded-md transition duration-300"
          >
            إرسال الرسالة
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "تواصل معنا",
});

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});
const errors = ref({ name: "", subject: "", message: "" });
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
  if (form.value.name.trim() === "") {
    errors.value.name = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (form.value.subject.trim() === "") {
    errors.value.subject = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (form.value.message.length < 25) {
    errors.value.message =
      "هذا الحقل مطلوب ويجب أن يكون عدد الأحرف أكبر من 24 حرف";
    isValid = false;
  }
  return isValid;
};
async function submitForm() {
  showErrorInput.value = true;
  if(!validateForm()) return;
  showLoading.value = true;
  try {
    const response = await $fetch("....");
  } catch (error) {
    console.log(error);
  } finally {
    showLoading.value = false;
  }
  // هنا يمكنك إضافة الكود اللازم لإرسال البيانات إلى الخادم (API)
  console.log("تم إرسال البيانات:", form);
  alert("تم إرسال رسالتك بنجاح!");
  // إعادة تعيين الحقول بعد الإرسال
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
  showErrorInput.value = false;
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
