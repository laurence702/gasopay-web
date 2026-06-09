<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div v-if="showWelcome" class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 relative">
      <button 
        @click="showWelcome = false" 
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        aria-label="Close welcome message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome, {{ authStore.currentUser?.fullname || 'User' }}!</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Here's your dashboard. Manage your fuel orders and view your history.</p>
    </div>

    <!-- Buy LPG Section -->
    <div class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 flex flex-col md:flex-row items-center gap-6">
      <div class="w-full md:w-1/3">
        <img src="@/assets/images/lpg-truck.png" alt="LPG Gas Truck" class="rounded-lg object-cover w-full h-full">
      </div>
      <div class="w-full md:w-2/3 text-center md:text-left">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Get Your Cooking Gas Delivered</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Order LPG cooking gas and have it delivered to your doorstep quickly and safely.</p>
        <button @click="showPaymentModal = true" class="mt-4 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75">
          Buy Now
        </button>
      </div>
    </div>


    <!-- Recent Orders -->
    <div class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        <router-link to="/dashboard/order-history" class="text-sm font-medium text-orange-600 hover:underline">View All</router-link>
      </div>
      <div v-if="loadingOrders" class="mt-4 text-center text-gray-500 dark:text-gray-400">Loading orders...</div>
      <div v-else-if="orderError" class="mt-4 text-center text-red-500">{{ orderError }}</div>
      <div v-else-if="orders.length === 0" class="mt-4 text-center text-gray-500 dark:text-gray-400">You have no recent orders.</div>
      <ul v-else class="mt-4 space-y-4">
        <li v-for="order in orders.slice(0, 5)" :key="order.id" class="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
          <div class="flex justify-between">
            <div>
              <p class="font-semibold text-gray-800 dark:text-white">Order #{{ order.id }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ new Date(order.created_at).toLocaleDateString() }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600 dark:text-green-400">NGN {{ order.total_amount }}</p>
              <p class="text-sm capitalize" :class="orderStatusClass(order.status)">{{ order.status }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <PaymentModal :isOpen="showPaymentModal" :products="lpgProducts" @close="showPaymentModal = false" @order-successful="handleOrderSuccess" />
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import PaymentModal from '@/components/modals/PaymentModal.vue';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';
import type { Order, Product } from '@/types';

const authStore = useAuthStore();
const showPaymentModal = ref(false);
const showWelcome = ref(true);
const loadingOrders = ref(false);
const orderError = ref('');
const orders = ref<Order[]>([]);

// MOCK DATA to bypass API auth issue
const lpgProducts = computed<Product[]>(() => [
  {
    id: 'prod_lpg_12kg',
    name: 'LPG',
    description: '12.5kg Cylinder',
    price: 15000, // Price for the base unit
    category: 'LPG',
    unit: 'kg',
  },
  {
    id: 'prod_lpg_25kg',
    name: 'LPG',
    description: '25kg Cylinder',
    price: 28000,
    category: 'LPG',
    unit: 'kg',
  },
]);

watchEffect(async () => {
  console.log('UserDashboard component mounted.');
  if (!authStore.isInitialized) {
    return;
  }

  const token = authStore.token;
  console.log('Auth token:', token);

  if (!token) {
    orderError.value = 'Authentication required. Please log in.';
    loadingOrders.value = false;
    return;
  }

  try {
    loadingOrders.value = true;
    // Removed product fetch: await productStore.fetchProducts();
    const ordersResponse = await apiService.get<{ data: Order[] }>('/orders', token);
    orders.value = ordersResponse.data;
  } catch (error) {
    orderError.value = 'Failed to load dashboard data. Please try again later.';
    console.error('Error fetching data:', error);
  } finally {
    loadingOrders.value = false;
  }
});

const orderStatusClass = (status: Order['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-500';
    case 'pending':
      return 'text-yellow-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};
const handleOrderSuccess = () => {
  showPaymentModal.value = false;
  // Optionally, refresh the orders list
};
</script>
