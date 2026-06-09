<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white">Buy Products</h2>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get your essential products quickly and easily.</p>
    <button @click="openModal" class="mt-4 w-full bg-brand-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-600 transition-colors">
      Buy Now
    </button>
    <PurchaseModal :is-open="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PurchaseModal from './PurchaseModal.vue';

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>
