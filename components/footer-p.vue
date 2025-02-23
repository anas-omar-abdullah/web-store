<template>
  <footer class="bg-[#1e293b] text-white mt-8">
    <div
    class="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center"
    >
    <!-- روابط صفحات الموقع -->
    <div class="flex space-x-4 m-4">
      <NuxtLink to="/" class="mx-4 text-sm hover:text-[#3ca2fa]"
      >الرئيسية</NuxtLink
      >
      <NuxtLink to="/prodect" class="text-sm hover:text-[#3ca2fa]"
      >المنتجات</NuxtLink
      >
      <NuxtLink to="/contant-us" class="text-sm hover:text-[#3ca2fa]"
        >اتصل بنا</NuxtLink
      >
    </div>
    <!-- أيقونات التواصل الاجتماعي -->
    <div class="flex space-x-4 mb-4 md:mb-0 m-4">
      <a
      href="https://www.facebook.com"
      target="_blank"
      rel="noopener noreferrer"
          class="m-2 hover:text-[#3ca2fa]"
        >
          <Facebook size="20" />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="m-2 hover:text-[#3ca2fa]"
        >
          <Instagram size="20" />
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          class="m-2 hover:text-[#3ca2fa]"
        >
          <Twitter size="20" />
        </a>
      </div>

      <p class="text-sm m-4">&copy; 2025 جميع الحقوق محفوظة</p>
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Twitter } from "lucide-vue-next";
</script>
