<template>
    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <p class="text-gray-600 mt-2">{{ message }}</p>
          <div class="flex justify-center gap-4 mt-4">
            <button @click="cancel" class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
              إلغاء
            </button>
            <button @click="confirm" class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
              تأكيد
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    isOpen: Boolean,
    title: String,
    message: String,
  });
  
  const emit = defineEmits(["confirm", "update:isOpen"]);
  
  const confirm = () => {
    emit("confirm");
    emit("update:isOpen", false);
  };
  
  const cancel = () => {
    emit("update:isOpen", false);
  };
  </script>
  