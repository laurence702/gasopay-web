<template>
  <div>
    <PageHeader title="Pending Rider Approvals">
      <template #actions>
        <div class="flex items-center space-x-2">
          <input type="text" placeholder="Search riders..." class="input input-sm input-bordered" />
          <button @click="fetchPendingRiders(1)" class="btn btn-sm btn-outline">Refresh</button>
        </div>
      </template>
    </PageHeader>

    <div class="mt-6">
      <BaseTable
        :columns="columns"
        :data="pendingRiders"
        :is-loading="isLoading"
        :total-items="totalItems"
        :has-actions="true"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        :show-pagination="totalItems > itemsPerPage"
        @update:currentPage="handlePageChange"
        empty-state-message="No pending rider approvals found."
      >
        <template #cell(created_at)="{ row }">
          <span>{{ formatDate(row.created_at as string) }}</span>
        </template>

        <template #actions="{ row }">
           <div class="flex space-x-1">
             <button
                @click="updateStatus(row.id as string, 'verified')"
                class="btn btn-xs btn-ghost text-green-500 hover:bg-green-100"
                title="Approve"
                :disabled="isUpdatingStatus === row.id"
             >
                <span v-if="isUpdatingStatus === row.id">...</span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </button>
             <button
                @click="updateStatus(row.id as string, 'rejected')"
                class="btn btn-xs btn-ghost text-red-500 hover:bg-red-100"
                title="Reject"
                :disabled="isUpdatingStatus === row.id"
             >
                 <span v-if="isUpdatingStatus === row.id">...</span>
                 <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <button
                @click="openUserDetailsModal(row as unknown as ApiUser)"
                class="btn btn-xs btn-ghost text-blue-500 hover:bg-blue-100"
                title="View Details"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             </button>
          </div>
        </template>
      </BaseTable>
      <div v-if="!isLoading && error" class="p-4 text-center text-red-600">
       Error loading pending riders: {{ error }}
     </div>
    </div>

    <BaseModal v-model="isUserDetailsModalVisible" max-width="max-w-2xl">
        <template #title>
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                Rider Details ({{ selectedRiderForModal?.fullname }})
            </h3>
        </template>
        <template #body>
            <div v-if="selectedRiderForModal" class="mt-4 space-y-4">
                 <img 
                    :src="selectedRiderForModal.user_profile?.profile_pic_url || DefaultAvatar"
                    alt="Rider Photo"
                    class="h-24 w-24 rounded-full object-cover mx-auto border"
                    @error="(event: Event) => (event.target as HTMLImageElement).src = DefaultAvatar"
                 />
                 <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div><dt class="font-medium text-gray-500">Full Name</dt><dd class="text-gray-900 dark:text-gray-200">{{ selectedRiderForModal.fullname }}</dd></div>
                    <div><dt class="font-medium text-gray-500">Email</dt><dd class="text-gray-900 dark:text-gray-200">{{ selectedRiderForModal.email }}</dd></div>
                    <div><dt class="font-medium text-gray-500">Phone</dt><dd class="text-gray-900 dark:text-gray-200">{{ selectedRiderForModal.phone }}</dd></div>
                    <div><dt class="font-medium text-gray-500">Verification</dt><dd class="text-gray-900 dark:text-gray-200 capitalize">{{ selectedRiderForModal.verification_status }}</dd></div>
                    <div><dt class="font-medium text-gray-500">Address</dt><dd class="text-gray-900 dark:text-gray-200">{{ selectedRiderForModal.user_profile?.address || 'N/A' }}</dd></div>
                    <div><dt class="font-medium text-gray-500">Vehicle Type</dt><dd class="text-gray-900 dark:text-gray-200">{{ selectedRiderForModal.user_profile?.vehicle_type || 'N/A' }}</dd></div>
                    <div><dt class="font-medium text-gray-500">NIN</dt><dd class="text-gray-900 dark:text-gray-200">{{ selectedRiderForModal.user_profile?.nin || 'N/A' }}</dd></div>
                    <div><dt class="font-medium text-gray-500">Guarantor</dt><dd class="text-gray-900 dark:text-gray-200">{{ selectedRiderForModal.user_profile?.guarantors_name || 'N/A' }}</dd></div>
                    <div><dt class="font-medium text-gray-500">Submitted On</dt><dd class="text-gray-900 dark:text-gray-200">{{ formatDate(selectedRiderForModal.created_at) }}</dd></div>
                 </dl>
            </div>
        </template>
        <template #footer>
            <button @click="closeUserDetailsModal" type="button" class="btn btn-outline">Close</button>
        </template>
    </BaseModal>

  </div>
</template>

<script setup lang="ts" name="PendingRiderApprovals">
import { ref, watchEffect } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import BaseTable from '@/components/common/BaseTable.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { getUsers, updateRiderVerificationStatus } from '@/services/apiService';
import { useAuthStore, Role } from '@/stores/auth';
import type { ApiUser } from '@/services/apiService';
import DefaultAvatar from '@/assets/images/default_avatar.png';

// Define local types
interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
}

// --- State ---
const authStore = useAuthStore();
const isLoading = ref(false);
const isUpdatingStatus = ref<string | null>(null);
const pendingRiders = ref<ApiUser[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const error = ref<string | null>(null);

// Modal State
const isUserDetailsModalVisible = ref(false);
const selectedRiderForModal = ref<ApiUser | null>(null);

// --- Table Columns (Adjusted) ---
const columns = ref<ColumnDefinition[]>([
  { key: 'fullname', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'created_at', label: 'Submitted On' },
]);

// --- Methods ---
const fetchPendingRiders = async (page: number = 1) => {
  if (!authStore.token) {
    error.value = "Authentication token not found.";
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getUsers(authStore.token, {
      page: page,
      limit: itemsPerPage.value,
      role: Role.RIDER,
      verification_status: 'pending'
    });
    pendingRiders.value = response.data;
    totalItems.value = response.total;
    currentPage.value = response.current_page;
  } catch (err) {
    console.error("Failed to fetch pending riders:", err);
    error.value = err instanceof Error ? err.message : "An unknown error occurred";
    pendingRiders.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchPendingRiders(page);
};

const updateStatus = async (riderId: string, status: 'verified' | 'rejected') => {
    if (!authStore.token) {
        alert("Authentication error. Please log in again.");
        return;
    }
    if (isUpdatingStatus.value) return;

    isUpdatingStatus.value = riderId;
    try {
        await updateRiderVerificationStatus(authStore.token, { rider_id: riderId, status });
        alert(`Rider status successfully updated to ${status}.`);
        await fetchPendingRiders(currentPage.value);
    } catch (err) {
        console.error(`Failed to update status to ${status}:`, err);
        alert(`Error updating status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
        isUpdatingStatus.value = null;
    }
};

// Modal Functions
const openUserDetailsModal = (rider: ApiUser) => {
    selectedRiderForModal.value = rider;
    isUserDetailsModalVisible.value = true;
};
const closeUserDetailsModal = () => {
    isUserDetailsModalVisible.value = false;
    selectedRiderForModal.value = null;
};

// --- Helper Functions ---
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

// --- Lifecycle & Watchers ---
watchEffect(() => {
  if (authStore.isInitialized) {
    fetchPendingRiders(currentPage.value);
  }
});

</script>

<style scoped>
/* Add component-specific styles if needed */
.input {
  padding: 0.5rem;
  border-radius: 0.375rem; /* rounded-md */
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem; /* rounded-md */
  font-weight: 500;
  transition: background-color 0.2s;
}
</style> 