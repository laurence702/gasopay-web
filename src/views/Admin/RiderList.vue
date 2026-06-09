<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div class="space-y-5">
    <BaseCard>
      <div class="p-5">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Riders</h2>
          <div class="flex items-center space-x-4">
            <select 
              v-model="filterStatus"
              @change="applyFilters" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <router-link 
              to="/branch-admin/create-rider"
              class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Add New Rider
            </router-link>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>

        <div v-else-if="error" class="text-center py-10">
          <p class="text-red-500">{{ error }}</p>
        </div>

        <div v-else>
          <BaseTable 
            :columns="tableHeaders" 
            :data="riders" 
            :totalItems="pagination.total_items"
            :itemsPerPage="pagination.per_page"
            v-model:currentPage="pagination.current_page"
            @update:currentPage="fetchRiders"
            :loading="isLoading"
          >
            <template #cell-fullname="{ row }">
              <div class="flex items-center">
                <img :src="(row.user_profile as UserProfileData)?.profile_pic_url || defaultAvatar" alt="Rider Avatar" class="w-10 h-10 rounded-full mr-3 object-cover">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ row.fullname }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ row.id }}</div>
                </div>
              </div>
            </template>
            <template #cell-branch="{ row }">
              {{ getBranchName(row.branch as ApiUser['branch']) }}
            </template>
            <template #cell-verification_status="{ row }">
              <span 
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': row.verification_status === 'verified',
                  'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': row.verification_status === 'pending',
                  'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': row.verification_status === 'rejected'
                }"
              >
                {{ capitalizeFirstLetter(row.verification_status as string) }}
              </span>
            </template>
            <template #cell-is_active="{ row }">
              <span :class="row.banned_at ? 'text-error-500' : 'text-success-500'">
                {{ row.banned_at ? 'Banned' : 'Active' }}
              </span>
            </template>
            <template #cell-actions="{ row }">
              <router-link 
                :to="`/admin/rider-profile/${row.id}`"
                class="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3"
              >
                View Profile
              </router-link>
              <!-- Add other actions like Ban/Unban if needed -->
            </template>
          </BaseTable>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import apiService, { type ApiUser, type UserProfileData } from '@/services/apiService';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseTable from '@/components/common/BaseTable.vue';
import type { ColumnDefinition } from '@/types/table';
import defaultAvatar from '@/assets/images/default_avatar.png'; // Default avatar

// Define component name
defineOptions({
  name: 'RiderListComponent'
});

const currentPageTitle = ref('Riders List');
const authStore = useAuthStore();

const riders = ref<ApiUser[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const filterStatus = ref('verified');

const pagination = ref({
  current_page: 1,
  total_pages: 1,
  per_page: 15,
  total_items: 0,
});

const tableHeaders = computed<ColumnDefinition[]>(() => [
  { key: 'fullname', label: 'Rider' },
  { key: 'email', label: 'Email' },
  { key: 'branch', label: 'Branch' },
  { key: 'verification_status', label: 'Verification Status' },
  { key: 'is_active', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]);

interface ApiMeta {
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
  per_page: number;
}

async function fetchRiders(page: number = pagination.value.current_page) {
  isLoading.value = true;
  error.value = null;
  try {
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated.');
    }
    
    const queryParams: Record<string, string | number> = {
      page,
      limit: pagination.value.per_page,
      role: 'rider' // Ensure we only fetch riders
    };

    if (filterStatus.value !== 'all') {
      queryParams.verification_status = filterStatus.value;
    }

    const response = await apiService.get<{ data: ApiUser[], meta: ApiMeta }>(
      `/users?${new URLSearchParams(queryParams as Record<string, string>).toString()}`,
      token
    );

    if (response && response.data) {
      riders.value = response.data.filter(user => user.role === 'rider').map(rider => ({
        ...rider,
        user_profile: rider.user_profile || {} as UserProfileData,
      }));
      pagination.value.current_page = response.meta.current_page;
      pagination.value.total_pages = response.meta.last_page;
      pagination.value.total_items = response.meta.total;
      pagination.value.per_page = response.meta.per_page;
    } else {
      riders.value = [];
    }
  } catch (err) {
    console.error('Error fetching riders:', err);
    const fetchError = err as Error;
    error.value = fetchError.message || 'Failed to load riders.';
  } finally {
    isLoading.value = false;
  }
}

function applyFilters() {
  pagination.value.current_page = 1; // Reset to first page when applying filters
  fetchRiders(1);
}

function getBranchName(branch: ApiUser['branch']) {
  return branch?.name || 'N/A';
}

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

onMounted(() => {
  fetchRiders();
});
</script>

<style scoped>
</style> 