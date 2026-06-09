<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Super Admin Dashboard" />

    <!-- Loading and Error States -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>
    <div v-else-if="fetchError" class="text-center text-error-500 py-10">
      Error loading dashboard data: {{ fetchError }}
    </div>

    <div v-else>
    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <StatsCard
        title="Total Income"
        :value="formatCurrency(stats.totalIncome)"
        change="+12.5%"
        changeType="increase"
      />
       <StatsCard
        title="Total Outstanding Debts"
        :value="formatCurrency(stats.totalDebt)"
        viewLink="/admin/debts"
      />
       <StatsCard
        title="Total Transactions"
        :value="stats.totalTransactions"
        change="-1.8%"
        changeType="decrease"
      />
       <StatsCard
        title="Active Riders"
        :value="stats.activeRiders"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6">
       <div class="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Income Overview</h3>
          <VueApexCharts
            type="line"
            height="350"
            :options="incomeChartOptions"
            :series="incomeChartSeries"
          ></VueApexCharts>
       </div>
       <div class="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
         <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Branch Performance</h3>
          <VueApexCharts
            type="bar"
            height="350"
            :options="branchChartOptions"
            :series="branchChartSeries"
          ></VueApexCharts>
       </div>
    </div>

      <!-- Recent Orders Section -->
      <div class="mt-6 p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h3 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
        <div v-if="recentOrders.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
          No recent orders found.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Payer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Branch</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ order.id.substring(0, 8) }}...</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" :src="getProductImage(order.product?.name || '')" alt="Product image">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ order.product?.name || 'N/A' }}</div>
                      <div class="text-sm text-gray-500">{{ order.product?.unit ? order.product.unit + ' units' : 'N/A units' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ order.product?.category || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatCurrency(order.amount_due) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ order.status || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" :src="order.payer?.image || 'https://via.placeholder.com/150'" alt="Payer image">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ order.payer?.fullname || 'N/A' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ order.branch?.name || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import StatsCard from '@/components/common/StatsCard.vue';
// Import chart component
import VueApexCharts from 'vue3-apexcharts';
import apiService, { type DashboardSummaryResponse, type ApiOrder, type ApiProduct, type BranchData } from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';

// Mock Stats Data
const stats = ref({
  totalIncome: 0,
  totalDebt: 0,
  totalTransactions: 0,
  activeRiders: 0,
});

const authStore = useAuthStore();
const loading = ref(true);
const fetchError = ref<string | null>(null);
const recentOrders = ref<ApiOrder[]>([] as ApiOrder[]);

// Helper function for currency formatting (adjust as needed)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

const getProductImage = (productName: string) => {
  const name = productName.toLowerCase();
  if (name.includes('lpg')) {
    return '@/assets/images/products/lpg.png';
  } else if (name.includes('pms')) {
    return '@/assets/images/products/pms.png';
  } else if (name.includes('cng')) {
    return '@/assets/images/products/cng.png';
  } else {
    return '@/assets/images/products/default.png'; // A default image
  }
};

// --- Chart Data and Options ---

// Income Overview Chart (Line)
const incomeChartOptions = ref({
  chart: {
    id: 'income-overview-chart',
    type: 'line',
    height: 350,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  xaxis: {
    categories: [],
    labels: { style: { colors: '#8E95A9' } } // Adjust label color for dark mode potentially
  },
  yaxis: {
    title: { text: 'Income (NGN)' },
     labels: { style: { colors: '#8E95A9' } }
  },
   stroke: {
     curve: 'smooth'
   },
    markers: {
      size: 4
    },
     tooltip: {
       theme: 'dark' // Or use a computed prop based on uiStore dark mode
     },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
       theme: {
         mode: 'light' // TODO: Link this to dark mode state
       }
});

const incomeChartSeries = ref([
  {
    name: 'Total Income',
    data: [],
  },
]);

// Branch Performance Chart (Bar)
const branchChartOptions = ref({
  chart: {
    id: 'branch-performance-chart',
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: { enabled: false }, // Keep it clean
  xaxis: {
    categories: [],
     labels: { style: { colors: '#8E95A9' } }
  },
  yaxis: {
    title: { text: 'Transactions' },
     labels: { style: { colors: '#8E95A9' } }
  },
  tooltip: {
     theme: 'dark'
   },
    grid: {
      borderColor: '#e7e7e7',
      row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
    },
     theme: {
       mode: 'light' // TODO: Link this to dark mode state
     }
});

const branchChartSeries = ref([
  {
    name: 'Transaction Volume',
    data: [],
  },
]);

onMounted(async () => {
  await fetchDashboardData();
});

interface MonthlySale {
  month: number;
  total_sales: number;
}

async function fetchDashboardData() {
  if (!authStore.token) {
    fetchError.value = "Authentication token not found. Cannot fetch dashboard data.";
    loading.value = false;
    return;
  }

  loading.value = true;
  fetchError.value = null;
  try {
    const response = await apiService.get<DashboardSummaryResponse>('/dashboard/summary', authStore.token);
    const data = response.data;

    stats.value.totalIncome = data.total_income;
    stats.value.totalDebt = data.total_debt;
    // Assuming totalTransactions and activeRiders would come from other endpoints or be calculated from recent_orders
    // For now, let's derive totalTransactions from recentOrders if available, or set to 0
    stats.value.totalTransactions = data.recent_orders.length; // Placeholder
    stats.value.activeRiders = 0; // Placeholder until we have user count logic

    // Update Income Chart
    const sortedMonthlySales = data.monthly_sales.sort((a: MonthlySale, b: MonthlySale) => a.month - b.month);
    incomeChartOptions.value.xaxis.categories = sortedMonthlySales.map((sale: MonthlySale) => new Date(2000, sale.month - 1, 1).toLocaleString('default', { month: 'short' }));
    incomeChartSeries.value[0].data = sortedMonthlySales.map((sale: MonthlySale) => sale.total_sales);

    // Update Recent Orders for potential display (though not directly used in template yet)
    recentOrders.value = data.recent_orders;

    // Placeholder for Branch Performance Chart - assuming no direct data for this yet
    // We'd need branch-specific sales data from the API for a proper bar chart
    branchChartOptions.value.xaxis.categories = ['Branch A', 'Branch B', 'Branch C', 'Branch D', 'Branch E']; // Example branches
    branchChartSeries.value[0].data = [0, 0, 0, 0, 0]; // Default to zeros for now

  } catch (error: unknown) {
    console.error("Failed to fetch dashboard data:", error);
    fetchError.value = error instanceof Error ? error.message : "An unknown error occurred while fetching dashboard data.";
  } finally {
    loading.value = false;
  }
}

// TODO: Make chart theme dynamic based on dark mode
// import { useUiStore } from '@/stores/ui';
// const uiStore = useUiStore();
// const chartTheme = computed(() => uiStore.isDarkMode ? 'dark' : 'light');
// Watch chartTheme and update chart options dynamically or pass theme prop

</script> 