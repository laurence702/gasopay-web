<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts" name="RiderProfile">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getUserById } from '@/services/apiService'; // Import new service
import type { ApiUser } from '@/services/apiService'; // Removed UserProfileData import
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
import QrcodeVue from 'qrcode.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import DefaultAvatar from '@/assets/images/default_avatar.png';

const authStore = useAuthStore(); // Still needed for token, and potentially for fallback/own profile view
const route = useRoute();

// --- State for the viewed rider's profile ---
const viewedRider = ref<ApiUser | null>(null);
const pageLoading = ref(false);
const pageError = ref<string | null>(null);


// --- Modal State (remains the same) ---
const isQrModalVisible = ref(false);

const openQrModal = () => {
  isQrModalVisible.value = true;
};

const closeQrModal = () => {
  isQrModalVisible.value = false;
};

// --- Fetch Rider Data ---
const fetchRiderData = async (riderId: string) => {
  if (!authStore.token) {
    pageError.value = "Authentication token not found.";
    pageLoading.value = false;
    return;
  }
  pageLoading.value = true;
  pageError.value = null;
  viewedRider.value = null; // Clear previous rider data

  try {
    const response = await getUserById(authStore.token, riderId);
    if (response.user) {
      viewedRider.value = response.user;
    } else {
      pageError.value = "Rider data not found in API response.";
    }
  } catch (err: unknown) {
    console.error(`Failed to fetch rider profile for ID ${riderId}:`, err);
    pageError.value = err instanceof Error ? err.message : `An unknown error occurred while fetching rider ID ${riderId}.`;
    viewedRider.value = null;
  } finally {
    pageLoading.value = false;
  }
};

// --- Computed Properties (updated to use viewedRider) ---

const profilePictureUrl = computed(() => {
  return viewedRider.value?.user_profile?.profile_pic_url || DefaultAvatar;
});

const qrCodeData = computed(() => {
  // Use viewedRider's ID for the QR code
  if (viewedRider.value?.id) {
    const baseUrl = window.location.origin;
    // Construct the URL based on the current route, but ensure it points to this specific rider's ID.
    // This assumes the route for RiderProfile is something like /rider/profile/:id or similar.
    // If the QR code is meant to link to a generic profile page that then uses the ID, this is fine.
    return `${baseUrl}/rider/profile/${viewedRider.value.id}`;
  }
  return 'Error: Rider ID not found for QR Code';
});

const totalPickups = computed(() => {
  return viewedRider.value?.user_profile?.total_pickups ?? 0;
});

const currentDebt = computed(() => {
  return viewedRider.value?.user_profile?.current_debt ?? 0;
});

const isEligible = computed(() => {
  if (!viewedRider.value) return false;
  return (
    viewedRider.value.verification_status === 'verified' &&
    (viewedRider.value.user_profile?.current_debt ?? 0) <= 0
  );
});

const eligibilityMessage = computed(() => {
  if (!viewedRider.value) return 'Rider data not loaded.';
  if (viewedRider.value.verification_status !== 'verified') {
    return 'Account not verified';
  }
  if ((viewedRider.value.user_profile?.current_debt ?? 0) > 0) {
    return 'Outstanding debt';
  }
  return 'Eligible for pickups';
});

// Mock data - replace later (remains the same)
const recentActivity = ref([
  { id: 1, type: 'Pickup', details: 'Completed pickup #12345', date: '2023-10-26' },
  { id: 2, type: 'Payment', details: 'Made payment of ₦5000', date: '2023-10-25' },
]);


// --- Watch for route changes and fetch data ---
watch(
  () => route.params.id,
  async (newId) => {
    if (newId && typeof newId === 'string') {
      await fetchRiderData(newId);
    } else if (newId) {
      // If the logged-in user is a rider and no ID is in params, show their own profile.
      // This part depends on whether the /rider/profile route can be accessed without an ID.
      // For now, strictly require an ID.
      pageError.value = "Rider ID missing or invalid in URL.";
      viewedRider.value = null;
    }
    // If no ID, and it's not the rider's own profile page (if that's a feature), clear/show error.
  },
  { immediate: true } // Fetch data immediately when component is created
);

// onMounted is effectively replaced by the immediate watcher on route.params.id

