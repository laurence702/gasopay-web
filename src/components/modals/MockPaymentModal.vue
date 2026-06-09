<template>
  <Modal :isOpen="isOpen" @close="handleClose">
    <template #body>
      <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Complete Your Payment
          </h2>
          <p class="text-center text-gray-600 dark:text-gray-300" >
            Test Payment - No real money will be charged
          </p>
        </div>

        <!-- Order Summary -->
        <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Order Summary</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Quantity:</span>
              <span class="text-gray-900 dark:text-white">{{ quantity }}kg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Total Amount:</span>
              <span class="text-orange-600 font-semibold">₦{{ amount.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Mock Payment Form -->
        <form @submit.prevent="processPayment">
          <div class="space-y-4">
            <!-- Card Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card Number
              </label>
              <div class="relative">
                <input
                  v-model="cardNumber"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="4242 4242 4242 4242"
                  readonly
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1.5a2.25 2.25 0 0 1 2.25 2.25v1.5h-4.5v-1.5A2.25 2.25 0 0 1 12 1.5z"/>
                    <path fill-rule="evenodd" d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h12a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-11.25zm3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-4.5zm4.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-4.5z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Expiry and CVC -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry
                </label>
                <input
                  v-model="cardExpiry"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="MM/YY"
                  readonly
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CVC
                </label>
                <input
                  v-model="cardCvc"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="123"
                  readonly
                />
              </div>
            </div>

            <!-- Billing Address (optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Billing Address
              </label>
              <input
                v-model="billingAddress"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="123 Test St, Test City"
                readonly
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isProcessing"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 flex items-center"
            >
              <span v-if="isProcessing" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isProcessing ? 'Processing...' : 'Pay ₦' + amount.toLocaleString() }}
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';
import Modal from '@/components/ui/Modal.vue';

const authStore = useAuthStore();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: [String, Number],
    required: true,
  },
  orderDetails: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'payment-success']);

// Mock card details (readonly)
const cardNumber = ref('4242 4242 4242 4242');
const cardExpiry = ref('12/25');
const cardCvc = ref('123');
const billingAddress = ref('123 Test St, Test City');
const isProcessing = ref(false);

const handleClose = () => {
  emit('close');
};

