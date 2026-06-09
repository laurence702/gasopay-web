import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // Example state: theme management
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    } else {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme on load
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Add other UI-related state here (e.g., sidebar state if needed)

  return { isDarkMode, toggleTheme }
}) 