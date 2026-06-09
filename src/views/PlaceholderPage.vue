<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">{{ pageTitle }}</h1>
    <div class="p-10 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
      <p class="text-lg text-gray-600 dark:text-gray-400">This page is under construction.</p>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-500">Please check back later!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Use route meta title or a default title
const pageTitle = computed(() => route.meta.title || 'Page Under Construction')
</script> 