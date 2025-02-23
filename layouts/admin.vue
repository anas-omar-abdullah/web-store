<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="small-s-all max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <img class="img-s mt-4 h-16 w-auto" src="/logo.png" alt="Logo" />
          <div class="flex">
            <div class="flex-shrink-0 flex items-center"></div>
            <div class="small-s ml-6 flex space-x-8 space-x-reverse">
              <NuxtLink
                to="/admin"
                class="small-s-link border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                المنتجات
              </NuxtLink>
              <NuxtLink
                to="/admin/categories"
                class="small-s-link border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                التصنيفات
              </NuxtLink>
              <NuxtLink
                to="/admin/add-admin"
                class="small-s-link border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                المشرفين
              </NuxtLink>
              <NuxtLink
                to="/admin/orders"
                class="small-s-link border-transparent text-gray-500 hover:border-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                الطلبات
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
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
        </div>
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
  </div>
</template>

<script setup>
import { Bell } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";

const showNotifications = ref(false);
const unreadNotifications = ref(0);
const notifications = ref([]);
const socket = ref(null);

onMounted(() => {
  socket.value = io("ws://your-backend-url");

  socket.value.on("notification", (notification) => {
    notifications.value.unshift(notification);
    unreadNotifications.value++;
  });
});
</script>
<style scoped>
.not-nav {
  right: calc(100% - 340px);
}
@media (max-width: 570px) {
  .small-s {
    margin-left: 1px;
    margin-right: 1px;
  }
  .small-s-all{
    padding-right: 0;
  }
  .small-s-link {
    margin-right: 1px !important;
  } 
}
@media (max-width: 470px) {
  .small-s-all{
    padding-left: 0;
  }
}

</style>
