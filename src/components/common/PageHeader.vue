<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
    <div>
      <!-- Optional Breadcrumbs -->
      <nav v-if="breadcrumbs && breadcrumbs.length > 0" class="mb-1">
        <ol class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
            <router-link
              v-if="crumb.path && index < breadcrumbs.length - 1"
              :to="crumb.path"
              class="hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              {{ crumb.name }}
            </router-link>
            <span v-else class="font-medium text-gray-700 dark:text-gray-300">
              {{ crumb.name }}
            </span>
            <span v-if="index < breadcrumbs.length - 1" class="mx-1">/</span>
          </li>
        </ol>
      </nav>

      <!-- Main Title -->
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
        <slot name="title">{{ title }}</slot>
      </h1>
    </div>

    <!-- Action Buttons/Slot -->
    <div class="flex items-center gap-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type BreadcrumbItem = {
  name: string;
  path?: RouteLocationRaw;
};

defineProps({
  title: {
    type: String,
    required: true,
  },
  breadcrumbs: {
    type: Array as PropType<BreadcrumbItem[]>,
    required: false,
    default: () => [],
  },
});
</script>

<style scoped>
/* Add any specific styles if needed */
</style> 