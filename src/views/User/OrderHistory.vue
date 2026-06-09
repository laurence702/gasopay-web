<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">My Orders</h1>

    <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <div v-if="loading" class="text-center py-10">Loading order history...</div>
      <div v-if="error" class="text-center py-10 text-red-500">{{ error }}</div>

      <div v-if="!loading && !error">
        <div v-if="orders.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
          You haven't placed any orders yet.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Order ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Product</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <tr v-for="order in orders" :key="order.id">
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">#{{ order.id.substring(0, 8) }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{{ order.product ? order.product.name : 'N/A' }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">₦{{ Number(order.amount_due).toLocaleString() }}</td>
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" :class="orderStatus(order.payment_status).badgeClass">
                    {{ order.payment_status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ new Date(order.created_at).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getOrders } from '@/services/apiService';
import type { ApiUserOrder } from '@/services/apiService';

export default defineComponent({
  name: 'OrderHistory',
  setup() {
    const authStore = useAuthStore();
    const orders = ref<ApiUserOrder[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const fetchOrders = async () => {
      const token = authStore.token;
      if (!token) {
        error.value = 'Authentication token not found.';
        loading.value = false;
        return;
      }

      try {
        loading.value = true;
        const orderData = await getOrders(token);
        orders.value = orderData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } catch (err) {
        error.value = 'Failed to load order history. Please try again later.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const orderStatus = (status: ApiUserOrder['payment_status']) => {
      switch (status) {
        case 'Paid':
          return { badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
        case 'Pending':
          return { badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
        case 'Failed':
        case 'Cancelled':
          return { badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
        default:
          return { badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
      }
    };

    onMounted(fetchOrders);

    return {
      orders,
      loading,
      error,
      orderStatus,
    };
  },
});
</script>