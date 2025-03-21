<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth";
import { onBeforeMount } from "vue";

onBeforeMount(() => {
  const now = new Date().getMilliseconds();
  const exp = localStorage.getItem("exp");
  if (exp && exp <= now - 60 * 60 * 1000) {
    const authStore = useAuthStore();
    authStore.logout();
  }
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap");
/* style scroll for website  */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background-color: #3ca2fa;
  border-radius: 4px;
  border: 2px solid #f1f1f1;
}
* {
  scrollbar-width: thin;
  scrollbar-color: #3ca2fa #f1f1f1;
  font-family: "Almarai", serif;
}
/* لتغيير لون التحديد في كل الموقع */
::selection {
  background-color: #3ca2fa; /* اللون الرئيسي */
  color: #fff; /* لون النص عند التحديد */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* للتأكد من التوافق مع فايرفوكس */
::-moz-selection {
  background-color: #3ca2fa;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
/* input number style */
input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield; /* المتصفحات الأخرى */
}

/* إخفاء الأسهم في WebKit (Chrome, Safari, Edge) */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
