<template>
  <FullScreenLayout>
    <div class="relative bg-white dark:bg-gray-900">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">

        <!-- ── Left panel (form) ── -->
        <div class="flex flex-col flex-1 w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto">
          <div class="w-full max-w-md pt-8 px-6 mx-auto">
            <router-link
              to="/landing"
              class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="stroke-current mr-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Back to home
            </router-link>
          </div>

          <div class="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto py-10">
            <!-- Mobile logo -->
            <div class="flex justify-center mb-6 lg:hidden">
              <img src="@/assets/images/main_logo.svg" alt="Gasopay" class="h-10" />
            </div>

            <div class="mb-6">
              <h1 class="mb-1.5 font-semibold text-2xl text-gray-800 dark:text-white/90">Create your GasoPay Account</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Fill in the details below to get started.</p>
            </div>

            <!-- ── Step progress indicator ── -->
            <div class="flex items-center mb-8">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors text-white bg-brand-500"
                >
                  <svg v-if="currentStep > 1" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span v-else>1</span>
                </div>
                <span class="ml-2 text-xs font-medium text-gray-700 dark:text-gray-200">Your Info</span>
              </div>
              <div class="flex-1 mx-3 h-0.5 rounded transition-colors" :class="currentStep >= 2 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                  :class="currentStep >= 2 ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                >2</div>
                <span class="ml-2 text-xs font-medium" :class="currentStep >= 2 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'">Address & Password</span>
              </div>
            </div>

            <!-- Global error -->
            <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
              {{ errorMessage }}
            </div>

            <!-- ── Step 1: name / email / phone ── -->
            <form v-if="currentStep === 1" @submit.prevent="goToStep2" class="space-y-5">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name<span class="text-red-500">*</span>
                </label>
                <input v-model="formData.fullName" type="text" placeholder="John Doe" required class="gp-input" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address<span class="text-red-500">*</span>
                </label>
                <input v-model="formData.email" type="email" placeholder="you@example.com" required class="gp-input" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number<span class="text-red-500">*</span>
                </label>
                <input v-model="formData.phone" type="tel" placeholder="08012345678" required class="gp-input" />
              </div>
              <button type="submit" class="gp-btn-primary w-full py-3 mt-2">
                Continue →
              </button>
            </form>

            <!-- ── Step 2: address / password ── -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Delivery Address<span class="text-red-500">*</span>
                </label>
                <input v-model="formData.address" type="text" placeholder="123 Main St, Lagos" required class="gp-input" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password<span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Create a password (min 8 chars)"
                    required
                    minlength="8"
                    class="gp-input pr-11"
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabindex="-1">
                    <svg v-if="!showPassword" width="18" height="18" fill="none" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 13.862C7.234 13.862 4.868 12.137 3.923 9.702 4.868 7.268 7.234 5.543 10 5.543c2.767 0 5.132 1.725 6.077 4.16C15.132 12.137 12.767 13.862 10 13.862ZM10 4.043c-3.518 0-6.505 2.266-7.585 5.416a1.002 1.002 0 000 .486C3.495 13.096 6.482 15.362 10 15.362s6.505-2.266 7.585-5.417a1.002 1.002 0 000-.486C16.505 6.309 13.518 4.043 10 4.043Zm-.009 3.8A1.859 1.859 0 1010.006 11.56H10a1.859 1.859 0 00-.009-3.717Z" fill="#9CA3AF"/></svg>
                    <svg v-else width="18" height="18" fill="none" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.638 3.577a.75.75 0 00-1.06 1.061l1.275 1.276A9.955 9.955 0 002.416 9.46a1 1 0 000 .486C3.495 13.096 6.482 15.362 10 15.362a9.96 9.96 0 003.499-.632l1.863 1.864a.75.75 0 001.061-1.061L4.638 3.577Zm7.723 9.844L10.447 11.508A1.86 1.86 0 0110 11.56h-.009A1.859 1.859 0 018.133 9.702c0-.156.02-.308.056-.453L5.919 6.979A8.456 8.456 0 003.923 9.702C4.868 12.137 7.234 13.862 10 13.862a8.45 8.45 0 002.361-.441ZM16.077 9.702a8.46 8.46 0 01-1.257 2.03l1.061 1.06A9.97 9.97 0 0017.585 9.95a1 1 0 000-.486C16.505 6.309 13.518 4.043 10 4.043a9.96 9.96 0 00-2.478.312L8.751 5.663A8.46 8.46 0 0110 5.543c2.767 0 5.132 1.725 6.077 4.159Z" fill="#9CA3AF"/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password<span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  class="gp-input"
                  :class="{ 'border-red-400': passwordMismatchError }"
                />
                <p v-if="passwordMismatchError" class="mt-1 text-xs text-red-500">{{ passwordMismatchError }}</p>
              </div>

              <div class="flex gap-3 pt-1">
                <button
                  type="button"
                  @click="currentStep = 1"
                  class="flex-1 py-3 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  :disabled="isLoading || !!passwordMismatchError"
                  class="gp-btn-primary flex-1 py-3"
                >
                  <span v-if="isLoading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Creating...
                  </span>
                  <span v-else>Create Account</span>
                </button>
              </div>
            </form>

            <p class="mt-5 text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account?
              <router-link to="/signin" class="font-medium text-brand-500 hover:text-brand-600">Sign In</router-link>
            </p>
            <p class="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              Are you a rider?
              <router-link to="/rider/signup" class="font-medium text-brand-500 hover:text-brand-600">Register as a Rider</router-link>
            </p>
          </div>
        </div>

        <!-- ── Right panel (brand) ── -->
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <common-grid-shape />
          <div class="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
            <img src="@/assets/images/main_logo.svg" alt="Gasopay" class="h-14 brightness-0 invert" />
            <p class="text-lg font-medium text-white/75 max-w-xs leading-relaxed">
              Join us and start fueling your journey!
            </p>
            <div class="flex flex-wrap justify-center gap-2 mt-1">
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70">Door-step Delivery</span>
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70">Lagos Coverage</span>
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70">No Queues</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts" name="UserSignup">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/services/apiService'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'

const router = useRouter()

const currentStep = ref(1)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const formData = reactive({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
})

const passwordMismatchError = computed(() => {
  if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.'
  }
  return ''
})

const goToStep2 = () => {
  errorMessage.value = null
  currentStep.value = 2
}

const handleSubmit = async () => {
  if (passwordMismatchError.value) {
    errorMessage.value = passwordMismatchError.value
    return
  }
  isLoading.value = true
  errorMessage.value = null
  try {
    await registerUser({
      fullname: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    })
    router.push({ name: 'Signin', query: { registered: 'true' } })
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred.'
    console.error('Signup error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
