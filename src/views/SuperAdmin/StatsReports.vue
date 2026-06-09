<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Stats & Reports">
       <!-- Actions like date range filter can be added later -->
    </PageHeader>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <!-- Overall Transactions Card -->
      <div class="stats-card">
        <h4 class="stats-title">Total Transactions</h4>
        <p class="stats-value">{{ totalTransactions }}</p>
        <p class="stats-description">All transactions recorded</p>
      </div>

      <!-- Total Sales Summary Card -->
      <div class="stats-card">
        <h4 class="stats-title">Total Sales</h4>
        <p class="stats-value">{{ formatCurrency(totalSalesAmount) }}</p>
        <p class="stats-description">Sum of all completed transactions</p>
      </div>

      <!-- User Registrations Card -->
      <div class="stats-card">
        <h4 class="stats-title">User Registrations</h4>
        <p class="stats-value">{{ userRegistrations }}</p> <!-- Placeholder value -->
        <p class="stats-description">Total registered users</p>
      </div>

      <!-- Add more stat cards as needed -->
    </div>

    <!-- Placeholder for detailed reports/charts -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold mb-4">Detailed Reports</h3>
        <p class="text-gray-600 dark:text-gray-400">Detailed reports and charts will be added here.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import transactionsData from '@/mockData/transactions.json';

// Define an interface for transaction data if not already globally defined
interface Transaction {
  id: string;
  date: string;
  userId: string;
  userName: string;
  userRole: string;
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  amount: number;
  paymentMethod: string;
  status: string;
}

const transactions = ref<Transaction[]>(transactionsData);

// Calculate stats from mock data
const totalTransactions = computed(() => transactions.value.length);

const totalSalesAmount = computed(() => {
  return transactions.value
    .filter(tx => tx.status.toLowerCase() === 'completed') // Only count completed transactions for sales
    .reduce((sum, tx) => sum + tx.amount, 0);
});

// Placeholder for user registrations - replace with actual data later
const userRegistrations = ref(152); // Example static value

// Currency formatting helper
const formatCurrency = (value: number | unknown): string => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

</script> 