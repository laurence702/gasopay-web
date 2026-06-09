<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  
  <div class="space-y-5">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="space-y-5">
      <BaseCard>
        <div class="flex flex-col items-center justify-center p-10 text-center">
          <ExclamationCircleIcon class="h-16 w-16 text-error-500 mb-4" />
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">Error Loading Orders</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">{{ error }}</p>
          <button
            @click="() => fetchOrders(1)"
            class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
          >
            Try Again
          </button>
        </div>
      </BaseCard>
    </div>
    
    <!-- Content -->
    <div v-else>
      <!-- Filters Card -->
      <BaseCard class="mb-5">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Filters</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Filter by Rider -->
            <div>
              <label for="rider-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rider Name/ID
              </label>
              <input
                id="rider-filter"
                v-model="filters.riderId"
                type="text"
                placeholder="Search by rider name or ID"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <!-- Filter by Status -->
            <div>
              <label for="status-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Status
              </label>
              <select
                id="status-filter"
                v-model="filters.status"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <!-- Filter by Start Date -->
            <div>
              <label for="start-date-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                id="start-date-filter"
                v-model="filters.startDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <!-- Filter by End Date -->
            <div>
              <label for="end-date-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                id="end-date-filter"
                v-model="filters.endDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <!-- Apply/Reset Filters -->
          <div class="flex justify-end mt-4">
            <button
              @click="resetFilters"
              class="px-4 py-2 mr-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
            <button
              @click="applyFilters"
              class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </BaseCard>
      
      <!-- Orders Table -->
      <BaseCard>
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Orders</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Total: {{ totalOrders }} orders
            </div>
          </div>
          
          <!-- No Orders Message -->
          <div v-if="orders.length === 0" class="flex flex-col items-center justify-center py-10">
            <ShoppingCartIcon class="h-12 w-12 text-gray-400 mb-3" />
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">No Orders Found</h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ filters.applied ? 'Try adjusting your filters' : 'No orders have been placed yet' }}
            </p>
          </div>
          
          <!-- Orders Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rider
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ order.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {{ getInitials(order.payer?.fullname || 'Unknown') }}
                        </span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ order.payer?.fullname || 'Unknown' }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          ID: {{ order.payer?.id || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ capitalizeFirstLetter(order.payments[0]?.order_product_type?.name) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>₦{{ formatAmount(order.amount_due) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ capitalizeFirstLetter(order.payments[0]?.payment_method) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="{
                        'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': order.status === 'completed',
                        'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': order.status === 'pending',
                        'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400': order.status === 'processing',
                        'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': order.status === 'failed'
                      }"
                    >
                      {{ capitalizeFirstLetter(order.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(order.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <router-link 
                      v-if="order.payments && order.payments.length > 0"
                      :to="`/admin/rider-profile/${order.payments[0].payer_id}`" 
                      class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      View Rider
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div v-if="orders.length > 0 && pagination.total" class="flex justify-between items-center mt-6">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }} orders
            </div>
            <div class="flex space-x-2">
              <button
                @click="previousPage"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!pagination.current_page || pagination.current_page === 1"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!pagination.current_page || !pagination.last_page || pagination.current_page === pagination.last_page"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore, Role } from '@/stores/auth';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { ExclamationCircleIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline';
import apiService from '@/services/apiService';

// Define interfaces for Order and API response
interface Payer {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  verification_status: string;
  verified_by: null | string;
  branch_id: number;
  balance: number;
  banned_at: null | string;
  ban_reason: null | string;
  ip_address: null | string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

interface Product {
  id: number;
  name: string;
  unit: string;
  description: string;
  category: string;
  price: string;
  rules: number[];
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

interface Payment {
  id: string;
  order_id: string;
  order_product_type: Product;
  order_branch_name: string;
  order_total_amount_due: string;
  order_payment_type: string;
  payer_id: string;
  payer_name: string;
  transaction_amount: string;
  payment_method: string;
  status: string;
  reference: string;
  approved_by_id: null | string;
  approved_by_name: null | string;
  approved_at: null | string;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  payer: Payer;
  branch: null | any; // Replace 'any' with a proper Branch interface if available
  payments: Payment[];
  quantity: null | number;
  amount_due: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  from: number | null;
  to: number | null;
  total: number;
  last_page: number;
}

interface ApiResponse {
  data: Order[];
  meta: PaginationMeta;
}

const authStore = useAuthStore();
const user = authStore.currentUser;

const currentPageTitle = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN ? 'Admin Order Overview' : 'Order History';

const orders = ref<Order[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const pagination = ref<Partial<PaginationMeta>>({});
const totalOrders = ref(0);

const filters = reactive({
  riderId: '',
  status: '',
  startDate: '',
  endDate: '',
  applied: false
});

const fetchOrders = async (page = 1) => {
    isLoading.value = true;
    error.value = null;
  pagination.value = { current_page: 1, from: 0, to: 0, total: 0, last_page: 1 }; 
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', '15'); 

    if (filters.riderId) queryParams.append('rider_id', filters.riderId);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('start_date', filters.startDate);
    if (filters.endDate) queryParams.append('end_date', filters.endDate);

    const endpoint = `/branch-admin/orders/history?${queryParams.toString()}`;
    
    const currentToken = authStore.token;
    if (!currentToken) {
        error.value = 'Authentication token not found. Please log in again.';
        isLoading.value = false;
        return;
      }

    const response = await apiService.get<ApiResponse>(endpoint, currentToken);
    
    orders.value = response.data;
    if (response.meta) {
      pagination.value = response.meta;
      totalOrders.value = response.meta.total;
    } else {
      // Handle case where meta is not in the response
      pagination.value = {};
      totalOrders.value = response.data.length;
    }
    
  } catch (err: unknown) {
    console.error('Error fetching orders:', err);
    if (err instanceof Error) {
        error.value = err.message;
    } else {
        error.value = 'An unknown error occurred while fetching orders.';
    }
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  filters.applied = true;
  fetchOrders(1);
};

const resetFilters = () => {
  filters.riderId = '';
  filters.status = '';
  filters.startDate = '';
  filters.endDate = '';
  filters.applied = false;
  fetchOrders(1);
};

onMounted(() => {
  fetchOrders();
});

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const formatAmount = (amount: string | undefined) => {
  if (amount === undefined || amount === null) return '0.00';
  return parseFloat(amount).toFixed(2);
};

const capitalizeFirstLetter = (string: string | undefined) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getInitials = (name: string | undefined) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('');
};

const previousPage = () => {
  if (pagination.value.current_page && pagination.value.current_page > 1) {
    fetchOrders(pagination.value.current_page - 1);
  }
};

const nextPage = () => {
  if (pagination.value.current_page && pagination.value.last_page && pagination.value.current_page < pagination.value.last_page) {
    fetchOrders(pagination.value.current_page + 1);
  }
};
</script> 