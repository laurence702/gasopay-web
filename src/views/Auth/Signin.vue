<template>
  <FullScreenLayout>
    <div class="relative bg-white dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">

        <!-- ── Left panel (form) ── -->
        <div class="flex flex-col flex-1 w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto">
          <div class="w-full max-w-md pt-8 px-6 mx-auto">
            <router-link
              to="/landing"
              class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg class="stroke-current mr-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Back to home
            </router-link>
          </div>

          <div class="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto py-10">
            <!-- Logo (mobile only) -->
            <div class="flex justify-center mb-6 lg:hidden">
              <img src="@/assets/images/main_logo.svg" alt="Gasopay" class="h-10" />
            </div>

            <div class="mb-6">
              <h1 class="mb-1.5 font-semibold text-gray-800 text-2xl dark:text-white/90">
                Sign in to GasoPay
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Enter your email or phone number and password to sign in.
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Error -->
              <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
                {{ errorMessage }}
              </div>

              <!-- Identifier -->
              <div>
                <label for="login-identifier" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email or Phone Number<span class="text-red-500">*</span>
                </label>
                <input
                  v-model="loginIdentifier"
                  type="text"
                  id="login-identifier"
                  placeholder="you@example.com or 08012345678"
                  required
                  class="gp-input"
                />
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password<span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    placeholder="Enter your password"
                    required
                    class="gp-input pr-11"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    tabindex="-1"
                  >
                    <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z" fill="#98A2B3"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z" fill="#98A2B3"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex justify-end">
                <router-link to="/password-reset" class="text-sm font-medium text-brand-500 hover:text-brand-600">
                  Forgot password?
                </router-link>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="gp-btn-primary w-full py-3"
              >
                <span v-if="isLoading" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing In...
                </span>
                <span v-else>Sign In</span>
              </button>
            </form>

            <!-- Google SSO -->
            <div class="mt-5">
              <a
                href="https://gaspy.onrender.com/api/auth/google/redirect"
                class="flex items-center justify-center w-full gap-2 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                <img src="@/assets/images/google.svg" alt="Google" class="w-5 h-5" />
                Sign in with Google
              </a>
            </div>

            <p class="mt-5 text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?
              <router-link to="/signup" class="font-medium text-brand-500 hover:text-brand-600">Sign Up</router-link>
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
              Fueling Your Journey, Seamlessly.
            </p>
            <div class="flex flex-wrap justify-center gap-2 mt-1">
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70">Fast Delivery</span>
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70">Secure Payment</span>
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/70">Best Prices</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts" name="UserSignin">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginUser } from '@/services/apiService'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'

const router = useRouter()
const authStore = useAuthStore()

const loginIdentifier = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const loginResponse = await loginUser(loginIdentifier.value, password.value)
    await authStore.login(loginResponse)
    await router.push('/')
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error
      ? error.message || 'Login failed. Please check your credentials.'
      : 'An unexpected error occurred.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
/* ── Gasopay auth design tokens ───────────────────────────────────────────
   Brand color: #465fff (blue/indigo) matching --color-brand-500 in main.css */
.gp-input {
  display: block;
  width: 100%;
  height: 2.75rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-family: Outfit, ui-sans-serif, system-ui, sans-serif;
  color: #1f2937;
  background-color: transparent;
  border: 1px solid #d0d5dd;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.gp-input::placeholder { color: #98a2b3; }
.gp-input:focus {
  border-color: #465fff;
  box-shadow: 0px 0px 0px 4px rgba(70, 95, 255, 0.12);
}
.gp-input.pr-11 { padding-right: 2.75rem; }

.dark .gp-input { color: rgba(255,255,255,0.9); border-color: #344054; background-color: transparent; }
.dark .gp-input::placeholder { color: rgba(255,255,255,0.3); }
.dark .gp-input:focus { border-color: #465fff; box-shadow: 0px 0px 0px 4px rgba(70, 95, 255, 0.12); }

.gp-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: Outfit, ui-sans-serif, system-ui, sans-serif;
  color: #fff;
  background-color: #465fff;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.12);
}
.gp-btn-primary:hover:not(:disabled) { background-color: #3641f5; }
.gp-btn-primary:active:not(:disabled) { background-color: #2a31d8; }
.gp-btn-primary:focus { outline: none; box-shadow: 0px 0px 0px 4px rgba(70, 95, 255, 0.12); }
.gp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
