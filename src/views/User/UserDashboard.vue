<template>
  <div class="space-y-6">

    <!-- ── Welcome header ── -->
    <div v-if="showWelcome" class="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <button @click="showWelcome = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <div class="flex items-center gap-3 flex-wrap">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {{ authStore.currentUser?.fullname?.split(' ')[0] || 'there' }}!
        </h1>
        <span v-if="isPro" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          ⭐ Pro
        </span>
      </div>
      <p class="mt-1 text-gray-500 dark:text-gray-400 text-sm">Manage your fuel orders and track deliveries.</p>
    </div>

    <!-- ── Upgrade to Pro CTA (free tier only) ── -->
    <div
      v-if="!isPro"
      class="p-5 rounded-xl border border-dashed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      style="border-color:#00bf63; background-color:#f0fdf6;"
    >
      <div>
        <p class="font-semibold text-gray-800 text-sm">🚀 Upgrade to <strong>Gasopay Pro</strong></p>
        <p class="text-xs text-gray-500 mt-0.5">Remove the ₦1,000 delivery fee on every order — pay once, save forever.</p>
      </div>
      <button @click="showUpgradeModal = true" class="gp-btn-primary px-4 py-2 text-xs whitespace-nowrap">
        Upgrade →
      </button>
    </div>

    <!-- ── Buy LPG card ── -->
    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
      <div class="w-full md:w-1/3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 h-36 flex items-center justify-center">
        <img src="@/assets/images/lpg-truck.png" alt="LPG delivery truck" class="object-cover w-full h-full" onerror="this.style.display='none'" />
      </div>
      <div class="w-full md:w-2/3 text-center md:text-left">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Get Cooking Gas Delivered</h2>
        <p class="mt-1.5 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          Order LPG in any cylinder size and have it delivered to your doorstep.
          <span v-if="!isPro" class="text-gray-400"> +₦1,000 delivery fee applies.</span>
          <span v-else class="font-medium" style="color:#00bf63;"> Free delivery with your Pro plan.</span>
        </p>
        <button @click="showPaymentModal = true" class="gp-btn-primary mt-4 px-6 py-2.5">
          Buy Now
        </button>
      </div>
    </div>

    <!-- ── Recent orders ── -->
    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        <router-link to="/dashboard/order-history" class="text-sm font-medium" style="color:#00bf63;">View All</router-link>
      </div>

      <div v-if="loadingOrders" class="text-center py-8 text-gray-400 text-sm">Loading orders…</div>
      <div v-else-if="orderError" class="text-center py-6 text-red-500 text-sm">{{ orderError }}</div>
      <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-400 text-sm">You have no recent orders.</div>
      <ul v-else class="space-y-3">
        <li
          v-for="order in orders.slice(0, 5)"
          :key="order.id"
          class="flex justify-between items-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50"
        >
          <div>
            <p class="font-semibold text-gray-800 dark:text-white text-sm">Order #{{ order.id }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ new Date(order.created_at).toLocaleDateString() }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold text-sm text-gray-900 dark:text-white">₦{{ Number(order.total_amount).toLocaleString() }}</p>
            <p class="text-xs font-medium mt-0.5 capitalize" :class="statusClass(order.status)">{{ order.status }}</p>
          </div>
        </li>
      </ul>
    </div>

  </div>

  <!-- Payment modal -->
  <PaymentModal
    :is-open="showPaymentModal"
    :price-per-kg="pricePerKg"
    @close="showPaymentModal = false"
    @order-created="showPaymentModal = false"
  />

  <!-- Upgrade modal (mock) -->
  <BaseModal v-if="showUpgradeModal" :is-open="showUpgradeModal" @close="showUpgradeModal = false">
    <template #body>
      <div class="p-6 bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full mx-auto text-center space-y-4">
        <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style="background-color:#fef3c7;">
          <span class="text-2xl">⭐</span>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Upgrade to Pro</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Remove the ₦1,000 delivery fee on all your orders.</p>
        </div>
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-left space-y-2 text-sm">
          <div v-for="perk in proPerks" :key="perk" class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#00bf63;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            {{ perk }}
          </div>
        </div>
        <button @click="showUpgradeModal = false" class="gp-btn-primary w-full py-3">
          Coming Soon — Stay Tuned!
        </button>
        <button @click="showUpgradeModal = false" class="text-sm text-gray-400 hover:text-gray-600 underline w-full">
          Maybe later
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import PaymentModal from '@/components/modals/PaymentModal.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/auth'
import type { Order } from '@/types'

const authStore = useAuthStore()
const showPaymentModal = ref(false)
const showUpgradeModal = ref(false)
const showWelcome = ref(true)
const loadingOrders = ref(false)
const orderError = ref('')
const orders = ref<Order[]>([])
const pricePerKg = ref(1200)

const proPerks = ['Free delivery on every order', 'Pro badge on your profile', 'Priority customer support']

const isPro = computed(() => {
  const user = authStore.currentUser as Record<string, unknown> | null
  return user?.subscription_tier === 'pro'
})

const statusClass = (status: Order['status']) => {
  if (status === 'completed' || status === 'paid') return 'text-green-600 dark:text-green-400'
  if (status === 'pending') return 'text-yellow-600 dark:text-yellow-400'
  if (status === 'cancelled') return 'text-red-500 dark:text-red-400'
  return 'text-gray-500'
}

const fetchPricePerKg = async () => {
  try {
    const token = authStore.token
    if (!token) return
    const res = await apiService.get<{ data: { price_per_kg?: number; price?: number } }>('/products/rules', token)
    const p = res?.data?.price_per_kg ?? res?.data?.price
    if (p && !isNaN(Number(p))) pricePerKg.value = Number(p)
  } catch { /* keep default */ }
}

onMounted(() => fetchPricePerKg())

watchEffect(async () => {
  if (!authStore.isInitialized) return
  const token = authStore.token
  if (!token) { orderError.value = 'Authentication required.'; return }
  try {
    loadingOrders.value = true
    const res = await apiService.get<{ data: Order[] }>('/orders', token)
    orders.value = res.data
  } catch {
    orderError.value = 'Failed to load orders.'
  } finally {
    loadingOrders.value = false
  }
})
</script>
