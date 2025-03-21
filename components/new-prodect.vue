<template>
  <h2 class="my-8 text-3xl font-bold text-center mb-8 text-[#3ca2fa]">
    جديدنا من المنتجات
  </h2>
  <div
    class="all relative w-full overflow-hidden"
    ref="sliderContainer"
    @mousedown="onDragStart"
    @touchstart="onDragStart"
    @mousemove="onDragMove"
    @touchmove="onDragMove"
    @mouseup="onDragEnd"
    @mouseleave="onDragEnd"
    @touchend="onDragEnd"
  >
    <!-- الحاوية الداخلية للمنتجات -->
    <div class="flex go-next" :style="sliderStyle">
      <div
        v-for="product in products"
        :key="product.id"
        class="p-2"
        :style="{ flex: `0 0 calc(100% / ${itemsPerView})` }"
      >
        <div class="bg-white p-4 shadow rounded cursor-pointer">
          <NuxtLink :to="`product/${product.id}`" draggable="false">
            <img
              draggable="false"
              :src="product.image"
              :alt="product.title"
              class="w-full h-auto object-cover"
            />
          </NuxtLink>
          <h2 class="mb-8 mt-2 text-center text-xl select-none">
            {{ product.title }}
          </h2>
        </div>
      </div>
    </div>
    <div class="h-[20px] w-100%"></div>

    <!-- سهم التنقل لليسار -->
    <button
      @click="prev"
      class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 z-10"
    >
      <ArrowLeft class="w-6 h-6 text-[#3ca2fa]" />
    </button>

    <!-- سهم التنقل لليمين -->
    <button
      @click="next"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 z-10"
    >
      <ArrowRight class="w-6 h-6 text-[#3ca2fa]" />
    </button>

    <!-- نقاط التنقل (الدوائر) أسفل الـ Slider -->
    <div
      class="absolute left-1/2 transform -translate-x-1/2 flex space-x-2 bottom--3"
      style="bottom: 0"
    >
      <span
        v-for="(dot, index) in totalDots"
        :key="index"
        @click="goTo(index)"
        :class="{
          'bg-[#3ca2fa]': currentIndex === index,
          'bg-gray-300': currentIndex !== index,
        }"
        class="w-3 h-3 rounded-full cursor-pointer transition-colors duration-300"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ArrowLeft, ArrowRight } from "lucide-vue-next";

// بيانات المنتجات (يمكنك تعديلها حسب الحاجة)
const products = ref([
  {
    id: 1,
    title: "منتج 1",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 2,
    title: "منتج 2",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 3,
    title: "منتج 3",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 4,
    title: "منتج 4",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 5,
    title: "منتج 5",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 6,
    title: "منتج 6",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 7,
    title: "منتج 7",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 8,
    title: "منتج 8",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 9,
    title: "منتج 8",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },

  {
    id: 10,
    title: "منتج 8",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },

  // يمكن إضافة المزيد من المنتجات هنا
]);

// متغيرات الحاوية وحجمها
const sliderContainer = ref(null);
const containerWidth = ref(0);
const itemsPerView = ref(1);
const currentIndex = ref(0);

// متغيرات السحب (drag)
const isDragging = ref(false);
const dragStartX = ref(0);
const dragOffset = ref(0);

// تحديث عدد المنتجات المعروضة حسب حجم الشاشة
const updateItemsPerView = () => {
  const width = window.innerWidth;
  if (width < 640) {
    itemsPerView.value = 1;
  } else if (width >= 640 && width < 1024) {
    itemsPerView.value = 2;
  } else if (width >= 1024 && width < 1280) {
    itemsPerView.value = 3;
  } else {
    itemsPerView.value = 4;
  }
  // التأكد من أن currentIndex ضمن النطاق الصحيح
  if (currentIndex.value > totalDots.value - 1) {
    currentIndex.value = totalDots.value - 1;
  }
};

// تحديث عرض الحاوية
const updateContainerWidth = () => {
  if (sliderContainer.value) {
    containerWidth.value = sliderContainer.value.clientWidth;
  }
};

const onResize = () => {
  updateItemsPerView();
  updateContainerWidth();
};

onMounted(() => {
  updateItemsPerView();
  updateContainerWidth();
  window.addEventListener("resize", onResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const totalDots = computed(() => {
  return Math.max(1, products.value.length - itemsPerView.value + 1);
});

// أسلوب التحريك للـ Slider
const sliderStyle = computed(() => {
  const productWidth = containerWidth.value / itemsPerView.value;
  // نحسب الإزاحة بناءً على currentIndex ونضيف أو نطرح dragOffset أثناء السحب
  const shift = currentIndex.value * productWidth - dragOffset.value;
  return {
    transform: `translateX(-${shift}px)`,
    transition: isDragging.value ? "none" : "transform  0.3s ease-in-out",
  };
});

const isTransitioning = ref(false);
// دوال التنقل بدون الالتفاف (loop)
const prev = () => {
  if (isTransitioning.value) return;
  if (currentIndex.value > 0) {
    isTransitioning.value = true;
    currentIndex.value--;
    setTimeout(() => {
      isTransitioning.value = false;
    }, 300);
  }
};

const next = () => {
  console.log(isTransitioning.value);
  if (isTransitioning.value) return;
  if (currentIndex.value < totalDots.value - 1) {
    isTransitioning.value = true;
    currentIndex.value++;
    setTimeout(() => {
      isTransitioning.value = false;
    }, 300);
  }
};

const goTo = (index) => {
  currentIndex.value = index;
};

// دوال السحب (drag)
const onDragStart = (event) => {
  isDragging.value = true;
  if (event.type === "touchstart") {
    dragStartX.value = event.touches[0].clientX;
  } else {
    dragStartX.value = event.clientX;
  }
};

const onDragMove = (event) => {
  if (!isDragging.value) return;
  const clientX = event.type.startsWith("touch")
    ? event.touches[0].clientX
    : event.clientX;
  dragOffset.value = clientX - dragStartX.value;
};

const onDragEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  const productWidth = containerWidth.value / itemsPerView.value;
  // نستخدم عتبة محددة (مثلاً 30% من عرض المنتج) لتحديد ما إذا كان السحب كافٍ لتغيير المنتج
  const threshold = productWidth * 0.3;
  if (dragOffset.value > threshold) {
    prev();
  } else if (dragOffset.value < -threshold) {
    next();
  }
  dragOffset.value = 0;
};
</script>
<style scoped>
.all {
  direction: ltr;
}
</style>
-->
