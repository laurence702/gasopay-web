<template>
  <div>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="p-8 mt-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 space-y-8">

      <!-- ── Personal Info ── -->
      <section>
        <div class="flex items-center gap-2 mb-6 flex-wrap">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Personal Info</h2>
          <span v-if="isPro" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            ⭐ Pro
          </span>
          <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            Free
          </span>
        </div>

        <div class="flex items-start gap-8">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <img v-if="user?.user_profile?.profile_pic_url" :src="user.user_profile.profile_pic_url" alt="Profile" class="object-cover w-full h-full" />
              <svg v-else class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>
          <div class="flex-1 space-y-3">
            <div class="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white">{{ user?.fullname || '—' }}</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500 dark:text-gray-400">Email</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white">{{ user?.email || '—' }}</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500 dark:text-gray-400">Phone</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white">{{ user?.phone || '—' }}</span>
            </div>
            <div class="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500 dark:text-gray-400">Subscription</span>
              <span class="text-sm font-medium" :style="isPro ? 'color:#00bf63;' : 'color:#6b7280;'">
                {{ isPro ? 'Pro — Free Delivery' : 'Free — ₦1,000 delivery fee' }}
              </span>
            </div>
            <div class="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
              <span class="text-sm text-gray-500 dark:text-gray-400">Role</span>
              <span class="text-sm font-medium text-gray-800 dark:text-white capitalize">{{ user?.role || '—' }}</span>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-gray-100 dark:border-gray-700" />

      <!-- ── Address ── -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Address Book</h2>
        <div class="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
          <span class="text-sm text-gray-500 dark:text-gray-400">Primary Address</span>
          <span class="text-sm font-medium text-gray-800 dark:text-white text-right max-w-xs">
            {{ user?.user_profile?.address || 'Not provided' }}
          </span>
        </div>
      </section>

      <hr class="border-gray-100 dark:border-gray-700" />

      <!-- ── QR Code ── -->
      <section>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">Your QR Code</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Show this at any Gasopay partner station for quick identification and in-station purchases.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-6">
          <!-- QR box -->
          <div class="flex-shrink-0 p-4 bg-white border-2 border-gray-200 dark:border-gray-700 rounded-xl">
            <div v-if="qrLoading" class="w-40 h-40 flex items-center justify-center">
              <svg class="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none" style="color:#00bf63;">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <div v-else-if="qrError" class="w-40 h-40 flex flex-col items-center justify-center gap-2 text-center">
              <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p class="text-xs text-gray-400">{{ qrError }}</p>
              <button @click="fetchQrCode" class="text-xs underline" style="color:#00bf63;">Retry</button>
            </div>
            <img v-else-if="qrCodeUrl" :src="qrCodeUrl" alt="Gasopay QR Code" class="w-40 h-40 object-contain" />
            <div v-else class="w-40 h-40 flex items-center justify-center">
              <svg class="w-24 h-24 text-gray-200 dark:text-gray-600" viewBox="0 0 100 100" fill="currentColor">
                <rect x="5" y="5" width="40" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="4"/>
                <rect x="15" y="15" width="20" height="20" rx="1"/>
                <rect x="55" y="5" width="40" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="4"/>
                <rect x="65" y="15" width="20" height="20" rx="1"/>
                <rect x="5" y="55" width="40" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="4"/>
                <rect x="15" y="65" width="20" height="20" rx="1"/>
                <rect x="55" y="55" width="10" height="10"/>
                <rect x="70" y="55" width="10" height="10"/>
                <rect x="85" y="55" width="10" height="10"/>
                <rect x="55" y="70" width="10" height="10"/>
                <rect x="70" y="70" width="10" height="10"/>
                <rect x="85" y="70" width="10" height="10"/>
                <rect x="55" y="85" width="10" height="10"/>
                <rect x="70" y="85" width="10" height="10"/>
                <rect x="85" y="85" width="10" height="10"/>
              </svg>
            </div>
          </div>

          <div class="text-center sm:text-left space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs">
              Your QR code uniquely identifies you at partner stations. Riders use this for quick in-station fuel purchases without filling forms each time.
            </p>
            <button @click="fetchQrCode" :disabled="qrLoading" class="gp-btn-primary px-4 py-2 text-sm">
              {{ qrCodeUrl ? 'Refresh QR Code' : 'Generate QR Code' }}
            </button>
            <div v-if="qrCodeUrl" class="pt-0.5">
              <a :href="qrCodeUrl" download="gasopay-qr.png" class="text-sm font-medium underline" style="color:#00bf63;">
                Download QR Code
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-gray-100 dark:border-gray-700" />

      <div class="flex justify-end">
        <button @click="openEditModal" class="gp-btn-primary px-6 py-2.5">
          Edit Profile
        </button>
      </div>
    </div>

    <EditProfileModal :is-open="isEditModalOpen" :user="user" @close="closeEditModal" @profile-updated="handleProfileUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import EditProfileModal from '@/components/profile/EditProfileModal.vue'
import apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/auth'
import type { ApiUser } from '@/services/apiService'

const currentPageTitle = ref('My Profile')
const authStore = useAuthStore()

const user = computed<ApiUser | null>(() => authStore.currentUser)

const isPro = computed(() => {
  const u = authStore.currentUser as Record<string, unknown> | null
  return u?.subscription_tier === 'pro'
})

// ── QR Code ──────────────────────────────────────────────────────────────────
const qrLoading = ref(false)
const qrError = ref('')
const qrCodeUrl = ref('')

const fetchQrCode = async () => {
  const token = authStore.token
  const userId = authStore.currentUser?.id
  if (!token || !userId) return

  qrLoading.value = true
  qrError.value = ''
  try {
    const res = await apiService.get<{ data: string } | string>(`/users/${userId}/qr-code`, token)
    if (typeof res === 'string') {
      qrCodeUrl.value = res
    } else if (res && typeof res === 'object') {
      const d = (res as Record<string, unknown>).data
      qrCodeUrl.value = typeof d === 'string' ? d : ''
    }
  } catch {
    qrError.value = 'Could not load QR code.'
  } finally {
    qrLoading.value = false
  }
}

// ── Profile edit ─────────────────────────────────────────────────────────────
const isEditModalOpen = ref(false)
const openEditModal = () => { isEditModalOpen.value = true }
const closeEditModal = () => { isEditModalOpen.value = false }
const handleProfileUpdate = () => {
  authStore.fetchProfile()
  closeEditModal()
}

onMounted(() => {
  if (!authStore.currentUser) authStore.fetchProfile()
  fetchQrCode()
})
</script>
