<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <div class="content container mx-auto flex items-center justify-between p-2">
      <!-- logo -->
      <NuxtLink to="/">
        <img class="w-40" src="/logo.png" alt="logo" />
      </NuxtLink>
      <div class="hidden md:flex flex-1">
        <!-- link for big screen -->
        <div class="link-des md:flex flex-1">
          <NuxtLink
            v-for="(link, index) in myLink"
            :key="index"
            :to="link.url"
            class="block px-2 py-2 mr-4 hover:text-primary"
            active-class="active-link"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="ml-4 flex items-center">
          <button @click="logout" class="ml-4 flex items-center logout text-white">
            <p>تسجيل الخروج</p>
            <LogOut class="w-5 h-5 pr-1" />
          </button>
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative"
          >
            <Bell class="h-6 w-6" />
            <span
              v-if="unreadNotifications > 0"
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"
            ></span>
          </button>
        </div>
        <!-- زر القائمة للجوال -->
        <button @click="toggleMenu" class="md:hidden">
          <LucideMenu class="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
    <!-- قائمة الصفحات للجوال -->
    <div v-if="isMenuOpen" ref="popupRef" class="nav-link md:hidden bg-gray-100">
      <NuxtLink
        v-for="(link, index) in myLink"
        :key="index"
        :to="link.url"
        class="block px-4 py-2 text-gray-700 hover:bg-gray-200"
        active-class="active-link"
      >
        {{ link.name }}
      </NuxtLink>
    </div>
    <!-- Notifications Panel -->
    <div
      v-if="showNotifications"
      class="not-nav absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
    >
      <div class="px-4 py-2 border-b border-gray-100">
        <h3 class="text-lg font-medium">الإشعارات</h3>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="px-4 py-2 hover:bg-gray-50"
        >
          <p class="text-sm text-gray-700">{{ notification.message }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
        </div>
      </div>
    </div>
  </nav>
  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <slot />
  </main>
</template>

<script setup>
import { Bell, LucideMenu, LogOut } from "lucide-vue-next";
import { ref } from "vue";
import { onClickOutside } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

// تعريف الراوتر من vue-router
const router = useRouter();

const showNotifications = ref(false);
const unreadNotifications = ref(0);
const notifications = ref([]);
const isSubAdmin = ref(JSON.parse(localStorage.getItem("_user"))?.role);

const popupRef = ref(null);
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// إغلاق القائمة عند الضغط خارجها باستخدام VueUse
onClickOutside(popupRef, () => {
  isMenuOpen.value = false;
});

// إغلاق القائمة عند التنقل بين الصفحات
router.afterEach(() => {
  isMenuOpen.value = false;
});

const myLink = [
  { name: "المنتجات", url: "/admin" },
  { name: "التصنيفات", url: "/admin/categories" },
  { name: "المشرفين", url: "/admin/add-admin" },
  { name: "الطلبات", url: "/admin/orders" },
];

const logout = () => {
  const authStore = useAuthStore();
  authStore.logout();
};

// يمكنك تفعيل socket إذا كنت تحتاج لذلك في onMounted
// onMounted(() => {
//   socket.value = io("ws://your-backend-url");
//   socket.value.on("notification", (notification) => {
//     notifications.value.unshift(notification);
//     unreadNotifications.value++;
//   });
// });
</script>

<style scoped>
.not-nav {
  right: calc(100% - 340px);
}
.text-primary {
  color: var(--primary-color);
}
.bg-primary {
  background-color: var(--primary-color);
}
.link-des {
  padding-right: 5%;
}
.active-link {
  color: var(--primary-color);
  position: relative;
}
.active-link::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
}
.logout {
  background-color: var(--primary-color);
  width: 115px;
  height: 40px;
  border-radius: 12px;
  font-size: small;
  justify-content: center;
}
.logout:hover {
  background-color: white;
  color: var(--primary-color);
  transition: 0.2s;
}
.logout p:hover {
  background-color: white;
  color: var(--primary-color);
  transition: 0.2s;
}
</style>
