<template>
  <loading overlay v-if="showLoading" />
  <div class="mb-6" v-if="detailsOrder">
    <h1 class="mt-6 text-2xl font-semibold text-gray-900">الطلبات</h1>

    <!-- Statistics -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">إجمالي المبيعات</h3>
        <p class="mt-2 text-3xl font-semibold text-primary">
          {{ detailsOrder.total }} $
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">عدد الطلبات</h3>
        <p class="mt-2 text-3xl font-semibold text-primary">
          {{ detailsOrder.allOrders }}
        </p>
        <h3 class="text-lg font-medium mt-[25%] text-gray-900">
          عدد الطلبات المكتملة
        </h3>
        <p class="mt-2 text-3xl font-semibold text-primary">
          {{ detailsOrder.allOrders }}
        </p>
      </div>
    </div>
  </div>
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">
    {{ errorMess }}
  </h1>
  <div v-else>
    <!-- Orders Table -->
    <div class="responsive-table-container">
      <div class="responsive-table-inner table-sm bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="table-header">رقم الطلب</th>
              <th scope="col" class="table-header">المبلغ</th>
              <th scope="col" class="table-header">المدينة</th>
              <th scope="col" class="table-header">العنوان</th>
              <th scope="col" class="table-header">تاريخ الطلب</th>
              <th scope="col" class="table-header">حالة الطلب</th>
              <th scope="col" class="table-header">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id">
              <td class="table-cell">#{{ order.id }}</td>
              <td class="table-cell">{{ order.total }} $</td>
              <td class="table-cell">{{ order.city }}</td>
              <td class="table-cell">{{ order.address }}</td>
              <td class="table-cell">{{ formatDate(order.createdAt) }}</td>
              <td class="table-cell">
                <span
                  :class="getStatusClass(order.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="table-cell">
                <button
                  @click="updateOrderStatus(order)"
                  class="btn btn-primary flex items-center justify-center p-2 rounded-full"
                >
                  <RefreshCw class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <h1 v-if="orders.length === 0" class="mt-2 text-primary text-center">
      لا يوجد عناصر لعرضها
    </h1>
    <!-- Update Status Modal -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[200]"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">
          تحديث حالة الطلب #{{ selectedOrder?.id }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text- gray-700"
              >الحالة</label
            >
            <select
              v-model="newStatus"
              class="input mt-1 block w-full border-pr"
            >
              <option value="1">قيد الانتظار</option>
              <option value="2">قيد التجهيز</option>
              <option value="3">تم الشحن</option>
              <option value="4">تم التوصيل</option>
              <option value="5">ملغي</option>
            </select>
          </div>
          <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              @click="showStatusModal = false"
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button @click="saveOrderStatus" class="btn btn-primary">
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";
import { showToast, showConfirmMessage } from "~/utils/toast";

useHead({
  title: "عرض تفاصيل الطلبات",
});

definePageMeta({
  layout: "admin",
});
const authStore = useAuthStore();

const orders = ref([]);
const showStatusModal = ref(false);
const selectedOrder = ref(null);
const newStatus = ref("");
const errorMess = ref("");
const showLoading = ref(false);
const detailsOrder = ref({
  total: "",
  allOrders: "",
  allCompleted: "",
});
function formatDate(date) {
  const dateObj = new Date(date);
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${hours}:${minutes}:${seconds} | ${year}/${month}/${day}`;
}

function getStatusClass(status) {
  const statusNumber = Number(status);
  const classes = {
    1: "bg-yellow-100 text-yellow-800 border ",
    2: "bg-blue-100 text-blue-800 border ",
    3: "bg-purple-100 text-purple-800 border ",
    4: "bg-green-100 text-green-800 border ",
    5: "bg-red-100 text-red-800 border ",
  };
  return classes[statusNumber] || classes[1];
}

function getStatusText(status) {
  const statusNumber = Number(status);
  const texts = {
    1: "قيد الانتظار",
    2: "قيد التجهيز",
    3: "تم الشحن",
    4: "تم التوصيل",
    5: "ملغي",
  };
  return texts[statusNumber] || texts[1];
}

function updateOrderStatus(order) {
  selectedOrder.value = order;
  newStatus.value = order.status;
  showStatusModal.value = true;
}

async function saveOrderStatus() {
  const url = `${authStore.urlAuth}/api/orders/order-status`;
  showLoading.value = true;
  if (selectedOrder.value) {
    try {
      const token = localStorage.getItem("token");
      const response = await $fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          orderId: selectedOrder.value.id,
          status: newStatus.value, // إضافة حالة الطلب للإرسال
        },
      });
      const index = orders.value.findIndex(
        (o) => o.id === selectedOrder.value.id
      );
      orders.value[index] = {
        ...selectedOrder.value,
        status: newStatus.value,
      };
      showToast("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      showToast("فشل تحديث حالة الطلب", "error");
    } finally {
      showLoading.value = false;
    }
  }
  showStatusModal.value = false;
  selectedOrder.value = null;
  newStatus.value = "";
}

// async function deleteOrder(order) {
//   try {
//     const result = await showConfirmMessage(
//       "هل أنت متأكد؟",
//       "لن تتمكن من استرجاع هذا الطلب!"
//     );
//     if (result.isConfirmed) {
//       showLoading.value = true;
//       const deleteResult = await authStore.deletThing(
//         order,
//         `api/orders/${order.id}`
//       );
//       orders.value = orders.value.filter((o) => o.id !== order.id);
//       showToast('تم حذف الطلب بنجاح');
//     }
//   } catch (error) {
//     showToast('فشل حذف الطلب', 'error');
//   } finally {
//     showLoading.value = false;
//   }
// }

// load order
onBeforeMount(async () => {
  showLoading.value = true;
  try {
    orders.value = await authStore.showProduct("api/orders");
    detailsOrder.value = await authStore.showProduct("api/orders/statistics");
  } catch (error) {
    errorMess.value = "فشل جلب الطلبات الرجاء المحاولة لاحقا ";
  } finally {
    showLoading.value = false;
    errorMess.value = "";
  }
});
</script>
<style scoped>
.border-pr {
  border: 1px solid var(--primary-color);
  height: 30px;
  outline: none;
}

.border-pr:focus {
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}
</style>
