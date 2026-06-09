<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div v-if="isLoading" class="text-center">
          <p>Loading products...</p>
        </div>
        <div v-else>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Purchase LPG</h2>
          <form @submit.prevent class="mt-6 space-y-6">
            <div>
              <label for="product" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
              <select id="product" v-model="selectedProduct" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
                <option v-for="product in products" :key="product.id" :value="product">{{ product.name }} ({{ product.unit }})</option>
              </select>
            </div>
            <div>
              <label for="quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input type="number" id="quantity" v-model.number="quantity" min="1" class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
            </div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              Total: ₦{{ totalPrice.toFixed(2) }}
            </div>
            <div class="flex justify-end space-x-4">
              <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              <paystack
                :button-class="'px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 disabled:bg-brand-300'"
                :button-text="'Pay Now'"
                :public-key="paystackKey"
                :email="email"
                :amount="totalPrice * 100"
                :reference="reference"
                :on-success="onSuccessfulPayment"
                :on-cancel="onCancelledPayment"
                :disabled="!selectedProduct"
              >
              </paystack>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/product';
import { useAuthStore } from '@/stores/auth';
import paystack from 'vue3-paystack';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

const productStore = useProductStore();
const authStore = useAuthStore();
const selectedProduct = ref<any>(null);
const quantity = ref(1);
const isLoading = ref(true);

const products = computed(() => {
  if (Array.isArray(productStore.products)) {
    return productStore.products.filter(p => p.name === 'LPG');
  }
  return [];
});
const email = computed(() => authStore.currentUser?.email || '');
const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx';

const totalPrice = computed(() => {
  if (selectedProduct.value && quantity.value) {
    return selectedProduct.value.price * quantity.value;
  }
  return 0;
});

const reference = computed(() => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
});

const closeModal = () => {
  emit('close');
};

const onSuccessfulPayment = (response: any) => {
  console.log('Payment successful:', response);
  // Here you would typically call an action to create the order in the backend
  // and probably pass the paystack reference for verification
  closeModal();
};

const onCancelledPayment = () => {
  console.log('Payment cancelled');
};

onMounted(async () => {
  isLoading.value = true;
  await productStore.fetchProducts();
  if (products.value.length > 0) {
    selectedProduct.value = products.value[0];
  }
  isLoading.value = false;
});
</script>
