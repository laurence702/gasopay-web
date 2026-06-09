<template>
  <!-- Mock Payment Modal -->
  <MockPaymentModal
    v-if="showMockPayment"
    :is-open="isOpen && showMockPayment"
    :amount="calculatedAmount"
    :quantity="orderDetails.quantity"
    :order-details="orderDetails"
    @close="handleCloseModal"
    @payment-success="handleMockPaymentSuccess"
  />
  
  <!-- Original Payment Modal -->
  <BaseModal v-else :is-open="isOpen" @close="handleCloseModal">
    <template #body>
      <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <!-- Header with Step Indicator -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
            {{ currentStep.title }}
          </h2>
          
          <!-- Step Progress Indicator -->
          <div class="flex items-center justify-center space-x-4 mb-4">
            <div class="flex items-center">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  currentStepIndex >= 0 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                ]"
              >
                1
              </div>
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Order Details</span>
            </div>
            
            <div class="w-8 h-0.5 bg-gray-300"></div>
            
            <div class="flex items-center">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  currentStepIndex >= 1 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                ]"
              >
                2
              </div>
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Payment</span>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
            {{ currentStep.description }}
          </p>
        </div>

        <!-- Step 1: Order Details Form -->
        <div v-if="currentStep.step === 'order-details'" class="space-y-4">
          <form @submit.prevent="handleOrderDetailsSubmit">
            <!-- Quantity Selection -->
            <div>
              <label for="quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity (kg) <span class="text-red-500">*</span>
              </label>
              <select 
                id="quantity" 
                v-model="orderDetails.quantity" 
                :disabled="payment.loadingStates.value.orderDetails"
                :class="[
                  'mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm',
                  getFieldError('quantity') 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600',
                  'dark:bg-gray-700 dark:text-white'
                ]"
              >
                <option value="">Select quantity</option>
                <option value="3">3kg</option>
                <option value="5">5kg</option>
                <option value="6">6kg</option>
                <option value="12.5">12.5kg</option>
                <option value="25">25kg</option>
                <option value="50">50kg</option>
              </select>
              <p v-if="getFieldError('quantity')" class="mt-1 text-sm text-red-600">
                {{ getFieldError('quantity') }}
              </p>
            </div>

            <!-- Delivery Address -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delivery Address <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="address" 
                v-model="orderDetails.address" 
                :disabled="payment.loadingStates.value.orderDetails"
                rows="3"
                placeholder="Enter your full delivery address including landmarks"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm',
                  getFieldError('address') 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                ]"
              ></textarea>
              <p v-if="getFieldError('address')" class="mt-1 text-sm text-red-600">
                {{ getFieldError('address') }}
              </p>
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                id="phone" 
                v-model="orderDetails.phone" 
                :disabled="payment.loadingStates.value.orderDetails"
                placeholder="e.g., 08012345678"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm',
                  getFieldError('phone') 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                ]"
              >
              <p v-if="getFieldError('phone')" class="mt-1 text-sm text-red-600">
                {{ getFieldError('phone') }}
              </p>
            </div>

            <!-- Price Display -->
            <div v-if="orderDetails.quantity" class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ orderDetails.quantity }}kg × ₦{{ pricePerKg.toLocaleString() }}
                </span>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                  ₦{{ calculatedAmount.toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Error Display -->
            <div v-if="payment.errorStates.value.orderDetails" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
              {{ payment.errorStates.value.orderDetails }}
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-4">
              <button 
                type="button" 
                @click="handleCloseModal" 
                :disabled="payment.loadingStates.value.orderDetails"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="payment.loadingStates.value.orderDetails || !orderDetails.quantity"
                class="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 flex items-center"
              >
                <svg v-if="payment.loadingStates.value.orderDetails" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Continue to Payment
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Payment -->
        <div v-else-if="currentStep.step === 'payment'" class="space-y-4">
          <!-- Order Summary -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Order Summary</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Quantity:</span>
                <span class="text-gray-900 dark:text-white">{{ orderDetails.quantity }}kg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Price per kg:</span>
                <span class="text-gray-900 dark:text-white">₦{{ pricePerKg.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Delivery Address:</span>
                <span class="text-gray-900 dark:text-white text-right">{{ orderDetails.address }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Phone:</span>
                <span class="text-gray-900 dark:text-white">{{ orderDetails.phone }}</span>
              </div>
              <hr class="border-gray-300 dark:border-gray-600">
              <div class="flex justify-between font-semibold">
                <span class="text-gray-900 dark:text-white">Total Amount:</span>
                <span class="text-orange-600">₦{{ calculatedAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Status -->
          <div v-if="payment.loadingStates.value.orderCreation" class="p-3 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300 flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating your order...
          </div>

          <div v-if="payment.loadingStates.value.whatsappRedirect" class="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300 flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-green-700 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Opening WhatsApp...
          </div>

          <!-- Error Display -->
          <div v-if="payment.currentError.value" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
            {{ payment.currentError.value }}
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between space-x-4 pt-4">
            <button 
              type="button" 
              @click="goBackToOrderDetails" 
              :disabled="payment.isAnyLoading.value"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              ← Back
            </button>
                        <button
                @click="initiatePaystackPayment"
                :disabled="payment.isAnyLoading.value"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm',
                  'hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  payment.loadingStates.value.payment ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <template v-if="payment.loadingStates.value.payment">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </template>
                <span v-else>Pay ₦{{ calculatedAmount.toLocaleString() }}</span>
              </button>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import PaystackButton from 'vue3-paystack';
// Paystack types
interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  reference: string;
  currency?: string;
  channels?: string[];
  onSuccess?: (response: { reference: string; status: string; transaction: string }) => void;
  onClose?: () => void;
}
import { usePayment } from '@/composables/usePayment';
import { useFormValidation } from '@/composables/useFormValidation';
import BaseModal from '@/components/common/BaseModal.vue';
import MockPaymentModal from './MockPaymentModal.vue';
import type { Product, PaymentStep } from '@/types';

// Import Paystack types
type PaystackChannels = 'card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer';

// Extended Paystack config type
interface ExtendedPaystackConfig extends PaystackOptions {
  channels?: PaystackChannels[];
}

import { usePaystackConfig } from '@/composables/usePaystackConfig';
import { useAuthStore } from '@/stores/auth';

// Initialize auth store first
const authStore = useAuthStore();

// Get Paystack configuration
const paystack = usePaystackConfig();
const isTestMode = paystack.isTestModeRef;

// Initialize Paystack config with required properties
const paystackConfig = ref<ExtendedPaystackConfig>({
  key: paystack.configRef.value.publicKey,
  email: authStore.currentUser?.email || 'customer@example.com',
  amount: 0, // Will be set dynamically
  reference: `ref-${Date.now()}`,
  currency: 'NGN',
  channels: ['card', 'bank', 'ussd', 'mobile_money']
});

// Types
interface PaymentOrderDetails {
  quantity: string;
  address: string;
  phone: string;
  notes: string;
  amount: number;
  productId: string;
  payment_method?: string;
  payment_status?: string;
  payment_reference?: string;
}

// Component setup
const props = defineProps<{
  isOpen: boolean;
  pricePerKg: number;
}>();

const emit = defineEmits(['close', 'order-created']);

// Mock payment mode from environment variable
const showMockPayment = ref(import.meta.env.VITE_USE_MOCK_PAYMENT === 'true');

// Component methods
const handleMockPaymentSuccess = (): void => {
  emit('order-created');
  handleCloseModal();};

const handleOrderDetailsSubmit = (): void => {
  // Create a base order details object that matches the OrderDetails type
  const orderValidationData = {
    quantity: orderDetails.value.quantity,
    address: orderDetails.value.address,
    phone: orderDetails.value.phone,
    productId: orderDetails.value.productId,
    amount: calculatedAmount.value
  };

  const validation = validateOrderDetails(orderValidationData);

  if (!validation.isValid) {
    validationErrors.value = validation.errors;
    return;
  }

  // Update the payment-related fields in the order details
  orderDetails.value.payment_method = 'paystack';
  orderDetails.value.payment_status = 'pending';
  orderDetails.value.amount = calculatedAmount.value;

  // Update Paystack amount before payment
  paystackConfig.value.amount = calculatedAmount.value * 100; // Convert to kobo
  currentStepIndex.value = 1;
};

const goBackToOrderDetails = (): void => {
  currentStepIndex.value = 0;
};

// Expose methods to template
defineExpose({
  handleMockPaymentSuccess,
  handleOrderDetailsSubmit,
  goBackToOrderDetails
});

// Composables
const payment = usePayment();
const { validateOrderDetails } = useFormValidation();
const validationErrors = ref<Array<{ field: string; message: string }>>([]);

// Helper function to get field errors
const getFieldError = (field: string): string | null => {
  const error = validationErrors.value.find(err => err.field === field);
  return error ? error.message : null;
};

// State
const orderDetails = ref<PaymentOrderDetails>({
  quantity: '',
  address: '',
  phone: '',
  notes: '',
  productId: '',
  amount: 0
});

// Computed
const calculatedAmount = computed(() => {
  const quantity = parseFloat(orderDetails.value.quantity) || 0;
  return quantity * props.pricePerKg;
});

// Steps
const currentStepIndex = ref(0);
const steps = [
  { step: 'order-details', title: 'Order Details', description: 'Please provide your order details' },
  { step: 'payment', title: 'Payment', description: 'Complete your payment' }
];

const currentStep = computed(() => steps[currentStepIndex.value]);

const initiatePaystackPayment = () => {
  // TODO: Implement Paystack payment initiation
  console.log('Initiating Paystack payment...');
};

// The authStore is already initialized at the top of the file

const handleCloseModal = (): void => {
  if (!payment.isAnyLoading.value) {
    // Reset all states
    currentStepIndex.value = 0;
    validationErrors.value = [];
    payment.resetStates();
    
    // Reset form data
    orderDetails.value = {
      quantity: '',
      address: authStore.currentUser?.user_profile?.address || '',
      phone: authStore.currentUser?.phone || '',
      notes: '',
      productId: '',
      amount: 0
    };
    
    emit('close');
  }
};

// ... (rest of the code remains the same)
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Reset states when modal opens
    currentStepIndex.value = 0;
    validationErrors.value = [];
    payment.resetStates();
    
    // Pre-fill user data
    if (authStore.currentUser) {
      orderDetails.value.address = authStore.currentUser.user_profile?.address || '';
      orderDetails.value.phone = authStore.currentUser.phone || '';
    }
  }
});

// Lifecycle
onMounted(() => {
  // Pre-fill user data on mount
  if (authStore.currentUser) {
    orderDetails.value.address = authStore.currentUser.user_profile?.address || '';
    orderDetails.value.phone = authStore.currentUser.phone || '';
  }
});
</script>
