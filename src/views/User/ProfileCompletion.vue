<template>
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-3xl font-extrabold text-center text-gray-900">Complete Your Profile</h2>
        <p class="mt-2 text-sm text-center text-gray-600">
          Please fill in the details below to continue.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div v-if="isPhoneMissing">
            <label for="phone-number" class="sr-only">Phone Number</label>
            <input id="phone-number" name="phone" type="tel" v-model="phone" required class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm" placeholder="Phone Number">
          </div>
          <div v-if="isAddressMissing">
            <label for="address" class="sr-only">Address</label>
            <input id="address" name="address" type="text" v-model="address" required :class="['relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 appearance-none focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm', { 'rounded-b-md': isPhoneMissing, 'rounded-md': !isPhoneMissing }]" placeholder="Address">
          </div>
        </div>

        <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {{ errorMessage }}
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:bg-brand-300">
            <span v-if="isLoading">Saving...</span>
            <span v-else>Save and Continue</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const phone = ref('');
const address = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const isPhoneMissing = computed(() => !authStore.currentUser?.phone);
const isAddressMissing = computed(() => !authStore.currentUser?.user_profile?.address);

onMounted(() => {
  if (!isPhoneMissing.value && !isAddressMissing.value) {
    router.push({ name: 'UserDashboard' });
  }
});

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const payload: { phone?: string; address?: string } = {};
    if (isPhoneMissing.value && phone.value) {
      payload.phone = phone.value;
    }
    if (isAddressMissing.value && address.value) {
      payload.address = address.value;
    }

    if (Object.keys(payload).length > 0) {
      await authStore.updateUserProfile(payload);
    }
    
    router.push({ name: 'UserDashboard' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message || 'An unexpected error occurred. Please try again.';
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>