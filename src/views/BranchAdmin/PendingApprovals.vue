<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div class="space-y-5">
    <BaseCard>
      <div class="p-5">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Pending Payment Approvals</h2>
          <!-- Add any filters if needed later, e.g., by date range -->
        </div>

        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>

        <div v-else-if="error" class="text-center py-10">
          <ExclamationCircleIcon class="mx-auto h-12 w-12 text-error-500" />
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Could not load approvals</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
          <button @click="() => fetchPendingApprovals()" class="mt-4 px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
            Try Again
          </button>
        </div>

        <div v-else-if="pendingApprovals.length === 0" class="text-center py-10">
          <CheckCircleIcon class="mx-auto h-12 w-12 text-success-500" />
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Pending Approvals</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">All payment proofs are up to date.</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="approval in pendingApprovals" 
            :key="approval.id" 
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div class="flex-1 mb-4 sm:mb-0">
                <div class="flex items-center mb-2">
                  <UserCircleIcon class="h-6 w-6 text-gray-500 dark:text-gray-400 mr-2" />
                  <h4 class="text-lg font-semibold text-brand-600 dark:text-brand-400">
                    Rider: {{ approval.rider_name || 'N/A' }} ({{ approval.rider_id }})
                  </h4>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  <span class="font-medium">Order ID:</span> {{ approval.order_id }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  <span class="font-medium">Amount:</span> ₦{{ formatAmount(approval.amount) }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  <span class="font-medium">Payment Method:</span> {{ capitalizeFirstLetter(approval.payment_method) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-medium">Submitted:</span> {{ formatDate(approval.submitted_at) }}
                </p>
              </div>

              <div class="flex-shrink-0 w-full sm:w-auto sm:ml-6">
                <div v-if="approval.proof_url" class="mb-3">
                  <a :href="approval.proof_url" target="_blank" class="text-sm text-brand-500 hover:underline flex items-center">
                    <EyeIcon class="h-4 w-4 mr-1" /> View Payment Proof
                  </a>
                </div>
                <div v-else class="mb-3 text-sm text-gray-400 italic">
                  No proof uploaded.
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="handleApproval(approval.id, 'approved')" 
                    :disabled="approval.isProcessing"
                    class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-success-500 rounded-md hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <CheckIcon class="h-4 w-4 mr-1.5" /> Approve
                  </button>
                  <button 
                    @click="handleApproval(approval.id, 'rejected')" 
                    :disabled="approval.isProcessing"
                    class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-error-500 rounded-md hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <XMarkIcon class="h-4 w-4 mr-1.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
            <div v-if="approval.statusMessage" :class="['mt-3 text-sm p-2 rounded-md', approval.statusMessageType === 'success' ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400' : 'bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400']">
              {{ approval.statusMessage }}
            </div>
          </div>
        </div>

        <!-- Pagination (if API supports it) -->
        <div v-if="!isLoading && pendingApprovals.length > 0 && pagination.total_pages > 1" class="flex justify-between items-center mt-6">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Showing page {{ pagination.current_page }} of {{ pagination.total_pages }}
            </div>
            <div class="flex space-x-2">
              <button
                @click="fetchPendingApprovals(pagination.current_page - 1)"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="pagination.current_page === 1"
              >
                Previous
              </button>
              <button
                @click="fetchPendingApprovals(pagination.current_page + 1)"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="pagination.current_page === pagination.total_pages"
              >
                Next
              </button>
            </div>
          </div>

      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import apiService from '@/services/apiService';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserCircleIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

defineOptions({
  name: 'PendingApprovals'
});

const currentPageTitle = ref('Pending Approvals');
const authStore = useAuthStore();

interface PendingApprovalItem {
  id: string;
  rider_id: string;
  rider_name?: string; 
  order_id: string;
  amount: number;
  payment_method: string;
  proof_url?: string;
  submitted_at: string;
  isProcessing?: boolean; 
  statusMessage?: string; 
  statusMessageType?: 'success' | 'error';
}

// ApiMeta is not used by the mock implementation, 
// but would be used if a real API call with metadata is implemented.
// interface ApiMeta {
//   current_page: number;
//   last_page: number;
//   total: number;
//   from: number;
//   to: number;
//   per_page: number;
// }

const pendingApprovals = ref<PendingApprovalItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const pagination = ref({
  current_page: 1,
  total_pages: 1,
  per_page: 10,
  total_items: 0,
});

async function fetchPendingApprovals(page: number = pagination.value.current_page) {
  isLoading.value = true;
  error.value = null;
  try {
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated.');
    }
    
    // Replace with actual API call when available
    // const response = await apiService.get<{ data: PendingApprovalItem[], meta: ApiMeta }>(
    //   `/api/branch-admin/pending-payment-proofs?page=${page}&limit=${pagination.value.per_page}`,
    //   token
    // );

    // MOCK DATA IMPLEMENTATION 
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const mockData: PendingApprovalItem[] = [
      {
        id: 'proof_1',
        rider_id: 'RIDER_001',
        rider_name: 'John Doe',
        order_id: 'ORDER_123',
        amount: 15000,
        payment_method: 'transfer',
        proof_url: 'https://via.placeholder.com/600x400.png?text=Payment+Proof+1',
        submitted_at: new Date(Date.now() - 86400000).toISOString(), 
      },
      {
        id: 'proof_2',
        rider_id: 'RIDER_002',
        rider_name: 'Jane Smith',
        order_id: 'ORDER_124',
        amount: 7500,
        payment_method: 'cash',
        proof_url: undefined,
        submitted_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'proof_3',
        rider_id: 'RIDER_003',
        rider_name: 'Mike Johnson',
        order_id: 'ORDER_125',
        amount: 22000,
        payment_method: 'transfer',
        proof_url: 'https://via.placeholder.com/600x400.png?text=Payment+Proof+3',
        submitted_at: new Date(Date.now() - 3*86400000).toISOString(),
      },
    ];

    const start = (page - 1) * pagination.value.per_page;
    const end = start + pagination.value.per_page;
    pendingApprovals.value = mockData.slice(start, end);
    
    pagination.value.current_page = page;
    pagination.value.total_items = mockData.length;
    pagination.value.total_pages = Math.ceil(mockData.length / pagination.value.per_page);

  } catch (err) {
    console.error('Error fetching pending approvals:', err);
    const fetchError = err as Error;
    error.value = fetchError.message || 'Failed to load pending approvals.';
  } finally {
    isLoading.value = false;
  }
}

async function handleApproval(proofId: string, status: 'approved' | 'rejected') {
  const item = pendingApprovals.value.find(p => p.id === proofId);
  if (!item) return;

  item.isProcessing = true;
  item.statusMessage = undefined;
  try {
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    // Replace with actual API call
    await apiService.post(`/payment-proofs/${proofId}/${status}`, {}, token);
    // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay if apiService is not used initially
    
    item.statusMessage = `Payment proof has been successfully ${status}.`;
    item.statusMessageType = 'success';

    setTimeout(() => {
        pendingApprovals.value = pendingApprovals.value.filter(p => p.id !== proofId);
        if (pendingApprovals.value.length === 0 && pagination.value.current_page > 1) {
            fetchPendingApprovals(pagination.value.current_page -1);
        } else if (pendingApprovals.value.length === 0 && pagination.value.current_page === 1) {
             // Re-fetch or update UI to show no items
             fetchPendingApprovals(1); // Could re-fetch to update total counts if necessary
        }
    }, 2000);

  } catch (err) {
    console.error(`Error ${status} payment proof:`, err);
    const approvalError = err as Error;
    item.statusMessage = approvalError.message || `Failed to ${status} payment proof.`;
    item.statusMessageType = 'error';
  } finally {
    item.isProcessing = false;
  }
}

function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

onMounted(() => {
  fetchPendingApprovals();
});
</script>

<style scoped>
/* Add any specific styles here */
</style> 