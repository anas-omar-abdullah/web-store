<template>
  <nav class="bg-white shadow-md">
    <div
      class="content container mx-auto flex items-center justify-between p-2"
    >
      <!-- logo -->
      <NuxtLink to="/" class="text-xl font-bold text-primary">
        <img class="w-40" src="/logo.png" alt="logo" />
      </NuxtLink>

      <!-- حقل البحث في الشاشات الكبيرة -->
      <div class="hidden md:flex flex-1">
        <div class="relative w-2/4">
          <LucideSearch class="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث..."
            class="input-search w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <!-- link for big scareen -->
        <div class="link-des md:flex flex-1">
          <NuxtLink
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.link"
            class="block px-2 py-2 hover:text-primary mr-2"
            active-class="active-link"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <!-- أيقونة البحث في الشاشات الصغيرة -->
        <button @click="toggleSearch" class="ml-4 md:hidden">
          <LucideSearch class="w-6 h-6 text-gray-700" />
        </button>

        <!-- أيقونة سلة الشراء -->
        <!-- زر سلة الشراء مع القائمة المنبثقة -->
        <div  ref="cartContainer" class="relative">
          <button @click="toggleCart" class="relative">
            <LucideShoppingCart class="w-6 h-6 text-gray-700" />
            <!-- عرض عدد العناصر في السلة -->
            <span
              v-if="cartItems.length"
              class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-2"
            >
              {{ cartItems.length }}
            </span>
          </button>

          <!-- قائمة العناصر في السلة -->
          <transition name="fade">
            <div
              v-if="isCartOpen"
              class="absolute left-full ml-2 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-10"
            >
              <h3 class="text-lg font-semibold mb-2">سلة المشتريات</h3>
              <div class="see max-h-64 overflow-y-auto">
                <!-- تكرار العناصر في السلة -->
                <div
                  v-for="(item, index) in cartItems"
                  :key="item.id"
                  class="flex items-center border-b border-gray-200 py-2"
                >
                  <!-- صورة المنتج (اختياري) -->
                  <img
                    v-if="item.image"
                    :src="item.image"
                    alt="صورة المنتج"
                    class="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div class="flex-1">
                    <p class="font-semibold">{{ item.name }}</p>
                    <p class="text-sm text-gray-400">
                      الكمية: {{ item.quantity }}
                    </p>
                  </div>
                  <div class="px-2 text-sm font-semibold">{{ item.price }} $</div>
                </div>
              </div>
              <!-- زر الانتقال للدفع -->
              <div class="mt-4">
                <NuxtLink
                  to="/checkout"
                  class="block text-center bg-primary text-white py-2 rounded hover:bg-primary-dark"
                >
                  الانتقال للشراء
                </NuxtLink>
              </div>
            </div>
          </transition>
        </div>

        <!-- زر القائمة للجوال -->
        <button @click="toggleMenu" class="md:hidden">
          <LucideMenu class="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
    <!-- حقل البحث للجوال -->
    <div v-if="isSearchOpen" class="p-4 md:hidden">
      <input
        type="text"
        placeholder="بحث..."
        class="search-sm w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- قائمة الصفحات للجوال -->
    <div v-if="isMenuOpen" class="nav-link md:hidden bg-gray-100">
      <NuxtLink
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.link"
        class="block px-4 py-2 text-gray-700 hover:bg-gray-200"
        active-class="active-link"
      >
        {{ item.name }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref ,onMounted, onUnmounted } from "vue";
import { LucideSearch, LucideShoppingCart, LucideMenu } from "lucide-vue-next";

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const menuItems = [
  { name: "الرئيسية", link: "/" },
  { name: "المنتجات", link: "/prodect" },
  { name: "اتصل بنا", link: "/contant-us" },
];
const isCartOpen = ref(false);
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
};

// مرجع لحاوية السلة
const cartContainer = ref(null)

// دالة لإغلاق السلة عند النقر خارجها
const handleClickOutside = (event) => {
  if (cartContainer.value && !cartContainer.value.contains(event.target)) {
    isCartOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// مثال لعناصر السلة
const cartItems = ref([
  {
    id: 1,
    name: "منتج",
    quantity: 2,
    price: 50,
    image: "https://via.placeholder.com/48",
  },
  {
    id: 2,
    name: "منتج 2",
    quantity: 1,
    price: 100,
    image: "https://via.placeholder.com/48",
  },
  {
    id: 3,
    name: "منتج 3",
    quantity: 3,
    price: 30,
    image: "https://via.placeholder.com/48",
  },
  {
    id: 1,
    name: "منتج 1",
    quantity: 2,
    price: 50,
    image: "https://via.placeholder.com/48",
  },
  {
    id: 2,
    name: "منتج 2",
    quantity: 1,
    price: 100,
    image: "https://via.placeholder.com/48",
  },
  {
    id: 3,
    name: "منتج 3",
    quantity: 3,
    price: 30,
    image: "https://via.placeholder.com/48",
  },

]);
</script>

<style scoped>
.text-primary {
  color: var(--primary-color);
}
.bg-primary {
  background-color: var(--primary-color);
}
.input-search:not(:focus) {
  border-color: black;
}
.link-des {
  padding-right: 5%;
}
.search-sm:not(:focus) {
  border-color: black;
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
/* سلة المشتريات */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.see{
  direction: rtl;
}
</style>
