<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Global Transactions">
       <template #actions>
         <!-- Placeholder for Filters/Search/Export -->
         <div class="flex items-center space-x-2">
            <input type="text" placeholder="Search Txn ID or User..." class="form-input form-input-sm w-48">
            <button class="btn btn-secondary">Filter</button>
            <button class="btn btn-outline">Export</button>
         </div>
       </template>
    </PageHeader>

    <BaseTable
      :columns="columns"
      :data="transactions"
      :loading="loading"
      :totalItems="transactions.length"
      :showPagination="true"
    >
      <!-- Client-side for now -->
       <!-- Custom Status Cell -->
      <template #cell-status="{ row }">
        <span
          :class="[
            'px-2 py-0.5 rounded text-xs font-medium capitalize',
             getStatusClass(row.status as string)
          ]"
        >
          {{ (row.status as string)?.replace('_', ' ') }}
        </span>
      </template>

       <!-- Custom Amount Cell -->
       <template #cell-amount="{ value }">
           {{ formatCurrency(value as number) }}
       </template>

        <!-- Custom Date Cell -->
       <template #cell-date="{ value }">
           {{ formatDate(value as string) }}
       </template>

       <!-- Actions -->
      <template #actions="{ row }">
        <div class="flex justify-end space-x-2">
          <button @click="viewTransaction(row.id as string)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">View</button>
        </div>
      </template>
    </BaseTable>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import BaseTable from '@/components/common/BaseTable.vue';
import transactionsData from '@/mockData/transactions.json';

const loading = ref(false);
const transactions = ref(transactionsData);

const columns = ref([
  { key: 'id', label: 'Txn ID', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'userName', label: 'User Name', sortable: true },
  { key: 'branchName', label: 'Branch', sortable: true },
  { key: 'productName', label: 'Product' },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]);

// Helper to get status badge class
const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
    case 'pending approval':
    case 'pending_payment':
    case 'pending payment':
       return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Helper function for currency formatting
const formatCurrency = (value: number | unknown): string => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

// Helper function for date formatting
const formatDate = (dateString: string | unknown): string => {
  if (typeof dateString !== 'string' || !dateString) return 'Invalid Date';
  try {
       const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
       return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
       return 'Invalid Date';
  }
};

// Action Handlers
const viewTransaction = (id: string) => {
  console.log('View Transaction:', id);
  alert('View transaction details functionality not implemented yet.');
}

</script>
