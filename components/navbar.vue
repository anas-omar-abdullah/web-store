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
        <div class="relative w-2/4" ref="searchContainer">
          <button @click="searchProducts">
            <LucideSearch class="absolute left-3 top-1/2 -translate-y-1/2" />
          </button>
          <input
            v-model="searchText"
            type="text"
            placeholder="بحث عن منتج..."
            class="input-search w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            @input="searchProducts"
          />
          <transition name="fade">
            <div
              v-if="isSerOpen"
              class="absolute right-0 mt-2 w-[500px] bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50"
            >
              <div class="flex justify-between items-center mb-4 border-b pb-3">
                <h3 class="text-lg font-semibold text-gray-800">نتائج البحث</h3>
                <button
                  @click="isSerOpen = false"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                <div v-if="isLoading" class="p-6 text-center">
                  <div
                    class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"
                  ></div>
                  <p class="mt-3 text-gray-600">جاري البحث عن المنتجات...</p>
                </div>
                <div v-else-if="errorMessage" class="p-6 text-center">
                  <div class="text-red-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-12 w-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p class="text-red-500 font-medium">{{ errorMessage }}</p>
                </div>
                <div v-else-if="results.length === 0" class="p-6 text-center">
                  <div class="text-gray-400 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-12 w-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p class="text-gray-500 font-medium">لا توجد نتائج للبحث</p>
                </div>
                <div v-else class="space-y-3">
                  <NuxtLink
                    v-for="product in results"
                    :key="product.id"
                    :to="`/product/${product.id}`"
                    class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200"
                    @click="isSerOpen = false"
                  >
                    <div class="relative w-20 h-20 flex-shrink-0">
                      <img
                        :src="product.image"
                        :alt="product.name"
                        loading="lazy"
                        class="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                    </div>
                    <div class="flex-1 mr-4">
                      <h3 class="font-medium text-gray-900 mb-1">
                        {{ product.name }}
                      </h3>
                      <p class="text-sm text-gray-600 line-clamp-2">
                        {{ product.description }}
                      </p>
                      <p class="text-primary font-semibold mt-2">
                        {{ product.price }} $
                      </p>
                    </div>
                  </NuxtLink>
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
              <Loading v-if="cartLoading" />
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
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
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
    <transition name="slide">
      <div
        v-if="isSearchOpen"
        class="fixed inset-0 bg-white z-[1000] md:hidden"
      >
        <div class="p-4 border-b">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">البحث عن المنتجات</h2>
            <button
              @click="closeSearch"
              class="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="relative">
            <button
              @click="searchProducts"
              class="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <LucideSearch class="w-5 h-5 text-gray-500" />
            </button>
            <input
              v-model="searchText"
              type="text"
              placeholder="اكتب اسم المنتج للبحث..."
              class="search-sm w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              @input="searchProducts"
              ref="searchInput"
            />
          </div>
        </div>

        <!-- نتائج البحث للجوال -->
        <div class="overflow-y-auto h-[calc(100vh-120px)]">
          <div v-if="isLoading" class="p-6 text-center">
            <div
              class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"
            ></div>
            <p class="mt-3 text-gray-600">جاري البحث عن المنتجات...</p>
          </div>
          <div v-else-if="errorMessage" class="p-6 text-center">
            <div class="text-red-500 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p class="text-red-500 font-medium">{{ errorMessage }}</p>
          </div>
          <div v-else-if="results.length === 0" class="p-6 text-center">
            <div class="text-gray-400 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p class="text-gray-500 font-medium">لا توجد نتائج للبحث</p>
          </div>
          <div v-else class="divide-y divide-gray-200">
            <NuxtLink
              v-for="product in results"
              :key="product.id"
              :to="`/product/${product.id}`"
              class="flex items-center p-4 hover:bg-gray-50 transition-colors duration-200"
              @click="closeSearch"
            >
              <div class="relative w-20 h-20 flex-shrink-0">
                <img
                  :src="product.image"
                  :alt="product.name"
                  loading="lazy"
                  class="w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>
              <div class="flex-1 mr-4">
                <h3 class="font-medium text-gray-900 mb-1">
                  {{ product.name }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ product.description }}
                </p>
                <p class="text-primary font-semibold mt-2">
                  {{ product.price }} $
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>

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
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { LucideSearch, LucideShoppingCart, LucideMenu } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAdvertisement } from "~/composables/useAdvertisement";

