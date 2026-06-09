<template>
  <div class="p-5 mb-6 bg-white border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-gray-900 lg:p-6">
    <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
      <div class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
        <img :src="user?.user_profile?.profile_pic_url || '/images/user/user-01.png'" alt="user" class="object-cover w-full h-full" />
      </div>
      <div class="text-center xl:text-left">
        <h4 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          {{ user?.fullname || 'Unknown User' }}
        </h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.role || 'No Role' }}</p>
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
</script>
