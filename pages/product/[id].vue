<template>
  <div class="container mx-auto p-4">
    <!-- زر العودة -->
    <NuxtLink
      to="/"
      class="inline-flex items-center text-primary hover:underline"
    >
      <LucideArrowLeft class="w-5 h-5 mr-1" />
      العودة
    </NuxtLink>

    <div class="mt-6" v-if="product">
      <h1 class="text-2xl font-bold text-primary">{{ product.title }}</h1>
      <img
        :src="product.image"
        alt="صورة المنتج"
        class="w-full max-w-md mx-auto mt-4 rounded shadow"
      />
      <p class="mt-4 text-gray-700">{{ product.description }}</p>
      <div class="mt-4">
        <span class="text-xl font-bold text-primary"
          >{{ product.price }} $</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useAsyncData } from '#imports'
import { LucideArrowLeft } from 'lucide-vue-next'

useHead({
  title: 'عرض منتج'
})

const route = useRoute()
const productId = route.params.id

// جلب بيانات المنتج من الـ API
const { data: product, error } = await useAsyncData('product', () =>
  $fetch(`https://api.example.com/products/${productId}`)
)

// إذا كان هناك خطأ أو لم يتم العثور على المنتج، يتم إطلاق خطأ 404
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'المنتج غير موجود'
  })
}
</script>

<style scoped>
.text-primary {
  color: var(--primary-color);
}
</style>
