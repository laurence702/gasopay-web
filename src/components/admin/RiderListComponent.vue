<template>
  <div>
    <!-- Optional: Add Header/Title as props if needed -->
    <BaseTable
      :columns="columns"
      :data="riders"
      :is-loading="isLoading"
      :total-items="totalItems"
      :has-actions="true"
      :items-per-page="itemsPerPage"
      :current-page="currentPage"
      :show-pagination="totalItems > itemsPerPage"
      @update:currentPage="handlePageChange"
    >
      <!-- Custom cell templates -->
      <template #cell-verification_status="{ row }">
         <span
            :class="getVerificationBadgeClass(row.verification_status as string)"
            class="px-2 py-1 text-xs font-medium rounded-full capitalize"
          >
            {{ row.verification_status || 'N/A' }}
          </span>
      </template>
       <template #cell-branch="{ row }">
          <span>{{ getBranchName(row.branch as ApiUser['branch']) }}</span>
      </template>
      <template #cell-is_active="{ row }">
           <span :class="row.is_active ? 'text-green-600' : 'text-red-600'">
             {{ row.is_active ? 'Active' : 'Inactive' }}
           </span>
       </template>

      <!-- Action buttons -->
      <template #actions="{ row }">
         <div class="flex space-x-1">
             <button
                @click="viewRiderProfile(row.id as string)"
                class="btn btn-xs btn-ghost text-blue-500 hover:bg-blue-100"
                title="View Profile"
             >
                 <!-- Eye Icon -->
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             </button>
             <!-- Optional Actions -->
            <button
                @click="editRider(row.id as string)"
                class="btn btn-xs btn-ghost text-yellow-500 hover:bg-yellow-100"
                title="Edit"
             >
                 <!-- Pencil Icon -->
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
             <button
                @click="toggleRiderStatus(row.id as string, row.is_active as boolean)"
                class="btn btn-xs btn-ghost "
                :class="row.is_active ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100'"
                :title="row.is_active ? 'Deactivate' : 'Activate'"
             >
                 <!-- Toggle Icon (e.g., Power) -->
                  <svg v-if="row.is_active" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a4 4 0 100-7.07" />
                 </svg>
             </button>
          </div>
      </template>
    </BaseTable>
    <div v-if="!isLoading && error" class="p-4 text-center text-red-600">
       Error loading riders: {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import BaseTable from '@/components/common/BaseTable.vue';
import { getUsers } from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';
import type { ApiUser } from '@/services/apiService';

interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
}

type Rider = ApiUser;

const props = defineProps({
  branchId: { type: String, default: null },
  initialPage: { type: Number, default: 1 },
  itemsPerPage: { type: Number, default: 15 },
  roleFilter: { type: String, default: 'rider' } // Default to rider role
});

const router = useRouter();
const authStore = useAuthStore();

// --- State ---
const isLoading = ref(false);
const riders = ref<Rider[]>([ ]);
const totalItems = ref(0);
const currentPage = ref(props.initialPage);
const error = ref<string | null>(null);

// --- Table Columns (Adjust based on ApiUser fields) ---
const columns = ref<ColumnDefinition[]>([
  { key: 'fullname', label: 'Name', sortable: true },
  { key: 'phone', label: 'Phone' },
  { key: 'branch', label: 'Branch' },
  { key: 'verification_status', label: 'Verification' },
  // { key: 'is_active', label: 'Account Status' }, // Add if needed
]);

// --- Methods ---
const fetchRiders = async (page: number) => {
  if (!authStore.token) {
      error.value = 'Authentication token not found when trying to fetch.';
      isLoading.value = false;
      return;
  }
  isLoading.value = true;
  error.value = null;
  console.log(`Fetching riders for page ${page}, role: ${props.roleFilter}, branch: ${props.branchId}`);

  try {
    const response = await getUsers(authStore.token, {
        page: page,
        limit: props.itemsPerPage,
        role: props.roleFilter,
        branchId: props.branchId ?? undefined
    });
    
    // Map the response data to parse the branch if it's a string
    riders.value = response.data.map(user => {
        let branchObject = null;
        if (user.branch && typeof user.branch === 'string') {
            try {
                branchObject = JSON.parse(user.branch);
            } catch (e) {
                console.error(`Failed to parse branch JSON for user ${user.id}:`, user.branch, e);
                branchObject = { name: 'Parse Error' }; // Indicate error
            }
        } else if (user.branch && typeof user.branch === 'object') {
            // If it's already an object, use it directly
            branchObject = user.branch;
        }
        return { 
            ...user, 
            branch: branchObject // Ensure branch is an object or null
        };
    });

    totalItems.value = response.total;
    currentPage.value = response.current_page;
    console.log('Processed riders:', riders.value.length, 'Total:', totalItems.value);
  } catch (err: unknown) {
    console.error("Failed to fetch riders:", err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    riders.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page: number) => {
  // currentPage ref is updated by BaseTable v-model:currentPage binding if used,
  // otherwise, update it manually here if needed.
  // currentPage.value = page;
  fetchRiders(page);
};

// --- Actions (Update based on Rider type / ApiUser) ---
const viewRiderProfile = (riderId: string) => {
  console.log('View profile for rider:', riderId);
  // Use the actual Rider Profile route, assuming it takes ID
  router.push({ name: 'RiderProfile', params: { id: riderId } });
};

const editRider = (riderId: string) => {
  console.log('Edit rider:', riderId);
  alert(`Editing Rider ${riderId} (Not Implemented)`);
};

const toggleRiderStatus = (riderId: string, currentIsActive: boolean | undefined) => {
  // Adapt based on how active status is determined (e.g., verification_status or a dedicated field)
  const isActive = !!currentIsActive;
  const action = isActive ? 'Deactivate' : 'Activate';
  console.log(`${action} rider: ${riderId}`);
  alert(`${action} Rider ${riderId} (Not Implemented)`);
  fetchRiders(currentPage.value);
};

// --- Lifecycle & Watchers ---

// Watch for store initialization before fetching
watchEffect(() => {
  console.log('[RiderList] WatchEffect triggered. Initialized:', authStore.isInitialized);
  if (authStore.isInitialized) {
    console.log('[RiderList] Store initialized, attempting initial fetch...');
    fetchRiders(currentPage.value);
  }
});

// Optional: Watch for prop changes if the component needs to refetch
watch(() => [props.branchId, props.roleFilter], () => {
    // Also ensure store is initialized before refetching due to props
    if (authStore.isInitialized) {
        console.log('Props changed, refetching riders...');
        fetchRiders(1); // Reset to page 1 on filter change
    }
}, { immediate: false }); // Don't run immediately, let watchEffect handle initial load

const getVerificationBadgeClass = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getBranchName = (branch: ApiUser['branch']): string => {
  if (typeof branch === 'string') {
    try {
      const parsedBranch = JSON.parse(branch);
      return parsedBranch.name || 'N/A';
    } catch (e) {
      console.error(`Failed to parse branch JSON for branch:`, branch, e);
      return 'Parse Error';
    }
  } else if (typeof branch === 'object' && branch !== null) {
    return branch.name || 'N/A';
  } else {
    return 'N/A';
  }
};

</script>

<style scoped>
/* Add component-specific styles if needed */
</style> 