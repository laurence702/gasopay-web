<template>
  <router-link to="/" class="lg:hidden flex items-center">
    <img
      src="/src/assets/images/main_logo.svg"
      alt="Gasopay"
      class="h-8 w-auto object-contain dark:brightness-0 dark:invert"
    />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
