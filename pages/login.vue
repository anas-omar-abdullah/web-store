<template>
  <section
    class="min-h-screen flex items-center justify-center container mx-auto px-4"
  >
    <div class="min-h-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-center">تسجيل الدخول</h1>
      <form @submit.prevent="Admin">
        <div class="c-all">
          <div class="space-y-4">
            <div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >البريد الإلكتروني</label
                >
                <input
                  v-model="adminForm.email"
                  type="email"
                  class="all-border-input input mt-1 block w-full"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >كلمة المرور</label
                >
                <input
                  v-model="adminForm.password"
                  type="password"
                  class="all-border-input input mt-1 block w-full"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-center space-x-3 space-x-reverse">
          <button type="submit" class="btn btn-primary">تسجيل الدخول</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore} from '@/stores/auth';

definePageMeta({
  layout: "none",
});

const adminForm = ref({
  email: "",
  password: "",
  id: "",
  name:"",
  role:"",
  totalAmount: 0,
  avatar: "",
});

async function Admin() {
    const authStore = useAuthStore();
    try{
      await authStore.login({
          email:adminForm.value.email,
          password:adminForm.value.password,
      })
    }catch (error){
      console.error('خطأ في تسجيل الدخول', error)
    }
}
</script>

<style scoped>
.c-all {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
