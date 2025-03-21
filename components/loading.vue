<template>
    <div :class="containerClasses">
      <div class="mt-4 flex flex-col items-center justify-center space-y-2">
        <LucideLoader class="animate-spin w-12 h-12 text-primary" />
        <span class="text-lg font-semibold text-primary">جاري التحميل...</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { LucideLoader } from 'lucide-vue-next'
  
  const props = defineProps({
    // عند تمرير prop overlay سيتم تغطية الشاشة كاملة
    overlay: {
      type: Boolean,
      default: false
    }
  })
  
  const containerClasses = computed(() => {
    return props.overlay
      ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center'
      : 'flex items-center justify-center'
  })
  </script>
  
  <style scoped>
  .text-primary {
    color: var(--primary-color);
  }
  </style>
  