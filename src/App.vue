<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
      <BaseModal
        v-model="sessionExpired"
        title="Session Expired"
        size="sm"
        :closeOnOverlayClick="false"
      >
        <template #body>
          <div class="flex flex-col items-center justify-center space-y-4">
            <p class="text-center text-lg text-gray-700 dark:text-gray-200 font-medium">
              Your session has expired. Please log in again.
            </p>
            <button
              class="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-50"
              @click="handleGoToLogin"
            >
              Go to Login
            </button>
          </div>
        </template>
      </BaseModal>
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import BaseModal from './components/common/BaseModal.vue'
import { useSessionExpiredModal } from './composables/useSessionExpiredModal'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { sessionExpired, showSessionExpired } = useSessionExpiredModal()
const authStore = useAuthStore()
const router = useRouter()

function handleGoToLogin() {
  authStore.logout()
  sessionExpired.value = false
  router.push('/signin')
}
</script>
