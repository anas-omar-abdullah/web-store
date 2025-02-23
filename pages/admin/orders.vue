<template>
  <div>
    <div class="mb-6">
      <h1 class="mt-6 text-2xl font-semibold text-gray-900">الطلبات</h1>

      <!-- Statistics -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900">إجمالي المبيعات</h3>
          <p class="mt-2 text-3xl font-semibold text-primary">
            {{ totalSales }} ر.س
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

    <!-- Orders Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
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
          <tr v-for="order in displayedOrders" :key="order.id">
            <td class="table-cell">#{{ order.id }}</td>
            <td class="table-cell">{{ order.customerName }}</td>
            <td class="table-cell">{{ order.total }} ر.س</td>
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

    <!-- Pagination -->
    <div class="mt-4 flex justify-center">
      <nav
        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          السابق
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          التالي
        </button>
      </nav>
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
import { ref, computed } from "vue";
import { RefreshCw } from "lucide-vue-next";

definePageMeta({
    layout:"admin"
})

const orders = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const showStatusModal = ref(false);
const selectedOrder = ref(null);
const newStatus = ref("");

const totalSales = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.total, 0).toFixed(2);
});

const totalOrders = computed(() => orders.value.length);

const totalPages = computed(() =>
  Math.ceil(orders.value.length / itemsPerPage)
);
const displayedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return orders.value.slice(start, end);
});

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
    // TODO: Call API to update order status
    const index = orders.value.findIndex(
      (o) => o.id === selectedOrder.value.id
    );
    orders.value[index] = {
      ...selectedOrder.value,
      status: newStatus.value,
    };
  }
  showStatusModal.value = false;
  selectedOrder.value = null;
  newStatus.value = "";
}
</script>
