<template>
  <div class="p-5 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-gray-900 lg:p-6">
    <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Default Delivery Address</h3>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Address</p>
      <p class="font-medium text-gray-800 dark:text-white/90">
        {{ user?.user_profile?.address || 'No address provided' }}
      </p>
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
</script>