</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="pageLoading" class="text-center p-8 text-gray-600">
      <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading rider profile data...
    </div>

    <!-- Error State -->
    <div v-else-if="pageError" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
      <span class="font-medium">Error!</span> {{ pageError }}
    </div>

    <!-- Profile Content -->
    <div v-else-if="viewedRider" class="space-y-6">
      <!-- Eligibility Banner -->
      <div
        :class="[
          'p-4 rounded-md flex items-center space-x-2 text-sm',
          isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]"
      >
        <CheckCircleIcon v-if="isEligible" class="h-5 w-5 flex-shrink-0" />
        <XCircleIcon v-else class="h-5 w-5 flex-shrink-0" />
        <span class="font-medium">{{ eligibilityMessage }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Profile Pic & QR Button -->
        <BaseCard class="lg:col-span-1 flex flex-col items-center space-y-4 p-6">
          <img
            :src="profilePictureUrl"
            alt="Rider Profile Picture"
            class="h-32 w-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
            @error="(event: Event) => (event.target as HTMLImageElement).src = DefaultAvatar"
          />
          <h2 class="text-xl font-bold text-gray-800 mt-2">{{ viewedRider.fullname }}</h2>
          <p class="text-gray-500 text-sm">{{ viewedRider.email }}</p>
          <p class="text-gray-500 text-sm">{{ viewedRider.phone }}</p>

          <!-- Generate QR Code Button -->
          <button
            @click="openQrModal"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="!viewedRider.id"
          >
            Generate Identification QR Code
          </button>
        </BaseCard>

        <!-- Right Column: Details & Activity -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Rider Details Card -->
          <BaseCard class="p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Rider Details</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Verification Status</dt>
                <dd class="mt-1 text-sm text-gray-900 capitalize">{{ viewedRider.verification_status }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Total Pickups</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ totalPickups }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Current Debt</dt>
                <dd :class="['mt-1 text-sm font-medium', currentDebt > 0 ? 'text-red-600' : 'text-gray-900']">
                  ₦{{ currentDebt.toLocaleString() }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ viewedRider.user_profile?.address || 'Not Provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Vehicle Type</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ viewedRider.user_profile?.vehicle_type || 'Not Provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">NIN</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ viewedRider.user_profile?.nin || 'Not Provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Guarantor's Name</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ viewedRider.user_profile?.guarantors_name || 'Not Provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Guarantor's Phone</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ viewedRider.user_profile?.guarantors_phone || 'Not Provided' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Guarantor's Address</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ viewedRider.user_profile?.guarantors_address || 'Not Provided' }}</dd>
              </div>
               <!-- Add more profile fields as needed -->
            </dl>
          </BaseCard>

          <!-- Recent Activity Card -->
          <BaseCard class="p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Recent Activity</h3>
            <ul v-if="recentActivity.length > 0" class="divide-y divide-gray-200">
              <li v-for="activity in recentActivity" :key="activity.id" class="py-3 flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ activity.type }}</p>
                  <p class="text-sm text-gray-600">{{ activity.details }}</p>
                </div>
                <p class="text-sm text-gray-500">{{ activity.date }}</p> <!-- Consider formatting date -->
              </li>
            </ul>
            <div v-else class="text-center text-gray-500 py-4">
              No recent activity found.
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <!-- Fallback if user data couldn't be loaded and not loading/no error -->
    <div v-else class="text-center p-8 text-gray-500">
       Rider profile data is not available or ID is missing.
    </div>

    <!-- QR Code Modal -->
    <BaseModal v-model="isQrModalVisible" max-width="max-w-xl">
      <template #title>
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
          Rider Identification QR Code
        </h3>
      </template>
      <template #body>
        <div class="mt-4 flex flex-col items-center justify-center p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Scan this code for rider identification and profile access.
          </p>
          <div v-if="qrCodeData.startsWith('Error:')" class="text-red-500">
             {{ qrCodeData }}
          </div>
          <div v-else class="p-4 bg-white rounded-lg shadow-lg inline-block">
            <qrcode-vue :value="qrCodeData" :size="300" level="H" />
          </div>
           <p v-if="!qrCodeData.startsWith('Error:')" class="mt-2 text-xs text-gray-500 break-all">{{ qrCodeData }}</p>
        </div>
      </template>
      <template #footer>
        <button
          @click="closeQrModal"
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Close
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<style scoped>
/* Scoped styles */
dl dd {
  word-break: break-word; /* Prevent long details from breaking layout */
}
</style>
