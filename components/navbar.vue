<template>
  <nav
    class="fixed z-[999] left-0 right-0 bg-white shadow-md"
    :class="{ 'top-[44px]': isAdVisible, 'top-0': !isAdVisible }"
  >
    <div class="content container mx-auto flex items-center justify-between">
      <!-- logo -->
      <NuxtLink to="/" class="text-xl font-bold text-primary">
        <img class="w-40" src="/logo.png" alt="logo" />
      </NuxtLink>

      <!-- حقل البحث في الشاشات الكبيرة -->
      <div class="hidden md:flex flex-1">
        <div class="relative w-2/4">
          <button @click="serachProduct">
            <LucideSearch class="absolute left-3 top-1/2 -translate-y-1/2" />
          </button>
          <input
            v-model="searchText"
            type="text"
            placeholder="بحث..."
            class="input-search w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <transition name="fade">
            <div
              v-if="isSerOpen"
              class="absolute left-full ml-2 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-10"
            >
              <h3 class="text-lg font-semibold mb-2">نتائج البحث</h3>
              <div class="max-h-64 overflow-y-auto">
                <div v-if="isLoading" class="p-4 text-center">
                  جاري البحث...
                </div>
                <div v-else-if="errorMessage" class="p-4 text-red-500">
                  {{ errorMessage }}
                </div>
                <div v-else-if="results.length === 0" class="p-4">
                  لا توجد نتائج
                </div>
                <div v-else class="results"></div>
                <div
                  v-for="product in results"
                  :key="product.id"
                  class="flex items-center border-b border-gray-200 py-2"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    loading="lazy"
                    class="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div class="flex-1">
                    <h3 class="font-medium">{{ product.name }}</h3>
                    <p class="text-sm text-gray-600">{{ product.price }} $</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
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
        <div ref="cartContainer" class="relative">
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
                  <div class="px-2 text-sm font-semibold">
                    {{ item.price }} $
                  </div>
                </div>
              </div>
              <!-- زر الانتقال للدفع -->
              <div class="mt-4">
                <NuxtLink
                  to="/menu"
                  class="block text-center border-var py-2 rounded-md transition-colors"
                >
                  الانتقال للسلة
                </NuxtLink>
              </div>
              <div class="mt-4">
                <NuxtLink
                  to="/buying"
                  class="block text-center bg-color text-white py-2 rounded-md pay"
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
    <div
      v-if="isMenuOpen"
      ref="popupRef"
      class="nav-link md:hidden bg-gray-100"
    >
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
import { ref, onMounted, onUnmounted } from "vue";
import { LucideSearch, LucideShoppingCart, LucideMenu } from "lucide-vue-next";
import { onClickOutside, useDebounce } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAdvertisement } from '~/composables/useAdvertisement';

const router = useRouter();
const { isAdVisible } = useAdvertisement();

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const popupRef = ref(null);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};
// إغلاق القائمة عند الضغط خارجها باستخدام VueUse
onClickOutside(popupRef, () => {
  isMenuOpen.value = false;
});

// إغلاق القائمة عند التنقل بين الصفحات
router.afterEach(() => {
  isMenuOpen.value = false;
});

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
const cartContainer = ref(null);

// دالة لإغلاق السلة عند النقر خارجها
const handleClickOutside = (event) => {
  if (cartContainer.value && !cartContainer.value.contains(event.target)) {
    isCartOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
// مثال لعناصر السلة
const cartItems = ref([
  {
    id: 1,
    name: "منتج",
    quantity: 2,
    price: 50,
    image: "https://via.placeholder.com/48",
  },
]);
// result search
const isSerOpen = ref(false);
const toggleSer = () => {
  isSerOpen.value = !isSerOpen.value;
};

const results = ref([]);
const searchText = ref("");
const errorMess = ref("");
const showLoading = ref(false);
const serachProduct = async () => {
  if (!searchText.value.trim()) {
    errorMess.value = "الرجاء إدخال كلمة بحث";
    isSearchOpen.value = false;
    setTimeout(() => {
      errorMess.value = "";
    }, 2000);
    return;
  }
  try {
    errorMess.value = "";
    showLoading.value = true;
    isSearchOpen.value = true;
    const { data } = await $fetch(
      "https://muaazaltahan-001-site1.dtempurl.com/api/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    results.value = data;
  } catch (error) {
    errorMess.value = "حدث خطأ أثناء البحث";
    setTimeout(() => {
      errorMess.value = "";
    }, 1000);
  } finally {
    showLoading.value = false;
  }
};

const debouncedSearch = useDebounce(serachProduct, 3000);
watch(searchText, () => {
  debouncedSearch();
});

onClickOutside(document.querySelector('.relative'), () => {
  isSearchOpen.value = false;
});
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
.see {
  direction: rtl;
}
.text-color {
  color: var(--primary-color);
}
.bg-color {
  background: var(--primary-color);
}
.border-var {
  border: 2px solid var(--primary-color);
}
.border-var:hover {
  background-color: var(--primary-color);
  color: white;
}
.pay:hover {
  background-color: #0f8fff;
}
/* search  */
.product-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
}
</style>
