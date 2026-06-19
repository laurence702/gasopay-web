<template>
  <PageBreadcrumb pageTitle="Upload Payment Proof" />

  <div class="max-w-xl mx-auto space-y-5">
    <!-- Order summary -->
    <BaseCard v-if="order">
      <div class="p-5">
        <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Order Summary</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Order ID</span>
            <span class="font-semibold text-gray-800 dark:text-white">#{{ order.id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Product</span>
            <span class="font-semibold text-gray-800 dark:text-white">{{ order.product?.name ?? 'LPG' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Amount Due</span>
            <span class="font-bold text-lg text-brand-600">₦{{ formatAmount(order.total_amount) }}</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Upload -->
    <BaseCard>
      <div class="p-5">
        <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Upload Receipt</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
          After making your bank transfer, take a clear photo of the receipt and upload it here for admin verification.
        </p>

        <!-- Drop zone -->
        <div
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="onFileDrop"
          :class="[
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            previewUrl
              ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
        >
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

          <div v-if="previewUrl" class="space-y-3">
            <img :src="previewUrl" alt="Receipt preview" class="max-h-48 mx-auto rounded-lg object-contain" />
            <p class="text-sm text-brand-600 font-medium">{{ selectedFile?.name }}</p>
            <button type="button" @click.stop="clearFile" class="text-xs text-red-500 hover:underline">Remove</button>
          </div>
          <div v-else>
            <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p class="text-sm text-gray-600 dark:text-gray-300">Click to upload or drag & drop</p>
            <p class="text-xs text-gray-400 mt-1">PNG, JPG or JPEG (max 5MB)</p>
          </div>
        </div>

        <!-- Success / Error messages -->
        <div v-if="successMsg" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
          {{ successMsg }}
        </div>
        <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {{ errorMsg }}
        </div>

        <button
          :disabled="!selectedFile || isUploading"
          @click="submitProof"
          class="mt-5 w-full px-4 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="isUploading" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
          {{ isUploading ? 'Uploading...' : 'Submit Receipt' }}
        </button>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CloudArrowUpIcon } from '@heroicons/vue/24/outline';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';

defineOptions({ name: 'RiderUploadProof' });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const orderId = route.params.orderId as string;

interface OrderInfo {
  id: number;
  total_amount: number;
  product?: { name: string; unit: string };
}

const order = ref<OrderInfo | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isUploading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

function formatAmount(n: number) { return Number(n).toLocaleString(); }

function triggerFileInput() { fileInput.value?.click(); }

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) setFile(file);
}

function onFileDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) setFile(file);
}

function setFile(file: File) {
  if (file.size > 5 * 1024 * 1024) { errorMsg.value = 'File too large. Max 5MB.'; return; }
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  errorMsg.value = '';
}

function clearFile() {
  selectedFile.value = null;
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

async function submitProof() {
  if (!selectedFile.value) return;
  isUploading.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  try {
    const token = authStore.token;
    if (!token) throw new Error('Not authenticated');
    const formData = new FormData();
    formData.append('receipt_image', selectedFile.value);
    formData.append('order_id', orderId);
    await apiService.postForm('/payment-proofs', formData, token);
    successMsg.value = 'Receipt uploaded successfully! An admin will verify your payment shortly.';
    setTimeout(() => router.push('/rider/pending-payments'), 2000);
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.message ?? 'Upload failed. Please try again.';
  } finally {
    isUploading.value = false;
  }
}

onMounted(async () => {
  try {
    const token = authStore.token;
    if (!token) return;
    const res = await apiService.get<{ data: OrderInfo }>(`/orders/${orderId}`, token);
    order.value = res.data;
  } catch {
    order.value = { id: Number(orderId), total_amount: 8000, product: { name: 'LPG', unit: 'kg' } };
  }
});
</script>
