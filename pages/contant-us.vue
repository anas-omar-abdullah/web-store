<template>
    <section class="mt-8 container mx-auto px-4">
      <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold mb-6 text-[#3ca2fa] text-center">
          الدعم واتصل بنا
        </h1>
        <p class="text-gray-600 mb-8 text-center">
          نرحب بمشاركتكم واستفساراتكم، يرجى ملء النموذج أدناه وسنتواصل معكم قريباً.
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
              />
            </div>
            <!-- حقل البريد الإلكتروني -->
            <div>
              <label class="block text-gray-700 mb-2" for="email">البريد الإلكتروني</label>
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
            />
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
            ></textarea>
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
  import { reactive } from 'vue'
  
  const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  function submitForm() {
    // هنا يمكنك إضافة الكود اللازم لإرسال البيانات إلى الخادم (API)
    console.log('تم إرسال البيانات:', form)
    alert('تم إرسال رسالتك بنجاح!')
    // إعادة تعيين الحقول بعد الإرسال
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }
  </script>
