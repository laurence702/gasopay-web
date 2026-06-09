<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
            <!-- Link back to signin -->
            <router-link
              to="/signin"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                class="stroke-current mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Back to Sign In
            </router-link>
          </div>
          <!-- Form -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div class="mb-5 sm:mb-8">
              <h1
                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
              >
                Reset Your Password
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Enter your email address to receive a password reset link.
              </p>
            </div>
            <div>
              <form @submit.prevent="handleSubmit">
                <div class="space-y-5">
                   <!-- Message Placeholder -->
                   <div v-if="message" class="p-3 text-sm rounded-lg" :class="isError ? 'text-red-700 bg-red-100 border border-red-300 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400' : 'text-green-700 bg-green-100 border border-green-300 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'">
                     {{ message }}
                   </div>
                  <!-- Email Input -->
                  <BaseInput
                    v-model="email"
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    inputId="reset-email"
                    :disabled="!!(isLoading || (message && !isError))" 
                  />

                  <!-- Button -->
                  <div>
                    <button
                      type="submit"
                      class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="!!(isLoading || (message && !isError))"
                    >
                      <span v-if="isLoading">Sending Link...</span>
                      <span v-else>Send Reset Link</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- Right Side Panel (Optional - Reuse from Signin if needed) -->
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
           <!-- Placeholder or reused content -->
           <div class="flex items-center justify-center z-1">
              <CommonGridShape /> 
              <div class="flex flex-col items-center max-w-xs">
                 <!-- Replace image with styled text -->
                 <h1 class="mb-4 text-4xl font-bold text-white">
                    GasoPay
                  </h1>
                <p class="text-center text-gray-400 dark:text-white/60">
                  Enter email to reset password.
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import BaseInput from '@/components/common/BaseInput.vue'

const email = ref('')
const isLoading = ref(false)
const message = ref<string | null>(null)
const isError = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  message.value = null
  isError.value = false
  console.log('Password Reset Request:', email.value)
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock success
    message.value = `Password reset link sent successfully to ${email.value}. Please check your inbox.`
    isError.value = false
    // Keep loading false, disable form maybe
    // Don't reset email field so user sees where it was sent

  } catch (error) {
    console.error("Password Reset error:", error)
    message.value = 'Failed to send reset link. Please try again.'
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Add helper class for required form inputs */
</style> 