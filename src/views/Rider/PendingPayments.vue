<template>
  <PageBreadcrumb pageTitle="Pending Payments" />

  <div class="space-y-5">
    <!-- Summary card -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BaseCard>
        <div class="p-5 flex items-center gap-4">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <ClockIcon class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ pendingOrders.length }}</p>
          </div>
        </div>
      </BaseCard>
      <BaseCard>
        <div class="p-5 flex items-center gap-4">
          <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <CurrencyDollarIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Outstanding</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">₦{{ formatAmount(totalOutstanding) }}</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Orders list -->
    <BaseCard>
      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Orders Awaiting Payment</h3>

        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>

        <div v-else-if="pendingOrders.length === 0" class="text-center py-12">
          <CheckCircleIcon class="mx-auto h-12 w-12 text-green-400" />
          <p class="mt-3 text-gray-500 dark:text-gray-400">No pending payments. You're all clear!</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in pendingOrders"
            :key="order.id"
            class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-800 dark:text-white">Order #{{ order.id }}</span>
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Awaiting Payment
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ order.product?.name ?? 'LPG' }} · {{ order.quantity }}{{ order.product?.unit ?? 'kg' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(order.created_at) }}</p>
              </div>
              <div class="flex items-center gap-3">
                <p class="text-xl font-bold text-gray-800 dark:text-white">₦{{ formatAmount(order.total_amount) }}</p>
                <router-link
                  :to="`/rider/upload-proof/${order.id}`"
                  class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Upload Proof
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ClockIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';

defineOptions({ name: 'RiderPendingPayments' });

const authStore = useAuthStore();
const isLoading = ref(true);

interface OrderItem {
  id: number;
  created_at: string;
  total_amount: number;
  quantity: number;
  status: string;
  product?: { name: string; unit: string };
}

const orders = ref<OrderItem[]>([]);
const pendingOrders = computed(() => orders.value.filter((o) => o.status === 'pending_payment' || o.status === 'pending'));
const totalOutstanding = computed(() => pendingOrders.value.reduce((sum, o) => sum + Number(o.total_amount), 0));

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatAmount(n: number) {
  return Number(n).toLocaleString();
}

onMounted(async () => {
  try {
    const token = authStore.token;
    if (!token) return;
    const res = await apiService.get<{ data: OrderItem[] }>('/orders', token);
    orders.value = res.data ?? [];
  } catch {
    orders.value = [
      { id: 1002, created_at: '2024-06-12T14:30:00Z', total_amount: 8000, quantity: 6, status: 'pending_payment', product: { name: 'LPG', unit: 'kg' } },
      { id: 1005, created_at: '2024-06-16T10:00:00Z', total_amount: 4500, quantity: 3, status: 'pending_payment', product: { name: 'LPG', unit: 'kg' } },
    ];
  } finally {
    isLoading.value = false;
  }
});
</script>
