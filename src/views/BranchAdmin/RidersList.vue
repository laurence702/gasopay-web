<template>
  <PageBreadcrumb pageTitle="Riders" />

  <div class="space-y-5">
    <BaseCard>
      <div class="p-5">
        <!-- Header actions -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6 justify-between">
          <div class="flex gap-3 flex-1">
            <input
              v-model="search"
              type="text"
              placeholder="Search by name, phone or email..."
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="id">Sort: ID</option>
              <option value="name">Sort: Name</option>
              <option value="orders">Sort: Most Orders</option>
              <option value="debt">Sort: Highest Debt</option>
            </select>
          </div>
          <router-link
            to="/branch-admin/create-rider"
            class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <PlusIcon class="h-4 w-4" /> Add Rider
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredRiders.length === 0" class="text-center py-12">
          <UserGroupIcon class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p class="mt-3 text-gray-500 dark:text-gray-400">No riders found for this branch.</p>
          <router-link to="/branch-admin/create-rider" class="mt-3 inline-block text-sm text-brand-600 hover:underline">
            Register a rider →
          </router-link>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="th">#</th>
                <th class="th">Rider</th>
                <th class="th">Phone</th>
                <th class="th">Vehicle</th>
                <th class="th">Status</th>
                <th class="th">Debt</th>
                <th class="th">Orders</th>
                <th class="th">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="rider in filteredRiders" :key="rider.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="td text-gray-400 text-xs">{{ rider.id }}</td>
                <td class="td">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <span class="text-xs font-bold text-brand-600 dark:text-brand-400">
                        {{ initials(rider.fullname) }}
                      </span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-800 dark:text-white">{{ rider.fullname }}</p>
                      <p class="text-xs text-gray-400">{{ rider.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="td">{{ rider.phone }}</td>
                <td class="td text-gray-500">{{ rider.user_profile?.vehicle_type ?? '—' }}</td>
                <td class="td">
                  <span :class="verificationClass(rider.verification_status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ verificationLabel(rider.verification_status) }}
                  </span>
                </td>
                <td class="td">
                  <span :class="rider.user_profile?.current_debt > 0 ? 'text-red-500 font-semibold' : 'text-gray-500'">
                    ₦{{ formatAmount(rider.user_profile?.current_debt ?? 0) }}
                  </span>
                </td>
                <td class="td text-center">{{ rider.orders_count ?? 0 }}</td>
                <td class="td">
                  <router-link
                    :to="`/admin/rider-profile/${rider.id}`"
                    class="text-xs font-medium text-brand-600 hover:underline"
                  >
                    View Profile
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PlusIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';

defineOptions({ name: 'BranchAdminRidersList' });

const authStore = useAuthStore();
const isLoading = ref(true);
const search = ref('');
const sortBy = ref('id');

interface RiderUser {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  verification_status: string;
  orders_count?: number;
  user_profile?: { vehicle_type?: string; current_debt?: number };
}

const riders = ref<RiderUser[]>([]);

const filteredRiders = computed(() => {
  let list = [...riders.value];
  if (search.value) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (r) =>
        r.fullname.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q)
    );
  }
  if (sortBy.value === 'name') list.sort((a, b) => a.fullname.localeCompare(b.fullname));
  else if (sortBy.value === 'orders') list.sort((a, b) => (b.orders_count ?? 0) - (a.orders_count ?? 0));
  else if (sortBy.value === 'debt') list.sort((a, b) => (b.user_profile?.current_debt ?? 0) - (a.user_profile?.current_debt ?? 0));
  else list.sort((a, b) => a.id - b.id);
  return list;
});

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}
function formatAmount(n: number) { return Number(n).toLocaleString(); }
function verificationLabel(s: string) {
  return s === 'verified' ? 'Verified' : s === 'pending' ? 'Pending' : 'Unverified';
}
function verificationClass(s: string) {
  return s === 'verified'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : s === 'pending'
    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
}

onMounted(async () => {
  try {
    const token = authStore.token;
    if (!token) return;
    const res = await apiService.get<{ data: RiderUser[] }>('/riders', token);
    riders.value = res.data ?? [];
  } catch {
    // Mock fallback
    riders.value = [
      { id: 1, fullname: 'John Doe', email: 'john@example.com', phone: '08012345678', verification_status: 'verified', orders_count: 14, user_profile: { vehicle_type: 'Motorcycle', current_debt: 0 } },
      { id: 2, fullname: 'Sarah Williams', email: 'sarah@example.com', phone: '08023456789', verification_status: 'pending', orders_count: 3, user_profile: { vehicle_type: 'Tricycle', current_debt: 5000 } },
      { id: 3, fullname: 'Emeka Obi', email: 'emeka@example.com', phone: '08034567890', verification_status: 'verified', orders_count: 22, user_profile: { vehicle_type: 'Motorcycle', current_debt: 0 } },
    ];
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.th {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider;
}
.td {
  @apply px-4 py-3 text-sm text-gray-800 dark:text-gray-200;
}
</style>
