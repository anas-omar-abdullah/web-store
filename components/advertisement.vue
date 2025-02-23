<template>
    <div  v-if="isVisible" class="announcement-bar">
      <Transition name="fade" mode="out-in">
        <div
          v-if="currentAd"
          :key="currentAd.id"
          class="announcement"
        >
          {{ currentAd.text }}
        </div>
      </Transition>
      <button class="close-btn" @click="hideBar">
  ✖
</button>

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  
  const ads = ref([
    { id: 1, text: "🔥 عرض خاص: خصم 50% على جميع المنتجات!" },
    { id: 2, text: "🚀 اشترك الآن واحصل على شهر مجاني!" },
    { id: 3, text: "🎁 هدية مجانية مع كل طلبية فوق 100 دولار!" },
  ]);
  const isVisible = ref(true); 
  const hideBar = () => {
  isVisible.value = false;
  clearInterval(interval);
};

  const currentIndex = ref(0);
  const currentAd = ref(ads.value[currentIndex.value]);
  let interval = null;
  
  const changeAd = () => {
    currentIndex.value = (currentIndex.value + 1) % ads.value.length;
    currentAd.value = ads.value[currentIndex.value];
  };
  
  const startRotation = () => {
    interval = setInterval(changeAd, 5000);
  };
  
  onMounted(startRotation);
  onUnmounted(() => clearInterval(interval));
  </script>
  
  <style scoped lang="scss">
  .announcement-bar {
    background-color: var(--primary-color);
    color: white;
    text-align: center;
    padding: 10px;
    font-size: 1rem;
    font-weight: bold;
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  
  .announcement {
    transition: opacity 0.5s ease-in-out;
    white-space: nowrap;
    cursor: default;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  /* زر الإغلاق */
.close-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}

.close-btn:hover {
  color: #f8f9fa;
  transform: translateY(-50%) scale(1.1);
}

  </style>
  