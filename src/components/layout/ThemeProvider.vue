<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'

type Theme = 'light' | 'dark'

// Define an interface for the provided theme context
interface ThemeContext {
  isDarkMode:  Readonly<import('vue').Ref<boolean>>;
  toggleTheme: () => void;
}

const theme = ref<Theme>('light')
const isInitialized = ref(false)

const isDarkMode = computed(() => theme.value === 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const initialTheme = savedTheme || 'light' // Default to light theme

  theme.value = initialTheme
  isInitialized.value = true
})

watch([theme, isInitialized], ([newTheme, newIsInitialized]) => {
  if (newIsInitialized) {
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

provide('theme', {
  isDarkMode,
  toggleTheme,
} as ThemeContext)
</script>

<script lang="ts">
import { inject } from 'vue'
// Re-define or import ThemeContext if it was only in setup block previously
interface ThemeContext { // Define here for this script block
  isDarkMode:  Readonly<import('vue').Ref<boolean>>;
  toggleTheme: () => void;
}

export function useTheme() {
  const themeContext = inject<ThemeContext>('theme') // Use generic with inject
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return themeContext
}
</script>
