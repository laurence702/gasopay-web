<template>
  <div class="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-gray-900 lg:p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Personal Information</h3>
      <button @click="$emit('open-edit-modal')" class="text-sm font-medium text-brand-500 hover:text-brand-600">Edit</button>
    </div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
        <p class="font-medium text-gray-800 dark:text-white/90">{{ user?.fullname }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
        <p class="font-medium text-gray-800 dark:text-white/90">{{ user?.email }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Phone</p>
        <p class="font-medium text-gray-800 dark:text-white/90">{{ user?.phone || 'Not provided' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { ApiUser } from '@/services/apiService'

defineProps({
  user: {
    type: Object as PropType<ApiUser | null>,
    default: null
  }
})

defineEmits(['open-edit-modal'])
</script>
