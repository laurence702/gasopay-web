<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {{ authStore.currentUser?.fullname || 'User' }}!</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Here's your dashboard. Manage your fuel orders and view your history.</p>
    </div>

    <!-- Available Products -->
    <div class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Available Products</h2>
      <div v-if="loadingProducts" class="text-center text-gray-500 dark:text-gray-400">Loading products...</div>
      <div v-else-if="productError" class="text-center text-red-500">{{ productError }}</div>
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="product in products" :key="product.id" class="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white">{{ product.name }}</h3>
          <p class="text-gray-600 dark:text-gray-300">{{ product.description }}</p>
          <p class="mt-2 font-semibold text-green-600 dark:text-green-400">Price: NGN {{ product.price }}</p>
        </div>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';
import type { Product, Order } from '@/types';

const authStore = useAuthStore();

const products = ref<Product[]>([]);
const orders = ref<Order[]>([]);
const loadingProducts = ref(true);
const productError = ref<string | null>(null);
const loadingOrders = ref(true);
const orderError = ref<string | null>(null);

onMounted(async () => {
  try {
    loadingProducts.value = true;
    const response = await apiService.get<{ data: Product[] }>('/products');
    products.value = response.data;
  } catch (error) {
    productError.value = 'Failed to load products.';
    console.error(error);
  } finally {
    loadingProducts.value = false;
  }

  try {
    loadingOrders.value = true;
    const response = await apiService.get<{ data: Order[] }>('/orders');
    orders.value = response.data;
  } catch (error) {
    orderError.value = 'Failed to load orders.';
    console.error(error);
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
</script>