const router = useRouter();
const { isAdVisible } = useAdvertisement();

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const popupRef = ref(null);
const cartLoading = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    // التركيز على حقل البحث عند فتحه
    nextTick(() => {
      searchInput.value?.focus();
    });
  } else {
    closeSearch();
  }
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
  { name: "اتصل بنا", link: "/contact" },
];
const isCartOpen = ref(false);
const cartItems = ref([]);

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
  if (isCartOpen.value) {
    loadCartItems();
  }
};

const loadCartItems = () => {
  try {
    cartLoading.value = true;
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      cartItems.value = JSON.parse(storedProducts);
    } else {
      cartItems.value = [];
    }
  } catch (error) {
    console.error("فشل في جلب المنتجات من السلة:", error);
    cartItems.value = [];
  } finally {
    cartLoading.value = false;
  }
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
  loadCartItems();

  // إضافة مراقب لتغييرات localStorage
  window.addEventListener("storage", (event) => {
    if (event.key === "products") {
      loadCartItems();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  // إزالة مراقب localStorage
  window.removeEventListener("storage", loadCartItems);
});

// إضافة مراقب محلي للتغييرات في localStorage
const setupLocalStorageWatcher = () => {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    const event = new Event("storage");
    event.key = key;
    event.newValue = value;
    originalSetItem.apply(this, arguments);
    window.dispatchEvent(event);
  };
};

onMounted(() => {
  setupLocalStorageWatcher();
});

// result search
const isSerOpen = ref(false);

const results = ref([]);
const searchText = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const searchProducts = async () => {
  if (!searchText.value.trim()) {
    results.value = [];
    isSerOpen.value = false;
    return;
  }

  try {
    isLoading.value = true;
    isSerOpen.value = true;
    errorMessage.value = "";

    const response = await $fetch(
      "https://muaazaltahan-001-site1.dtempurl.com/api/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // التحقق من وجود البيانات قبل التصفية
    if (response && Array.isArray(response)) {
      results.value = response.filter((product) =>
        product.name.toLowerCase().includes(searchText.value.toLowerCase())
      );
    } else if (response && response.data && Array.isArray(response.data)) {
      results.value = response.data.filter((product) =>
        product.name.toLowerCase().includes(searchText.value.toLowerCase())
      );
    } else {
      results.value = [];
      errorMessage.value = "لم يتم العثور على بيانات المنتجات";
    }
  } catch (error) {
    console.error("Search error:", error);
    errorMessage.value = "حدث خطأ أثناء البحث";
    results.value = [];
  } finally {
    isLoading.value = false;
  }
};

// تحسين مراقبة التغييرات في حقل البحث
watch(searchText, (newValue) => {
  if (newValue.trim()) {
    searchProducts();
  } else {
    results.value = [];
    isSerOpen.value = false;
  }
});

// إضافة معالج للنقر خارج نافذة البحث
const searchContainer = ref(null);

onClickOutside(searchContainer, () => {
  isSerOpen.value = false;
});

onClickOutside(document.querySelector(".relative"), () => {
  isSearchOpen.value = false;
});

// دالة لإغلاق البحث
const closeSearch = () => {
  isSearchOpen.value = false;
  isSerOpen.value = false;
  searchText.value = "";
};

// إضافة مرجع لحقل البحث
const searchInput = ref(null);
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
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) #f3f4f6;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 3px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تحسينات للبحث في الشاشات الصغيرة */
.search-sm {
  background-color: #f9fafb;
  border-color: #e5e7eb;
  transition: all 0.3s ease;
}

.search-sm:focus {
  background-color: white;
  border-color: var(--primary-color);
}

/* تأثيرات الحركة */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

@media (max-width: 768px) {
  .custom-scrollbar {
    max-height: calc(100vh - 200px);
  }
}
</style>
