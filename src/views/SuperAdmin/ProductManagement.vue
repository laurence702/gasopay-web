<template>
  <div class="p-4 md:p-6">
    <PageHeader title="Product Management">
      <!-- Optional: Add actions like 'Refresh Data' if needed later -->
    </PageHeader>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {{ product.name }}
        </h3>

        <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>
            <span class="font-medium text-gray-700 dark:text-gray-200">Unit:</span> {{ product.unit }}
          </p>
          <p>
            <span class="font-medium text-gray-700 dark:text-gray-200">Unit Price:</span> {{ formatCurrency(product.unitPrice) }} / {{ product.unit }}
          </p>
          <div>
            <span class="font-medium text-gray-700 dark:text-gray-200">Available Purchase Amounts:</span>
            <div class="flex flex-wrap gap-2 mt-1">
              <span
                v-for="price in product.prices"
                :key="price"
                class="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 px-2 py-0.5 rounded text-xs"
              >
                {{ formatCurrency(price) }}
              </span>
            </div>
          </div>
        </div>
         <!-- Placeholder for future actions like 'Edit Price' -->
         <!-- <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button class="btn btn-sm btn-outline-secondary">Edit Prices</button>
         </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import productsData from '@/mockData/products.json';

// Define an interface for better type safety
interface Product {
  id: string;
  name: string;
  prices: number[];
  unit: string;
  unitPrice: number;
}

const products = ref<Product[]>(productsData);

// Re-use currency formatting helper
const formatCurrency = (value: number | unknown): string => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
};

</script> 