const processPayment = async () => {
  isProcessing.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Define interfaces for the payment response
    interface OrderDetails {
      quantity: string | number;
      product_id: string;
      amount: number;
      address: string;
      phone: string;
      notes: string;
    }

    interface PaymentMetadata {
      custom_fields: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
      order_details?: OrderDetails;
    }

    interface PaymentResponseData {
      id: number;
      domain: string;
      status: string;
      reference: string;
      amount: number;
      paid_at: string;
      channel: string;
      currency: string;
      ip_address: string;
      metadata: PaymentMetadata;
      log: {
        time_spent: number;
        attempts: number;
        authentication: string;
        errors: number;
        success: boolean;
        mobile: boolean;
        input: string[];
        channel: string | null;
        history: Array<{
          type: string;
          message: string;
          time: number;
        }>;
      };
      fees: number;
      fees_split: null;
      authorization: {
        authorization_code: string;
        bin: string;
        last4: string;
        exp_month: string;
        exp_year: string;
        channel: string;
        card_type: string;
        bank: string;
        country_code: string;
        brand: string;
        reusable: boolean;
        signature: string;
        account_name: string | null;
      };
      customer: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        customer_code: string;
        phone: string;
        metadata: null;
        risk_action: string;
        international_format_phone: string | null;
      };
      plan: null;
      split: Record<string, unknown>;
      order_id: string;
      paidAt: string;
      createdAt: string;
      requested_amount: number;
      pos_transaction_data: null;
      source: null;
      fees_breakdown: null;
    }

    interface MockPaymentResponse {
      status: string;
      message: string;
      data: PaymentResponseData;
      reference: string;
      amount: number;
      currency: string;
      timestamp: string;
    }

    // Create a mock payment response that matches the Paystack response structure
    const mockResponse: MockPaymentResponse = {
      status: 'success',
      message: 'Payment successful',
      data: {
        id: Date.now(),
        domain: 'test',
        status: 'success',
        reference: `test_ref_${Date.now()}`,
        amount: props.amount * 100, // Convert to kobo
        paid_at: new Date().toISOString(),
        channel: 'card',
        currency: 'NGN',
        ip_address: '127.0.0.1',
        metadata: {
          custom_fields: [
            {
              display_name: 'Product',
              variable_name: 'product',
              value: `Gas - ${props.quantity}kg`
            },
            {
              display_name: 'Customer',
              variable_name: 'customer',
              value: 'Test User'
            }
          ]
        },
        log: {
          time_spent: 3,
          attempts: 1,
          authentication: 'pin',
          errors: 0,
          success: true,
          mobile: false,
          input: [],
          channel: null,
          history: [
            {
              type: 'action',
              message: 'Filled these fields: card number',
              time: 1
            },
            {
              type: 'success',
              message: 'Successfully paid',
              time: 2
            }
          ]
        },
        fees: 0,
        fees_split: null,
        authorization: {
          authorization_code: 'AUTH_testcode123',
          bin: '408408',
          last4: '4081',
          exp_month: '12',
          exp_year: '2030',
          channel: 'card',
          card_type: 'visa',
          bank: 'TEST BANK',
          country_code: 'NG',
          brand: 'visa',
          reusable: true,
          signature: 'SIG_test123',
          account_name: null
        },
        customer: {
          id: 1234567,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          customer_code: 'CUS_test123',
          phone: '08012345678',
          metadata: null,
          risk_action: 'default',
          international_format_phone: null
        },
        plan: null,
        split: {},
        order_id: `order_${Date.now()}`,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        requested_amount: props.amount * 100,
        pos_transaction_data: null,
        source: null,
        fees_breakdown: null
      },
      reference: `test_ref_${Date.now()}`,
      amount: props.amount,
      currency: 'NGN',
      timestamp: new Date().toISOString(),
    };
    
    // Add order details to the response for the parent component
    const orderDetails: OrderDetails = {
      quantity: props.quantity,
      product_id: props.orderDetails.productId,
      amount: props.amount,
      address: props.orderDetails.address,
      phone: props.orderDetails.phone,
      notes: props.orderDetails.notes
    };
    
    // Update metadata with order details
    const metadataWithOrderDetails: PaymentMetadata = {
      ...mockResponse.data.metadata,
      order_details: orderDetails
    };
    
    mockResponse.data.metadata = metadataWithOrderDetails;
    
    try {
      // Log the payment to the backend using the authenticated API client
      // Generate a random amount between 5000 and 15000 in multiples of 1000
      const randomAmount = Math.floor(Math.random() * 11 + 5) * 1000; // 5000-15000 in multiples of 1000
      
      const paymentData = {
        reference: mockResponse.reference,
        amount: randomAmount,
        status: 'success',
        metadata: {
          ...metadataWithOrderDetails,
          original_amount: props.amount, // Keep original amount in metadata
          random_amount: randomAmount    // Add the random amount to metadata for reference
        },
        timestamp: new Date().toISOString()
      };
      
      console.log('Sending payment data:', paymentData);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/payments/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log payment');
      }
      
      // Show success message with SweetAlert2
      await Swal.fire({
        title: 'Payment Successful!',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#10B981',
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
      
      // Trigger success callback with the mock response
      emit('payment-success', mockResponse);
      
      // Close the modal
      handleClose();
      
    } catch (error) {
      console.error('Error logging payment:', error);
      
      // Log the complete error response
      const errorMessage = error.response?.data?.message || 'Unknown error occurred';
      const errorDetails = error.response?.data?.error || error.message;
      
      console.error('Payment logging error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      // Show detailed error message with SweetAlert2
      await Swal.fire({
        title: 'Payment Processed, But...',
        html: `
          <div class="text-left">
            <p>Your payment was successful, but there was an issue saving the details.</p>
            <p class="mt-2 text-sm text-gray-600">
              <strong>Reference:</strong> ${mockResponse.reference}<br>
              <strong>Error:</strong> ${errorMessage}
            </p>
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'I Understand',
        confirmButtonColor: '#EF4444',
        showCancelButton: true,
        cancelButtonText: 'View Details',
        cancelButtonColor: '#6B7280',
      }).then((result) => {
        if (result.isDismissed) {
          // Show full error details in console
          Swal.fire({
            title: 'Error Details',
            text: JSON.stringify({
              status: error.response?.status,
              error: errorMessage,
              details: errorDetails,
              reference: mockResponse.reference
            }, null, 2),
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: '#3B82F6',
            width: '80%'
          });
        }
      });
      
      // Still trigger success since payment was processed
      emit('payment-success', mockResponse);
      handleClose();
    }
    
  } catch (error) {
    console.error('Payment error:', error);
    await Swal.fire({
      title: 'Payment Failed',
      text: 'There was an error processing your payment. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#EF4444'
    });
  } finally {
    isProcessing.value = false;
  }
};
</script>
