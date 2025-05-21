<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="mt-[60px] relative">
      <!-- خلفية متحركة -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50 opacity-50"></div>
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- العنوان الرئيسي -->
        <div class="text-center mb-2 fade-in">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            تواصل معنا
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            نحن هنا لمساعدتك! تواصل معنا من خلال أي من القنوات التالية
          </p>
        </div>

        <!-- معلومات الاتصال -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <!-- رقم الهاتف -->
          <div class="contact-card group slide-in-left">
            <div class="icon-wrapper">
              <Phone class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">اتصل بنا</h3>
            <p class="text-gray-700 mb-4">+1 (555) 123-4567</p>
            <button @click="copyToClipboard('+1 (555) 123-4567')" class="contact-link group">
              <span class="group-hover:hidden">رقم الهاتف</span>
              <span class="hidden group-hover:inline">نسخ</span>
              <ArrowLeft class="w-4 h-4 mr-2" />
            </button>
            <div v-if="copiedText === '+1 (555) 123-4567'" class="mt-2 text-sm text-green-600">
              تم نسخ رقم الهاتف!
            </div>
          </div>

          <!-- البريد الإلكتروني -->
          <div class="contact-card group slide-in-right">
            <div class="icon-wrapper">
              <Mail class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">راسلنا</h3>
            <p class="text-gray-700 mb-4">support@company.com</p>
            <button @click="copyToClipboard('support@company.com')" class="contact-link group">
              <span class="group-hover:hidden">البريد الإلكتروني</span>
              <span class="hidden group-hover:inline">نسخ</span>
              <ArrowLeft class="w-4 h-4 mr-2" />
            </button>
            <div v-if="copiedText === 'support@company.com'" class="mt-2 text-sm text-green-600">
              تم نسخ البريد الإلكتروني!
            </div>
          </div>
        </div>

        <!-- وسائل التواصل الاجتماعي -->
        <div class="text-center fade-in-delayed">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">تابعنا على وسائل التواصل الاجتماعي</h2>
          <div class="flex flex-wrap justify-center gap-6">
            <a href="https://wa.me/your-number" target="_blank" class="social-link whatsapp">
              <MessageCircle class="w-6 h-6" />
              <span>واتساب</span>
            </a>
            <a href="https://t.me/your-username" target="_blank" class="social-link telegram">
              <Send class="w-6 h-6" />
              <span>تيليجرام</span>
            </a>
            <a href="https://facebook.com/your-page" target="_blank" class="social-link facebook">
              <Facebook class="w-6 h-6" />
              <span>فيسبوك</span>
            </a>
            <a href="https://instagram.com/your-account" target="_blank" class="social-link instagram">
              <Instagram class="w-6 h-6" />
              <span>انستجرام</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Phone, Mail, ArrowLeft, Facebook, Instagram, Send, MessageCircle } from 'lucide-vue-next';
import { ref } from 'vue';

const copiedText = ref('');

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedText.value = text;
    setTimeout(() => {
      copiedText.value = '';
    }, 2000);
  } catch (err) {
    console.error('فشل نسخ النص:', err);
  }
};

definePageMeta({
  layout: "default",
});

useHead({
  title: "تواصل معنا",
  meta: [
    {
      name: "description",
      content: "تواصل مع فريقنا للحصول على الدعم والاستفسارات.",
    },
  ],
});
</script>

<style scoped>
.contact-card {
  @apply bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  @apply w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-6 text-primary;
  transition: all 0.3s ease;
}

.contact-card:hover .icon-wrapper {
  @apply bg-primary text-white transform scale-110;
}

.contact-link {
  @apply inline-flex items-center text-primary font-medium hover:text-primary-600 transition-colors duration-300 cursor-pointer;
}

.social-link {
  @apply flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105;
}

.social-link.whatsapp {
  @apply bg-green-500 hover:bg-green-600;
}

.social-link.telegram {
  @apply bg-primary hover:bg-primary-600;
}

.social-link.facebook {
  @apply bg-primary hover:bg-primary-600;
}

.social-link.instagram {
  @apply bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.fade-in-delayed {
  animation: fadeIn 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

.slide-in-left {
  animation: slideInLeft 0.8s ease-out forwards;
}

.slide-in-right {
  animation: slideInRight 0.8s ease-out forwards;
}

.contact-card {
  animation: float 6s ease-in-out infinite;
}

.contact-card:nth-child(2) {
  animation-delay: 0.2s;
}
</style>