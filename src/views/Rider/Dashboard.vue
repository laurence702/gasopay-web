<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
  <div class="space-y-5">
    <!-- Rider Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <BaseCard class="overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Purchases</p>
              <h3 class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {{ riderStats.totalPurchases || 0 }}
              </h3>
            </div>
            <div class="flex-shrink-0">
              <ShoppingCartIcon class="h-10 w-10 text-brand-500 opacity-70" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
            <span :class="[riderStats.lastPurchaseDaysAgo <= 7 ? 'text-success-500' : 'text-warning-500']">
              {{ riderStats.lastPurchaseDaysAgo }}
            </span>
            days since last purchase
          </p>
        </div>
      </BaseCard>

      <BaseCard class="overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</p>
              <h3 class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
                ₦{{ formatAmount(riderStats.pendingPaymentsAmount) }}
              </h3>
            </div>
            <div class="flex-shrink-0">
              <CreditCardIcon class="h-10 w-10 text-warning-500 opacity-70" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Across {{ riderStats.pendingPaymentsCount }} order(s)
          </p>
        </div>
      </BaseCard>

      <BaseCard class="overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Balance</p>
              <h3 class="mt-1 text-2xl font-semibold" 
                :class="[accountBalance >= 0 ? 'text-success-500' : 'text-error-500']"
              >
                ₦{{ formatAmount(accountBalance) }}
              </h3>
            </div>
            <div class="flex-shrink-0">
              <CurrencyDollarIcon class="h-10 w-10 opacity-70" 
                :class="[accountBalance >= 0 ? 'text-success-500' : 'text-error-500']" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
            {{ accountBalance >= 0 ? 'In credit' : 'Outstanding debt' }}
          </p>
        </div>
      </BaseCard>
    </div>

    <!-- Quick Actions -->
    <BaseCard>
        <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <router-link to="/rider/purchase-history" class="quick-action-card">
                    <DocumentTextIcon class="h-8 w-8 mb-2 text-brand-500" />
                    <span class="font-medium">View Purchase History</span>
                    <p class="text-xs text-gray-500 dark:text-gray-400">See all your past orders</p>
                </router-link>
                <router-link to="/rider/pending-payments" class="quick-action-card">
                    <ClockIcon class="h-8 w-8 mb-2 text-warning-500" />
                    <span class="font-medium">Manage Pending Payments</span>
                    <p class="text-xs text-gray-500 dark:text-gray-400">View and pay outstanding orders</p>
                </router-link>
                <router-link to="/rider/profile" class="quick-action-card">
                    <UserCircleIcon class="h-8 w-8 mb-2 text-gray-500" />
                    <span class="font-medium">My Profile</span>
                     <p class="text-xs text-gray-500 dark:text-gray-400">View or update your details</p>
                </router-link>
            </div>
        </div>
    </BaseCard>

    <!-- Recent Activity (placeholder) -->
    <BaseCard>
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Recent Activity</h3>
        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
          <NewspaperIcon class="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Recent transactions and account activity will appear here.</p>
          <p class="text-xs mt-1">(Feature coming soon)</p>
        </div>
      </div>
    </BaseCard>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import {
  ShoppingCartIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  UserCircleIcon,
  NewspaperIcon
} from '@heroicons/vue/24/outline';
// import apiService from '@/services/apiService'; // Uncomment when API is ready

defineOptions({
  name: 'RiderDashboard'
});

const currentPageTitle = ref('My Dashboard');
const authStore = useAuthStore();
// const isLoading = ref(true); // For API calls
// const error = ref<string | null>(null);

interface RiderStats {
  totalPurchases: number;
  lastPurchaseDaysAgo: number;
  pendingPaymentsAmount: number;
  pendingPaymentsCount: number;
  // accountBalance: number; // Removed direct prop from interface
}

const riderStats = ref<Omit<RiderStats, 'accountBalance'>>({
  totalPurchases: 0,
  lastPurchaseDaysAgo: 0,
  pendingPaymentsAmount: 0,
  pendingPaymentsCount: 0,
  // accountBalance: 0, // Removed direct prop from ref
});

// Computed property for account balance
const accountBalance = computed(() => {
  const balanceString = authStore.currentUser?.balance;
  const balance = balanceString ? parseFloat(balanceString) : 0;
  return isNaN(balance) ? 0 : balance;
});

function formatAmount(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0.00'; // Or some other default like 'N/A'
  }
  return Number(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).replace('NGN', '');
}

async function fetchRiderStats() {
  // isLoading.value = true;
  // error.value = null;
  try {
    const token = authStore.token;
    if (!token || !authStore.currentUser) {
      throw new Error('User not authenticated or user data missing.');
    }
    // const riderId = authStore.currentUser.id;
    // const response = await apiService.get<RiderStats>(`/riders/${riderId}/stats`, token);
    // riderStats.value = response.data;

    // MOCK DATA 
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    riderStats.value = {
      totalPurchases: 27,
      lastPurchaseDaysAgo: 3,
      pendingPaymentsAmount: 12500,
      pendingPaymentsCount: 2,
    };

  } catch (err: unknown) {
    console.error('Error fetching rider stats:', err);
    // error.value = err.message || 'Failed to load dashboard data.';
  } finally {
    // isLoading.value = false;
  }
}

onMounted(() => {
  fetchRiderStats();
});
</script>

<style scoped>
.quick-action-card {
  @apply flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out text-center;
}
</style> 