<template>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>
    
    <div v-else-if="error" class="space-y-5">
      <BaseCard>
        <div class="flex flex-col items-center justify-center p-10 text-center">
          <ExclamationCircleIcon class="h-16 w-16 text-error-500 mb-4" />
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">Error Loading Rider Profile</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">{{ error }}</p>
          <button
            @click="goBack"
            class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
          >
            Go Back
          </button>
        </div>
      </BaseCard>
    </div>
    
    <div v-else class="space-y-5">
      <!-- Alert Message for API responses -->
      <Alert 
        v-if="alertInfo.show" 
        :variant="alertInfo.type" 
        :title="alertInfo.title" 
        :message="alertInfo.message"
        :showLink="false"
        class="mb-4"
      />

      <!-- Eligibility Alert -->
      <Alert 
        v-if="Number(rider?.balance) > 0" 
        variant="error" 
        title="Not Eligible for Purchase" 
        message="Please clear your debts before making a new purchase."
        :showLink="false"
      />

      <!-- Rider Profile Card -->
      <BaseCard>
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            <!-- Profile Picture and QR Code -->
            <div class="flex flex-col items-center space-y-4 w-full md:w-1/3 lg:w-1/4">
              <div class="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img v-if="rider?.user_profile?.profile_pic_url" :src="rider.user_profile.profile_pic_url" alt="Rider" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-3xl font-semibold text-gray-500 dark:text-gray-400">
                  {{ getInitials(rider?.fullname || '') }}
                </div>
              </div>
              
              <!-- QR Code -->
              <!-- Temporarily commented out. Will be replaced by QrcodeVue component. -->
              <!-- 
              <div class="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <img
                  :src="generateQRCode(rider.id)"
                  alt="Rider QR Code"
                  class="w-32 h-32 object-contain"
                />
                <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  Rider ID: {{ formatRiderId(rider.id) }}
                </p>
              </div>
               -->
              
              <div v-if="showBuyProductButton" class="flex flex-col w-full space-y-2">
                <button
                  @click="openNewOrderModal"
                  class="flex justify-center items-center px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
                  :disabled="!showBuyProductButton"
                >
                  <ShoppingCartIcon class="h-5 w-5 mr-2" />
                  Buy Now
                </button>
                
                <button
                  @click="viewPaymentHistory"
                  class="flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  <ClockIcon class="h-5 w-5 mr-2" />
                  Order History
                </button>
              </div>
            </div>
            
            <!-- Profile Details -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h2 class="text-2xl font-semibold text-gray-800 dark:text-white/90">{{ rider?.fullname }}</h2>
                  <p class="text-gray-500 dark:text-gray-400">
                    {{ rider?.user_profile?.vehicle_type ? capitalizeFirstLetter(rider.user_profile.vehicle_type) : 'Rider' }}
                  </p>
                </div>
                
                <div v-if="rider?.banned_at" class="flex items-center space-x-2">
                  <div
                    class="bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500 px-3 py-1 rounded-full text-sm font-medium"
                  >
                   Rider has been Banned
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <PhoneIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.phone }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <EnvelopeIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.email }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <MapPinIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.user_profile?.address || 'No address provided' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Personal Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <IdentificationIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">NIN</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.user_profile?.nin || 'Not provided' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <TruckIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Vehicle Type</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.user_profile?.vehicle_type ? capitalizeFirstLetter(rider.user_profile.vehicle_type) : 'Not specified' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <BanknotesIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Unpaid Balance</p>
                        <p class="text-gray-800 dark:text-white/90">₦{{ formatAmount(rider?.balance || 0) }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <CalendarIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Registered</p>
                        <p class="text-gray-800 dark:text-white/90">{{ formatDate(rider?.created_at || '') }}</p>
                      </div>
                    </div>

                    <div class="flex items-start">
                      <CheckBadgeIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Status</p>
                        <div
                          :class="{
                            'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': rider?.verification_status === 'verified',
                            'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': rider?.verification_status === 'pending',
                            'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': rider?.verification_status === 'rejected'
                          }"
                          class="inline-block px-3 py-1 rounded-full text-sm font-medium mt-1"
                        >
                          {{ capitalizeFirstLetter(rider?.verification_status || 'pending') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Guarantor Info</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-start">
                      <UserIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Name</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.user_profile?.guarantors_name || 'Not provided' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <PhoneIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Phone</p>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.user_profile?.guarantors_phone || 'Not provided' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start">
                      <MapPinIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p class="text-gray-800 dark:text-white/90">{{ rider?.user_profile?.guarantors_address || 'Not provided' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Order Purchase Modal -->
    <Modal :isOpen="showOrderModal" @close="closeOrderModal">
      <template #body>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Order</h3>
            <button 
              @click="closeOrderModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          
          <!-- Modal Body - Order Form -->
          <div class="p-6">
            <form @submit.prevent="createOrder">
              <!-- Product Selection -->
              <div class="mb-4">
                <label for="product" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                <select 
                  id="product" 
                  v-model="orderForm.product_id" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  @change="handleProductChange"
                >
                  <option value="" disabled>Select a product</option>
                  <option v-for="product in filteredProducts" :key="product.id" :value="product.id">{{ product.name }}</option>
                </select>
              </div>
              
              <!-- Amount Due Selection -->
              <div class="mb-4">
                <label for="amount_due" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Amount Due (₦)</label>
                <select 
                  id="amount_due" 
                  v-model="orderForm.amount_due" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  :disabled="!orderForm.product_id"
                  @change="updatePartialPaymentOptions"
                >
                  <option value="" disabled>Select amount due</option>
                  <option v-for="amount in amountDueOptions" :key="amount" :value="amount">₦{{ amount }}</option>
                </select>
              </div>
              
              <!-- Payment Type Selection -->
              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Type</label>
                <div class="flex items-center space-x-4">
                  <label class="inline-flex items-center">
                    <input 
                      type="radio" 
                      v-model="orderForm.payment_type" 
                      value="full" 
                      class="form-radio text-brand-500" 
                      @change="handlePaymentTypeChange"
                    />
                    <span class="ml-2 text-gray-700 dark:text-gray-300">Full Payment</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input 
                      type="radio" 
                      v-model="orderForm.payment_type" 
                      value="part" 
                      class="form-radio text-brand-500" 
                      @change="handlePaymentTypeChange"
                    />
                    <span class="ml-2 text-gray-700 dark:text-gray-300">Partial Payment</span>
                  </label>
                </div>
              </div>

              <!-- Amount Paid for Partial Payment -->
              <div v-if="orderForm.payment_type === 'part'" class="mb-4">
                <label for="amount_paid" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Amount Paid (₦)</label>
                <select 
                  id="amount_paid" 
                  v-model="orderForm.amount_paid" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :required="orderForm.payment_type === 'part'"
                  :disabled="!orderForm.amount_due"
                >
                  <option value="" disabled>Select amount paid</option>
                  <option v-for="amount in availableAmountOptions" :key="amount" :value="amount">₦{{ amount }}</option>
                </select>
              </div>

              <!-- Payment Method Selection -->
              <div class="mb-6">
                <label for="payment_method" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                <select 
                  id="payment_method" 
                  v-model="orderForm.payment_method" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="" disabled>Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeOrderModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
                >
                  <span v-if="isSubmitting">Processing...</span>
                  <span v-else>Create Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Payment History Modal -->
    <Modal :isOpen="showPaymentHistoryModal" @close="closePaymentHistoryModal">
      <template #body>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payment History</h3>
            <button 
              @click="closePaymentHistoryModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          
          <!-- Modal Body - Payment History -->
          <div class="p-6">
            <div v-if="isLoadingPayments" class="flex justify-center py-10">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
            </div>
            
            <div v-else-if="paymentHistoryError" class="flex flex-col items-center justify-center p-6 text-center">
              <ExclamationCircleIcon class="h-12 w-12 text-error-500 mb-3" />
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Error Loading Payment History</h4>
              <p class="text-gray-500 dark:text-gray-400">{{ paymentHistoryError }}</p>
            </div>
            
            <div v-else-if="paymentHistory.length === 0" class="flex flex-col items-center justify-center p-10 text-center">
              <ClipboardDocumentIcon class="h-12 w-12 text-gray-400 mb-3" />
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">No Payment Records</h4>
              <p class="text-gray-500 dark:text-gray-400">This rider has not made any payments yet.</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="payment in paymentHistory" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ payment.product.toUpperCase() }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₦{{ formatAmount(payment.amount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="{
                          'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': payment.status === 'completed',
                          'bg-info-100 text-success-800 dark:bg-success-900/30 dark:text-success-500': payment.status === 'paid',
                          'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-500': payment.status === 'pending',
                          'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-500': payment.status === 'failed'
                        }"
                      >
                        {{ capitalizeFirstLetter(payment.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(payment.created_at) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- See All Orders Link -->
            <div v-if="paymentHistory.length > 0" class="mt-4 text-right">
                <button 
                  @click="goToOrderHistoryForRider"
                  class="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 focus:outline-none"
                >
                  See all orders
                </button>
            </div>

          </div>
        </div>
      </template>
    </Modal>
</template>

<script setup lang="ts">
// Temporary comment to trigger linter re-evaluation
import { ref, onMounted, computed, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Removed as not found and not explicitly used: import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { ShoppingCartIcon, ClockIcon, ExclamationCircleIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, IdentificationIcon, TruckIcon, BanknotesIcon, CalendarIcon, CheckBadgeIcon, UserIcon, XMarkIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import Alert from '@/components/ui/Alert.vue';
import Modal from '@/components/ui/Modal.vue';
import apiService from '@/services/apiService';
import { useProductStore } from '@/stores/product';
import type { AxiosResponse } from 'axios';

interface Rider {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  role: string;
  branch_id: string;
  created_at: string;
  balance: number;
  banned_at: string | null;
  verification_status: string;
  user_profile: {
    address: string;
    nin: string;
    guarantors_name: string;
    guarantors_phone: string;
    guarantors_address: string;
    vehicle_type: string;
    profile_pic_url: string;
  } | null;
}

interface Product {
  id: number;
  name: string;
  unit: string;
  price: number;
  rules: number[]; // Assuming rules is an array of allowed amounts
}

interface OrderForm {
  product_id: number | null;
  amount_due: number | null;
  payment_type: 'full' | 'part';
  payment_method: 'cash' | 'bank_transfer' | 'wallet';
  amount_paid: number | null;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();

// Destructure products from the store to ensure reactivity
const { products } = toRefs(productStore);

const rider = ref<Rider | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const showOrderModal = ref(false);
const currentPageTitle = ref('Rider Profile');
const orderForm = ref<OrderForm>({
  product_id: null,
  amount_due: null,
  payment_type: 'full',
  payment_method: 'cash',
  amount_paid: null,
});

const alertInfo = ref({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  title: '',
  message: '',
});

const amountDueOptions = ref<number[]>([]);
const availableAmountOptions = ref<number[]>([]);
const isSubmitting = ref(false);

const showPaymentHistoryModal = ref(false);
const isLoadingPayments = ref(false);
const paymentHistoryError = ref<string | null>(null);
const paymentHistory = ref<any[]>([]);

// Computed properties
const showBuyProductButton = computed(() => {
  return rider.value &&
    !rider.value.banned_at &&
    rider.value.verification_status === 'verified' &&
    Number(rider.value.balance) <= 0;
});

const filteredProducts = computed<Product[]>(() => {
  console.log('Computing filteredProducts...');
  console.log('products (from toRefs):', products.value); // Use .value for ref
  console.log('rider.value?.user_profile?.vehicle_type:', rider.value?.user_profile?.vehicle_type);

  if (!Array.isArray(products.value) || products.value.length === 0 || !rider.value?.user_profile?.vehicle_type) {
    return [];
  }

  const vehicleType = rider.value.user_profile.vehicle_type;

  if (vehicleType === 'keke' || vehicleType === 'car') {
    // Rider type: PMS and CNG only
    return products.value.filter((p: Product) => p.name === 'PMS' || p.name === 'CNG');
  } else if (vehicleType === 'other') {
    // Regular user type: LPG only
    return products.value.filter((p: Product) => p.name === 'LPG');
  } else {
    return [];
  }
});

async function fetchRiderData() {
  isLoading.value = true;
  error.value = null;
  try {
  const riderId = route.params.id as string;
  if (!riderId) {
      error.value = 'Rider ID is missing.';
    isLoading.value = false;
    return;
  }
  
    const token = authStore.token;
    if (!token) {
      throw new Error('Authentication token not found.');
    }
    
    const response: AxiosResponse<Rider> = await apiService.get(`/users/${riderId}`, token);
      rider.value = response.data;
    currentPageTitle.value = `${rider.value?.fullname || 'Rider'}'s Profile`;
  } catch (err: any) {
    console.error('Error fetching rider data:', err);
    error.value = err.message || 'Failed to load rider profile.';
  } finally {
    isLoading.value = false;
  }
}

function formatAmount(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '0.00';
  }
  return Number(amount).toLocaleString();
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatRiderId(id: string): string {
  if (!id) return 'N/A';
  return id.substring(0, 8).toUpperCase();
}

function getInitials(fullname: string): string {
  return fullname.split(' ').map(n => n[0]).join('').toUpperCase();
}

function goBack() {
  router.back();
}

function showAlert(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) {
  alertInfo.value.show = true;
  alertInfo.value.type = type;
  alertInfo.value.title = title;
  alertInfo.value.message = message;
  setTimeout(() => {
    alertInfo.value.show = false;
  }, 5000);
}

function openNewOrderModal() {
  showOrderModal.value = true;
  orderForm.value = {
    product_id: null,
    amount_due: null,
    payment_type: 'full',
    payment_method: 'cash',
    amount_paid: null,
  };
}

function closeOrderModal() {
  showOrderModal.value = false;
}

function closePaymentHistoryModal() {
  showPaymentHistoryModal.value = false;
  paymentHistory.value = [];
  paymentHistoryError.value = null;
}

function goToOrderHistoryForRider() {
  if (rider.value) {
    router.push({ name: 'OrderHistory', query: { rider_id: rider.value.id } });
  }
}

function viewPaymentHistory() {
  if (rider.value) {
    router.push({ name: 'OrderHistory', query: { rider_id: rider.value.id } });
  }
}

function handlePaymentTypeChange() {
  if (orderForm.value.payment_type === 'full') {
    orderForm.value.amount_paid = orderForm.value.amount_due;
  } else {
    orderForm.value.amount_paid = null;
  }
}

function handleProductChange() {
  // Reset amount-related fields
  orderForm.value.amount_due = null;
  orderForm.value.amount_paid = null;
  
  // Generate amount due options based on product rules from fetched products
  const selectedProduct = products.value.find((p: Product) => p.id === orderForm.value.product_id); // Use products.value
  if (selectedProduct) {
    amountDueOptions.value = selectedProduct.rules.sort((a: number, b: number) => a - b);
  } else {
    amountDueOptions.value = [];
  }
  
  // Clear partial payment options until amount_due is selected
  availableAmountOptions.value = [];
}

function updatePartialPaymentOptions() {
  const fullAmount = Number(orderForm.value.amount_due);
  const selectedProduct = products.value.find((p: Product) => p.id === orderForm.value.product_id); // Use products.value

  if (fullAmount > 0 && selectedProduct) {
    // Filter rules to only include amounts less than the full amount
    // and ensure they are valid partial payment amounts (e.g., divisible by step if applicable)
    availableAmountOptions.value = selectedProduct.rules.filter((ruleAmount: number) => ruleAmount < fullAmount);
  } else {
    availableAmountOptions.value = [];
  }
}

// Order creation logic
async function createOrder() {
    isSubmitting.value = true;
  try {
    // Basic frontend validation (backend will re-validate)
    if (!orderForm.value.product_id || !orderForm.value.amount_due) {
      showAlert('error', 'Validation Error', 'Please select a product and enter the amount.');
      return;
    }

    const selectedProduct = products.value.find((p: Product) => p.id === orderForm.value.product_id); // Use products.value
    if (!selectedProduct || !selectedProduct.rules.includes(orderForm.value.amount_due as number)) {
      showAlert('error', 'Validation Error', 'Invalid amount for the selected product.');
      return;
    }

    // Simulate payment based on type (no actual gateway interaction yet)
    if (orderForm.value.payment_type === 'full') {
      orderForm.value.amount_paid = orderForm.value.amount_due; // Full payment means amount_paid is amount_due
    } else {
      // For partial payments, amount_paid should be set by user input if applicable.
      // If "part" is selected, and amount_paid is not explicitly set, it means it's a pay later partial
      orderForm.value.amount_paid = orderForm.value.amount_paid || 0; // Ensure amount_paid is 0 if pay later partial
    }

    // Prepare payload for backend
    const payload = {
      payer_id: rider.value?.id,
      product_id: orderForm.value.product_id,
      amount_due: orderForm.value.amount_due,
      payment_type: orderForm.value.payment_type,
      payment_method: orderForm.value.payment_method,
      amount_paid: orderForm.value.amount_paid,
    };

    const token = authStore.token;
    if (!token) {
      throw new Error('Authentication token not found.');
    }
    const response: { message: string } = await apiService.post('/orders', payload, token);
    showAlert('success', 'Success', response.message || 'Order created successfully!');
    closeOrderModal();
    
    fetchRiderData(); 
  } catch (err: any) {
    console.error('Error creating order:', err);
    showAlert('error', 'Error', err.message || 'Failed to create order.');
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  await fetchRiderData();
  productStore.init(); // Initialize product store from localStorage
  console.log('Products after init call (original store):', productStore.products);
  console.log('Products after init call (from toRefs, after await):', products.value);

  // If products are still not loaded, fetch them directly from local rules
  if (productStore.products.length === 0) {
    console.log('Products not found in localStorage, generating from local rules...');
    await productStore.fetchProductsFromLocalRules(); // Changed to use local rules
    console.log('Products after generating from local rules in RiderProfileView:', productStore.products);
  }
});
</script>

<style scoped>
</style>