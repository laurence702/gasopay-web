<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white">Wallet Balance</h2>
    <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${{ authStore.currentUser?.balance || '0.00' }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
