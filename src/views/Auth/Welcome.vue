<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome to GasoPay!</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Just one more step to complete your profile.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <div class="mt-1">
            <input
              id="phone"
              v-model="phone"
              name="phone"
              type="tel"
              required
              class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-white"
              placeholder="e.g., +1234567890"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="isLoading">Saving...</span>
            <span v-else>Complete Profile</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const phone = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // We will implement this API endpoint in the next step
    const response = await authStore.updateUserProfile({ phone: phone.value });

    if (response.success) {
      // On success, redirect to the main dashboard
      await router.push({ name: 'Ecommerce' });
    } else {
      errorMessage.value = response.message || 'Failed to update profile. Please try again.';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};
</script>
