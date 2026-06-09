<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Paystack Integration Test</h1>
    
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div v-if="!paymentInitialized" class="space-y-4">
        <h2 class="text-xl font-semibold">Test Payment</h2>
        <p class="text-gray-600 dark:text-gray-300">
          This is a test page to verify Paystack payment integration.
        </p>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount (₦)
          </label>
          <input
            v-model="amount"
            type="number"
            min="100"
            step="100"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter amount in Naira"
          >
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="your@email.com"
          >
        </div>
        
        <button
          @click="initializePayment"
          :disabled="!isFormValid || processing"
          class="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="processing" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Pay ₦{{ amount || '0' }}</span>
        </button>
        
        <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          {{ error }}
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <div class="text-green-500 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Payment Initialized!</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          The Paystack payment modal should open shortly. If it doesn't, please check your popup blocker.
        </p>
        <button
          @click="resetTest"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Test Again
        </button>
      </div>
    </div>
    
    <div class="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Test Results</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Paystack Loaded</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <span v-if="paystackLoaded" class="inline-flex items-center text-green-600 dark:text-green-400">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Yes
                </span>
                <span v-else class="text-red-600 dark:text-red-400">No</span>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Public Key</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono text-xs truncate max-w-xs">
                {{ paystackConfig.publicKey || 'Not set' }}
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Test Mode</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ isTestMode ? 'Yes' : 'No' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PaystackPop from '@paystack/inline-js';

// Paystack configuration
const paystackConfig = {
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_test_key',
  channels: [
    'card', 
    'bank', 
    'ussd', 
    'qr', 
    'mobile_money', 
    'bank_transfer'
  ] as ('card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer')[],
  currency: 'NGN' as const
};

// State
const amount = ref('1000');
const email = ref('test@example.com');
const processing = ref(false);
const paymentInitialized = ref(false);
const error = ref('');
const paystackLoaded = ref(false);

// Computed
const isFormValid = computed(() => {
  return amount.value && parseFloat(amount.value) >= 100 && email.value.includes('@');
});

const isTestMode = computed(() => {
  return paystackConfig.publicKey.startsWith('pk_test_');
});

// Methods
const initializePayment = async () => {
  if (!isFormValid.value) return;
  
  processing.value = true;
  error.value = '';
  
  try {
    const paystack = new PaystackPop();
    paystackLoaded.value = true;
    
    paystack.newTransaction({
      key: paystackConfig.publicKey,
      email: email.value,
      amount: parseFloat(amount.value) * 100, // Convert to kobo
      reference: `test_${Date.now()}`,
      channels: paystackConfig.channels,
      currency: paystackConfig.currency,
      onSuccess: (response) => {
        console.log('Payment successful:', response);
        alert(`Payment successful! Reference: ${response.reference}`);
        resetTest();
      },
      onCancel: () => {
        console.log('Payment cancelled');
        error.value = 'Payment was cancelled';
        processing.value = false;
      }
    });
    
    paymentInitialized.value = true;
    
  } catch (err) {
    console.error('Payment error:', err);
    error.value = err instanceof Error ? err.message : 'Failed to initialize payment';
  } finally {
    processing.value = false;
  }
};

const resetTest = () => {
  paymentInitialized.value = false;
  processing.value = false;
  error.value = '';
};

// Lifecycle
onMounted(() => {
  // Check if Paystack is available
  if (typeof PaystackPop !== 'undefined') {
    paystackLoaded.value = true;
  }
  
  // Set a test email if in development
  if (import.meta.env.DEV) {
    email.value = `test-${Math.random().toString(36).substring(2, 8)}@example.com`;
  }
});
</script>
