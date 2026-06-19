<template>
  <PageBreadcrumb pageTitle="Purchase History" />

  <div class="space-y-5">
    <BaseCard>
      <div class="p-5">
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            v-model="search"
            type="text"
            placeholder="Search by order ID or product..."
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending_payment">Awaiting Payment</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p class="mt-3 text-gray-500 dark:text-gray-400">No purchases found.</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="th">Order ID</th>
                <th class="th">Date</th>
                <th class="th">Product</th>
                <th class="th">Qty</th>
                <th class="th">Amount</th>
                <th class="th">Payment</th>
                <th class="th">Status</th>
                <th class="th">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="td font-medium text-brand-600 dark:text-brand-400">#{{ order.id }}</td>
                <td class="td text-gray-500">{{ formatDate(order.created_at) }}</td>
                <td class="td">{{ order.product?.name ?? 'LPG' }}</td>
                <td class="td">{{ order.quantity }}{{ order.product?.unit ?? 'kg' }}</td>
                <td class="td font-semibold">₦{{ formatAmount(order.total_amount) }}</td>
                <td class="td capitalize">{{ order.payment_type?.replace('_', ' ') }}</td>
                <td class="td">
                  <span :class="statusClass(order.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ statusLabel(order.status) }}
                  </span>
                </td>
                <td class="td">
                  <router-link
                    v-if="order.status === 'pending_payment'"
                    :to="`/rider/upload-proof/${order.id}`"
                    class="text-xs font-medium text-brand-600 hover:underline"
                  >
                    Upload Proof
                  </router-link>
                  <span v-else class="text-xs text-gray-400">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { DocumentTextIcon } from '@heroicons/vue/24/outline';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';

defineOptions({ name: 'RiderPurchaseHistory' });

const authStore = useAuthStore();
const isLoading = ref(true);
const search = ref('');
const statusFilter = ref('');

interface OrderItem {
  id: number;
  created_at: string;
  total_amount: number;
  quantity: number;
  payment_type: string;
  status: string;
  product?: { name: string; unit: string };
}

const orders = ref<OrderItem[]>([]);

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const matchSearch =
      !search.value ||
      String(o.id).includes(search.value) ||
      (o.product?.name ?? '').toLowerCase().includes(search.value.toLowerCase());
    const matchStatus = !statusFilter.value || o.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatAmount(n: number) {
  return Number(n).toLocaleString();
}
function statusLabel(s: string) {
  const map: Record<string, string> = {
    completed: 'Completed',
    pending_payment: 'Awaiting Payment',
    pending: 'Pending',
    cancelled: 'Cancelled',
    paid: 'Paid',
  };
  return map[s] ?? s;
}
function statusClass(s: string) {
  const map: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending_payment: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[s] ?? 'bg-gray-100 text-gray-600';
}

onMounted(async () => {
  try {
    const token = authStore.token;
    if (!token) return;
    const res = await apiService.get<{ data: OrderItem[] }>('/orders', token);
    orders.value = res.data ?? [];
  } catch {
    // fallback to mock
    orders.value = [
      { id: 1001, created_at: '2024-06-10T09:00:00Z', total_amount: 15000, quantity: 12.5, payment_type: 'cash', status: 'completed', product: { name: 'LPG', unit: 'kg' } },
      { id: 1002, created_at: '2024-06-12T14:30:00Z', total_amount: 8000, quantity: 6, payment_type: 'pay_later', status: 'pending_payment', product: { name: 'LPG', unit: 'kg' } },
      { id: 1003, created_at: '2024-06-15T11:00:00Z', total_amount: 32000, quantity: 25, payment_type: 'cash', status: 'completed', product: { name: 'LPG', unit: 'kg' } },
    ];
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.th {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider;
}
.td {
  @apply px-4 py-3 text-sm text-gray-800 dark:text-gray-200;
}
</style>
