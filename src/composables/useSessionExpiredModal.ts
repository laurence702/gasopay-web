import { ref } from 'vue'

const sessionExpired = ref(false)

function showSessionExpired() {
  sessionExpired.value = true
}

export function useSessionExpiredModal() {
  return {
    sessionExpired,
    showSessionExpired,
  }
} 