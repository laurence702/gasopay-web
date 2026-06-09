<template>
  <BaseCard>
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Riders by Location</h2>
      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
      <div v-else-if="ridersByLocation.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-10">
        No riders found.
      </div>
      <div v-else class="space-y-4">
        <div v-for="(location, index) in ridersByLocation" :key="index">
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{{ location.name }}</h3>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="(rider, rIndex) in location.riders" :key="rIndex" class="py-3 flex items-center justify-between">
              <div class="flex items-center">
                <img class="h-10 w-10 rounded-full mr-4" :src="rider.user_profile?.profile_pic_url || '/images/avatar.png'" alt="Rider Avatar">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ rider.fullname }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ rider.phone }}</p>
                </div>
              </div>
              <router-link :to="`/rider/${rider.id}`" class="text-sm text-brand-500 hover:underline">View</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/services/apiService';
import BaseCard from '@/components/common/BaseCard.vue';
import type { ApiUser } from '@/services/apiService';

interface Location {
  name: string;
  riders: ApiUser[];
}

const isLoading = ref(true);
const ridersByLocation = ref<Location[]>([]);
const authStore = useAuthStore();

onMounted(async () => {
  try {
    isLoading.value = true;
    const token = authStore.token;
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const branchId = authStore.currentUser?.branch_id;
    if (!branchId) {
      throw new Error('Branch ID not found');
    }

    const response = await apiService.get<{ data: ApiUser[] }>(`/riders?branch_id=${branchId}`, token);
    const riders = response.data;

    const locations: { [key: string]: ApiUser[] } = {};
    for (const rider of riders) {
      const locationName = rider.branch?.name || 'Unknown Location';
      if (!locations[locationName]) {
        locations[locationName] = [];
      }
      locations[locationName].push(rider);
    }

    ridersByLocation.value = Object.entries(locations).map(([name, riders]) => ({ name, riders }));

  } catch (error) {
    console.error('Error fetching riders by location:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
