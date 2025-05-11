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
        <p class="text-gray-600 mb-8 text-center">
          هل تريد شراء ال .... وسعرها ..... $
        </p>
        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-gray-700 mb-2" for="name">العنوان</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                placeholder="أدخل عنوانك"
                class="w-full border rounded-md p-2 all-border-input"
                :class="{ '!border-red-500': errors.address }"
                @input="clearError('address')"
              />
              <p v-if="errors.address" class="text-red-500 text-sm mt-1 pl-2">
                {{ errors.address }}
              </p>
            </div>
            <div class="w-[80%] w-small">
              <div>
                <label class="mt-4 block text-gray-700">رقم الهاتف</label>
                <div class="flex-number">
                  <!-- زر اختيار رمز الدولة -->
                  <div ref="dropdownRef" class="relative flex-grow-0">
                    <button
                      type="button"
                      @click="toggleCountryCodeDropdown"
                      class="inline-flex items-center px-2 py-2 all-border-input rounded-l-md"
                    >
                      {{ selectedCountryCode }}
                      <ChevronDown class="ml-2 h-4 w-4" />
                    </button>
                    <!-- قائمة رموز الدول -->
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
                  <!-- حقل إدخال الرقم -->
                  <input
                    v-model="form.phone"
                    type="number"
                    class="text-po m-2 w-full border rounded-r-md all-border-input"
                    placeholder="أدخل رقم الهاتف"
                    :class="{ '!border-red-500': errors.phone }"
                    @input="clearError('phone')"
                  />
                </div>
                <p v-if="errors.phone" class="text-red-500 text-sm mt-1 pl-2">
                  {{ errors.phone }}
                </p>
              </div>
            </div>
          </div>
          <!-- Check box لتذكر معلومات تسجيل الدخول -->
          <div class="flex items-center my-6 text-center">
            <div
              @click="toggleRemember"
              class="cursor-pointer flex items-center"
            >
              <div
                class="border-b mx-2 w-4 h-4 border border-gray-300 flex items-center justify-center"
                :class="{ 'bg-primary': remember }"
              >
                <LucideCheck v-if="remember" class="w-3 h-3 text-white" />
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
              class="bg-[#3ca2fa] hover:bg-[#349ed1] text-white font-bold py-2 px-6 rounded-md transition duration-300"
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
import { ref } from "vue";
import { LucideCheck, ChevronDown } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";

useHead({
  title: "صفحة الشراء",
});

const form = ref({
  name: "",
  address: "",
  email: "",
  phone: "",
});
const errors = ref({
  name: "",
  address: "",
  phone: "",
});
const showErrorInput = ref(false);
const countries = ref([
  { code: "+964", name: "العراق" },
  { code: "+963", name: "سوريا" },
  // يمكنك إضافة المزيد من الدول
]);
const selectedCountryCode = ref("+964"); // رمز الدولة الافتراضي
const showCountryCodeDropdown = ref(false);
const dropdownRef = ref(null);

const toggleCountryCodeDropdown = () => {
  showCountryCodeDropdown.value = !showCountryCodeDropdown.value;
};

const selectCountryCode = (country) => {
  selectedCountryCode.value = country.code;
  showCountryCodeDropdown.value = false;
};

// إغلاق القائمة عند النقر خارجها
onClickOutside(dropdownRef, () => {
  showCountryCodeDropdown.value = false;
});

const showLoading = ref(false);
const remember = ref(false);

const toggleRemember = () => {
  remember.value = !remember.value;
};
// دالة لتنظيف الأخطاء عند البدء بالكتابة
const clearError = (field) => {
  if (errors.value[field] && showErrorInput.value) {
    errors.value[field] = "";
    validateForm();
  }
};
// التحقق من صحة البيانات
const validateForm = () => {
  let isValid = true;
  if (form.value.name.trim() === "") {
    errors.value.name = " هذا الحقل مطلوب";
    isValid = false;
  }
  if (form.value.name.length >= 30) {
    errors.value.name = " يجب أن يكون أصغر من 30 حرف";
    isValid = false;
  }
  if (form.value.address.trim() === "") {
    errors.value.address = "هذا الحقل مطلوب";
    isValid = false;
  }
  if (form.value.phone.length.trim() === "") {
    errors.value.phone = "هذا الحقل مطلوب";
    isValid = false;
  }

  return isValid;
};
async function submitForm() {
  showErrorInput.value = true;
  if (!validateForm()) return;
  // هنا يمكنك إضافة الكود اللازم لإرسال البيانات إلى الخادم (API)
  showLoading.value = true;
  try {
    const response = await $fetch(`...`, {
      method: "PUT",
    });
  } catch (error) {
    console.log(error);
  } finally {
    showLoading.value = false;
  }
  // إعادة تعيين الحقول بعد الإرسال
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
  showErrorInput.value = false;
  // إذا تم تحديد check box يتم حفظ المعلومات في localStorage
  if (remember.value) {
    localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
  } else {
    localStorage.removeItem("loginInfo");
  }
}
</script>

<style scoped>
.all-border-input {
  border: 1px solid #1a1a1a;
  padding: 2px 25px;
  transition: all 0.3s;
  outline: none;
  color: #1a1a1a;
}
.all-border-input:hover,
.all-border-input:focus,
.all-border-input:active,
.all-border-input:focus-visible,
.all-border-input:focus-within,
.all-border-input:target {
  border: 1px solid var(--primary-color);
}

.bg-primary {
  background-color: #3ca2fa;
}
.disable-select {
  -webkit-user-select: none; /* Safari, Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* الإصدارات الحديثة */
}
.border-b {
  border: 1px solid black;
}
.margin-bt {
  margin-bottom: 58px;
}
.flex-number {
  display: flex;
  justify-content: center;
  align-items: center;
  direction: ltr;
}
.text-po {
  direction: rtl;
}
@media(max-width:425px){
.w-small{
  width:100%
}
}
</style>
