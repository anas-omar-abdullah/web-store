<template>
  <loading overlay v-if="showLoading" />
  <div class="all mb-4 mt-[84px]">
    <section class="m-h mt-8 container mx-auto px-4">
      <div
        class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 margin-bt"
      >
        <h1 class="text-3xl font-bold mb-6 text-[#3ca2fa] text-center">
          قسم الشراء
        </h1>
        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 gap-4">
            <div class="w-full max-w-xl mx-auto">
              <label class="block text-gray-700 mb-2 text-right" for="address">العنوان</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                placeholder="أدخل عنوانك"
                class="w-full border rounded-md p-3 all-border-input text-right"
                :class="{ '!border-red-500': errors.address }"
                @input="clearError('address')"
              />
              <p v-if="errors.address" class="text-red-500 text-sm mt-1 text-right">
                {{ errors.address }}
              </p>
            </div>
            <div class="w-full max-w-xl mx-auto">
              <label class="mt-4 block text-gray-700 text-right mb-2">رقم الهاتف</label>
              <div class="flex-number">
                <div ref="dropdownRef" class="relative flex-grow-0">
                  <button
                    type="button"
                    @click="toggleCountryCodeDropdown"
                    class="inline-flex items-center px-3 py-3 all-border-input rounded-l-md"
                  >
                    {{ selectedCountryCode }}
                    <ChevronDown class="ml-2 h-4 w-4" />
                  </button>
                  <div
                    v-if="showCountryCodeDropdown"
                    class="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200"
                  >
                    <div
                      v-for="country in countries"
                      :key="country.code"
                      @click="selectCountryCode(country)"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ country.name }} ({{ country.code }})
                    </div>
                  </div>
                </div>
                <input
                  v-model="form.phone"
                  type="number"
                  class="text-po w-full border rounded-r-md all-border-input p-3 mr-2"
                  placeholder="أدخل رقم الهاتف"
                  :class="{ '!border-red-500': errors.phone }"
                  @input="clearError('phone')"
                />
              </div>
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1 text-right">
                {{ errors.phone }}
              </p>
            </div>
          </div>
          <!-- Check box لتذكر معلومات تسجيل الدخول -->
          <div class="flex items-center justify-start my-6 max-w-xl mx-auto">
            <div
              @click="toggleRemember"
              class="cursor-pointer flex items-center"
            >
              <div
                class="border-b mx-2 w-5 h-5 border border-gray-300 flex items-center justify-center rounded"
                :class="{ 'bg-primary': remember }"
              >
                <LucideCheck v-if="remember" class="w-4 h-4 text-white" />
              </div>
              <span class="disable-select ml-2 text-gray-700"
                >تذكر معلومات تسجيل الدخول</span
              >
            </div>
          </div>
          <!-- زر الإرسال -->
          <div class="mt-8 text-center">
            <button
              type="submit"
              class="bg-[#3ca2fa] hover:bg-[#349ed1] text-white font-bold py-3 px-8 rounded-md transition duration-300"
            >
              شراء
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { LucideCheck, ChevronDown } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import { useRoute, useRouter } from 'vue-router';
import { showToast, showConfirmMessage } from '~/utils/toast';

useHead({
  title: "صفحة الشراء",
});

const route = useRoute();
const router = useRouter();
const productId = ref(route.query.id);
const productCount = ref(route.query.count);
const showLoading = ref(false);

const form = ref({
  address: "",
  phone: "",
});
const errors = ref({
  address: "",
  phone: "",
});
const showErrorInput = ref(false);
const countries = ref([
  { code: "+964", name: "العراق" },
  { code: "+963", name: "سوريا" },
]);
const selectedCountryCode = ref("+964");
const showCountryCodeDropdown = ref(false);
const dropdownRef = ref(null);
const remember = ref(false);

// استرجاع البيانات المحفوظة عند تحميل الصفحة
onMounted(() => {
  const savedInfo = localStorage.getItem("loginInfo");
  if (savedInfo) {
    const { address, phone } = JSON.parse(savedInfo);
    form.value.address = address;
    form.value.phone = phone;
    remember.value = true;
  }
});

const toggleCountryCodeDropdown = () => {
  showCountryCodeDropdown.value = !showCountryCodeDropdown.value;
};

const selectCountryCode = (country) => {
  selectedCountryCode.value = country.code;
  showCountryCodeDropdown.value = false;
};

onClickOutside(dropdownRef, () => {
  showCountryCodeDropdown.value = false;
});

const toggleRemember = () => {
  remember.value = !remember.value;
  if (!remember.value) {
    localStorage.removeItem("loginInfo");
  }
};

const clearError = (field) => {
  if (errors.value[field] && showErrorInput.value) {
    errors.value[field] = "";
    validateForm();
  }
};

const validateForm = () => {
  let isValid = true;
  if (!form.value.address || form.value.address.trim() === "") {
    errors.value.address = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (!form.value.phone || String(form.value.phone).trim() === "") {
    errors.value.phone = "هذا الحقل مطلوب";
    isValid = false;
  }
  return isValid;
};

async function submitForm() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  showLoading.value = true;
  try {
    const orderData = {
      productId: productId.value,
      quantity: productCount.value,
      address: form.value.address,
      phone: selectedCountryCode.value + form.value.phone
    };

    const response = await $fetch("https://muaazaltahan-001-site1.dtempurl.com//api/orders/order-products", {
      method: "POST",
      body: orderData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // حفظ البيانات في localStorage قبل إعادة تعيين الحقول
    if (remember.value) {
      const dataToSave = {
        address: form.value.address,
        phone: form.value.phone
      };
      localStorage.setItem("loginInfo", JSON.stringify(dataToSave));
    } else {
      localStorage.removeItem("loginInfo");
    }

    // إعادة تعيين الحقول بعد الإرسال
    form.value.address = "";
    form.value.phone = "";
    showErrorInput.value = false;

    // عرض رسالة نجاح
    await showToast('تم إرسال الطلب بنجاح');

    // التوجيه إلى الصفحة الرئيسية
    router.push('/');

  } catch (error) {
    console.error("Error submitting order:", error);
    // عرض رسالة خطأ
    showToast('فشل إرسال الطلب', 'error');
  } finally {
    showLoading.value = false;
  }
}

async function confirmOrder() {
  const result = await showConfirmMessage(
    'تأكيد الطلب',
    'هل أنت متأكد من إتمام الطلب؟'
  );
  if (result.isConfirmed) {
    // ... rest of the code ...
  }
}
</script>

<style scoped>
.all-border-input {
  border: 1px solid #1a1a1a;
  transition: all 0.3s;
  outline: none;
  color: #1a1a1a;
  font-size: 1rem;
}
.all-border-input:hover,
.all-border-input:focus,
.all-border-input:active,
.all-border-input:focus-visible,
.all-border-input:focus-within,
.all-border-input:target {
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 0 2px rgba(60, 162, 250, 0.1);
}

.bg-primary {
  background-color: #3ca2fa;
}
.disable-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.border-b {
  border: 1px solid black;
}
.margin-bt {
  margin-bottom: 58px;
}
.flex-number {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  direction: ltr;
  gap: 0.5rem;
}
.text-po {
  direction: rtl;
}

@media (max-width: 425px) {
  .w-small {
    width: 100%;
  }
  .all-border-input {
    font-size: 0.9rem;
  }
}
</style>
