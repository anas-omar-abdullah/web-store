<template>
  <footer class="bg-[#1e293b] text-white mt-auto">
    <div
    class="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center"
    >
    <!-- روابط صفحات الموقع -->
    <div class="flex flex-wrap justify-center gap-4 m-4">
      <NuxtLink to="/" class="text-white hover:text-[#3ca2fa] transition-colors duration-300"
      >الرئيسية</NuxtLink
      >
      <NuxtLink to="/prodect" class="text-white hover:text-[#3ca2fa] transition-colors duration-300"
      >المنتجات</NuxtLink
      >
      <NuxtLink to="/contact" class="text-white hover:text-[#3ca2fa] transition-colors duration-300"
        >اتصل بنا</NuxtLink
      >
    </div>
    <!-- أيقونات التواصل الاجتماعي -->
    <div class="flex flex-wrap justify-center gap-4 mb-4 md:mb-0 m-4">
      <NuxtLink
      to="https://www.facebook.com"
      target="_blank"
      rel="noopener noreferrer"
          class="text-white hover:text-[#3ca2fa] transition-colors duration-300"
        >
          <Facebook size="20" />
        </NuxtLink>
        <NuxtLink
          to="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white hover:text-[#3ca2fa] transition-colors duration-300"
        >
          <Instagram size="20" />
        </NuxtLink>
        <NuxtLink
          to="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white hover:text-[#3ca2fa] transition-colors duration-300"
        >
          <Twitter size="20" />
        </NuxtLink>
      </div>

      <p class="text-sm text-white m-4 text-center md:text-right">&copy; 2025 جميع الحقوق محفوظة</p>
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Twitter } from "lucide-vue-next";
</script>
