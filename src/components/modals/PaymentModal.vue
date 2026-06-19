<template>
  <BaseModal :is-open="isOpen" @close="handleClose">
    <template #body>
      <div class="p-6 bg-white dark:bg-gray-800 rounded-xl max-w-md w-full mx-auto">

        <!-- ── Header ── -->
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            <span v-if="step === 'order'">Order LPG Gas</span>
            <span v-else-if="step === 'success'">Order Placed!</span>
            <span v-else-if="step === 'partial-error'">Action Needed</span>
            <span v-else>Processing…</span>
          </h2>
          <button
            v-if="!isProcessing"
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- ══════════════════════════════════════════════
             STEP 1 — Order form
        ══════════════════════════════════════════════ -->
        <div v-if="step === 'order'" class="space-y-4">
          <!-- Quantity -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity (kg) <span class="text-red-500">*</span>
            </label>
            <select v-model="form.quantity" class="gp-input" required>
              <option value="">Select quantity</option>
              <option value="3">3 kg</option>
              <option value="5">5 kg</option>
              <option value="6">6 kg</option>
              <option value="12.5">12.5 kg</option>
              <option value="25">25 kg</option>
              <option value="50">50 kg</option>
            </select>
          </div>

          <!-- Delivery address -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Delivery Address <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.address"
              rows="2"
              placeholder="Enter your full delivery address"
              class="gp-input"
              style="height:auto; padding-top:0.625rem; padding-bottom:0.625rem; resize:none;"
              required
            ></textarea>
          </div>

          <!-- Phone -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input v-model="form.phone" type="tel" placeholder="08012345678" class="gp-input" required />
          </div>

          <!-- Order summary (shown once quantity selected) -->
          <div v-if="form.quantity" class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Order Summary</p>
            </div>
            <div class="px-4 py-3 space-y-2 text-sm">
              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{{ form.quantity }}kg × ₦{{ pricePerKg.toLocaleString() }}/kg</span>
                <span>₦{{ gasSubtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span class="flex items-center gap-1.5">
                  Delivery fee
                  <span v-if="isPro" class="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    Pro benefit
                  </span>
                </span>
                <span v-if="isPro" class="line-through text-gray-400">₦{{ DELIVERY_FEE.toLocaleString() }}</span>
                <span v-else>₦{{ DELIVERY_FEE.toLocaleString() }}</span>
              </div>
              <div v-if="isPro" class="flex justify-between text-green-600 dark:text-green-400 text-sm font-medium">
                <span>Pro discount</span>
                <span>−₦{{ DELIVERY_FEE.toLocaleString() }}</span>
              </div>
              <hr class="border-gray-200 dark:border-gray-700" />
              <div class="flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span style="color:#00bf63;">₦{{ totalAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

          <div class="flex gap-3 pt-1">
            <button @click="handleClose" type="button" class="flex-1 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button
              @click="confirmOrder"
              :disabled="!canConfirm"
              class="gp-btn-primary flex-1 py-2.5"
            >
              Pay ₦{{ totalAmount.toLocaleString() }}
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════
             Processing spinner
        ══════════════════════════════════════════════ -->
        <div v-else-if="step === 'processing'" class="flex flex-col items-center gap-4 py-8">
          <svg class="animate-spin h-10 w-10" style="color:#00bf63;" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p class="text-sm text-gray-500 dark:text-gray-400">Processing your payment…</p>
        </div>

        <!-- ══════════════════════════════════════════════
             Success
        ══════════════════════════════════════════════ -->
        <div v-else-if="step === 'success'" class="flex flex-col items-center gap-4 py-4">
          <div class="w-16 h-16 rounded-full flex items-center justify-center" style="background-color:#dcfce8;">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16L12 22L26 8" stroke="#00bf63" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="text-center">
            <p class="font-semibold text-gray-900 dark:text-white text-lg">Payment Successful!</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Your order for {{ form.quantity }}kg LPG has been placed.</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">{{ paymentReference }}</p>
          </div>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white w-full justify-center transition-opacity hover:opacity-90"
            style="background-color:#25d366;"
          >
            <!-- WhatsApp icon -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.553 4.106 1.524 5.836L.057 23.453A.5.5 0 00.547 24l5.721-1.5A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.955 9.955 0 01-5.077-1.388l-.364-.214-3.74.98.999-3.646-.237-.375A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            Message Admin on WhatsApp
          </a>

          <button @click="handleClose" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 underline">
            Close
          </button>
        </div>

        <!-- ══════════════════════════════════════════════
             Partial error (payment ok, order save failed)
        ══════════════════════════════════════════════ -->
        <div v-else-if="step === 'partial-error'" class="space-y-4 py-2">
          <div class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-700">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-amber-800 dark:text-amber-300">Payment Processed But Order Wasn't Saved</p>
              <p class="text-xs text-amber-700 dark:text-amber-400 mt-1">Your payment went through successfully. Please contact support with the reference below and we'll sort it out immediately.</p>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Payment Reference</p>
              <p class="text-sm font-mono font-semibold text-gray-800 dark:text-white break-all">{{ paymentReference }}</p>
            </div>
            <button
              @click="copyReference"
              class="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <a
            :href="supportWhatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style="background-color:#25d366;"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.553 4.106 1.524 5.836L.057 23.453A.5.5 0 00.547 24l5.721-1.5A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.955 9.955 0 01-5.077-1.388l-.364-.214-3.74.98.999-3.646-.237-.375A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            Contact Support on WhatsApp
          </a>

          <button @click="handleClose" class="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 underline">
            Close
          </button>
        </div>

      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// @paystack/inline-js is already installed
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PaystackPop from '@paystack/inline-js'
import BaseModal from '@/components/common/BaseModal.vue'
import apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/auth'

// ── Constants ────────────────────────────────────────────────────────────────
const DELIVERY_FEE = 1000
const ADMIN_WHATSAPP = '2348131361241'
const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string

// ── Props / Emits ────────────────────────────────────────────────────────────
const props = defineProps<{
  isOpen: boolean
  pricePerKg: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'order-created'): void
}>()

// ── Store ────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()

// ── State ────────────────────────────────────────────────────────────────────
type Step = 'order' | 'processing' | 'success' | 'partial-error'
const step = ref<Step>('order')
const isProcessing = ref(false)
const paymentReference = ref('')
const copied = ref(false)
const formError = ref('')

const form = ref({
  quantity: '',
  address: '',
  phone: '',
})

// ── Computed ─────────────────────────────────────────────────────────────────
const isPro = computed(() => {
  const user = authStore.currentUser as Record<string, unknown> | null
  return user?.subscription_tier === 'pro'
})

const gasSubtotal = computed(() => {
  const qty = parseFloat(form.value.quantity) || 0
  return qty * props.pricePerKg
})

const totalAmount = computed(() => {
  return gasSubtotal.value + (isPro.value ? 0 : DELIVERY_FEE)
})

const canConfirm = computed(() => {
  return !!form.value.quantity &&
    !!form.value.address.trim() &&
    !!form.value.phone.trim() &&
    totalAmount.value > 0
})

const whatsappUrl = computed(() => {
  const msg = encodeURIComponent(
    `I just purchased ${form.value.quantity}kg of LPG on Gasopay! 🔥 Reference: ${paymentReference.value}`
  )
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`
})

const supportWhatsappUrl = computed(() => {
  const msg = encodeURIComponent(
    `Hi, my payment went through on Gasopay but my order wasn't saved. Reference: ${paymentReference.value}. Please help.`
  )
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`
})

// ── Methods ──────────────────────────────────────────────────────────────────
const resetForm = () => {
  form.value = {
    quantity: '',
    address: authStore.currentUser?.user_profile?.address ?? '',
    phone: authStore.currentUser?.phone ?? '',
  }
  formError.value = ''
  paymentReference.value = ''
  step.value = 'order'
  isProcessing.value = false
  copied.value = false
}

const handleClose = () => {
  if (isProcessing.value) return
  resetForm()
  emit('close')
}

const copyReference = async () => {
  try {
    await navigator.clipboard.writeText(paymentReference.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard not available — silently fail
  }
}

const confirmOrder = () => {
  formError.value = ''
  if (!canConfirm.value) {
    formError.value = 'Please fill in all required fields.'
    return
  }

  const user = authStore.currentUser
  if (!user?.email) {
    formError.value = 'Unable to process payment. Please sign in again.'
    return
  }

  const ref = `gasopay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  paymentReference.value = ref

  isProcessing.value = true
  step.value = 'processing'

  const popup = new PaystackPop()

  popup.newTransaction({
    key: PAYSTACK_KEY,
    email: user.email,
    amount: totalAmount.value * 100, // convert to kobo
    reference: ref,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: user.fullname ?? '' },
        { display_name: 'Quantity (kg)', variable_name: 'quantity_kg', value: form.value.quantity },
        { display_name: 'Delivery Address', variable_name: 'delivery_address', value: form.value.address },
      ],
    },
    onSuccess: (transaction: { reference: string }) => {
      paymentReference.value = transaction.reference || ref
      handlePaymentSuccess(transaction.reference || ref)
    },
    onCancel: () => {
      isProcessing.value = false
      step.value = 'order'
    },
  })
}

const handlePaymentSuccess = async (reference: string) => {
  try {
    await apiService.post(
      '/payments/log',
      {
        reference,
        quantity: parseFloat(form.value.quantity),
        amount: totalAmount.value,
        delivery_address: form.value.address,
        phone: form.value.phone,
      },
      authStore.token ?? undefined,
    )
    step.value = 'success'
    emit('order-created')
  } catch (err) {
    console.error('Order save failed after payment:', err)
    step.value = 'partial-error'
  } finally {
    isProcessing.value = false
  }
}

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(() => props.isOpen, (open) => {
  if (open) {
    resetForm()
  }
})
</script>
