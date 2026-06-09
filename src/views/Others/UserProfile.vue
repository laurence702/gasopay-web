<template>
  <div>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="p-8 mt-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <!-- Personal Info Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Personal Info</h2>
        <div class="flex items-start mt-6 space-x-8">
          <div class="flex flex-col items-center text-center">
            <div class="flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full">
              <!-- Heroicon: user -->
              <svg class="w-12 h-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">Basic Info</h3>
          </div>
          <div class="flex-1">
            <p class="text-gray-600 dark:text-gray-400">Enter your name, username and primary email.</p>
            <div class="mt-4 space-y-4">
              <div class="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300">Full Name</span>
                <span class="font-medium text-gray-800 dark:text-white">{{ user?.fullname }}</span>
              </div>
              <div class="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300">Email Address</span>
                <span class="font-medium text-gray-800 dark:text-white">{{ user?.email }}</span>
              </div>
              <div class="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300">Phone</span>
                <span class="font-medium text-gray-800 dark:text-white">{{ user?.phone || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="my-8 border-gray-200 dark:border-gray-700">

      <!-- Address Book Section -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Address Book</h2>
        <div class="flex items-start mt-6 space-x-8">
          <div class="flex flex-col items-center text-center">
            <div class="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
              <!-- Heroicon: identification -->
              <svg class="w-12 h-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4m-9 4h2m-2 4h2m4-4h2m-2 4h2" />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">Address Details</h3>
          </div>
          <div class="flex-1">
            <p class="text-gray-600 dark:text-gray-400">Enter and manage all the addresses associated with your account.</p>
            <div class="mt-4 space-y-4">
              <div class="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300">Primary Address</span>
                <span class="font-medium text-gray-800 dark:text-white">{{ user?.user_profile?.address || 'Not provided' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="flex justify-end mt-8">
        <button @click="openEditModal" class="px-6 py-2 font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">
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
import { useAuthStore } from '@/stores/auth'
import type { ApiUser } from '@/services/apiService'

const currentPageTitle = ref('My Profile')
const authStore = useAuthStore()

const user = computed<ApiUser | null>(() => authStore.currentUser)

const isEditModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleProfileUpdate = () => {
  authStore.fetchProfile() // Refresh profile data
  closeEditModal()
}

onMounted(() => {
  if (!authStore.currentUser) {
    authStore.fetchProfile()
  }
})
</script>
