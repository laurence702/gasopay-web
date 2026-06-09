<template>
  <div>
    <PageHeader title="Order History">
      <!-- Action Buttons (Optional: Add search, filter, export later) -->
      <template #actions>
        <div class="flex items-center space-x-2">
          <input type="text" placeholder="Search orders..." class="input input-sm input-bordered" />
          <button class="btn btn-sm btn-outline">Filter</button>
          <button class="btn btn-sm btn-primary">Export</button>
        </div>
      </template>
    </PageHeader>

    <div class="mt-6">
      <BaseTable
        :columns="columns"
        :data="orders"
        :is-loading="isLoading"
        :total-items="totalItems"
        :has-actions="true"
        :items-per-page="10"
        :current-page="1"
        @update:currentPage="(page) => console.log('Page changed:', page)"
      >
        <!-- Custom cell templates -->
        <template #cell(status)="{ row }">
          <span
            :class="getStatusBadgeClass(row.status as string)"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell(amount)="{ row }">
          <span>{{ formatCurrency(row.amount as number) }}</span>
        </template>

        <template #cell(order_date)="{ row }">
          <span>{{ formatDate(row.order_date as string) }}</span>
        </template>

        <!-- Action buttons -->
        <template #actions="{ row }">
          <button
            @click="viewOrderDetails(row.id as string)"
            class="btn btn-xs btn-ghost text-blue-500 hover:bg-blue-100"
            title="View Details"
          >
            <!-- Eye Icon or similar -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import BaseTable from '@/components/common/BaseTable.vue';
// import type { ColumnDefinition } from '@/components/common/BaseTable.vue'; // Assuming type export

// Define local types until BaseTable export is fixed
interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
  // Add other potential properties if needed
}

interface Order {
  id: string;
  order_date: string;
  rider_name: string;
  customer_name: string;
  amount: number;
  status: string;
}

// --- State ---
const isLoading = ref(false);
const orders = ref<Order[]>([ // Use Order interface
  { id: 'ORD-001', order_date: '2024-05-20T10:30:00Z', rider_name: 'John Doe', customer_name: 'Alice Smith', amount: 5500, status: 'Delivered' },
  { id: 'ORD-002', order_date: '2024-05-19T14:15:00Z', rider_name: 'Jane Roe', customer_name: 'Bob Johnson', amount: 3200, status: 'Pending' },
  { id: 'ORD-003', order_date: '2024-05-19T09:00:00Z', rider_name: 'John Doe', customer_name: 'Charlie Brown', amount: 7800, status: 'Cancelled' },
  { id: 'ORD-004', order_date: '2024-05-18T16:45:00Z', rider_name: 'Peter Pan', customer_name: 'Wendy Darling', amount: 4100, status: 'Delivered' },
]);

// Compute total items for pagination
const totalItems = computed(() => orders.value.length);

// --- Table Columns ---
const columns = ref<ColumnDefinition[]>([
  { key: 'id', label: 'Order ID' },
  { key: 'order_date', label: 'Date' },
  { key: 'rider_name', label: 'Rider' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]);


// --- Helper Functions ---
const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return 'N/A';
  return `₦${value.toLocaleString()}`;
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

// --- Actions ---
const viewOrderDetails = (orderId: string) => {
  console.log('View details for order:', orderId);
  // TODO: Implement navigation or modal display for order details
  alert(`Viewing details for Order ${orderId} (Not Implemented)`);
};

// TODO: Fetch real data on component mount
</script>

<style scoped>
/* Add component-specific styles if needed */
.input {
  /* Basic styling for input - enhance as needed */
  padding: 0.5rem;
  border-radius: 0.375rem; /* rounded-md */
}
.btn {
   /* Basic styling for button - enhance as needed */
  padding: 0.5rem 1rem;
  border-radius: 0.375rem; /* rounded-md */
  font-weight: 500; 
  transition: background-color 0.2s;
}

/* Add Tailwind utility classes directly or define custom styles */
</style> 