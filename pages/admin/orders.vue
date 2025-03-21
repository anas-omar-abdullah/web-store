<template>
  <loading overlay v-if="showLoading" />
  <div class="mb-6">
    <h1 class="mt-6 text-2xl font-semibold text-gray-900">الطلبات</h1>

    <!-- Statistics -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">إجمالي المبيعات</h3>
        <p class="mt-2 text-3xl font-semibold text-primary">
          {{ totalSales }} $
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">عدد الطلبات</h3>
        <p class="mt-2 text-3xl font-semibold text-primary">
          {{ totalOrders }}
        </p>
      </div>
    </div>
  </div>
  <h1 v-if="errorMess" class="w-full text-red-500 text-center">{{ errorMess }}</h1>
  <h1 v-else-if="orders.length === 0" class="text-primary text-center">
    لا يوجد عناصر لعرضها
  </h1>
  <div v-else>
    <!-- Orders Table -->
    <div class="table-sm bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="table-header">رقم الطلب</th>
            <th scope="col" class="table-header">العميل</th>
            <th scope="col" class="table-header">المبلغ</th>
            <th scope="col" class="table-header">تاريخ الطلب</th>
            <th scope="col" class="table-header">حالة الطلب</th>
            <th scope="col" class="table-header">الإجراءات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="table-cell">#{{ order.id }}</td>
            <td class="table-cell">{{ order.customerName }}</td>
            <td class="table-cell">{{ order.total }} $</td>
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
                class="text-primary hover:text-primary/80"
              >
                <RefreshCw class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Update Status Modal -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
            <select v-model="newStatus" class="input mt-1 block w-full">
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد التجهيز</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم التوصيل</option>
              <option value="cancelled">ملغي</option>
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

useHead({
  title: "عرض تفاصيل الطلبات",
});

definePageMeta({
  layout: "admin",
});

const orders = ref([]);
const showStatusModal = ref(false);
const selectedOrder = ref(null);
const newStatus = ref("");
const errorMess = ref("");
const showLoading = ref(false);
const totalSales = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.total, 0).toFixed(2);
});

const totalOrders = computed(() => orders.value.length);

function formatDate(date) {
  return new Date(date).toLocaleDateString("ar-SA");
}

function getStatusClass(status) {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || classes.pending;
}

function getStatusText(status) {
  const texts = {
    pending: "قيد الانتظار",
    processing: "قيد التجهيز",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };
  return texts[status] || texts.pending;
}

function updateOrderStatus(order) {
  selectedOrder.value = order;
  newStatus.value = order.status;
  showStatusModal.value = true;
}

function saveOrderStatus() {

  if (selectedOrder.value) {
    showLoading.value = true;
    try {
      // TODO: Call API to update order status
      const index = orders.value.findIndex(
        (o) => o.id === selectedOrder.value.id
      );
      orders.value[index] = {
        ...selectedOrder.value,
        status: newStatus.value,
      };
      if (!authStore.response.ok) {
        setTimeout(() => {
          errorMess.value = "فشل تعديل حالة الطلب الرجاء المحاولة لاحقا";
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        errorMess.value = "فشل تعديل حالة الطلب الرجاء المحاولة لاحقا";
      }, 2000);
    } finally {
      errorMess.value = "";
      showLoading.value = false;
    }
  }
  showStatusModal.value = false;
  selectedOrder.value = null;
  newStatus.value = "";
}
// load order 
onBeforeMount(async () => {
  showLoading.value = true;
  try {
    products.value = await authStore.showProduct("api/products");
    if(!authStore.response.ok){
      errorMess.value = "فشل جلب الطلبات الرجاء المحاولة لاحقا: "
    }
  } catch (error) {
    errorMess.value = "فشل جلب الطلبات الرجاء المحاولة لاحقا "
  } finally {
    showLoading.value = false;
  }
});

</script>
